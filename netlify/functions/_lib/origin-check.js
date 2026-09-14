// ============================================================
// Origin check — "did this call come from our own site?"
// ------------------------------------------------------------
// Both endpoints cost us something: /api/audit makes three
// outbound requests, /api/spotcheck spends Anthropic tokens. The
// rate limiter caps how often one caller can do that; this caps
// *who* can trigger it from a browser at all, so the endpoints
// can't be wired into someone else's page and billed to us.
//
// Be honest about the strength of this: Origin is set by the
// browser and cannot be forged by page JavaScript, so this does
// stop cross-site use and casual curl. It does NOT stop someone
// who sets the header themselves from a script. The control that
// actually bounds the damage is the monthly spend limit in the
// Anthropic Console (see .env.example).
//
// The allowlist is built from Netlify's own per-deploy variables,
// so previews and branch deploys keep working without config.
// ALLOWED_ORIGINS adds to it (comma-separated) once a custom
// domain is live.
// ============================================================

const NETLIFY_ORIGIN_VARS = ["URL", "DEPLOY_PRIME_URL", "DEPLOY_URL"];

function toOrigin(value) {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function allowedOrigins() {
  const raw = [];

  if (process.env.ALLOWED_ORIGINS) {
    raw.push(...process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()));
  }
  for (const name of NETLIFY_ORIGIN_VARS) {
    if (process.env[name]) raw.push(process.env[name]);
  }

  return [...new Set(raw.filter(Boolean).map(toOrigin).filter(Boolean))];
}

/**
 * Returns { ok: true } when the caller is one of our own pages.
 *
 * Deliberate fail-open: if no allowlist can be built at all (local
 * `netlify dev`, where Netlify sets none of its URL variables), the
 * check passes rather than breaking the endpoints outright. In a
 * real deploy Netlify always sets URL, so the allowlist is non-empty
 * exactly where it matters.
 */
function checkOrigin(headers = {}) {
  const allow = allowedOrigins();
  if (allow.length === 0) return { ok: true };

  // Netlify lowercases header names, but don't bet the check on it.
  let candidate = headers.origin || headers.Origin;

  // Safari has historically omitted Origin on some same-origin POSTs;
  // Referer is a usable second opinion, and only ever narrows what
  // we accept — it can never widen it past the allowlist.
  if (!candidate) {
    const referer = headers.referer || headers.Referer;
    if (referer) candidate = toOrigin(referer);
  }

  if (!candidate) return { ok: false, reason: "no Origin or Referer" };

  const origin = toOrigin(candidate);
  if (!origin) return { ok: false, reason: `unparseable Origin: ${candidate}` };

  return allow.includes(origin) ? { ok: true } : { ok: false, reason: `origin not allowed: ${origin}` };
}

module.exports = { checkOrigin };
