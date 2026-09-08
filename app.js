// ============================================================
// First Found — front-end logic
// Talks to two serverless endpoints:
//   POST /api/audit       { url }                          -> free, unlimited
//   POST /api/spotcheck   { name, industry, city }          -> one-time, guarded
// Both endpoints keep all API keys server-side. Nothing secret
// ever lives in this file.
//
// The endpoints return language-neutral keys (gradeKey, check
// keys, errorKey); every user-facing string is resolved here
// through i18n.js, so switching language re-renders results that
// are already on screen without another API call.
//
// Wrapped in an IIFE: this and i18n.js are both plain <script>s
// sharing one global scope, so nothing here leaks into it.
// ============================================================

(function () {

  const { t, setLang, getLang, onLangChange } = window.FFI18n;

  // ---------- theme ----------

  const THEME_KEY = "ff_theme";
  const themeToggle = document.getElementById("theme-toggle");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* private mode — the choice just won't survive a reload */
    }
  }

  function safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeColorMeta) {
      const color = themeColorMeta.dataset[theme === "dark" ? "themeColorDark" : "themeColorLight"];
      if (color) themeColorMeta.setAttribute("content", color);
    }
  }

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  applyTheme(currentTheme());

  themeToggle.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    safeSet(THEME_KEY, next);
  });

  // Follow the OS setting as long as the visitor hasn't picked one themselves.
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (safeGet(THEME_KEY)) return;
    applyTheme(e.matches ? "dark" : "light");
  });

  // ---------- language switch ----------

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  // ---------- mobile nav ----------

  const navToggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  function closeNav() {
    mobileNav.hidden = true;
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  navToggle.addEventListener("click", () => {
    const open = mobileNav.hidden;
    mobileNav.hidden = !open;
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
  });

  mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !mobileNav.hidden) {
      closeNav();
      navToggle.focus();
    }
  });

  // ---------- scroll reveal ----------

  const revealTargets = document.querySelectorAll(".step, .service, .tool-card, .chat-mock");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealTargets.forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  // ---------- step 1: technical audit ----------

  const auditForm = document.getElementById("audit-form");
  const auditSubmit = document.getElementById("audit-submit");
  const auditHint = document.getElementById("audit-hint");
  const auditResult = document.getElementById("audit-result");
  const auditDial = document.getElementById("audit-dial");
  const auditScoreEl = document.getElementById("audit-score");
  const auditGradeEl = document.getElementById("audit-grade");
  const auditChecksEl = document.getElementById("audit-checks");

  // Last successful audit payload, kept so a language switch can re-render it.
  let lastAudit = null;
  let lastAuditErrorKey = null;

  function normalizeUrl(raw) {
    let v = raw.trim();
    if (!/^https?:\/\//i.test(v)) v = "https://" + v;
    return v;
  }

  function renderAudit(data) {
    auditScoreEl.textContent = data.score;
    auditDial.style.setProperty("--pct", String(data.score));
    auditDial.classList.toggle("is-good", data.score >= 80);
    auditDial.classList.toggle("is-mid", data.score >= 50 && data.score < 80);
    auditDial.classList.toggle("is-bad", data.score < 50);
    auditGradeEl.textContent = t("audit.grade." + data.gradeKey);

    auditChecksEl.innerHTML = "";
    data.checks.forEach((c) => {
      const li = document.createElement("li");
      li.className = "check-item " + (c.pass ? "ok" : "fail");

      const icon = document.createElement("span");
      icon.className = "check-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = c.pass ? "✓" : "✕";

      const label = document.createElement("span");
      label.textContent = t("audit.check." + c.key, c.params);

      li.append(icon, label);
      auditChecksEl.appendChild(li);
    });

    auditResult.hidden = false;
  }

  auditForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = normalizeUrl(document.getElementById("audit-url").value);

    auditSubmit.disabled = true;
    auditSubmit.textContent = t("tool.step1.submitting");
    auditHint.textContent = "";
    auditHint.classList.remove("is-error");
    auditResult.hidden = true;
    lastAuditErrorKey = null;

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!res.ok) {
        lastAuditErrorKey = data.errorKey || "server_error";
        throw new Error();
      }

      lastAudit = data;
      renderAudit(data);
      unlockSpotcheck();
    } catch {
      // No errorKey means the request never landed (offline, DNS, CORS).
      lastAuditErrorKey = lastAuditErrorKey || "network";
      auditHint.textContent = t("error." + lastAuditErrorKey);
      auditHint.classList.add("is-error");
    } finally {
      auditSubmit.disabled = false;
      auditSubmit.textContent = t("tool.step1.submit");
    }
  });

  // ---------- step 2: live spotcheck ----------

  const spotcheckStep = document.getElementById("step-spotcheck");
  const spotcheckForm = document.getElementById("spotcheck-form");
  const spotcheckSubmit = document.getElementById("spotcheck-submit");
  const spotResult = document.getElementById("spotcheck-result");
  const spotVerdict = document.getElementById("spot-verdict");
  const spotAnswer = document.getElementById("spot-answer");
  const toolCta = document.getElementById("tool-cta");

  const SPOTCHECK_DONE_KEY = "ff_spotcheck_done";

  // Last spotcheck outcome, kept so a language switch can re-render it.
  let lastSpot = null;

  function spotcheckUsed() {
    try {
      return Boolean(sessionStorage.getItem(SPOTCHECK_DONE_KEY));
    } catch {
      return false;
    }
  }

  function markSpotcheckUsed() {
    try {
      sessionStorage.setItem(SPOTCHECK_DONE_KEY, "1");
    } catch {
      /* private mode — the server-side rate limit is the real guard anyway */
    }
  }

  function unlockSpotcheck() {
    spotcheckStep.classList.add("unlocked");
    if (spotcheckUsed()) {
      spotcheckSubmit.disabled = true;
      spotcheckSubmit.textContent = t("tool.step2.used");
    } else {
      spotcheckSubmit.disabled = false;
    }
  }

  function renderSpot(spot) {
    if (spot.state === "error") {
      spotVerdict.className = "spot-verdict fail";
      spotVerdict.textContent = t("spot.failed");
      spotAnswer.textContent = spot.errorKey ? t("error." + spot.errorKey) : t("error.server_error");
    } else {
      spotVerdict.className = "spot-verdict " + (spot.mentioned ? "ok" : "fail");
      spotVerdict.textContent = spot.mentioned
        ? t("spot.mentioned", { name: spot.name })
        : t("spot.notMentioned", { name: spot.name });
      spotAnswer.textContent = spot.snippet || t("spot.noAnswer");
    }
    spotResult.hidden = false;
  }

  spotcheckForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // honeypot — if filled, silently do nothing
    if (document.getElementById("sc-website").value) return;

    const payload = {
      name: document.getElementById("sc-name").value.trim(),
      industry: document.getElementById("sc-industry").value.trim(),
      city: document.getElementById("sc-city").value.trim(),
      // Ask Claude in the visitor's own language — the question has to read
      // like something a real customer would type.
      lang: getLang(),
    };

    spotcheckSubmit.disabled = true;
    spotcheckSubmit.textContent = t("tool.step2.submitting");
    spotResult.hidden = true;

    try {
      const res = await fetch("/api/spotcheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        const err = new Error();
        err.errorKey = data.errorKey || "server_error";
        throw err;
      }

      lastSpot = {
        state: "ok",
        name: payload.name,
        mentioned: data.mentioned,
        snippet: data.snippet,
      };
      renderSpot(lastSpot);

      toolCta.hidden = false;
      markSpotcheckUsed();
      spotcheckSubmit.textContent = t("tool.step2.used");
    } catch (err) {
      lastSpot = { state: "error", errorKey: err.errorKey || "network" };
      renderSpot(lastSpot);
      spotcheckSubmit.disabled = false;
      spotcheckSubmit.textContent = t("tool.step2.submit");
    }
  });

  // ---------- contact form (Netlify Forms — no external account needed) ----------
  // Netlify detects the <form name="contact" data-netlify="true"> at deploy
  // time from the static HTML, so submissions just need to POST back to "/"
  // as normal form-encoded data for Netlify's edge to catch and store them.

  const contactForm = document.getElementById("contact-form");
  const contactStatus = document.getElementById("contact-status");

  // Last contact-form outcome key, kept so a language switch re-renders it.
  let lastContactStatusKey = null;

  function encodeFormData(form) {
    return new URLSearchParams(new FormData(form)).toString();
  }

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    lastContactStatusKey = null;
    contactStatus.textContent = t("contact.sending");
    contactStatus.className = "form-status";

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormData(contactForm),
      });
      if (!res.ok) throw new Error();

      contactForm.reset();
      lastContactStatusKey = "contact.ok";
      contactStatus.textContent = t("contact.ok");
      contactStatus.className = "form-status ok";
    } catch {
      lastContactStatusKey = "contact.fail";
      contactStatus.textContent = t("contact.fail");
      contactStatus.className = "form-status fail";
    } finally {
      submitBtn.disabled = false;
    }
  });

  // ---------- re-render dynamic content when the language changes ----------

  onLangChange(() => {
    if (lastAudit) renderAudit(lastAudit);
    if (lastAuditErrorKey) auditHint.textContent = t("error." + lastAuditErrorKey);
    if (lastSpot) renderSpot(lastSpot);
    if (lastContactStatusKey) contactStatus.textContent = t(lastContactStatusKey);

    // Button labels depend on state, so they can't be plain data-i18n targets.
    if (spotcheckUsed() && spotcheckStep.classList.contains("unlocked")) {
      spotcheckSubmit.textContent = t("tool.step2.used");
    }
  });

  // A visitor who already used their check in this session sees step 2 as spent.
  if (spotcheckUsed()) unlockSpotcheck();

})();
