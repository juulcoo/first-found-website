// ============================================================
// First Found — front-end logic
// Talks to two serverless endpoints:
//   POST /api/audit       { url }                         -> free, unlimited
//   POST /api/spotcheck   { name, industry, city }         -> one-time, guarded
// Both endpoints keep all API keys server-side. Nothing secret
// ever lives in this file.
// ============================================================

const auditForm = document.getElementById("audit-form");
const auditSubmit = document.getElementById("audit-submit");
const auditHint = document.getElementById("audit-hint");
const auditResult = document.getElementById("audit-result");
const auditScoreEl = document.getElementById("audit-score");
const auditGradeEl = document.getElementById("audit-grade");
const auditChecksEl = document.getElementById("audit-checks");

const spotcheckStep = document.getElementById("step-spotcheck");
const spotcheckForm = document.getElementById("spotcheck-form");
const spotcheckSubmit = document.getElementById("spotcheck-submit");
const spotResult = document.getElementById("spotcheck-result");
const spotVerdict = document.getElementById("spot-verdict");
const spotAnswer = document.getElementById("spot-answer");

const toolCta = document.getElementById("tool-cta");

const SPOTCHECK_DONE_KEY = "ff_spotcheck_done";

function normalizeUrl(raw) {
  let v = raw.trim();
  if (!/^https?:\/\//i.test(v)) v = "https://" + v;
  return v;
}

function checkLabel(key) {
  const labels = {
    ai_crawlers_blocked: "AI-crawlers mogen je site bezoeken",
    client_side_rendered: "Je site is leesbaar zonder JavaScript",
    sitemap_found: "Je hebt een sitemap.xml",
    schema_found: "Je hebt schema markup (gestructureerde data)",
  };
  return labels[key] || key;
}

auditForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = normalizeUrl(document.getElementById("audit-url").value);

  auditSubmit.disabled = true;
  auditSubmit.textContent = "Checken…";
  auditHint.textContent = "";
  auditResult.hidden = true;

  try {
    const res = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Kon de site niet checken.");

    auditScoreEl.textContent = data.score;
    auditGradeEl.textContent = data.grade;

    auditChecksEl.innerHTML = "";
    data.checks.forEach((c) => {
      const li = document.createElement("li");
      li.className = "check-item " + (c.pass ? "ok" : "fail");
      li.innerHTML = `<span class="check-icon">${c.pass ? "✓" : "✕"}</span><span>${c.label}</span>`;
      auditChecksEl.appendChild(li);
    });

    auditResult.hidden = false;
    unlockSpotcheck();
  } catch (err) {
    auditHint.textContent = err.message || "Er ging iets mis. Probeer het opnieuw.";
  } finally {
    auditSubmit.disabled = false;
    auditSubmit.textContent = "Check mijn site";
  }
});

function unlockSpotcheck() {
  spotcheckStep.classList.add("unlocked");
  if (sessionStorage.getItem(SPOTCHECK_DONE_KEY)) {
    spotcheckSubmit.disabled = true;
    spotcheckSubmit.textContent = "Al gebruikt deze sessie";
  } else {
    spotcheckSubmit.disabled = false;
  }
}

spotcheckForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // honeypot — if filled, silently pretend success and do nothing
  if (document.getElementById("sc-website").value) return;

  const payload = {
    name: document.getElementById("sc-name").value.trim(),
    industry: document.getElementById("sc-industry").value.trim(),
    city: document.getElementById("sc-city").value.trim(),
  };

  spotcheckSubmit.disabled = true;
  spotcheckSubmit.textContent = "Claude denkt na…";
  spotResult.hidden = true;

  try {
    const res = await fetch("/api/spotcheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Kon de check niet uitvoeren.");

    spotVerdict.className = "spot-verdict " + (data.mentioned ? "ok" : "fail");
    spotVerdict.textContent = data.mentioned
      ? `Genoemd — Claude noemt ${payload.name} in het antwoord.`
      : `Niet genoemd — Claude noemt ${payload.name} niet in het antwoord.`;
    spotAnswer.textContent = data.snippet;

    spotResult.hidden = false;
    toolCta.hidden = false;
    sessionStorage.setItem(SPOTCHECK_DONE_KEY, "1");
    spotcheckSubmit.textContent = "Al gebruikt deze sessie";
  } catch (err) {
    spotcheckSubmit.disabled = false;
    spotcheckSubmit.textContent = "Vraag het aan Claude";
    spotResult.hidden = false;
    spotVerdict.className = "spot-verdict fail";
    spotVerdict.textContent = "Kon de check niet uitvoeren.";
    spotAnswer.textContent = err.message || "Probeer het later opnieuw.";
  }
});

// ---------- contact form (Netlify Forms — no external account needed) ----------
// Netlify detects the <form name="contact" data-netlify="true"> at deploy
// time from the static HTML, so submissions just need to POST back to "/"
// as normal form-encoded data for Netlify's edge to catch and store them.

const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

function encodeFormData(form) {
  return new URLSearchParams(new FormData(form)).toString();
}

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  contactStatus.textContent = "Versturen…";
  contactStatus.className = "form-status";

  try {
    const res = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encodeFormData(contactForm),
    });
    if (res.ok) {
      contactForm.reset();
      contactStatus.textContent = "Bedankt — we reageren binnen één werkdag.";
      contactStatus.className = "form-status ok";
    } else {
      throw new Error();
    }
  } catch {
    contactStatus.textContent = "Versturen mislukt. Mail ons gerust direct op hallo@firstfound.nl.";
    contactStatus.className = "form-status fail";
  } finally {
    submitBtn.disabled = false;
  }
});
