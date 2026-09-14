// ============================================================
// First Found — i18n
// ------------------------------------------------------------
// Two languages, one dictionary, no build step. The markup ships
// with the Dutch strings inline (so the page is readable before
// this file runs, and for crawlers that don't execute JS); this
// script swaps them out when the visitor prefers English.
//
// Markup hooks:
//   data-i18n="key"             -> textContent
//   data-i18n-html="key"        -> innerHTML (only for our own strings)
//   data-i18n-placeholder="key" -> placeholder attribute
//   data-i18n-aria-label="key"  -> aria-label attribute
//   data-i18n-content="key"     -> content attribute (meta tags)
//
// Strings used from JS (results, errors, button states) are read
// with t("key", { param: value }) instead.
//
// Wrapped in an IIFE: this and app.js are both plain <script>s
// sharing one global scope, so only window.FFI18n is exported.
// ============================================================

(function () {

  const I18N = {
    nl: {
      "meta.title": "First Found — Word gevonden door AI",
      "meta.description":
        "First Found meet en verbetert of jouw bedrijf wordt genoemd in ChatGPT, Perplexity, Gemini en Claude. Begin met een gratis check.",

      "nav.skip": "Naar hoofdinhoud",
      "nav.label": "Hoofdmenu",
      "nav.how": "Hoe het werkt",
      "nav.check": "Check je site",
      "nav.services": "Diensten",
      "nav.contact": "Contact",
      "nav.language": "Taal",
      "nav.theme": "Wissel tussen licht en donker",
      "nav.menu": "Menu",

      "hero.eyebrow": "Generative Engine Optimization",
      "hero.title": "Wordt jouw bedrijf genoemd als iemand het aan AI vraagt?",
      "hero.sub":
        "Steeds meer mensen zoeken niet meer via Google, maar vragen het rechtstreeks aan ChatGPT, Perplexity of Claude. Als jouw bedrijf daar niet in het antwoord staat, besta je voor die klant niet. First Found meet dat — en zorgt dat je wél genoemd wordt.",
      "hero.cta": "Check je site gratis",
      "hero.secondary": "Hoe werkt dat precies?",
      "hero.badge1": "Gratis technische check",
      "hero.badge2": "Geen account nodig",
      "hero.badge3": "Resultaat in seconden",
      "hero.mock.label": "AI-antwoord",
      "hero.mock.question": "“Beste installateur voor zonnepanelen in Groningen?”",
      "hero.mock.answerA": "Voor zonnepanelen in Groningen worden vaak",
      "hero.mock.answerB": "en",
      "hero.mock.answerC": "genoemd, beide met ervaring in de regio en goede reviews.",
      "hero.mock.missing": "jouw bedrijf?",

      "how.eyebrow": "Aanpak",
      "how.title": "Hoe het werkt",
      "how.lead":
        "Dit heet <strong>GEO</strong> (Generative Engine Optimization) — hetzelfde idee als SEO, maar dan voor AI-antwoorden in plaats van zoekresultaten. Simpel gezegd komt het op drie dingen neer.",
      "how.s1.title": "We stellen AI dezelfde vragen als jouw klanten",
      "how.s1.body":
        "Niet “noem [bedrijfsnaam]”, maar echte koopvragen zoals “beste [dienst] in [plaats]” of “wat kost [dienst] ongeveer”. Zo zien we wat een klant écht te zien krijgt.",
      "how.s2.title": "We meten of, hoe vaak en hoe je genoemd wordt",
      "how.s2.body":
        "Over de vier grote platformen — ChatGPT, Perplexity, Gemini en Claude — zodat je één helder cijfer krijgt in plaats van een onderbuikgevoel.",
      "how.s3.title": "We passen je site en content aan",
      "how.s3.body":
        "Technisch fundament op orde, content in de vorm die AI begrijpt en overneemt, en elke maand opnieuw gemeten — want wat AI aanbeveelt verschuift voortdurend.",

      "tool.eyebrow": "Gratis check",
      "tool.title": "Check je site",
      "tool.lead":
        "Twee stappen. Eerst een gratis technische check — direct, geen kosten. Daarna kun je één keer live laten checken of Claude jouw bedrijf ook echt noemt.",

      "tool.step1.label": "Stap 1 — gratis, direct",
      "tool.step1.title": "Kunnen AI's je site überhaupt lezen?",
      "tool.step1.inputLabel": "Website URL",
      "tool.step1.placeholder": "jouwbedrijf.nl",
      "tool.step1.submit": "Check mijn site",
      "tool.step1.submitting": "Checken…",
      "tool.step1.scoreSub": "technisch fundament, op 100",

      "tool.step2.label": "Stap 2 — één gratis check",
      "tool.step2.title": "Noemt Claude jouw bedrijf ook echt?",
      "tool.step2.hint":
        "We vragen het aan Claude, zoals een klant dat zou doen — inclusief live websearch. Dit werkt één keer gratis per bezoek.",
      "tool.step2.nameLabel": "Bedrijfsnaam",
      "tool.step2.namePlaceholder": "Bedrijfsnaam",
      "tool.step2.industryLabel": "Branche",
      "tool.step2.industryPlaceholder": "Branche, bv. loodgieter",
      "tool.step2.cityLabel": "Plaats",
      "tool.step2.cityPlaceholder": "Plaats",
      "tool.step2.submit": "Vraag het aan Claude",
      "tool.step2.submitting": "Claude denkt na…",
      "tool.step2.used": "Al gebruikt deze sessie",

      "tool.cta.text": "<strong>Niet zichtbaar?</strong> Dat is precies wat we oplossen.",
      "tool.cta.button": "Neem contact op",

      "services.eyebrow": "Diensten",
    "services.title": "Wat we doen",
    "services.lead":
      "De gratis check hierboven laat een momentopname zien. Ons werk is structureel: we zorgen dat je zichtbaar blijft, niet één keer maar continu.",
    "services.s1.title": "Volledige meting",
    "services.s1.body":
      "Tientallen realistische koopvragen, getest over ChatGPT, Perplexity, Gemini én Claude — inclusief je concurrenten, zodat je weet waar je precies staat.",
    "services.s2.title": "Technisch fundament",
    "services.s2.body":
      "Robots.txt, sitemap, structured data, laadsnelheid: de dingen die AI-crawlers nodig hebben om je site te kunnen lezen — en die nu misschien in de weg zitten.",
    "services.s3.title": "Content die AI overneemt",
    "services.s3.body":
      "Korte, directe antwoorden, FAQ's, duidelijke koppen. Precies de vorm die AI-modellen citeren in plaats van negeren.",
    "services.s4.title": "Maandelijkse herijking",
    "services.s4.body":
      "Citatiepatronen verschuiven in dagen, niet maanden. We meten doorlopend en sturen bij zodra dat nodig is.",

    "packages.title": "Hoe we samenwerken",
    "packages.lead":
      "Elk traject bestaat uit twee delen: een eenmalige opstart waarin we alles doorlopen en op AI-zichtbaarheid richten, en daarna een maandelijks pakket dat het bijhoudt.",
    "packages.setup.step": "Stap 1 · eenmalig",
    "packages.setup.title": "De opstart",
    "packages.setup.line":
      "Voor elke nieuwe klant. We brengen je hele aanwezigheid in kaart en richten hem op AI-zichtbaarheid — zodat het maandelijkse werk daarna op een fundament staat.",
    "packages.setup.b1": "Volledige nulmeting: tientallen koopvragen over vijf categorieën, op meerdere AI-platforms",
    "packages.setup.b2": "Technische check: robots.txt, server-side rendering, schema markup en sitemap",
    "packages.setup.b3": "Concurrentieanalyse: wie wordt er in jouw regio wél genoemd, en waarom",
    "packages.setup.b4": "Bronnenanalyse: welke externe platforms AI citeert in jouw branche",
    "packages.setup.b5": "Je bestaande content — website en waar relevant je social profielen — doorgelicht en op AI-zichtbaarheid gericht",
    "packages.setup.b6": "Contentfundament: de kernpagina's die de grootste gaten dichten",
    "packages.setup.b7": "Strategisch rapport met prioriteiten voor de zes maanden erna",
    "packages.setup.foot": "Doorlooptijd: 2 tot 3 weken.",
    "packages.tiers.step": "Stap 2 · maandelijks",
    "packages.tiers.lead":
      "Zichtbaarheid in AI verschuift continu, dus na de opstart houden we het bij. Je kiest per maand hoeveel we uit handen nemen.",
    "packages.cadence": "per maand",
    "packages.featured": "Meest gekozen",
    "packages.t1.name": "Monitor",
    "packages.t1.line": "Weten waar je staat.",
    "packages.t1.b1": "Maandelijkse meting over de grote AI-platforms",
    "packages.t1.b2": "Rapport met score, ontwikkeling en marktverschuivingen",
    "packages.t1.b3": "Signalering zodra een concurrent terrein wint",
    "packages.t1.foot": "Jij krijgt het inzicht. De uitvoering doe je zelf.",
    "packages.t2.name": "Groei",
    "packages.t2.line": "Zichtbaar worden, zonder dat het jouw tijd kost.",
    "packages.t2.b1": "Alles uit Monitor",
    "packages.t2.b2": "Wij schrijven de content, gericht op de gaten die de meting laat zien",
    "packages.t2.b3": "Autoriteit-opbouw op de externe platforms die AI daadwerkelijk citeert",
    "packages.t2.b4": "Strategiecall per kwartaal",
    "packages.t2.foot": "Wij leveren aan. Jij zet het live.",
    "packages.t3.name": "Dominantie",
    "packages.t3.line": "Wij doen het. Jij ziet de aanvragen binnenkomen.",
    "packages.t3.b1": "Alles uit Groei",
    "packages.t3.b2": "Volledige uitvoering: wij plaatsen de content en regelen de technische aanpassingen",
    "packages.t3.b3": "Uitgebreidere meting over meer AI-platforms en meerdere regio's of diensten",
    "packages.t3.b4": "Actieve concurrent-monitoring en maandelijkse strategiecall",
    "packages.t3.foot": "Jij hoeft niets te doen.",
    "packages.note":
      "Welk pakket past, hangt af van je branche, je regio en hoeveel je zelf wilt oppakken. Dat bespreken we — inclusief de kosten — in een vrijblijvend kennismakingsgesprek. <a href=\"#contact\">Neem contact op</a>.",

    "audit.grade.strong": "Sterk — AI-crawlers kunnen je site goed lezen",
      "audit.grade.good": "Redelijk — een paar dingen staan in de weg",
      "audit.grade.limited": "Beperkt — belangrijke blokkades gevonden",
      "audit.grade.weak": "Zwak — AI-crawlers kunnen je site nauwelijks lezen",

      "audit.check.crawlers_ok": "AI-crawlers mogen je site bezoeken",
      "audit.check.crawlers_blocked": "{count} AI-crawler(s) geblokkeerd in robots.txt ({list})",
      "audit.check.rendering_ok": "Je site is leesbaar zonder JavaScript uit te voeren",
      "audit.check.rendering_csr": "Je site lijkt zwaar op JavaScript te leunen — AI-crawlers lezen dat niet",
      "audit.check.sitemap_ok": "Sitemap.xml gevonden",
      "audit.check.sitemap_missing": "Geen sitemap.xml gevonden",
      "audit.check.schema_ok": "Schema markup (gestructureerde data) gevonden",
      "audit.check.schema_missing": "Geen schema markup gevonden",

      "spot.mentioned": "Genoemd — Claude noemt {name} in het antwoord.",
      "spot.notMentioned": "Niet genoemd — Claude noemt {name} niet in het antwoord.",
      "spot.failed": "Kon de check niet uitvoeren.",
      "spot.noAnswer": "Geen antwoord ontvangen.",

      "error.method_not_allowed": "Methode niet toegestaan.",
      "error.bad_request": "Ongeldige aanvraag.",
      "error.forbidden": "Deze check werkt alleen vanaf onze eigen site.",
      "error.request_too_large": "Aanvraag te groot.",
      "error.url_required": "Geef een website URL op.",
      "error.url_invalid": "Dat is geen geldige URL.",
      "error.url_protocol": "Alleen http:// en https:// worden ondersteund.",
      "error.url_blocked_host": "Deze host kan niet gecheckt worden.",
      "error.url_dns": "Kon dit domein niet vinden. Klopt de URL?",
      "error.url_private": "Deze URL wijst naar een adres dat niet gecheckt kan worden.",
      "error.url_redirects": "Deze URL stuurt te vaak door. Klopt het adres?",
      "error.url_timeout": "De site reageerde niet op tijd. Probeer het later opnieuw.",
      "error.audit_rate_limited": "Je hebt net veel checks gedaan. Wacht even en probeer het opnieuw.",
      "error.not_configured": "Server is niet geconfigureerd (ontbrekende API key).",
      "error.rate_limited": "Je hebt de gratis check al gebruikt. Neem contact op voor een volledige meting.",
      "error.fields_required": "Vul bedrijfsnaam, branche en plaats in.",
      "error.upstream_unreachable": "Kon Claude niet bereiken. Probeer het later opnieuw.",
      "error.server_error": "Er ging iets mis. Probeer het later opnieuw.",
      "error.network": "Er ging iets mis. Probeer het opnieuw.",

      "contact.eyebrow": "Contact",
      "contact.title": "Praat met ons",
      "contact.lead":
        "Vertel kort over je bedrijf en wat je opviel bij de check hierboven — we reageren binnen één werkdag.",
      "contact.emailLabel": "E-mail",
      "contact.phoneLabel": "Telefoon",
      "contact.baseLabel": "Basis",
      "contact.baseValue": "Groningen — actief in heel Nederland",
      "contact.name": "Naam",
      "contact.email": "E-mail",
      "contact.company": "Bedrijf",
      "contact.message": "Bericht",
      "contact.submit": "Verstuur bericht",
      "contact.sending": "Versturen…",
      "contact.ok": "Bedankt — we reageren binnen één werkdag.",
      "contact.fail": "Versturen mislukt. Mail ons gerust direct op hallo@firstfound.nl.",

      "footer.base": "First Found — Groningen, Nederland",
    },

    en: {
      "meta.title": "First Found — Get found by AI",
      "meta.description":
        "First Found measures and improves whether your business gets mentioned in ChatGPT, Perplexity, Gemini and Claude. Start with a free check.",

      "nav.skip": "Skip to main content",
      "nav.label": "Main menu",
      "nav.how": "How it works",
      "nav.check": "Check your site",
      "nav.services": "Services",
      "nav.contact": "Contact",
      "nav.language": "Language",
      "nav.theme": "Switch between light and dark",
      "nav.menu": "Menu",

      "hero.eyebrow": "Generative Engine Optimization",
      "hero.title": "Does AI mention your business when someone asks?",
      "hero.sub":
        "More and more people skip Google entirely and ask ChatGPT, Perplexity or Claude directly. If your business isn't in that answer, you don't exist for that customer. First Found measures it — and makes sure you get named.",
      "hero.cta": "Check your site for free",
      "hero.secondary": "How does that work?",
      "hero.badge1": "Free technical check",
      "hero.badge2": "No account needed",
      "hero.badge3": "Results in seconds",
      "hero.mock.label": "AI answer",
      "hero.mock.question": "“Best solar panel installer in Groningen?”",
      "hero.mock.answerA": "For solar panels in Groningen, people often mention",
      "hero.mock.answerB": "and",
      "hero.mock.answerC": "both with regional experience and strong reviews.",
      "hero.mock.missing": "your business?",

      "how.eyebrow": "Approach",
      "how.title": "How it works",
      "how.lead":
        "It's called <strong>GEO</strong> (Generative Engine Optimization) — the same idea as SEO, but for AI answers instead of search results. It comes down to three things.",
      "how.s1.title": "We ask AI the same questions your customers do",
      "how.s1.body":
        "Not “name [company]”, but real buying questions like “best [service] in [city]” or “roughly what does [service] cost”. That shows what a customer actually sees.",
      "how.s2.title": "We measure whether, how often and how you're mentioned",
      "how.s2.body":
        "Across the four big platforms — ChatGPT, Perplexity, Gemini and Claude — so you get one clear number instead of a gut feeling.",
      "how.s3.title": "We adjust your site and content",
      "how.s3.body":
        "A solid technical foundation, content in the shape AI understands and reuses, and re-measured every month — because what AI recommends keeps shifting.",

      "tool.eyebrow": "Free check",
      "tool.title": "Check your site",
      "tool.lead":
        "Two steps. First a free technical check — instant, no cost. Then you can run one live check to see whether Claude actually names your business.",

      "tool.step1.label": "Step 1 — free, instant",
      "tool.step1.title": "Can AI read your site at all?",
      "tool.step1.inputLabel": "Website URL",
      "tool.step1.placeholder": "yourcompany.com",
      "tool.step1.submit": "Check my site",
      "tool.step1.submitting": "Checking…",
      "tool.step1.scoreSub": "technical foundation, out of 100",

      "tool.step2.label": "Step 2 — one free check",
      "tool.step2.title": "Does Claude actually name your business?",
      "tool.step2.hint":
        "We ask Claude the way a customer would — with live web search enabled. This works once per visit, free.",
      "tool.step2.nameLabel": "Company name",
      "tool.step2.namePlaceholder": "Company name",
      "tool.step2.industryLabel": "Industry",
      "tool.step2.industryPlaceholder": "Industry, e.g. plumber",
      "tool.step2.cityLabel": "City",
      "tool.step2.cityPlaceholder": "City",
      "tool.step2.submit": "Ask Claude",
      "tool.step2.submitting": "Claude is thinking…",
      "tool.step2.used": "Already used this session",

      "tool.cta.text": "<strong>Not visible?</strong> That's exactly what we fix.",
      "tool.cta.button": "Get in touch",

      "services.eyebrow": "Services",
    "services.title": "What we do",
    "services.lead":
      "The free check above is a snapshot. Our work is structural: we make sure you stay visible — not once, but continuously.",
    "services.s1.title": "Full measurement",
    "services.s1.body":
      "Dozens of realistic buying questions, tested across ChatGPT, Perplexity, Gemini and Claude — competitors included, so you know exactly where you stand.",
    "services.s2.title": "Technical foundation",
    "services.s2.body":
      "Robots.txt, sitemap, structured data, load speed: the things AI crawlers need in order to read your site — and that may be in the way right now.",
    "services.s3.title": "Content AI picks up",
    "services.s3.body":
      "Short, direct answers, FAQs, clear headings. Exactly the shape AI models quote instead of skip.",
    "services.s4.title": "Monthly recalibration",
    "services.s4.body":
      "Citation patterns shift in days, not months. We keep measuring and adjust as soon as it's needed.",

    "packages.title": "How we work together",
    "packages.lead":
      "Every engagement has two parts: a one-off setup where we go through everything and point it at AI visibility, and a monthly package that keeps it there afterwards.",
    "packages.setup.step": "Step 1 · one-off",
    "packages.setup.title": "The setup",
    "packages.setup.line":
      "For every new client. We map your whole presence and aim it at AI visibility — so the monthly work afterwards stands on a foundation.",
    "packages.setup.b1": "Full baseline: dozens of buying questions across five categories, on multiple AI platforms",
    "packages.setup.b2": "Technical check: robots.txt, server-side rendering, schema markup and sitemap",
    "packages.setup.b3": "Competitor analysis: who does get named in your region, and why",
    "packages.setup.b4": "Source analysis: which external platforms AI cites in your industry",
    "packages.setup.b5": "Your existing content — website and, where relevant, your social profiles — reviewed and aimed at AI visibility",
    "packages.setup.b6": "Content foundation: the core pages that close the biggest gaps",
    "packages.setup.b7": "Strategic report with priorities for the six months that follow",
    "packages.setup.foot": "Turnaround: 2 to 3 weeks.",
    "packages.tiers.step": "Step 2 · monthly",
    "packages.tiers.lead":
      "Visibility in AI shifts constantly, so after the setup we keep it up. You choose month to month how much we take off your hands.",
    "packages.cadence": "per month",
    "packages.featured": "Most chosen",
    "packages.t1.name": "Monitor",
    "packages.t1.line": "Know where you stand.",
    "packages.t1.b1": "Monthly measurement across the major AI platforms",
    "packages.t1.b2": "Report with score, movement and market shifts",
    "packages.t1.b3": "An alert as soon as a competitor gains ground",
    "packages.t1.foot": "You get the insight. You handle the execution.",
    "packages.t2.name": "Growth",
    "packages.t2.line": "Get visible, without it costing you time.",
    "packages.t2.b1": "Everything in Monitor",
    "packages.t2.b2": "We write the content, aimed at the gaps the measurement reveals",
    "packages.t2.b3": "Authority building on the external platforms AI actually cites",
    "packages.t2.b4": "Quarterly strategy call",
    "packages.t2.foot": "We deliver. You publish.",
    "packages.t3.name": "Dominance",
    "packages.t3.line": "We do it. You watch the enquiries come in.",
    "packages.t3.b1": "Everything in Growth",
    "packages.t3.b2": "Full execution: we publish the content and handle the technical changes",
    "packages.t3.b3": "Broader measurement across more AI platforms, and multiple regions or services",
    "packages.t3.b4": "Active competitor monitoring and a monthly strategy call",
    "packages.t3.foot": "Nothing for you to do.",
    "packages.note":
      "Which package fits depends on your industry, your region and how much you want to handle yourself. We'll go through that — costs included — in a no-obligation intro call. <a href=\"#contact\">Get in touch</a>.",

    "audit.grade.strong": "Strong — AI crawlers can read your site well",
      "audit.grade.good": "Decent — a few things are getting in the way",
      "audit.grade.limited": "Limited — significant blockers found",
      "audit.grade.weak": "Weak — AI crawlers can barely read your site",

      "audit.check.crawlers_ok": "AI crawlers are allowed to visit your site",
      "audit.check.crawlers_blocked": "{count} AI crawler(s) blocked in robots.txt ({list})",
      "audit.check.rendering_ok": "Your site is readable without running JavaScript",
      "audit.check.rendering_csr": "Your site leans heavily on JavaScript — AI crawlers don't read that",
      "audit.check.sitemap_ok": "Sitemap.xml found",
      "audit.check.sitemap_missing": "No sitemap.xml found",
      "audit.check.schema_ok": "Schema markup (structured data) found",
      "audit.check.schema_missing": "No schema markup found",

      "spot.mentioned": "Mentioned — Claude names {name} in its answer.",
      "spot.notMentioned": "Not mentioned — Claude does not name {name} in its answer.",
      "spot.failed": "Couldn't run the check.",
      "spot.noAnswer": "No answer received.",

      "error.method_not_allowed": "Method not allowed.",
      "error.bad_request": "Invalid request.",
      "error.forbidden": "This check only works from our own site.",
      "error.request_too_large": "Request too large.",
      "error.url_required": "Please enter a website URL.",
      "error.url_invalid": "That isn't a valid URL.",
      "error.url_protocol": "Only http:// and https:// are supported.",
      "error.url_blocked_host": "This host can't be checked.",
      "error.url_dns": "Couldn't find that domain. Is the URL correct?",
      "error.url_private": "This URL points at an address that can't be checked.",
      "error.url_redirects": "This URL redirects too many times. Is the address correct?",
      "error.url_timeout": "The site didn't respond in time. Please try again later.",
      "error.audit_rate_limited": "You've run a lot of checks just now. Give it a moment and try again.",
      "error.not_configured": "Server isn't configured (missing API key).",
      "error.rate_limited": "You've already used the free check. Get in touch for a full measurement.",
      "error.fields_required": "Please fill in company name, industry and city.",
      "error.upstream_unreachable": "Couldn't reach Claude. Please try again later.",
      "error.server_error": "Something went wrong. Please try again later.",
      "error.network": "Something went wrong. Please try again.",

      "contact.eyebrow": "Contact",
      "contact.title": "Talk to us",
      "contact.lead":
        "Tell us briefly about your business and what stood out in the check above — we reply within one working day.",
      "contact.emailLabel": "Email",
      "contact.phoneLabel": "Phone",
      "contact.baseLabel": "Based in",
      "contact.baseValue": "Groningen — working across the Netherlands",
      "contact.name": "Name",
      "contact.email": "Email",
      "contact.company": "Company",
      "contact.message": "Message",
      "contact.submit": "Send message",
      "contact.sending": "Sending…",
      "contact.ok": "Thanks — we'll reply within one working day.",
      "contact.fail": "Sending failed. Feel free to email us directly at hallo@firstfound.nl.",

      "footer.base": "First Found — Groningen, the Netherlands",
    },
  };

  const LANG_KEY = "ff_lang";
  const SUPPORTED = ["nl", "en"];
  const FALLBACK = "nl";

  function store(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* private mode — the choice just won't survive a reload */
    }
  }

  function readStored(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function detectLang() {
    const saved = readStored(LANG_KEY);
    if (SUPPORTED.includes(saved)) return saved;
    const browser = (navigator.language || FALLBACK).toLowerCase();
    return browser.startsWith("nl") ? "nl" : "en";
  }

  let currentLang = detectLang();

  /** Look up a string, interpolating {placeholders}. Falls back to Dutch, then the key. */
  function t(key, params) {
    const dict = I18N[currentLang] || I18N[FALLBACK];
    let str = dict[key];
    if (str === undefined) str = I18N[FALLBACK][key];
    if (str === undefined) return key;
    if (!params) return str;
    return str.replace(/\{(\w+)\}/g, (match, name) =>
      Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match
    );
  }

  function applyTranslations(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    root.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder));
    });
    root.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel));
    });
    root.querySelectorAll("[data-i18n-content]").forEach((el) => {
      el.setAttribute("content", t(el.dataset.i18nContent));
    });
  }

  const langListeners = [];

  /** Register a callback that re-renders dynamic (JS-generated) content on language change. */
  function onLangChange(fn) {
    langListeners.push(fn);
  }

  function setLang(lang, { persist = true } = {}) {
    if (!SUPPORTED.includes(lang)) return;
    currentLang = lang;
    if (persist) store(LANG_KEY, lang);

    document.documentElement.setAttribute("lang", lang);
    applyTranslations();

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });

    langListeners.forEach((fn) => fn(lang));
  }

  function getLang() {
    return currentLang;
  }

  // Apply immediately — this script is loaded at the end of <body>, so the
  // DOM is parsed and the swap happens before the browser's first paint.
  setLang(currentLang, { persist: false });

  window.FFI18n = { t, setLang, getLang, onLangChange };

})();
