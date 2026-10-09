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
    ".chat, .shift-type, .shift-col, .pull, .statement, .geo-body," +
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

  // ---------- hero chat demonstration ----------
  // A scripted conversation that plays once the hero is seen, and stays
  // usable afterwards. Three rules it must not break:
  //   1. It never claims to have queried a real model. The panel is
  //      labelled a demonstration in its header, footnote and
  //      accessible name.
  //   2. It invents no rankings. The worked answers give generic buying
  //      criteria and then name obvious placeholders, with the slot the
  //      visitor cares about left deliberately empty.
  //   3. An off-script question gets an honest "no sample answer for
  //      that" and a pointer to the real scan, never a made-up one.

  const chat = document.getElementById("chat");
  if (chat) {
    const thread = document.getElementById("chat-thread");
    const form = document.getElementById("chat-form");
    const input = document.getElementById("chat-input");
    const suggest = document.getElementById("chat-suggest");
    const replay = document.getElementById("chat-replay");

    const SCRIPT = ["1", "2", "3"].map((n) => ({
      q: "chat.q" + n,
      a: "chat.a" + n,
    }));

    // Bumped by anything that interrupts: a new question, a replay, a
    // language switch. Every async step checks it before touching the DOM.
    let run = 0;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const el = (tag, cls, text) => {
      const n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      return n;
    };

    function addUser(text) {
      clearResting();
      const row = el("div", "msg msg-user");
      row.appendChild(el("p", "bubble", text));
      thread.appendChild(row);
      thread.scrollTop = thread.scrollHeight;
      return row;
    }

    function addThinking() {
      clearResting();
      const row = el("div", "msg msg-ai thinking");
      row.setAttribute("aria-label", t("chat.thinking"));
      const dots = el("span", "dots");
      dots.appendChild(el("i")); dots.appendChild(el("i")); dots.appendChild(el("i"));
      row.appendChild(dots);
      thread.appendChild(row);
      thread.scrollTop = thread.scrollHeight;
      return row;
    }

    // Streams text in. aria-hidden while it writes, so a screen reader
    // gets one clean announcement at the end instead of every keystroke.
    async function stream(parent, text, token, speed) {
      const p = el("p", "answer");
      p.setAttribute("aria-hidden", "true");
      parent.appendChild(p);
      if (!motionOK) {
        p.textContent = text;
      } else {
        for (let i = 1; i <= text.length; i++) {
          if (token !== run) return null;
          p.textContent = text.slice(0, i);
          thread.scrollTop = thread.scrollHeight;
          if (i % 2 === 0) await sleep(speed + Math.random() * 10);
        }
      }
      p.removeAttribute("aria-hidden");
      return p;
    }

    // The point of the whole demonstration: two placeholders named, and
    // the visitor's own slot sitting empty next to them.
    function addMentions(parent) {
      const wrap = el("div", "mentions");
      wrap.appendChild(el("span", "idx mentions-label", t("chat.mentioned")));
      wrap.appendChild(el("span", "mention", t("chat.exampleA")));
      wrap.appendChild(el("span", "mention", t("chat.exampleB")));
      wrap.appendChild(el("span", "mention mention-you", t("chat.yourCompany")));
      parent.appendChild(wrap);
    }

    function addCaption(parent) {
      parent.appendChild(el("p", "chat-caption", t("chat.caption")));
    }

    async function answer(step, token) {
      const thinking = addThinking();
      await sleep(motionOK ? 700 + Math.random() * 400 : 0);
      if (token !== run) return;
      thinking.remove();

      const row = el("div", "msg msg-ai");
      thread.appendChild(row);

      const written = await stream(row, t(step.a), token, 9);
      if (!written || token !== run) return;

      await sleep(motionOK ? 240 : 0);
      if (token !== run) return;
      addMentions(row);

      await sleep(motionOK ? 420 : 0);
      if (token !== run) return;
      addCaption(row);
      thread.scrollTop = thread.scrollHeight;
    }

    async function offScript(token) {
      const thinking = addThinking();
      await sleep(motionOK ? 600 : 0);
      if (token !== run) return;
      thinking.remove();
      const row = el("div", "msg msg-ai");
      thread.appendChild(row);
      await stream(row, t("chat.offscript"), token, 9);
      thread.scrollTop = thread.scrollHeight;
    }

    // Types the question into the real input, so the demonstration uses
    // the same control the visitor does.
    async function typeInto(text, token) {
      input.value = "";
      if (!motionOK) { input.value = text; return true; }
      for (let i = 1; i <= text.length; i++) {
        if (token !== run) return false;
        input.value = text.slice(0, i);
        await sleep(26 + Math.random() * 38);
      }
      return true;
    }

    async function play(token) {
      const step = SCRIPT[0];
      await sleep(motionOK ? 500 : 0);
      if (token !== run) return;
      if (!(await typeInto(t(step.q), token))) return;
      await sleep(motionOK ? 320 : 0);
      if (token !== run) return;
      addUser(input.value);
      input.value = "";
      await answer(step, token);
    }

    // The thread holds a fixed height, so an empty one is a visible gap
    // for the couple of seconds before the first bubble lands. It rests
    // on a quiet line instead, cleared by whatever is appended first.
    function showResting() {
      thread.innerHTML = "";
      thread.appendChild(el("p", "chat-resting", t("chat.resting")));
    }

    function clearResting() {
      const r = thread.querySelector(".chat-resting");
      if (r) r.remove();
    }

    function reset() {
      run++;
      input.value = "";
      showResting();
    }

    // Loose match so "beste badkamerzaken zwolle" still finds the worked
    // example; anything else is answered honestly rather than invented.
    function findStep(text) {
      const norm = (x) => x.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
      const asked = norm(text);
      let best = null, bestScore = 0;
      SCRIPT.forEach((step) => {
        const words = norm(t(step.q));
        const hits = words.filter((w) => w.length > 3 && asked.includes(w)).length;
        const score = hits / Math.max(1, words.filter((w) => w.length > 3).length);
        if (score > bestScore) { bestScore = score; best = step; }
      });
      return bestScore >= 0.5 ? best : null;
    }

    async function ask(text) {
      const token = ++run;
      addUser(text);
      input.value = "";
      const step = findStep(text);
      if (step) await answer(step, token);
      else await offScript(token);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (text) ask(text);
    });

    replay.addEventListener("click", () => {
      reset();
      const token = run;
      play(token);
      input.focus({ preventScroll: true });
    });

    // Suggested questions, rebuilt on a language change.
    function buildSuggestions() {
      [...suggest.querySelectorAll("button")].forEach((b) => b.remove());
      SCRIPT.forEach((step) => {
        const b = el("button", "chip", t(step.q));
        b.type = "button";
        // Appends, like a typed question: only Replay starts over.
        b.addEventListener("click", () => {
          ask(t(step.q));
          input.focus({ preventScroll: true });
        });
        suggest.appendChild(b);
      });
    }
    buildSuggestions();
    showResting();

    // Plays once, when the hero is actually looked at.
    let started = false;
    const begin = () => {
      if (started) return;
      started = true;
      reset();
      play(run);
    };
    if (!motionOK || !("IntersectionObserver" in window)) {
      begin();
    } else {
      const chatObserver = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          chatObserver.disconnect();
          begin();
        });
      }, { threshold: 0.3 });
      chatObserver.observe(chat);
      setTimeout(begin, 6000); // never leave the panel empty
    }

    // A language switch invalidates everything on screen.
    onLangChange(() => {
      buildSuggestions();
      reset();
      started = false;
      begin();
    });
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
    const progress = document.getElementById("progress");
    const onScroll = () => {
      masthead.classList.toggle("is-stuck", window.scrollY > 24);
      if (!progress) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      progress.style.setProperty("--p", p.toFixed(4));
    };
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
      const stale = document.getElementById("contact-fallback");
      if (stale) stale.hidden = true;
      lastContactStatusKey = "contact.ok";
      contactStatus.textContent = t("contact.ok");
      contactStatus.className = "form-status ok";
    } catch {
      // A failed POST here means a lost enquiry, so offer a route that
      // does not depend on the form backend at all: a prefilled mail to
      // us, composed in the visitor's own client. encodeURIComponent on
      // every part keeps the values out of the mailto's own syntax.
      lastContactStatusKey = "contact.fail";
      contactStatus.textContent = t("contact.fail");
      contactStatus.className = "form-status fail";

      const field = (id) => (document.getElementById(id) || {}).value || "";
      const line = (key, id) => (field(id) ? t(key) + ": " + field(id) : "");
      const details = [
        line("contact.mailName", "c-name"),
        line("contact.mailCompany", "c-company"),
        line("contact.mailEmail", "c-email"),
      ].filter(Boolean).join("\n");
      // blank line between the details and the message itself
      const body = [details, field("c-message")].filter(Boolean).join("\n\n");

      const href =
        "mailto:info@firstfound.nl" +
        "?subject=" + encodeURIComponent(t("contact.mailSubject")) +
        "&body=" + encodeURIComponent(body);

      let link = document.getElementById("contact-fallback");
      if (!link) {
        link = document.createElement("a");
        link.id = "contact-fallback";
        link.className = "underline-link form-fallback";
        contactStatus.insertAdjacentElement("afterend", link);
      }
      link.href = href;
      link.textContent = t("contact.failMail");
      link.hidden = false;
    } finally {
      submitBtn.disabled = false;
    }
  });

  // ---------- re-render dynamic content when the language changes ----------

  onLangChange(() => {
    if (lastAudit) renderAudit(lastAudit);
    if (lastAuditErrorKey) auditHint.textContent = t("error." + lastAuditErrorKey);
    if (lastContactStatusKey) contactStatus.textContent = t(lastContactStatusKey);
    const fb = document.getElementById("contact-fallback");
    if (fb && !fb.hidden) fb.textContent = t("contact.failMail");
    auditSubmit.textContent = t("tool.step1.submit");
  });

})();
