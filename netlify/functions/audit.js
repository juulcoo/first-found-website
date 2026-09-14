// ============================================================
// Netlify Function — POST /api/audit  { url }
// (routed from /api/audit to here via netlify.toml redirect)
// ------------------------------------------------------------
// Free, unlimited, no external API calls — checks whether AI
// crawlers can technically read the given site. Same logic as
// the original geo_tracker Python tool's technical_audit.py +
// scoring.technical_score.
//
// The response is language-neutral: checks come back as
// { key, pass, params } and the grade as a gradeKey, which the
// front-end resolves through i18n.js. That way switching NL/EN
// re-renders an existing result without re-running the audit.
//
// Free to the visitor, but not free to us: each call makes three
// outbound requests, so it's loosely rate-limited to stop the
// endpoint being used as a request amplifier against someone else
// (and to keep our own function invocations in check). The limit is
// deliberately generous — a real person trying a few sites should
// never see it.
// ============================================================

const { assertSafeUrl, safeFetch, readCapped } = require("./_lib/ssrf-guard");
const { checkRateLimit } = require("./_lib/rate-limit");
const { checkOrigin } = require("./_lib/origin-check");

const AI_CRAWLERS = ["OAI-SearchBot", "GPTBot", "PerplexityBot", "ClaudeBot", "Google-Extended"];
const FETCH_TIMEOUT_MS = 8000;
// no-store: these answers are per-visitor and per-site; nothing in
// the chain (CDN, browser, proxy) should hold on to them.
const JSON_HEADERS = { "Content-Type": "application/json", "Cache-Control": "no-store" };
// A URL is a few hundred bytes. Anything larger is not a real client.
const MAX_REQUEST_BYTES = 4 * 1024;

// Every outbound request in this file goes through here. safeFetch
// re-validates the URL on each redirect hop, so a site that answers
// "302 -> http://169.254.169.254/" can't walk us into the private
// network. Never call fetch() directly from this file.
function fetchWithTimeout(url, options = {}) {
  return safeFetch(url, options, { timeoutMs: FETCH_TIMEOUT_MS });
}

async function checkRobotsTxt(origin) {
  const url = new URL("/robots.txt", origin).toString();
  const blocked = [];
  try {
    const res = await fetchWithTimeout(url);
    if (res.status !== 200) return { found: false, blocked };
    const text = await readCapped(res);

    let currentAgents = [];
    for (const rawLine of text.split("\n")) {
      const line = rawLine.trim();
      if (/^user-agent:/i.test(line)) {
        currentAgents.push(line.split(":").slice(1).join(":").trim());
      } else if (/^disallow:/i.test(line)) {
        const path = line.split(":").slice(1).join(":").trim();
        if (path === "/") {
          for (const agent of currentAgents) {
            for (const bot of AI_CRAWLERS) {
              if ((agent === bot || agent === "*") && !blocked.includes(bot)) {
                blocked.push(bot);
              }
            }
          }
        }
      } else if (line === "") {
        currentAgents = [];
      }
    }
    return { found: true, blocked };
  } catch (err) {
    if (err && err.key) throw err; // guard rejection — let the handler report it
    return { found: false, blocked, error: true };
  }
}

async function checkRendering(origin) {
  try {
    const res = await fetchWithTimeout(origin, { headers: { "User-Agent": "OAI-SearchBot" } });
    const html = await readCapped(res);
    const scriptTags = (html.match(/<script/gi) || []).length;
    const bodyMatch = html.match(/<body[\s\S]*$/i);
    const bodyTextEstimate = bodyMatch ? bodyMatch[0].length : 0;
    const likelyClientSideRendered = bodyTextEstimate < 500 && scriptTags > 5;
    return { likelyClientSideRendered, htmlLength: html.length, html };
  } catch (err) {
    if (err && err.key) throw err; // guard rejection — let the handler report it
    return { likelyClientSideRendered: null, html: "" };
  }
}

async function checkSitemap(origin) {
  const url = new URL("/sitemap.xml", origin).toString();
  try {
    const res = await fetchWithTimeout(url);
    return { found: res.status === 200 };
  } catch (err) {
    if (err && err.key) throw err; // guard rejection — let the handler report it
    return { found: false };
  }
}

function checkSchema(html) {
  return { hasJsonLd: html.includes("application/ld+json") };
}

function computeScore({ blockedCount, likelyClientSideRendered, sitemapFound, hasJsonLd }) {
  let score = 100;
  score -= blockedCount * 25;
  if (likelyClientSideRendered) score -= 20;
  if (!sitemapFound) score -= 5;
  if (!hasJsonLd) score -= 5;
  return Math.max(0, Math.min(100, score));
}

function gradeKey(score) {
  if (score >= 80) return "strong";
  if (score >= 60) return "good";
  if (score >= 40) return "limited";
  return "weak";
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: JSON_HEADERS, body: JSON.stringify({ errorKey: "method_not_allowed" }) };
  }

  const originCheck = checkOrigin(event.headers || {});
  if (!originCheck.ok) {
    console.warn("audit blocked:", originCheck.reason);
    return { statusCode: 403, headers: JSON_HEADERS, body: JSON.stringify({ errorKey: "forbidden" }) };
  }

  if (event.body && event.body.length > MAX_REQUEST_BYTES) {
    return { statusCode: 413, headers: JSON_HEADERS, body: JSON.stringify({ errorKey: "request_too_large" }) };
  }

  const { allowed } = checkRateLimit(event.headers || {}, {
    bucket: "audit",
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30,
  });
  if (!allowed) {
    return { statusCode: 429, headers: JSON_HEADERS, body: JSON.stringify({ errorKey: "audit_rate_limited" }) };
  }

  let payload;
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch {
    return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ errorKey: "bad_request" }) };
  }

  const { url } = payload;
  if (!url || typeof url !== "string") {
    return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ errorKey: "url_required" }) };
  }

  try {
    const parsed = await assertSafeUrl(url);
    const origin = parsed.origin;

    const [robots, rendering, sitemap] = await Promise.all([
      checkRobotsTxt(origin),
      checkRendering(origin),
      checkSitemap(origin),
    ]);
    const schema = checkSchema(rendering.html || "");

    const score = computeScore({
      blockedCount: robots.blocked.length,
      likelyClientSideRendered: rendering.likelyClientSideRendered,
      sitemapFound: sitemap.found,
      hasJsonLd: schema.hasJsonLd,
    });

    const crawlersBlocked = robots.blocked.length > 0;
    const checks = [
      crawlersBlocked
        ? {
            key: "crawlers_blocked",
            pass: false,
            params: { count: robots.blocked.length, list: robots.blocked.join(", ") },
          }
        : { key: "crawlers_ok", pass: true },
      rendering.likelyClientSideRendered
        ? { key: "rendering_csr", pass: false }
        : { key: "rendering_ok", pass: true },
      sitemap.found ? { key: "sitemap_ok", pass: true } : { key: "sitemap_missing", pass: false },
      schema.hasJsonLd ? { key: "schema_ok", pass: true } : { key: "schema_missing", pass: false },
    ];

    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify({ score, gradeKey: gradeKey(score), checks }),
    };
  } catch (err) {
    // assertSafeUrl rejections carry a .key; anything else is on us.
    if (err && err.key) {
      return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ errorKey: err.key }) };
    }
    console.error("audit error:", err);
    return { statusCode: 500, headers: JSON_HEADERS, body: JSON.stringify({ errorKey: "server_error" }) };
  }
};
