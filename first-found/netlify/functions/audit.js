// ============================================================
// Netlify Function — POST /api/audit  { url }
// (routed from /api/audit to here via netlify.toml redirect)
// ------------------------------------------------------------
// Free, unlimited, no external API calls — checks whether AI
// crawlers can technically read the given site. Same logic as
// the original geo_tracker Python tool's technical_audit.py +
// scoring.technical_score.
// ============================================================

const { assertSafeUrl } = require("./_lib/ssrf-guard");

const AI_CRAWLERS = ["OAI-SearchBot", "GPTBot", "PerplexityBot", "ClaudeBot", "Google-Extended"];
const FETCH_TIMEOUT_MS = 8000;
const JSON_HEADERS = { "Content-Type": "application/json" };

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal, redirect: "follow" });
  } finally {
    clearTimeout(timer);
  }
}

async function checkRobotsTxt(origin) {
  const url = new URL("/robots.txt", origin).toString();
  const blocked = [];
  try {
    const res = await fetchWithTimeout(url);
    if (res.status !== 200) return { found: false, blocked };
    const text = await res.text();

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
  } catch {
    return { found: false, blocked, error: true };
  }
}

async function checkRendering(origin) {
  try {
    const res = await fetchWithTimeout(origin, { headers: { "User-Agent": "OAI-SearchBot" } });
    const html = await res.text();
    const scriptTags = (html.match(/<script/gi) || []).length;
    const bodyMatch = html.match(/<body[\s\S]*$/i);
    const bodyTextEstimate = bodyMatch ? bodyMatch[0].length : 0;
    const likelyClientSideRendered = bodyTextEstimate < 500 && scriptTags > 5;
    return { likelyClientSideRendered, htmlLength: html.length, html };
  } catch {
    return { likelyClientSideRendered: null, html: "" };
  }
}

async function checkSitemap(origin) {
  const url = new URL("/sitemap.xml", origin).toString();
  try {
    const res = await fetchWithTimeout(url);
    return { found: res.status === 200 };
  } catch {
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

function grade(score) {
  if (score >= 80) return "Sterk — AI-crawlers kunnen je site goed lezen";
  if (score >= 60) return "Redelijk — een paar dingen staan in de weg";
  if (score >= 40) return "Beperkt — belangrijke blokkades gevonden";
  return "Zwak — AI-crawlers kunnen je site nauwelijks lezen";
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: JSON_HEADERS, body: JSON.stringify({ error: "Methode niet toegestaan." }) };
  }

  let payload;
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch {
    return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ error: "Ongeldige aanvraag." }) };
  }

  const { url } = payload;
  if (!url || typeof url !== "string") {
    return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ error: "Geef een website URL op." }) };
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

    const checks = [
      {
        label:
          robots.blocked.length === 0
            ? "AI-crawlers mogen je site bezoeken"
            : `${robots.blocked.length} AI-crawler(s) geblokkeerd in robots.txt (${robots.blocked.join(", ")})`,
        pass: robots.blocked.length === 0,
      },
      {
        label: rendering.likelyClientSideRendered
          ? "Je site lijkt zwaar op JavaScript te leunen — AI-crawlers lezen dat niet"
          : "Je site is leesbaar zonder JavaScript uit te voeren",
        pass: !rendering.likelyClientSideRendered,
      },
      {
        label: sitemap.found ? "Sitemap.xml gevonden" : "Geen sitemap.xml gevonden",
        pass: sitemap.found,
      },
      {
        label: schema.hasJsonLd ? "Schema markup (structured data) gevonden" : "Geen schema markup gevonden",
        pass: schema.hasJsonLd,
      },
    ];

    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify({ score, grade: grade(score), checks }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: JSON_HEADERS,
      body: JSON.stringify({ error: err.message || "Er ging iets mis." }),
    };
  }
};
