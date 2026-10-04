// ============================================================
// Netlify Function :: POST /api/audit  { url }
// (routed from /api/audit to here via netlify.toml redirect)
// ------------------------------------------------------------
// Free, unlimited, no LLM calls. Everything here is derived from
// four plain HTTP fetches, which is what keeps the scan free to
// run and free to give away.
//
// Checks are grouped into the same four dimensions the AI
// Visibility Index section shows, so a visitor's real numbers
// land in the same shape as the illustrative ones. Two of those
// dimensions (whether a model actually names you, and how your
// competitors place) cannot be measured without asking a model,
// and are deliberately not part of the free scan.
//
// The response is language-neutral: checks come back as
// { key, pass, group, params } and the grade as a gradeKey, which
// the front-end resolves through i18n.js. That way switching NL/EN
// re-renders an existing result without re-running the audit.
//
// Free to the visitor, but not free to us: each call makes three
// outbound requests, so it's loosely rate-limited to stop the
// endpoint being used as a request amplifier against someone else
// (and to keep our own function invocations in check). The limit is
// deliberately generous: a real person trying a few sites should
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
    if (err && err.key) throw err; // guard rejection, let the handler report it
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
    if (err && err.key) throw err; // guard rejection, let the handler report it
    return { likelyClientSideRendered: null, html: "" };
  }
}

async function checkSitemap(origin) {
  const url = new URL("/sitemap.xml", origin).toString();
  try {
    const res = await fetchWithTimeout(url);
    return { found: res.status === 200 };
  } catch (err) {
    if (err && err.key) throw err; // guard rejection, let the handler report it
    return { found: false };
  }
}

// llms.txt is the emerging convention for telling AI systems what a
// site is and which pages matter. Almost nobody has one yet, which is
// exactly why it is worth reporting on.
async function checkLlmsTxt(origin) {
  const url = new URL("/llms.txt", origin).toString();
  try {
    const res = await fetchWithTimeout(url);
    return { found: res.status === 200 };
  } catch (err) {
    if (err && err.key) throw err;
    return { found: false };
  }
}

/**
 * Everything we can learn from the homepage HTML itself. Deliberately
 * tolerant: these are signals, not validation, and a regex that fails
 * to match should read as "absent", never as an error.
 */
