// ============================================================
// Netlify Function — POST /api/spotcheck  { name, industry, city }
// (routed from /api/spotcheck to here via netlify.toml redirect)
// ------------------------------------------------------------
// Asks Claude one realistic buying question, with live web search
// enabled, and checks whether the given business name shows up in
// the answer. Costs real tokens, so it's guarded:
//   - rate-limited per IP (see _lib/rate-limit.js)
//   - capped tokens, a single short question
//   - basic input validation + honeypot
//
// Requires ANTHROPIC_API_KEY as a server-side environment variable
// (Netlify → Site configuration → Environment variables). Never
// expose this key in front-end code.
//
// Bilingual in two ways: errors come back as { errorKey } for the
// front-end dictionary to resolve, and `lang` decides which
// language the buying question is asked in — an English visitor
// asking about a Dutch town should still see a realistic answer.
// ============================================================

const { checkRateLimit } = require("./_lib/rate-limit");

const MODEL = "claude-sonnet-5";
const MAX_FIELD_LEN = 80;
const JSON_HEADERS = { "Content-Type": "application/json" };

// The question a real customer would type, per supported language.
const PROMPTS = {
  nl: ({ industry, city }) =>
    `Wat is de beste ${industry} in ${city}? Geef een kort antwoord met een paar concrete aanbevelingen.`,
  en: ({ industry, city }) =>
    `What is the best ${industry} in ${city}? Give a short answer with a few concrete recommendations.`,
};

function clean(value) {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n\t]/g, " ").trim().slice(0, MAX_FIELD_LEN);
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: JSON_HEADERS, body: JSON.stringify({ errorKey: "method_not_allowed" }) };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({ errorKey: "not_configured" }),
    };
  }

  const { allowed } = checkRateLimit(event.headers || {}, { bucket: "spotcheck" });
  if (!allowed) {
    return {
      statusCode: 429,
      headers: JSON_HEADERS,
      body: JSON.stringify({ errorKey: "rate_limited" }),
    };
  }

  let payload;
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch {
    return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ errorKey: "bad_request" }) };
  }

  const name = clean(payload.name);
  const industry = clean(payload.industry);
  const city = clean(payload.city);
  const lang = payload.lang === "en" ? "en" : "nl";
  const honeypot = payload.website;

  if (honeypot) {
    // bot filled the hidden field — pretend success, do nothing real
    return { statusCode: 200, headers: JSON_HEADERS, body: JSON.stringify({ mentioned: false, snippet: "" }) };
  }

  if (!name || !industry || !city) {
    return {
      statusCode: 400,
      headers: JSON_HEADERS,
      body: JSON.stringify({ errorKey: "fields_required" }),
    };
  }

  const prompt = (PROMPTS[lang] || PROMPTS.nl)({ industry, city });

  try {
    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!apiRes.ok) {
      const errBody = await apiRes.text();
      console.error("Anthropic API error:", apiRes.status, errBody);
      return {
        statusCode: 502,
        headers: JSON_HEADERS,
        body: JSON.stringify({ errorKey: "upstream_unreachable" }),
      };
    }

    const data = await apiRes.json();
    const text = (data.content || [])
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    const mentioned = text.toLowerCase().includes(name.toLowerCase());
    const snippet = text.length > 600 ? text.slice(0, 600) + "…" : text;

    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify({ mentioned, snippet }),
    };
  } catch (err) {
    console.error("spotcheck error:", err);
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({ errorKey: "server_error" }),
    };
  }
};
