// ============================================================
// Rate limiter — in-memory, per function instance
// ------------------------------------------------------------
// Same caveat as before: resets on cold start, not shared across
// concurrent instances. Fine for a marketing site's traffic;
// swap for Upstash Redis if volume grows. See README.
//
// Takes a plain headers object rather than a framework-specific
// request object, so it works the same under Netlify's classic
// handler (event.headers) as it would anywhere else.
// ============================================================

const hits = new Map(); // ip -> [timestamps]

const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_PER_WINDOW = 3;

function getClientIp(headers) {
  // Netlify sets this to the real visitor IP reliably, behind their own proxy.
  const nfIp = headers["x-nf-client-connection-ip"];
  if (nfIp) return nfIp;

  const fwd = headers["x-forwarded-for"];
  if (fwd) return fwd.split(",")[0].trim();

  return "unknown";
}

function checkRateLimit(headers) {
  const ip = getClientIp(headers || {});
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    return { allowed: false, ip };
  }

  recent.push(now);
  hits.set(ip, recent);
  return { allowed: true, ip };
}

module.exports = { checkRateLimit };
