# First Found — website

A static marketing site with two small serverless functions:

- `/api/audit` — free, unlimited technical checker (robots.txt, rendering,
  sitemap, schema). No API costs, no secrets involved.
- `/api/spotcheck` — one-time-per-visitor live check that asks Claude a
  real buying question and checks if the business is mentioned. Costs a
  small amount of API usage per call, so it's rate-limited.

No build step, no framework, no database. Plain HTML/CSS/JS + two Netlify
Functions.

The site is bilingual (Dutch/English) and themed light/dark. Both are
plain front-end concerns — no build step, no extra requests:

- **Language** — every string lives in `i18n.js`. The markup ships with
  the Dutch text inline, so the page reads correctly before any JS runs
  and for crawlers that don't execute it; `i18n.js` swaps in English when
  the visitor prefers it. The choice follows the browser language on a
  first visit and is remembered in `localStorage` after that.
- **Theme** — one set of CSS custom properties in `style.css`, with the
  dark theme redefining only the tokens. A small inline script in
  `<head>` sets `data-theme` before first paint, so there's no flash of
  the wrong theme. It follows the OS setting until the visitor picks one.

Because the functions return language-neutral keys rather than sentences
(see below), switching language re-renders results already on screen
without calling the API again.

## Before you deploy — two things to fill in, one to switch on after

1. **Contact details** — replace the placeholders in *both* files:
   - `hallo@firstfound.nl` — twice in `index.html` (contact block, footer)
     and once in each language's `contact.fail` message in `i18n.js`
   - `+31 (0)0 000 00 00` — in `index.html`, in both the link text and
     the `tel:` href next to it
2. **Domain** — decide what you're deploying to (e.g. `firstfound.nl`).
3. **After your first deploy**, turn on email notifications for the
   contact form — Netlify stores submissions in its dashboard by default,
   but does *not* email them to you until you ask it to:
   **Site configuration → Forms → Form notifications → Add notification
   → Email notification** → point it at `hallo@firstfound.nl`.
   Without this step, messages arrive but nothing tells you they did.

## Deploying (Netlify)

Netlify's free tier is confirmed fine for hosting your own business site
(not for reselling hosting to clients under one account, which doesn't
apply here). Automatic HTTPS, a global CDN, and serverless functions for
`/api/*` — no extra setup beyond what's already in `netlify.toml`.

1. Push this folder to a GitHub repository.
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** →
   **Import an existing project** → connect that repo. Netlify reads
   `netlify.toml` automatically — no build command needed.
