// ============================================================
// First Found :: front-end logic
// Talks to two serverless endpoints:
//   POST /api/audit  { url }   -> free, rate-limited, no LLM calls
//
// The scan is deliberately technical only. Whether a model actually
// names a business is the question we get paid to answer, so it is
// not given away here.
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
      /* private mode, so the choice just won't survive a reload */
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

  // ---------- footer year ----------
  // Set from the clock so the copyright line can't quietly go stale.
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

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

  const revealTargets = document.querySelectorAll(
    ".canvas, .shift-type, .shift-col, .pull, .statement, .geo-body," +
    " .wiring, .index-head, .report, .scan-head, .step-block, .rows, .phases," +
    " .setup, .setup-list, .signals, .tiers-head, .tier, .about-statement, .about-body, .creds," +
    " .local, .contact-aside, .form, .foot-statement, .faq-aside, .qas"
  );
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

    revealTargets.forEach((el) => el.classList.add("reveal"));

    // Anything already on screen is revealed directly rather than waiting
    // for a callback. An observer only fires once the page is actually
    // rendered, so in a background tab the first screen would otherwise
    // sit at opacity 0 until the visitor looked at it.
    setTimeout(() => {
      revealTargets.forEach((el) => {
        const box = el.getBoundingClientRect();
        if (box.top < window.innerHeight && box.bottom > 0) {
          el.classList.add("is-visible");
        } else {
          observer.observe(el);
        }
      });
    }, 0);

    // Last resort: content must never stay invisible because a callback
    // did not arrive. Well after any legitimate reveal, show everything.
    setTimeout(() => {
      revealTargets.forEach((el) => el.classList.add("is-visible"));
      observer.disconnect();
    }, 8000);
  }

  // ---------- art direction: scroll-driven detail ----------
  // The rules that draw themselves (the shift arrow, the signal mesh) and
  // the index meters key off their own section arriving, not off a global
  // scroll position, so each lands when it is actually looked at.

  const motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const lightUp = document.querySelectorAll(".shift, .geo, .report");
  if (!motionOK || !("IntersectionObserver" in window)) {
    lightUp.forEach((el) => el.classList.add("is-visible"));
  } else {
    const lineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-visible");
          lineObserver.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    lightUp.forEach((el) => lineObserver.observe(el));
    setTimeout(() => {
      lightUp.forEach((el) => el.classList.add("is-visible"));
      lineObserver.disconnect();
    }, 8000);
  }

  // The hero canvas assembles itself: question, then answer, then the
  // sources it leaned on. Without motion it is simply there already.
  const canvas = document.getElementById("canvas");
  if (canvas) {
    const stages = canvas.querySelectorAll("[data-stage]");
    if (!motionOK) {
      canvas.classList.add("lit");
    } else {
      canvas.classList.add("staged");
      stages.forEach((el, i) => {
        setTimeout(() => el.classList.add("on"), 420 + i * 520);
      });
      setTimeout(() => canvas.classList.add("lit"), 420 + stages.length * 520);
    }
  }

  // Index meters carry their value in data-v. Applying it through CSSOM
  // rather than a style attribute keeps the CSP free of 'unsafe-inline'.
  document.querySelectorAll(".meter[data-v]").forEach((el) => {
    el.style.setProperty("--v", el.dataset.v);
  });

  // Which section you are in, shown in the masthead on narrow screens.
  // Driven by the same observer idea as everything else, and it falls
  // back to simply staying empty if nothing matches.
  const hereNum = document.getElementById("here-num");
  const hereName = document.getElementById("here-name");
  if (hereNum && hereName) {
    const marked = [...document.querySelectorAll("main > section[id]")];
    const labelFor = (sec) => {
      const mark = sec.querySelector(".band-mark, .idx");
      return mark ? mark.textContent.trim() : "";
    };

    const setHere = (sec) => {
      const i = marked.indexOf(sec);
      if (i < 0) return;
      hereNum.textContent = String(i + 1).padStart(2, "0");
      hereName.textContent = labelFor(sec);
    };

    if ("IntersectionObserver" in window) {
      const hereObserver = new IntersectionObserver(
        (entries) => {
          // the section covering the top of the viewport wins
          const top = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          if (top) setHere(top.target);
        },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      );
      marked.forEach((sec) => hereObserver.observe(sec));
    }

    // Labels are translated, so refresh on a language change.
    onLangChange(() => {
      const current = marked.find((sec) => {
        const r = sec.getBoundingClientRect();
        return r.top <= window.innerHeight * 0.3 && r.bottom > window.innerHeight * 0.3;
      });
      if (current) setHere(current);
    });
  }

  // Lists come in one child at a time. The index is set here so the CSS
  // only has to express the delay, and so adding a list item needs no
  // extra markup.
  // A staggered container must also be a reveal target, otherwise its
  // children are hidden by .stagger and nothing ever un-hides them.
  // Deriving the list from revealTargets makes that impossible to get
  // wrong when a selector changes.
  if (motionOK) {
    const STAGGER = ".rows, .phases, .creds, .signals, .setup-list, .qas";
    [...revealTargets].filter((el) => el.matches(STAGGER)).forEach((group) => {
      group.classList.add("stagger");
      [...group.children].forEach((child, i) => child.style.setProperty("--i", String(i)));
    });
  }

  // Figures count up to their value instead of appearing at it. Short
  // and eased, so it reads as a measurement settling rather than a slot
  // machine.
  function countTo(el, target, ms) {
    // Write the real value first. requestAnimationFrame does not run in a
    // background tab, and a figure that never arrives is far worse than
    // one that simply did not animate.
    el.textContent = String(target);
    if (!motionOK) return;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // The illustrative index figures animate when the report arrives.
  const report = document.querySelector(".report");
  if (report) {
    const runCounts = () => {
      report.querySelectorAll(".meter[data-v]").forEach((m) => {
        const val = m.querySelector(".meter-val");
        if (val && !val.dataset.counted) {
          val.dataset.counted = "1";
          countTo(val, Number(m.dataset.v), 1400);
        }
      });
    };
    if (!motionOK || !("IntersectionObserver" in window)) {
      runCounts();
    } else {
      const countObserver = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          runCounts();
          countObserver.disconnect();
        });
      }, { threshold: 0.25 });
      countObserver.observe(report);
      setTimeout(runCounts, 8000); // never leave the figures at zero
    }
  }

  // The masthead only becomes a surface once you have left the hero.
  const masthead = document.getElementById("masthead");
  if (masthead) {
    const onScroll = () => masthead.classList.toggle("is-stuck", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
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
  const auditDimsEl = document.getElementById("audit-dimensions");
  const toolCta = document.getElementById("tool-cta");

  // Last successful audit payload, kept so a language switch can re-render it.
  let lastAudit = null;
  let lastAuditErrorKey = null;

  function normalizeUrl(raw) {
    let v = raw.trim();
    if (!/^https?:\/\//i.test(v)) v = "https://" + v;
    return v;
  }

  const DIMENSION_ORDER = ["access", "structure", "entity", "answer"];

  function renderAudit(data) {
    countTo(auditScoreEl, data.score, 1100);
    auditDial.style.setProperty("--pct", String(data.score));
    auditDial.classList.toggle("is-good", data.score >= 75);
    auditDial.classList.toggle("is-mid", data.score >= 45 && data.score < 75);
    auditDial.classList.toggle("is-bad", data.score < 45);
    auditGradeEl.textContent = t("audit.grade." + data.gradeKey);

    // Real dimension scores, in the same meter shape as the illustrative
    // index above, so the two read as one instrument.
    auditDimsEl.innerHTML = "";
    DIMENSION_ORDER.forEach((dim) => {
      const value = data.dimensions ? data.dimensions[dim] : null;
      if (value == null) return;

      const li = document.createElement("li");
      li.className = "meter";
      li.dataset.dim = dim;
      li.style.setProperty("--v", String(value));

      const name = document.createElement("span");
      name.className = "meter-name";
      name.textContent = t("audit.dim." + dim);

      const track = document.createElement("span");
      track.className = "meter-track";
      track.setAttribute("aria-hidden", "true");
      track.appendChild(Object.assign(document.createElement("span"), { className: "meter-fill" }));

      const val = document.createElement("span");
      val.className = "meter-val idx";
      countTo(val, value, 1200);

      li.append(name, track, val);
      auditDimsEl.appendChild(li);
    });
    // the fills are revealed by the same rule the illustrative meters use
    auditDimsEl.classList.add("is-visible");

    // Findings, grouped under the dimension they belong to.
    auditChecksEl.innerHTML = "";
    DIMENSION_ORDER.forEach((dim) => {
      const inGroup = data.checks.filter((c) => (c.group || "access") === dim);
      if (!inGroup.length) return;

      const section = document.createElement("section");
      section.className = "finding-group";
      section.dataset.dim = dim;

      const head = document.createElement("h5");
      head.className = "idx";
      head.textContent = t("audit.dim." + dim);
      section.appendChild(head);

      const ul = document.createElement("ul");
      ul.className = "checks";
      inGroup.forEach((c) => {
        const li = document.createElement("li");
        li.className = c.pass ? "ok" : "fail";

        const icon = document.createElement("span");
        icon.className = "check-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = c.pass ? "+" : "\u2013";

        const label = document.createElement("span");
        label.textContent = t("audit.check." + c.key, c.params);

        li.append(icon, label);
        ul.appendChild(li);
      });

      section.appendChild(ul);
      auditChecksEl.appendChild(section);
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
      toolCta.hidden = false;
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

  // ---------- contact form (Netlify Forms, no external account needed) ----------
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
    if (lastContactStatusKey) contactStatus.textContent = t(lastContactStatusKey);
    auditSubmit.textContent = t("tool.step1.submit");
  });

})();
