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

// One map per named bucket, so the cheap endpoint and the paid one
// can't eat into each other's budget: buckets.get("spotcheck") is
// separate from buckets.get("audit").
const buckets = new Map(); // bucket -> Map(ip -> [timestamps])

const DEFAULT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const DEFAULT_MAX = 3;

function getClientIp(headers) {
  // Netlify sets this to the real visitor IP reliably, behind their own proxy.
  const nfIp = headers["x-nf-client-connection-ip"];
  if (nfIp) return nfIp;

  const fwd = headers["x-forwarded-for"];
  if (fwd) return fwd.split(",")[0].trim();

  return "unknown";
}

function checkRateLimit(headers, options = {}) {
  const {
    bucket = "default",
    windowMs = DEFAULT_WINDOW_MS,
    max = DEFAULT_MAX,
  } = options;

  if (!buckets.has(bucket)) buckets.set(bucket, new Map());
  const hits = buckets.get(bucket);

  const ip = getClientIp(headers || {});
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < windowMs);

  if (recent.length >= max) {
    return { allowed: false, ip };
  }

  recent.push(now);
  hits.set(ip, recent);

  // Drop callers who have aged out entirely, so a long-lived warm
  // instance doesn't grow this map forever.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(key);
    }
  }

  return { allowed: true, ip };
}

module.exports = { checkRateLimit };
