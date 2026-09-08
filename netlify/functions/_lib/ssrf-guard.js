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
// Good enough for a marketing-site tool. If you later handle
// anything sensitive, swap this for a maintained package (e.g.
// ssrfcheck) or route the fetch through a locked-down proxy.
// ============================================================

const dns = require("node:dns").promises;
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

/**
 * Validates a URL is safe to fetch server-side.
 * Throws with a user-facing message if not.
 * Returns the parsed URL on success.
 */
async function assertSafeUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("Dat is geen geldige URL.");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Alleen http:// en https:// worden ondersteund.");
  }

  const hostname = parsed.hostname;

  // Reject obvious loopback/metadata hostnames outright.
  const blockedHosts = ["localhost", "metadata.google.internal"];
  if (blockedHosts.includes(hostname.toLowerCase())) {
    throw new Error("Deze host kan niet gecheckt worden.");
  }

  let addresses;
  try {
    addresses = await dns.lookup(hostname, { all: true });
  } catch {
    throw new Error("Kon dit domein niet vinden. Klopt de URL?");
  }

  if (addresses.length === 0 || addresses.some((a) => isPrivateIP(a.address))) {
    throw new Error("Deze URL wijst naar een adres dat niet gecheckt kan worden.");
  }

  return parsed;
}

module.exports = { assertSafeUrl, isPrivateIP };
