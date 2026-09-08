// ============================================================
// SSRF guard
// ------------------------------------------------------------
// /api/audit fetches whatever URL a visitor types in. Without
// this check, someone could type "http://169.254.169.254/" or
// "http://localhost:6379" and use your server as a probe into
// its own private network. This resolves the hostname and
// rejects anything that points at a private, loopback, or
// link-local address before any fetch happens.
//
// Validating the typed URL is NOT enough on its own: a hostile
// site can accept the request and answer "302 -> http://10.0.0.5/",
// and a following fetch would go there having never been checked.
// So use safeFetch() below rather than fetch() directly — it
// re-validates every hop of every redirect chain.
//
// Residual risk, accepted knowingly: between our DNS check and the
// fetch's own lookup, a domain with a very short TTL could flip to
// a private address (DNS rebinding). Closing that needs pinning the
// connection to the validated IP, which Node's fetch can't express
// without breaking TLS certificate checks. The window is tiny and
// the audit only ever reveals booleans, so it's a poor target — but
// if this ever returns fetched content, revisit it.
//
// Rejections throw an Error carrying a `.key` — the site is
// bilingual, so the wording lives in the front-end dictionary
// (i18n.js, under "error.<key>") rather than here.
// ============================================================

const dns = require("node:dns").promises;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const net = require("node:net");

function isPrivateIPv4(ip) {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p))) return true;
  const [a, b] = parts;
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 127) return true; // loopback
  if (a === 0) return true; // "this" network
  if (a === 169 && b === 254) return true; // link-local
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a === 198 && (b === 18 || b === 19)) return true; // benchmarking
  if (a >= 224) return true; // multicast / reserved
  return false;
}

function isPrivateIPv6(ip) {
  const lower = ip.toLowerCase();
  if (lower === "::1") return true; // loopback
  if (lower.startsWith("fe80:")) return true; // link-local
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // unique local fc00::/7
  if (lower.startsWith("::ffff:")) {
    // IPv4-mapped address — check the embedded IPv4 part
    const v4 = lower.split("::ffff:")[1];
    if (v4 && v4.includes(".")) return isPrivateIPv4(v4);
  }
  return false;
}

function isPrivateIP(ip) {
  if (net.isIPv4(ip)) return isPrivateIPv4(ip);
  if (net.isIPv6(ip)) return isPrivateIPv6(ip);
  return true; // unknown format — fail closed
}

/** Error carrying a translation key for the front-end to resolve. */
function reject(key, detail) {
  const err = new Error(detail);
  err.key = key;
  return err;
}

/**
 * Validates a URL is safe to fetch server-side.
 * Throws an Error with a `.key` (see i18n.js "error.*") if not.
 * Returns the parsed URL on success.
 */
async function assertSafeUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw reject("url_invalid", "unparseable URL");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw reject("url_protocol", `unsupported protocol: ${parsed.protocol}`);
  }

  const hostname = parsed.hostname;

  // Reject obvious loopback/metadata hostnames outright.
  const blockedHosts = ["localhost", "metadata.google.internal"];
  if (blockedHosts.includes(hostname.toLowerCase())) {
    throw reject("url_blocked_host", `blocked hostname: ${hostname}`);
  }

  let addresses;
  try {
    addresses = await dns.lookup(hostname, { all: true });
  } catch {
    throw reject("url_dns", `DNS lookup failed for ${hostname}`);
  }

  if (addresses.length === 0 || addresses.some((a) => isPrivateIP(a.address))) {
    throw reject("url_private", `resolves to a private address: ${hostname}`);
  }

  return parsed;
}

/**
 * fetch() that is safe to point at a visitor-supplied URL.
 *
 * Every hop is validated before it is requested, redirects are
 * followed manually so none of them can skip that check, and the
 * whole chain shares one deadline (Netlify kills the function at
 * 10s, so per-hop timeouts could otherwise add up past the limit).
 */
async function safeFetch(rawUrl, options = {}, { timeoutMs = 8000, maxRedirects = 3 } = {}) {
  const deadline = Date.now() + timeoutMs;
  let url = rawUrl;

  for (let hop = 0; hop <= maxRedirects; hop++) {
    await assertSafeUrl(url);

    const remaining = deadline - Date.now();
    if (remaining <= 0) throw reject("url_timeout", `timed out after ${hop} hop(s)`);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), remaining);
    let res;
    try {
      res = await fetch(url, { ...options, signal: controller.signal, redirect: "manual" });
    } finally {
      clearTimeout(timer);
    }

    if (!REDIRECT_STATUSES.has(res.status)) return res;

    const location = res.headers.get("location");
    if (!location) return res; // a 3xx with nowhere to go — treat as the answer

    // Relative redirects are legal, so resolve against the current URL.
    try {
      url = new URL(location, url).toString();
    } catch {
      throw reject("url_invalid", `unparseable redirect target: ${location}`);
    }
  }

  throw reject("url_redirects", `more than ${maxRedirects} redirects`);
}

module.exports = { assertSafeUrl, safeFetch, isPrivateIP };
