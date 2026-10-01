// ============================================================
// First Found :: i18n
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
      "meta.title": "FirstFound | AI-zichtbaarheid en GEO vanuit Noord-Nederland",
      "meta.description":
        "FirstFound meet en verbetert hoe zichtbaar uw bedrijf is in antwoorden van ChatGPT, Gemini, Perplexity en Claude. Begin met een gratis zichtbaarheidsscan.",
      "meta.ogAlt": "FirstFound, specialist in AI-zichtbaarheid",

      "nav.skip": "Naar hoofdinhoud",
      "nav.label": "Hoofdmenu",
      "nav.geo": "GEO",
      "nav.method": "Werkwijze",
      "nav.services": "Diensten",
      "nav.about": "Over ons",
      "nav.contact": "Contact",
      "nav.cta": "Zichtbaarheidsscan",
      "nav.language": "Taal",
      "nav.theme": "Wissel tussen licht en donker",
      "nav.menu": "Menu",

      "hero.eyebrow": "Generative Engine Optimization",
      "hero.titleA": "Uw klant vraagt het aan AI.",
      "hero.titleB": "Wij zorgen dat u genoemd wordt.",
      "hero.sub":
        "Steeds meer mensen vragen ChatGPT, Gemini of Perplexity om een aanbeveling. FirstFound meet hoe zichtbaar uw bedrijf daar is en verbetert die positie stap voor stap.",
      "hero.cta": "Ontdek uw AI-zichtbaarheid",
      "hero.secondary": "Hoe werkt GEO?",
      "hero.badge1": "Gratis eerste scan",
      "hero.badge2": "Resultaat binnen enkele minuten",
      "hero.badge3": "Vrijblijvend",

      "hero.demo.label": "Illustratie",
      "hero.demo.caption": "Conceptueel voorbeeld. Dit is geen echte uitvoer van een AI-systeem.",
      "hero.demo.question": "Welke bedrijven helpen met AI-vindbaarheid in Noord-Nederland?",
      "hero.demo.answerA": "Voor AI-vindbaarheid, ook wel GEO genoemd, in Noord-Nederland komt",
      "hero.demo.brand": "FirstFound",
      "hero.demo.answerB":
        "naar voren als specialist. Het bureau meet hoe vaak een bedrijf in AI-antwoorden wordt genoemd en werkt daarna aan die zichtbaarheid.",
      "hero.demo.sources": "Bronnen",
      "hero.demo.source1": "firstfound.nl",
      "hero.demo.source2": "branchegids",
      "hero.demo.source3": "vakpublicatie",

      "shift.eyebrow": "De verschuiving",
      "shift.title": "Zoeken verandert. Kiezen ook.",
      "shift.lead":
        "Een zoekopdracht leverde vroeger tien links op, waarna uw klant zelf ging vergelijken. Nu stelt hij een vraag en krijgt hij een antwoord met twee of drie namen erin.",
      "shift.thenLabel": "Zoekmachine",
      "shift.then1": "Klant typt een zoekopdracht",
      "shift.then2": "Lijst met tien websites",
      "shift.then3": "Klant vergelijkt zelf en kiest",
      "shift.nowLabel": "AI-assistent",
      "shift.now1": "Klant stelt een vraag",
      "shift.now2": "Eén antwoord met enkele namen",
      "shift.now3": "Klant kiest uit die namen",
      "shift.close":
        "Staat u niet in dat antwoord, dan doet u niet mee in de eerste afweging. Niet omdat u minder goed bent, maar omdat u niet genoemd wordt.",

      "geo.eyebrow": "GEO",
      "geo.title": "Wat is Generative Engine Optimization?",
      "geo.lead":
        "SEO helpt u gevonden te worden in zoekmachines. GEO helpt u genoemd te worden in AI-antwoorden.",
      "geo.body":
        "Een AI-systeem stelt zijn antwoord samen uit veel signalen tegelijk: wat er op uw eigen website staat, hoe duidelijk die informatie is opgebouwd, en wat andere bronnen over u zeggen. GEO is het werk dat die signalen op orde brengt.",
      "geo.p1.title": "Uw eigen content",
      "geo.p1.body": "Informatie die een AI-systeem kan lezen, begrijpen en overnemen.",
      "geo.p2.title": "Externe bronnen",
      "geo.p2.body": "De plekken buiten uw site waar AI zijn beeld van uw markt vandaan haalt.",
      "geo.p3.title": "Context",
      "geo.p3.body": "Wie u bent, wat u doet, voor wie, en in welke regio.",

      "versus.title": "GEO vervangt SEO niet",
      "versus.seoLabel": "SEO",
      "versus.seoGoal": "Doel: hoger in de zoekresultaten.",
      "versus.seoResult": "Resultaat: meer bezoekers op uw website.",
      "versus.geoLabel": "GEO",
      "versus.geoGoal": "Doel: genoemd worden in het antwoord.",
      "versus.geoResult": "Resultaat: u komt in de overweging voor.",
      "versus.close":
        "De twee versterken elkaar. Een site die technisch goed in elkaar zit, presteert in allebei beter.",

      "tool.eyebrow": "AI-zichtbaarheidsscan",
      "tool.title": "Hoe zichtbaar bent u nu?",
      "tool.lead":
        "Begin met een momentopname. De eerste stap controleert of AI-systemen uw website kunnen lezen. De tweede laat zien of een AI-assistent uw bedrijf daadwerkelijk noemt.",

      "tool.step1.label": "Stap 1 · direct en gratis",
      "tool.step1.title": "Kan een AI-systeem uw site lezen?",
      "tool.step1.inputLabel": "Website URL",
      "tool.step1.placeholder": "uwbedrijf.nl",
      "tool.step1.submit": "Controleer mijn site",
      "tool.step1.submitting": "Bezig met controleren",
      "tool.step1.scoreSub": "technisch fundament, op 100",

      "tool.step2.label": "Stap 2 · één gratis check",
      "tool.step2.title": "Wordt uw bedrijf genoemd?",
      "tool.step2.hint":
        "We stellen de vraag zoals een klant dat zou doen, met live websearch erbij. Dit werkt één keer gratis per bezoek.",
      "tool.step2.nameLabel": "Bedrijfsnaam",
      "tool.step2.namePlaceholder": "Bedrijfsnaam",
      "tool.step2.industryLabel": "Branche",
      "tool.step2.industryPlaceholder": "Branche, bijvoorbeeld installateur",
      "tool.step2.cityLabel": "Plaats",
      "tool.step2.cityPlaceholder": "Plaats",
      "tool.step2.submit": "Stel de vraag",
      "tool.step2.submitting": "Bezig met opvragen",
      "tool.step2.used": "Al gebruikt deze sessie",

      "tool.cta.text": "<strong>Nog niet zichtbaar?</strong> Daar begint ons werk.",
      "tool.cta.button": "Plan een gesprek",
      "tool.note":
        "Deze scan is een momentopname op één platform. De volledige zichtbaarheidsscan meet tientallen koopvragen over meerdere AI-platforms, inclusief uw concurrenten.",

      "method.eyebrow": "Werkwijze",
      "method.title": "Hoe wij werken",
      "method.lead":
        "Vier stappen, in deze volgorde. We beginnen nooit met schrijven voordat we weten wat er gemeten is.",
      "method.s1.title": "Analyse",
      "method.s1.body": "We meten hoe AI-systemen uw markt beschrijven, en wie er nu genoemd wordt.",
      "method.s2.title": "Strategie",
      "method.s2.body": "We bepalen welke onderwerpen, bronnen en pagina's het meeste effect hebben.",
      "method.s3.title": "Optimalisatie",
      "method.s3.body": "We verbeteren uw content, de structuur van uw informatie en uw aanwezigheid op bronnen die AI gebruikt.",
      "method.s4.title": "Monitoring",
      "method.s4.body": "We meten elke maand opnieuw, want wat AI aanbeveelt verschuift continu.",

      "services.eyebrow": "Diensten",
      "services.title": "Wat wij doen",
      "services.lead":
        "Vier onderdelen die op elkaar aansluiten. U kunt ermee beginnen bij de meting en later uitbreiden.",
      "services.s1.title": "AI-zichtbaarheid",
      "services.s1.lead": "Meten hoe vaak en hoe u nu in AI-antwoorden voorkomt.",
      "services.s1.body": "Over meerdere platforms, met uw concurrenten ernaast, zodat u weet waar u staat.",
      "services.s2.title": "GEO-strategie",
      "services.s2.lead": "Bepalen waar de winst zit, en in welke volgorde.",
      "services.s2.body": "Een plan op basis van de meting, niet op basis van aannames.",
      "services.s3.title": "Content en autoriteit",
      "services.s3.lead": "De informatie verbeteren waar AI-systemen op afgaan.",
      "services.s3.body": "Op uw eigen site en op de externe bronnen die in uw branche geciteerd worden.",
      "services.s4.title": "Monitoring",
      "services.s4.lead": "Volgen hoe uw zichtbaarheid zich ontwikkelt.",
      "services.s4.body": "Maandelijks, inclusief wat er bij concurrenten verandert.",

      "packages.title": "Hoe we samenwerken",
      "packages.lead":
        "Elk traject bestaat uit twee delen: een eenmalige opstart waarin we alles doorlopen en op AI-zichtbaarheid richten, en daarna een maandelijks pakket dat het bijhoudt.",
      "packages.setup.step": "Stap 1 · eenmalig",
      "packages.setup.title": "De opstart",
      "packages.setup.line":
        "Voor elke nieuwe opdrachtgever. We brengen uw hele aanwezigheid in kaart en richten die op AI-zichtbaarheid, zodat het maandelijkse werk daarna op een fundament staat.",
      "packages.setup.b1": "Volledige nulmeting: tientallen koopvragen over vijf categorieën, op meerdere AI-platforms",
      "packages.setup.b2": "Technische controle: robots.txt, server-side rendering, schema markup en sitemap",
      "packages.setup.b3": "Concurrentieanalyse: wie er in uw regio wel genoemd wordt, en waarom",
      "packages.setup.b4": "Bronnenanalyse: welke externe platforms AI in uw branche citeert",
      "packages.setup.b5": "Uw bestaande content (website en waar relevant uw social profielen) doorgelicht en op AI-zichtbaarheid gericht",
      "packages.setup.b6": "Contentfundament: de kernpagina's die de grootste gaten dichten",
      "packages.setup.b7": "Strategisch rapport met prioriteiten voor de zes maanden erna",
      "packages.setup.foot": "Doorlooptijd: 2 tot 3 weken.",
      "packages.tiers.step": "Stap 2 · maandelijks",
      "packages.tiers.lead":
        "Zichtbaarheid in AI verschuift continu, dus na de opstart houden we het bij. U kiest per maand hoeveel wij uit handen nemen.",
      "packages.cadence": "per maand",
      "packages.featured": "Meest gekozen",
      "packages.t1.name": "Monitor",
      "packages.t1.line": "Weten waar u staat.",
      "packages.t1.b1": "Maandelijkse meting over de grote AI-platforms",
      "packages.t1.b2": "Rapport met score, ontwikkeling en marktverschuivingen",
      "packages.t1.b3": "Signalering zodra een concurrent terrein wint",
      "packages.t1.foot": "U krijgt het inzicht. De uitvoering doet u zelf.",
      "packages.t2.name": "Groei",
      "packages.t2.line": "Zichtbaar worden, zonder dat het uw tijd kost.",
      "packages.t2.b1": "Alles uit Monitor",
      "packages.t2.b2": "Wij schrijven de content, gericht op de gaten die de meting laat zien",
      "packages.t2.b3": "Autoriteit opbouwen op de externe bronnen die AI daadwerkelijk citeert",
      "packages.t2.b4": "Strategiegesprek per kwartaal",
      "packages.t2.foot": "Wij leveren aan. U zet het live.",
      "packages.t3.name": "Volledig",
      "packages.t3.line": "Wij voeren uit. U ziet de aanvragen binnenkomen.",
      "packages.t3.b1": "Alles uit Groei",
      "packages.t3.b2": "Volledige uitvoering: wij plaatsen de content en regelen de technische aanpassingen",
      "packages.t3.b3": "Uitgebreidere meting over meer platforms en meerdere regio's of diensten",
      "packages.t3.b4": "Actieve concurrentiemonitoring en maandelijks strategiegesprek",
      "packages.t3.foot": "U hoeft niets te doen.",
      "packages.note":
        "Welk pakket past, hangt af van uw branche, uw regio en hoeveel u zelf wilt oppakken. Dat bespreken we, inclusief de kosten, in een vrijblijvend kennismakingsgesprek. <a href=\"#contact\">Neem contact op</a>.",

      "about.eyebrow": "Over FirstFound",
      "about.title": "Waarom FirstFound",
      "about.lead":
        "Wij zijn geen algemeen marketingbureau dat er AI bij doet. Dit is waar wij ons op richten, en waar u ons op mag afrekenen.",
      "about.p1.title": "Gespecialiseerd in AI-zichtbaarheid",
      "about.p1.body": "Eén vakgebied, geen bijzaak naast tien andere diensten.",
      "about.p2.title": "Meetbaar, geen aannames",
      "about.p2.body": "Elk advies komt voort uit een meting die we met u doornemen.",
      "about.p3.title": "Technisch onderlegd",
      "about.p3.body": "We weten hoe crawlers, structured data en bronvermelding in de praktijk werken.",
      "about.p4.title": "Transparant",
      "about.p4.body": "U ziet wat we meten en wat het oplevert. Ook wanneer een resultaat tegenvalt.",
      "about.localTitle": "AI-marketing vanuit Noord-Nederland",
      "about.localBody":
        "We werken vanuit Groningen, met opdrachtgevers in Groningen, Friesland en Drenthe en daarbuiten. De regio kennen we. Het werk zelf is niet aan een plaats gebonden.",

      "cta.title": "Weet u wat AI over uw bedrijf zegt?",
      "cta.lead":
        "Ontdek hoe zichtbaar uw organisatie nu is binnen de belangrijkste AI-platforms, en wat er nodig is om dat te verbeteren.",
      "cta.button": "Laat mijn zichtbaarheid analyseren",
      "cta.secondary": "Of probeer eerst de gratis scan",

      "contact.eyebrow": "Contact",
      "contact.title": "Neem contact op",
      "contact.lead":
        "Vertel kort wat u doet en wat u opviel bij de scan. We reageren binnen één werkdag.",
      "contact.emailLabel": "E-mail",
      "contact.phoneLabel": "Telefoon",
      "contact.baseLabel": "Vestiging",
      "contact.baseValue": "Groningen, actief in heel Nederland",
      "contact.name": "Naam",
      "contact.email": "E-mail",
      "contact.company": "Bedrijf",
      "contact.message": "Bericht",
      "contact.submit": "Verstuur bericht",
      "contact.sending": "Bezig met versturen",
      "contact.ok": "Bedankt. We reageren binnen één werkdag.",
      "contact.fail": "Versturen mislukt. Mail ons gerust direct op info@firstfound.nl.",

      "footer.tagline": "AI-zichtbaarheid en GEO vanuit Noord-Nederland.",
      "footer.navTitle": "Navigatie",
      "footer.contactTitle": "Contact",
      "footer.base": "Groningen, Nederland",
      "footer.rights": "Alle rechten voorbehouden.",

      "audit.grade.strong": "Sterk: AI-crawlers kunnen uw site goed lezen",
      "audit.grade.good": "Redelijk: een paar dingen staan in de weg",
      "audit.grade.limited": "Beperkt: belangrijke blokkades gevonden",
      "audit.grade.weak": "Zwak: AI-crawlers kunnen uw site nauwelijks lezen",

      "audit.check.crawlers_ok": "AI-crawlers mogen uw site bezoeken",
      "audit.check.crawlers_blocked": "{count} AI-crawler(s) geblokkeerd in robots.txt ({list})",
      "audit.check.rendering_ok": "Uw site is leesbaar zonder JavaScript uit te voeren",
      "audit.check.rendering_csr": "Uw site leunt zwaar op JavaScript, en AI-crawlers lezen dat niet",
      "audit.check.sitemap_ok": "Sitemap.xml gevonden",
      "audit.check.sitemap_missing": "Geen sitemap.xml gevonden",
      "audit.check.schema_ok": "Schema markup (gestructureerde data) gevonden",
      "audit.check.schema_missing": "Geen schema markup gevonden",

      "spot.mentioned": "Genoemd. {name} komt voor in het antwoord.",
      "spot.notMentioned": "Niet genoemd. {name} komt niet voor in het antwoord.",
      "spot.failed": "De check kon niet worden uitgevoerd.",
      "spot.noAnswer": "Geen antwoord ontvangen.",

      "error.method_not_allowed": "Methode niet toegestaan.",
      "error.bad_request": "Ongeldige aanvraag.",
      "error.forbidden": "Deze aanvraag is niet toegestaan.",
      "error.url_required": "Vul een website-URL in.",
      "error.url_invalid": "Dat is geen geldige URL.",
      "error.url_protocol": "Alleen http:// en https:// worden ondersteund.",
      "error.url_blocked_host": "Deze host kan niet gecontroleerd worden.",
      "error.url_dns": "Dit domein is niet gevonden. Klopt de URL?",
      "error.url_private": "Deze URL wijst naar een adres dat niet gecontroleerd kan worden.",
      "error.url_redirects": "Deze URL stuurt te vaak door. Klopt het adres?",
      "error.url_timeout": "De site reageerde niet op tijd. Probeer het later opnieuw.",
      "error.request_too_large": "De aanvraag is te groot.",
      "error.not_configured": "De server is niet geconfigureerd (ontbrekende API key).",
      "error.rate_limited": "U heeft de gratis check al gebruikt. Neem contact op voor een volledige meting.",
      "error.audit_rate_limited": "U heeft net veel checks gedaan. Wacht even en probeer het opnieuw.",
      "error.fields_required": "Vul bedrijfsnaam, branche en plaats in.",
      "error.upstream_unreachable": "Het AI-systeem was niet bereikbaar. Probeer het later opnieuw.",
      "error.server_error": "Er ging iets mis. Probeer het later opnieuw.",
      "error.network": "Er ging iets mis. Probeer het opnieuw.",
    },

    en: {
      "meta.title": "FirstFound | AI visibility and GEO from the north of the Netherlands",
      "meta.description":
        "FirstFound measures and improves how visible your business is in answers from ChatGPT, Gemini, Perplexity and Claude. Start with a free visibility scan.",
      "meta.ogAlt": "FirstFound, specialists in AI visibility",

      "nav.skip": "Skip to main content",
      "nav.label": "Main menu",
      "nav.geo": "GEO",
      "nav.method": "Approach",
      "nav.services": "Services",
      "nav.about": "About",
      "nav.contact": "Contact",
      "nav.cta": "Visibility scan",
      "nav.language": "Language",
      "nav.theme": "Switch between light and dark",
      "nav.menu": "Menu",

      "hero.eyebrow": "Generative Engine Optimization",
      "hero.titleA": "Your customer asks AI.",
      "hero.titleB": "We make sure you get named.",
      "hero.sub":
        "More and more people ask ChatGPT, Gemini or Perplexity for a recommendation. FirstFound measures how visible your business is there, and improves that position step by step.",
      "hero.cta": "Discover your AI visibility",
      "hero.secondary": "How does GEO work?",
      "hero.badge1": "Free first scan",
      "hero.badge2": "Results in minutes",
      "hero.badge3": "No obligation",

      "hero.demo.label": "Illustration",
      "hero.demo.caption": "Conceptual example. This is not real output from an AI system.",
      "hero.demo.question": "Which companies help with AI visibility in the north of the Netherlands?",
      "hero.demo.answerA": "For AI visibility, also known as GEO, in the north of the Netherlands,",
      "hero.demo.brand": "FirstFound",
      "hero.demo.answerB":
        "comes up as a specialist. They measure how often a business is named in AI answers, and then work on that visibility.",
      "hero.demo.sources": "Sources",
      "hero.demo.source1": "firstfound.nl",
      "hero.demo.source2": "industry directory",
      "hero.demo.source3": "trade publication",

      "shift.eyebrow": "The shift",
      "shift.title": "Search is changing. So is choosing.",
      "shift.lead":
        "A search used to return ten links, and your customer did the comparing. Now they ask a question and get one answer with two or three names in it.",
      "shift.thenLabel": "Search engine",
      "shift.then1": "Customer types a query",
      "shift.then2": "A list of ten websites",
      "shift.then3": "Customer compares and chooses",
      "shift.nowLabel": "AI assistant",
      "shift.now1": "Customer asks a question",
      "shift.now2": "One answer with a few names",
      "shift.now3": "Customer picks from those names",
      "shift.close":
        "If you are not in that answer, you are not part of the first consideration. Not because you are worse, but because you were not mentioned.",

      "geo.eyebrow": "GEO",
      "geo.title": "What is Generative Engine Optimization?",
      "geo.lead":
        "SEO helps you get found in search engines. GEO helps you get named in AI answers.",
      "geo.body":
        "An AI system builds its answer from many signals at once: what your own website says, how clearly that information is structured, and what other sources say about you. GEO is the work of getting those signals in order.",
      "geo.p1.title": "Your own content",
      "geo.p1.body": "Information an AI system can read, understand and reuse.",
      "geo.p2.title": "External sources",
      "geo.p2.body": "The places beyond your site where AI forms its picture of your market.",
      "geo.p3.title": "Context",
      "geo.p3.body": "Who you are, what you do, for whom, and in which region.",

      "versus.title": "GEO does not replace SEO",
      "versus.seoLabel": "SEO",
      "versus.seoGoal": "Goal: rank higher in search results.",
      "versus.seoResult": "Result: more visitors on your website.",
      "versus.geoLabel": "GEO",
      "versus.geoGoal": "Goal: get named in the answer.",
      "versus.geoResult": "Result: you make the shortlist.",
      "versus.close":
        "The two reinforce each other. A site that is technically sound performs better in both.",

      "tool.eyebrow": "AI visibility scan",
      "tool.title": "How visible are you right now?",
      "tool.lead":
        "Start with a snapshot. The first step checks whether AI systems can read your website. The second shows whether an AI assistant actually names your business.",

      "tool.step1.label": "Step 1 · instant and free",
      "tool.step1.title": "Can an AI system read your site?",
      "tool.step1.inputLabel": "Website URL",
      "tool.step1.placeholder": "yourcompany.com",
      "tool.step1.submit": "Check my site",
      "tool.step1.submitting": "Checking",
      "tool.step1.scoreSub": "technical foundation, out of 100",

      "tool.step2.label": "Step 2 · one free check",
      "tool.step2.title": "Does AI name your business?",
      "tool.step2.hint":
        "We ask the question the way a customer would, with live web search enabled. This works once per visit, free.",
      "tool.step2.nameLabel": "Company name",
      "tool.step2.namePlaceholder": "Company name",
      "tool.step2.industryLabel": "Industry",
      "tool.step2.industryPlaceholder": "Industry, for example installer",
      "tool.step2.cityLabel": "City",
      "tool.step2.cityPlaceholder": "City",
      "tool.step2.submit": "Ask the question",
      "tool.step2.submitting": "Asking",
      "tool.step2.used": "Already used this session",

      "tool.cta.text": "<strong>Not visible yet?</strong> That is where our work starts.",
      "tool.cta.button": "Book a call",
      "tool.note":
        "This scan is a snapshot on one platform. The full visibility scan covers dozens of buying questions across several AI platforms, your competitors included.",

      "method.eyebrow": "Approach",
      "method.title": "How we work",
      "method.lead":
        "Four steps, in this order. We never start writing before we know what the measurement says.",
      "method.s1.title": "Analysis",
      "method.s1.body": "We measure how AI systems describe your market, and who gets named today.",
      "method.s2.title": "Strategy",
      "method.s2.body": "We decide which topics, sources and pages will have the most effect.",
      "method.s3.title": "Optimisation",
      "method.s3.body": "We improve your content, the structure of your information and your presence on the sources AI uses.",
      "method.s4.title": "Monitoring",
      "method.s4.body": "We measure again every month, because what AI recommends keeps shifting.",

      "services.eyebrow": "Services",
      "services.title": "What we do",
      "services.lead":
        "Four parts that build on each other. Start with the measurement and expand later.",
      "services.s1.title": "AI visibility",
      "services.s1.lead": "Measure how often and how you appear in AI answers today.",
      "services.s1.body": "Across several platforms, with your competitors alongside, so you know where you stand.",
      "services.s2.title": "GEO strategy",
      "services.s2.lead": "Work out where the gains are, and in what order.",
      "services.s2.body": "A plan based on the measurement, not on assumptions.",
      "services.s3.title": "Content and authority",
      "services.s3.lead": "Improve the information AI systems rely on.",
      "services.s3.body": "On your own site and on the external sources that get cited in your industry.",
      "services.s4.title": "Monitoring",
      "services.s4.lead": "Track how your visibility develops.",
      "services.s4.body": "Monthly, including what changes at your competitors.",

      "packages.title": "How we work together",
      "packages.lead":
        "Every engagement has two parts: a one-off setup where we go through everything and aim it at AI visibility, then a monthly package that keeps it current.",
      "packages.setup.step": "Step 1 · one-off",
      "packages.setup.title": "The setup",
      "packages.setup.line":
        "For every new client. We map your whole presence and aim it at AI visibility, so the monthly work afterwards stands on a foundation.",
      "packages.setup.b1": "Full baseline measurement: dozens of buying questions across five categories, on several AI platforms",
      "packages.setup.b2": "Technical check: robots.txt, server-side rendering, schema markup and sitemap",
      "packages.setup.b3": "Competitor analysis: who does get named in your region, and why",
      "packages.setup.b4": "Source analysis: which external platforms AI cites in your industry",
      "packages.setup.b5": "Your existing content (website and, where relevant, your social profiles) reviewed and aimed at AI visibility",
      "packages.setup.b6": "Content foundation: the core pages that close the biggest gaps",
      "packages.setup.b7": "Strategic report with priorities for the six months after",
      "packages.setup.foot": "Turnaround: 2 to 3 weeks.",
      "packages.tiers.step": "Step 2 · monthly",
      "packages.tiers.lead":
        "Visibility in AI keeps shifting, so after the setup we keep it current. You choose per month how much we take off your hands.",
      "packages.cadence": "per month",
      "packages.featured": "Most chosen",
      "packages.t1.name": "Monitor",
      "packages.t1.line": "Know where you stand.",
      "packages.t1.b1": "Monthly measurement across the major AI platforms",
      "packages.t1.b2": "Report with score, movement and market shifts",
      "packages.t1.b3": "An alert as soon as a competitor gains ground",
      "packages.t1.foot": "You get the insight. You handle the execution.",
      "packages.t2.name": "Growth",
      "packages.t2.line": "Become visible without spending your own time on it.",
      "packages.t2.b1": "Everything in Monitor",
      "packages.t2.b2": "We write the content, aimed at the gaps the measurement shows",
      "packages.t2.b3": "Building authority on the external sources AI actually cites",
      "packages.t2.b4": "Quarterly strategy call",
      "packages.t2.foot": "We deliver. You publish.",
      "packages.t3.name": "Full service",
      "packages.t3.line": "We execute. You watch the enquiries come in.",
      "packages.t3.b1": "Everything in Growth",
      "packages.t3.b2": "Full execution: we publish the content and handle the technical changes",
      "packages.t3.b3": "Broader measurement across more platforms and several regions or services",
      "packages.t3.b4": "Active competitor monitoring and a monthly strategy call",
      "packages.t3.foot": "Nothing for you to do.",
      "packages.note":
        "Which package fits depends on your industry, your region and how much you want to handle yourself. We go through that, costs included, in a no-obligation intro call. <a href=\"#contact\">Get in touch</a>.",

      "about.eyebrow": "About FirstFound",
      "about.title": "Why FirstFound",
      "about.lead":
        "We are not a general marketing agency that added AI to the list. This is what we focus on, and what you can hold us to.",
      "about.p1.title": "Specialised in AI visibility",
      "about.p1.body": "One field, not a sideline next to ten other services.",
      "about.p2.title": "Measured, not assumed",
      "about.p2.body": "Every recommendation comes out of a measurement we go through with you.",
      "about.p3.title": "Technically informed",
      "about.p3.body": "We know how crawlers, structured data and citation actually work.",
      "about.p4.title": "Transparent",
      "about.p4.body": "You see what we measure and what it produces. Including when a result disappoints.",
      "about.localTitle": "AI marketing from the north of the Netherlands",
      "about.localBody":
        "We work from Groningen, with clients in Groningen, Friesland and Drenthe and beyond. We know the region. The work itself is not tied to a place.",

      "cta.title": "Do you know what AI says about your business?",
      "cta.lead":
        "Find out how visible your organisation is across the major AI platforms today, and what it would take to improve that.",
      "cta.button": "Analyse my visibility",
      "cta.secondary": "Or try the free scan first",

      "contact.eyebrow": "Contact",
      "contact.title": "Get in touch",
      "contact.lead":
        "Tell us briefly what you do and what stood out in the scan. We reply within one working day.",
      "contact.emailLabel": "Email",
      "contact.phoneLabel": "Phone",
      "contact.baseLabel": "Based in",
      "contact.baseValue": "Groningen, working across the Netherlands",
      "contact.name": "Name",
      "contact.email": "Email",
      "contact.company": "Company",
      "contact.message": "Message",
      "contact.submit": "Send message",
      "contact.sending": "Sending",
      "contact.ok": "Thanks. We'll reply within one working day.",
      "contact.fail": "Sending failed. Feel free to email us directly at info@firstfound.nl.",

      "footer.tagline": "AI visibility and GEO from the north of the Netherlands.",
      "footer.navTitle": "Navigation",
      "footer.contactTitle": "Contact",
      "footer.base": "Groningen, the Netherlands",
      "footer.rights": "All rights reserved.",

      "audit.grade.strong": "Strong: AI crawlers can read your site well",
      "audit.grade.good": "Decent: a few things are getting in the way",
      "audit.grade.limited": "Limited: significant blockers found",
      "audit.grade.weak": "Weak: AI crawlers can barely read your site",

      "audit.check.crawlers_ok": "AI crawlers are allowed to visit your site",
      "audit.check.crawlers_blocked": "{count} AI crawler(s) blocked in robots.txt ({list})",
      "audit.check.rendering_ok": "Your site is readable without running JavaScript",
      "audit.check.rendering_csr": "Your site leans heavily on JavaScript, and AI crawlers don't read that",
      "audit.check.sitemap_ok": "Sitemap.xml found",
      "audit.check.sitemap_missing": "No sitemap.xml found",
      "audit.check.schema_ok": "Schema markup (structured data) found",
      "audit.check.schema_missing": "No schema markup found",

      "spot.mentioned": "Mentioned. {name} appears in the answer.",
      "spot.notMentioned": "Not mentioned. {name} does not appear in the answer.",
      "spot.failed": "The check could not be completed.",
      "spot.noAnswer": "No answer received.",

      "error.method_not_allowed": "Method not allowed.",
      "error.bad_request": "Invalid request.",
      "error.forbidden": "This request is not allowed.",
      "error.url_required": "Please enter a website URL.",
      "error.url_invalid": "That isn't a valid URL.",
      "error.url_protocol": "Only http:// and https:// are supported.",
      "error.url_blocked_host": "This host can't be checked.",
      "error.url_dns": "Couldn't find that domain. Is the URL correct?",
      "error.url_private": "This URL points at an address that can't be checked.",
      "error.url_redirects": "This URL redirects too many times. Is the address correct?",
      "error.url_timeout": "The site didn't respond in time. Please try again later.",
      "error.request_too_large": "The request is too large.",
      "error.not_configured": "The server isn't configured (missing API key).",
      "error.rate_limited": "You've already used the free check. Get in touch for a full measurement.",
      "error.audit_rate_limited": "You've run a lot of checks just now. Give it a moment and try again.",
      "error.fields_required": "Please fill in company name, industry and city.",
      "error.upstream_unreachable": "The AI system was unreachable. Please try again later.",
      "error.server_error": "Something went wrong. Please try again later.",
      "error.network": "Something went wrong. Please try again.",
    },
  };

  const LANG_KEY = "ff_lang";
  const SUPPORTED = ["nl", "en"];
  const FALLBACK = "nl";

  function store(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* private mode, so the choice just won't survive a reload */
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

  // Apply immediately. This script is loaded at the end of <body>, so the
  // DOM is parsed and the swap happens before the browser's first paint.
  setLang(currentLang, { persist: false });

  window.FFI18n = { t, setLang, getLang, onLangChange };

})();