3. Before the first deploy, add the environment variable:
   - **Site configuration → Environment variables** → `ANTHROPIC_API_KEY`
     → your key from [console.anthropic.com](https://console.anthropic.com)
4. Deploy.
5. **Domain settings → Add a domain** → follow the DNS instructions
   (usually one A record or CNAME at your registrar).

That's it — no server to patch, no OS to maintain.

## Important: set a spend cap

Before sharing the link publicly, set a **monthly spend limit** on your
Anthropic account: [console.anthropic.com](https://console.anthropic.com) →
Settings → Limits. The rate limiter in `netlify/functions/_lib/rate-limit.js`
caps usage per visitor, but a spend cap is your real backstop against
anything unexpected — set it and forget it.

## How the guardrails work

- **`/api/audit`** fetches whatever URL a visitor types in, so every
  outbound request goes through `safeFetch()` in `_lib/ssrf-guard.js`.
  It resolves the hostname and rejects anything pointing at a
  private/internal address — and it re-runs that check on **every
  redirect hop**, following redirects manually rather than letting
  `fetch` do it. That matters: validating only the typed URL is not
  enough, because a hostile site can answer `302 -> http://10.0.0.5/`
  and a following fetch would go there unchecked. Redirect chains are
  capped at 3 and the whole chain shares one 8s deadline (Netlify kills
  a function at 10s). **Never call `fetch()` directly in `audit.js`.**
- **`/api/audit` is also rate-limited** — 30 per IP per hour. It's free
  to the visitor but not to us: each call makes three outbound requests,
  so without a limit the endpoint is a request amplifier pointed at
  someone else's server, and it burns Netlify invocations. The limit is
  generous enough that a real person checking a few sites never sees it.
- **`/api/spotcheck`** is rate-limited to 3 requests per IP per 24 hours
  (`_lib/rate-limit.js`, using Netlify's `x-nf-client-connection-ip`
  header for the real visitor IP), has a honeypot field to deter simple
  bots, and caps `max_tokens` to keep any single call cheap.
- **Both endpoints are origin-locked** (`_lib/origin-check.js`). A call
  whose `Origin` isn't one of our own is refused with a 403 before any
  work happens, so neither endpoint can be wired into someone else's
  page and billed to us. The allowlist is built from Netlify's own
  `URL` / `DEPLOY_PRIME_URL` / `DEPLOY_URL`, so previews and branch
  deploys keep working with no configuration; set `ALLOWED_ORIGINS`
  (comma-separated) once a custom domain is live.

  Be clear about what this does and doesn't do: browsers set `Origin`
  and page JavaScript cannot forge it, so this stops cross-site use and
  casual `curl`. It does **not** stop someone who sets the header
  themselves. The spend cap below is what actually bounds the damage.

  It deliberately **fails open** when no allowlist can be built at all
  (local `netlify dev`, where Netlify sets none of those variables) —
  otherwise the endpoints would break locally. A real deploy always has
  `URL` set.
- **Response bodies are read with a 512KB ceiling** (`readCapped()` in
  `_lib/ssrf-guard.js`). `/api/audit` reads the body of whatever site a
  visitor names, and a hostile or broken target can stream forever;
  reading that into a string is how a function runs out of memory. We
  only look at the first few KB anyway, so the reader stops early and
  cancels the rest. Request bodies are capped at 4KB for the same reason.
- **`/api/*` routing**: `netlify.toml` redirects `/api/audit` and
  `/api/spotcheck` to Netlify's actual function URLs
  (`/.netlify/functions/...`), so the front-end code never needs to know
  the difference.
- **Security headers** are set site-wide in `netlify.toml`: a strict
  `Content-Security-Policy` (`default-src 'self'` — the site loads
  nothing from any other origin), plus `Permissions-Policy`,
  `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` and the
  cross-origin isolation headers.

  ⚠️ The CSP contains a **sha256 hash of the inline `<script>`** in
  `index.html`'s `<head>` (the theme/language bootstrap). If you edit
  that script, the hash no longer matches and the browser will
  **silently refuse to run it** — the page still works but flashes the
  wrong theme on load. After editing it, run:

  ```bash
  ./tools-csp-hash.sh
  ```

  and paste the value it prints into the `script-src` in `netlify.toml`.
- **No third-party requests at all.** Fonts are self-hosted in `fonts/`
  rather than loaded from Google, so no visitor IP is handed to Google —
  which is a GDPR question you don't want to have to answer. There is no
  analytics, no tag manager, no external script anywhere. This is what
  lets the CSP be as tight as it is.
- **Contact form** uses Netlify's built-in form handling — no external
  account, no data leaving Netlify. Netlify detects the form at deploy
  time by scanning the static HTML for `<form name="contact" data-netlify="true">`,
  so that markup needs to stay as real, static HTML in `index.html` (it
  already is — nothing to maintain here, just don't let a future edit
  turn it into something JS-generated). The hidden `bot-field` input is
  Netlify's own honeypot: bots that fill every field get silently
  rejected at Netlify's edge, before it ever reaches your inbox.

### What the endpoints return

Neither function returns human-readable text, so that neither one has to
know which language the visitor is reading:

- `/api/audit` → `{ score, gradeKey, checks: [{ key, pass, params? }] }`.
  `params` carries values to interpolate into the sentence (e.g. which
  crawlers are blocked); the front-end resolves `audit.check.<key>`.
- `/api/spotcheck` → `{ mentioned, snippet }`. The snippet is Claude's
  own answer, passed through as-is. `lang` in the request body decides
  which language the buying question is asked in.
- Errors from either → `{ errorKey }`, resolved against `error.*`.

Adding a new rejection reason means adding its `error.<key>` to **both**
languages in `i18n.js`, or the front-end will print the bare key.

### One limitation to know about

The rate limiter is **in-memory** — it resets whenever the function
cold-starts, and doesn't share state across concurrent instances under
real traffic. Fine for a low-to-moderate-traffic marketing site. If this
page starts getting real volume (e.g. after a paid campaign), swap it for
a durable store — [Upstash Redis](https://upstash.com) has a generous free
tier and drops in as a replacement for the `Map` in that file with only a
few lines changed. Ask me to do this swap if/when you need it.

## Local testing

```bash
npm install -g netlify-cli
netlify dev
```

This runs the site and both functions locally, with routing exactly as
configured in `netlify.toml`. Put your key in a local `.env` file first
(copy `.env.example` — this local `.env` is already gitignored, don't
commit it).

## Regenerating the fonts

You shouldn't need to, but if you change which weights the design uses,
re-download them rather than pointing `index.html` back at Google:

1. Edit the `family=` list in the `URL` below to match the weights you
   want, then run it from the project root:

```bash
python3 -c "$(cat <<'EOF'
import re, subprocess
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
URL = ("https://fonts.googleapis.com/css2?"
       "family=Archivo:wght@500;600;700;800&"
       "family=Inter:wght@400;500;600&"
       "family=IBM+Plex+Mono:wght@400;500&display=swap")
css = subprocess.run(["curl","-s","-H",f"User-Agent: {UA}",URL],capture_output=True,text=True).stdout
out, seen = [], {}
for subset, block in re.findall(r'/\*\s*([a-z0-9-]+)\s*\*/\s*(@font-face\s*\{[^}]*\})', css):
    if subset not in {"latin","latin-ext"}: continue
    fam = re.search(r"font-family: '([^']+)'", block).group(1)
    w   = re.search(r"font-weight: (\d+)", block).group(1)
    url = re.search(r"url\((https://[^)]+\.woff2)\)", block).group(1)
    name = f"{fam.lower().replace(' ','-')}-{w}-normal-{subset}.woff2"
    if url not in seen:
        subprocess.run(["curl","-s","-o",f"fonts/{name}",url]); seen[url] = name
    out.append(re.sub(r"url\(https://[^)]+\.woff2\)", f"url(./{seen[url]})", block))
open("fonts/fonts.css","a").write("\n\n".join(out))
print("wrote", len(seen), "files")
EOF
)"
```

2. Keep the licence note in `fonts/LICENSE.md` accurate, and re-check
   that `fonts/fonts.css` still starts with the explanatory header
   comment (the snippet above appends, so tidy the file afterwards).

Only `latin` and `latin-ext` subsets are kept — enough for Dutch and
English. The browser only downloads the subsets a page actually uses, so
in practice a visitor fetches about 112KB of font, once, then it's cached
for a year by the `Cache-Control` rule in `netlify.toml`.

## Project structure

```
index.html                     the whole site (one page)
style.css                      design tokens + light/dark themes
i18n.js                        NL/EN dictionary and the translation engine
app.js                         front-end logic for the tool, theme, nav, contact form
netlify.toml                   build config, /api/* routing, security headers
tools-csp-hash.sh              reprints the CSP hash after editing the inline script
fonts/                         self-hosted webfonts (see fonts/LICENSE.md)
  fonts.css                    @font-face rules pointing at the local .woff2 files
netlify/functions/
  audit.js                     free technical checker
  spotcheck.js                  one-time live AI check
  _lib/
    ssrf-guard.js               safeFetch(): validates every redirect hop
    rate-limit.js                per-endpoint request caps, keyed by visitor IP
    origin-check.js               refuses calls that didn't come from our own site
```

## Changing the copy

Visible text lives in **two** places, and both need to stay in step:

1. `index.html` — the Dutch text as it ships (what a visitor sees before
   JS runs). Search for the section you want
   (`<!-- ================= HERO ================= -->` etc.).
2. `i18n.js` — the `nl` and `en` dictionaries, keyed by the
   `data-i18n="..."` attribute on the element you're editing.

So changing a Dutch sentence means editing the element in `index.html`
*and* its `nl` entry in `i18n.js`; a new sentence needs an entry in both
`nl` and `en`. If a key is missing, `t()` falls back to Dutch and then to
printing the key itself — so a stray `services.title` on the page means
that key never made it into the dictionary.

Strings that JS generates (check results, grades, error messages, button
states) exist **only** in `i18n.js` — there's nothing for them in the
HTML. The same goes for anything the serverless functions report: they
return keys like `gradeKey: "strong"` or `errorKey: "url_dns"`, and the
wording for those lives under `audit.grade.*` / `error.*` in the
dictionary. Adding a new check or error means adding its key in both
languages.
