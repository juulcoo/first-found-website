#!/usr/bin/env bash
# Recompute the CSP hash for the inline theme/language bootstrap script
# in index.html, and print the line to paste into netlify.toml.
#
# Run this whenever you edit that <script> block in <head>. If the hash
# and the script disagree, the browser silently refuses to run it and
# the page flashes the wrong theme on load.
set -euo pipefail
cd "$(dirname "$0")"
HASH=$(python3 - <<'PY'
import re, hashlib, base64
html = open("index.html", encoding="utf-8").read()
body = re.search(r"<script>(.*?)</script>", html, re.S).group(1)
print("sha256-" + base64.b64encode(hashlib.sha256(body.encode()).digest()).decode())
PY
)
echo "$HASH"