function readPage(html) {
  const head = (html.match(/<head[\s\S]*?<\/head>/i) || [""])[0];

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : "";

  // Attribute order is not fixed in the wild, so match either way round
  // rather than reporting a description that exists as missing.
  const descTag = (head.match(/<meta[^>]*name=["']description["'][^>]*>/i) || [""])[0];
  const descMatch = descTag.match(/content=["']([^"']*)["']/i);
  const description = descMatch ? descMatch[1].trim() : "";

  const h1s = html.match(/<h1[\s>]/gi) || [];
  const h2s = html.match(/<h2[\s>]/gi) || [];

  // Question-shaped headings are the raw material of an AI answer.
  const headingText = (html.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi) || [])
    .map((h) => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  const questionHeadings = headingText.filter((t) => t.endsWith("?")).length;

  // Rough readable-text volume: strip script/style, then tags.
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const jsonLd = html.match(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || [];
  const jsonLdBlob = jsonLd.join(" ");

  return {
    hasJsonLd: jsonLd.length > 0,
    hasEntitySchema: /"@type"\s*:\s*"?(Organization|LocalBusiness|ProfessionalService|Corporation)/i.test(jsonLdBlob),
    hasFaqSchema: /"@type"\s*:\s*"?(FAQPage|QAPage|Question)/i.test(jsonLdBlob),
    title,
    hasTitle: title.length > 0,
    titleWellSized: title.length >= 15 && title.length <= 65,
    hasDescription: description.length > 0,
    h1Count: h1s.length,
    h2Count: h2s.length,
    questionHeadings,
    wordCount: text ? text.split(" ").length : 0,
    hasCanonical: /<link[^>]+rel=["']canonical["']/i.test(head),
    hasOpenGraph: /<meta[^>]+property=["']og:/i.test(head),
    hasLang: /<html[^>]+lang=["'][a-z]/i.test(html),
  };
}

// Four dimensions, each scored out of 100 and each with its own
// deductions. A single flat score hides which part is actually broken.
const DIMENSIONS = {
  access: [
    ["crawlers", (f) => f.blockedCount * 34],
    ["rendering", (f) => (f.likelyClientSideRendered ? 40 : 0)],
    ["https", (f) => (f.https ? 0 : 20)],
  ],
  structure: [
    ["sitemap", (f) => (f.sitemapFound ? 0 : 30)],
    ["h1", (f) => (f.page.h1Count === 1 ? 0 : 25)],
    ["headings", (f) => (f.page.h2Count >= 2 ? 0 : 20)],
    ["canonical", (f) => (f.page.hasCanonical ? 0 : 12)],
    ["lang", (f) => (f.page.hasLang ? 0 : 13)],
  ],
  entity: [
    ["jsonld", (f) => (f.page.hasJsonLd ? 0 : 30)],
    ["entityschema", (f) => (f.page.hasEntitySchema ? 0 : 28)],
    ["title", (f) => (f.page.hasTitle ? (f.page.titleWellSized ? 0 : 8) : 20)],
    ["description", (f) => (f.page.hasDescription ? 0 : 14)],
    ["opengraph", (f) => (f.page.hasOpenGraph ? 0 : 8)],
  ],
  answer: [
    ["llmstxt", (f) => (f.llmsTxtFound ? 0 : 22)],
    ["faq", (f) => (f.page.hasFaqSchema || f.page.questionHeadings >= 2 ? 0 : 30)],
    ["depth", (f) => (f.page.wordCount >= 300 ? 0 : f.page.wordCount >= 120 ? 18 : 34)],
  ],
};

function scoreDimensions(facts) {
  const out = {};
  for (const [dim, rules] of Object.entries(DIMENSIONS)) {
    const penalty = rules.reduce((sum, [, fn]) => sum + fn(facts), 0);
    out[dim] = Math.max(0, Math.min(100, Math.round(100 - penalty)));
  }
  return out;
}

// Crawler access is weighted hardest: if a model cannot read the site,
// nothing else on the list can compensate.
const DIMENSION_WEIGHT = { access: 0.4, structure: 0.2, entity: 0.25, answer: 0.15 };

function computeScore(dimensions) {
  const total = Object.entries(DIMENSION_WEIGHT)
    .reduce((sum, [dim, w]) => sum + dimensions[dim] * w, 0);
  return Math.max(0, Math.min(100, Math.round(total)));
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

    const [robots, rendering, sitemap, llmsTxt] = await Promise.all([
      checkRobotsTxt(origin),
      checkRendering(origin),
      checkSitemap(origin),
      checkLlmsTxt(origin),
    ]);

    const page = readPage(rendering.html || "");
    const facts = {
      blockedCount: robots.blocked.length,
      likelyClientSideRendered: rendering.likelyClientSideRendered,
      https: parsed.protocol === "https:",
      sitemapFound: sitemap.found,
      llmsTxtFound: llmsTxt.found,
      page,
    };

    const dimensions = scoreDimensions(facts);
    const score = computeScore(dimensions);

    // Every check reports which dimension it belongs to, so the
    // front-end can group them without knowing the scoring model.
    const checks = [
      robots.blocked.length
        ? {
            key: "crawlers_blocked", group: "access", pass: false,
            params: { count: robots.blocked.length, list: robots.blocked.join(", ") },
          }
        : { key: "crawlers_ok", group: "access", pass: true },
      rendering.likelyClientSideRendered
        ? { key: "rendering_csr", group: "access", pass: false }
        : { key: "rendering_ok", group: "access", pass: true },
      facts.https
        ? { key: "https_ok", group: "access", pass: true }
        : { key: "https_missing", group: "access", pass: false },

      sitemap.found
        ? { key: "sitemap_ok", group: "structure", pass: true }
        : { key: "sitemap_missing", group: "structure", pass: false },
      page.h1Count === 1
        ? { key: "h1_ok", group: "structure", pass: true }
        : { key: "h1_bad", group: "structure", pass: false, params: { count: page.h1Count } },
      page.h2Count >= 2
        ? { key: "headings_ok", group: "structure", pass: true, params: { count: page.h2Count } }
        : { key: "headings_thin", group: "structure", pass: false },
      page.hasCanonical
        ? { key: "canonical_ok", group: "structure", pass: true }
        : { key: "canonical_missing", group: "structure", pass: false },
      page.hasLang
        ? { key: "lang_ok", group: "structure", pass: true }
        : { key: "lang_missing", group: "structure", pass: false },

      page.hasJsonLd
        ? { key: "schema_ok", group: "entity", pass: true }
        : { key: "schema_missing", group: "entity", pass: false },
      page.hasEntitySchema
        ? { key: "entity_ok", group: "entity", pass: true }
        : { key: "entity_missing", group: "entity", pass: false },
      page.hasTitle
        ? (page.titleWellSized
            ? { key: "title_ok", group: "entity", pass: true }
            : { key: "title_length", group: "entity", pass: false, params: { count: page.title.length } })
        : { key: "title_missing", group: "entity", pass: false },
      page.hasDescription
        ? { key: "description_ok", group: "entity", pass: true }
        : { key: "description_missing", group: "entity", pass: false },
      page.hasOpenGraph
        ? { key: "og_ok", group: "entity", pass: true }
        : { key: "og_missing", group: "entity", pass: false },

      llmsTxt.found
        ? { key: "llmstxt_ok", group: "answer", pass: true }
        : { key: "llmstxt_missing", group: "answer", pass: false },
      page.hasFaqSchema || page.questionHeadings >= 2
        ? { key: "faq_ok", group: "answer", pass: true }
        : { key: "faq_missing", group: "answer", pass: false },
      page.wordCount >= 300
        ? { key: "depth_ok", group: "answer", pass: true, params: { count: page.wordCount } }
        : { key: "depth_thin", group: "answer", pass: false, params: { count: page.wordCount } },
    ];

    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify({ score, gradeKey: gradeKey(score), dimensions, checks }),
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
