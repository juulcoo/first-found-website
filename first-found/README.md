# First Found — website

A static marketing site with two small serverless functions:

- `/api/audit` — free, unlimited technical checker (robots.txt, rendering,
  sitemap, schema). No API costs, no secrets involved.
- `/api/spotcheck` — one-time-per-visitor live check that asks Claude a
  real buying question and checks if the business is mentioned. Costs a
  small amount of API usage per call, so it's rate-limited.

No build step, no framework, no database. Plain HTML/CSS/JS + two Netlify
Functions.

## Before you deploy — two things to fill in, one to switch on after

1. **Contact details** — in `index.html`, replace:
   - `hallo@firstfound.nl` (appears twice)
   - `+31 (0)0 000 00 00`
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

- **`/api/audit`** fetches whatever URL a visitor types in. Before
  fetching, `_lib/ssrf-guard.js` resolves the hostname and rejects
  anything pointing at a private/internal address (so it can't be used
  to probe your own network or cloud metadata endpoints).
- **`/api/spotcheck`** is rate-limited to 3 requests per IP per 24 hours
  (`_lib/rate-limit.js`, using Netlify's `x-nf-client-connection-ip`
  header for the real visitor IP), has a honeypot field to deter simple
  bots, and caps `max_tokens` to keep any single call cheap.
- **`/api/*` routing**: `netlify.toml` redirects `/api/audit` and
  `/api/spotcheck` to Netlify's actual function URLs
  (`/.netlify/functions/...`), so the front-end code never needs to know
  the difference.
- A few baseline security headers (`X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`) are set site-wide in `netlify.toml`.
- **Contact form** uses Netlify's built-in form handling — no external
  account, no data leaving Netlify. Netlify detects the form at deploy
  time by scanning the static HTML for `<form name="contact" data-netlify="true">`,
  so that markup needs to stay as real, static HTML in `index.html` (it
  already is — nothing to maintain here, just don't let a future edit
  turn it into something JS-generated). The hidden `bot-field` input is
  Netlify's own honeypot: bots that fill every field get silently
  rejected at Netlify's edge, before it ever reaches your inbox.

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

## Project structure

```
index.html                     the whole site (one page)
style.css
app.js                         front-end logic for the tool + contact form
netlify.toml                   build config, /api/* routing, security headers
netlify/functions/
  audit.js                     free technical checker
  spotcheck.js                  one-time live AI check
  _lib/
    ssrf-guard.js               blocks the audit tool from probing internal networks
    rate-limit.js                caps spotcheck usage per visitor
```

## Changing the copy

Everything is in `index.html` — no CMS, no build step. Search for the
section you want (`<!-- ================= HERO ================= -->` etc.)
and edit directly.
