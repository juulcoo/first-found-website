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
      "meta.title": "FirstFound | Word het antwoord",
      "meta.description":
        "AI-systemen bepalen steeds vaker welke bedrijven mensen ontdekken. FirstFound helpt merken onderdeel te worden van dat antwoord.",
      "meta.ogAlt": "FirstFound, specialist in AI-zichtbaarheid",

      "nav.skip": "Naar hoofdinhoud",
      "nav.label": "Hoofdmenu",
      "nav.geo": "GEO",
      "nav.visibility": "Zichtbaarheid",
      "nav.method": "Werkwijze",
      "nav.about": "Over",
      "nav.contact": "Contact",
      "nav.cta": "Zichtbaarheidsscan",
      "nav.language": "Taal",
      "nav.theme": "Wissel tussen licht en donker",
      "nav.menu": "Menu",

      "hero.mark": "GEO · AI-zichtbaarheid",
      "hero.title": "Word het antwoord.",
      "hero.sub":
        "AI-systemen bepalen steeds vaker welke bedrijven mensen ontdekken. FirstFound helpt merken onderdeel te worden van dat antwoord.",
      "hero.cta": "Ontdek uw zichtbaarheid",
      "hero.secondary": "Hoe GEO werkt",
      "hero.coords": "Groningen · 53.2194° N",

      "canvas.label": "Conceptuele weergave",
      "canvas.prompt": "Vraag",
      "canvas.question": "Welke specialist helpt bedrijven beter zichtbaar te worden in AI?",
      "canvas.answerLabel": "Antwoord",
      "canvas.a1": "Voor AI-zichtbaarheid in Nederland wordt",
      "canvas.brand": "FirstFound",
      "canvas.a2": "genoemd, een bureau dat zich uitsluitend richt op hoe merken in gegenereerde antwoorden verschijnen.",
      "canvas.sourcesLabel": "Bronnen",
      "canvas.s1": "firstfound.nl",
      "canvas.s2": "branchegids",
      "canvas.s3": "vakpublicatie",
      "canvas.caption": "Geen echte uitvoer van een AI-systeem.",

      "shift.mark": "De verschuiving",
      "shift.from": "Zoeken",
      "shift.to": "Antwoord",
      "shift.leftLabel": "Zoekmachine",
      "shift.left1": "Tien blauwe links",
      "shift.left2": "De gebruiker vergelijkt zelf",
      "shift.left3": "U concurreert om een positie",
      "shift.rightLabel": "AI-systeem",
      "shift.right1": "Eén gegenereerd antwoord",
      "shift.right2": "Drie bedrijven genoemd",
      "shift.right3": "U staat er wel of niet in",
      "shift.statement":
        "Vindbaarheid gaat niet meer alleen over bovenaan staan. Het gaat er steeds vaker om óf uw merk überhaupt onderdeel wordt van het antwoord.",

      "geo.mark": "Wat GEO is",
      "geo.seo": "SEO optimaliseert voor zoekresultaten.",
      "geo.geo": "GEO optimaliseert voor gegenereerde antwoorden.",
      "geo.body":
        "Een AI-systeem kiest niet de hoogste positie. Het stelt een antwoord samen uit signalen die het vertrouwt. GEO is het werk dat die signalen op orde brengt.",
      "geo.signalsLabel": "Signalen",
      "geo.sig1": "Content",
      "geo.sig2": "Autoriteit",
      "geo.sig3": "Entiteiten",
      "geo.sig4": "Bronnen",
      "geo.sig5": "Context",
      "geo.sig6": "Vermeldingen",
      "geo.outputLabel": "Resultaat",
      "geo.output": "AI-antwoord",

      "index.mark": "AI Visibility Index",
      "index.title": "Zichtbaarheid is meetbaar.",
      "index.lead":
        "We brengen vier dimensies in kaart en herhalen die meting. Zo ziet u niet alleen waar u staat, maar ook welke kant het op beweegt.",
      "index.illustrative": "Voorbeeldwaarden",
      "index.m1": "Merkaanwezigheid",
      "index.m2": "Zichtbaarheid concurrenten",
      "index.m3": "Bronautoriteit",
      "index.m4": "Entiteitshelderheid",
      "index.scanTitle": "Begin met een momentopname",
      "index.scanLead":
        "Vier dimensies, nu meteen gemeten op uw eigen site. Geen account, geen wachttijd.",

      "tool.step1.label": "Directe scan",
      "tool.step1.title": "Wat kan een AI-systeem van uw site maken?",
      "tool.step1.inputLabel": "Website URL",
      "tool.step1.placeholder": "uwbedrijf.nl",
      "tool.step1.submit": "Analyseer",
      "tool.step1.submitting": "Bezig",
      "tool.step1.scoreSub": "technisch fundament, op 100",


      "tool.cta.text": "Benieuwd wat AI nu over u zegt?",
      "tool.cta.button": "Plan een gesprek",
      "tool.note":
        "Deze scan leest uw site zoals een AI-crawler dat doet. Wat modellen vervolgens over u zeggen, meten we in de volledige index.",

      "services.mark": "Diensten",
      "services.title": "Vier disciplines.",
      "services.s1.title": "AI Visibility",
      "services.s1.body": "Meten waar en hoe uw merk verschijnt in AI-systemen.",
      "services.s1.detail": "Over meerdere platforms, met uw concurrenten ernaast.",
      "services.s2.title": "GEO Strategie",
      "services.s2.body": "De signalen verbeteren die bepalen of u onderdeel wordt van het antwoord.",
      "services.s2.detail": "Op volgorde van effect, op basis van de meting.",
      "services.s3.title": "Autoriteit en content",
      "services.s3.body": "Het informatie-ecosysteem rond uw merk versterken.",
      "services.s3.detail": "Op uw eigen site en op de bronnen die AI daadwerkelijk citeert.",
      "services.s4.title": "Monitoring",
      "services.s4.body": "Volgen hoe AI-platforms u en uw concurrenten weergeven.",
      "services.s4.detail": "Maandelijks, met signalering zodra het beeld verschuift.",

      "method.mark": "Werkwijze",
      "method.title": "Meten, dan pas schrijven.",
      "method.s1.title": "Analyse",
      "method.s1.body": "We meten hoe AI-systemen uw markt beschrijven en wie er nu genoemd wordt.",
      "method.s2.title": "Strategie",
      "method.s2.body": "We bepalen welke onderwerpen, bronnen en pagina's het meeste effect hebben.",
      "method.s3.title": "Optimalisatie",
      "method.s3.body": "We verbeteren uw content, uw structuur en uw aanwezigheid op geciteerde bronnen.",
      "method.s4.title": "Monitoring",
      "method.s4.body": "We meten opnieuw. Wat AI aanbeveelt verschuift continu.",

      "packages.mark": "Samenwerken",
      "packages.title": "Eén opstart, daarna onderhoud.",
      "packages.lead":
        "Elk traject begint met een eenmalige opstart. Daarna houdt een maandelijks pakket de zichtbaarheid bij.",
      "packages.setup.step": "Eenmalig",
      "packages.setup.title": "De opstart",
      "packages.setup.line":
        "We brengen uw hele aanwezigheid in kaart en richten die op AI-zichtbaarheid, zodat het maandelijkse werk op een fundament staat.",
      "packages.setup.b1": "Nulmeting: tientallen koopvragen over vijf categorieën, op meerdere AI-platforms",
      "packages.setup.b2": "Technische controle: robots.txt, rendering, schema markup en sitemap",
      "packages.setup.b3": "Concurrentieanalyse: wie er in uw regio wel genoemd wordt, en waarom",
      "packages.setup.b4": "Bronnenanalyse: welke externe platforms AI in uw branche citeert",
      "packages.setup.b5": "Uw bestaande content doorgelicht en op AI-zichtbaarheid gericht",
      "packages.setup.b6": "Contentfundament: de kernpagina's die de grootste gaten dichten",
      "packages.setup.b7": "Strategisch rapport met prioriteiten voor zes maanden",
      "packages.setup.foot": "Doorlooptijd 2 tot 3 weken",
      "packages.tiers.step": "Maandelijks",
      "packages.tiers.lead": "U kiest hoeveel wij uit handen nemen.",
      "packages.cadence": "per maand",
      "packages.swipe": "Veeg om te vergelijken",
      "packages.featured": "Meest gekozen",
      "packages.t1.name": "Monitor",
      "packages.t1.line": "Weten waar u staat.",
      "packages.t1.b1": "Maandelijkse meting over de grote AI-platforms",
      "packages.t1.b2": "Rapport met score, ontwikkeling en marktverschuivingen",
      "packages.t1.b3": "Signalering zodra een concurrent terrein wint",
      "packages.t1.foot": "U krijgt het inzicht. De uitvoering doet u zelf.",
      "packages.t2.name": "Groei",
      "packages.t2.line": "Zichtbaar worden zonder dat het uw tijd kost.",
      "packages.t2.b1": "Alles uit Monitor",
      "packages.t2.b2": "Wij schrijven de content, gericht op de gaten uit de meting",
      "packages.t2.b3": "Autoriteit opbouwen op de bronnen die AI citeert",
      "packages.t2.b4": "Strategiegesprek per kwartaal",
      "packages.t2.foot": "Wij leveren aan. U zet het live.",
      "packages.t3.name": "Volledig",
      "packages.t3.line": "Wij voeren uit.",
      "packages.t3.b1": "Alles uit Groei",
      "packages.t3.b2": "Volledige uitvoering, inclusief technische aanpassingen",
      "packages.t3.b3": "Bredere meting over meer platforms, regio's en diensten",
      "packages.t3.b4": "Actieve concurrentiemonitoring en maandelijks gesprek",
      "packages.t3.foot": "U hoeft niets te doen.",
      "packages.note":
        "Welk pakket past, hangt af van uw branche en regio. Dat bespreken we, inclusief kosten, in een vrijblijvend gesprek. <a href=\"#contact\">Neem contact op</a>.",

      "faq.mark": "Veelgestelde vragen",
      "faq.title": "Wat mensen ons vragen.",
      "faq.q1": "Wat is GEO precies?",
      "faq.a1": "Generative Engine Optimization. Waar SEO zorgt dat u hoog in de zoekresultaten staat, zorgt GEO dat u genoemd wordt in het antwoord dat een AI-systeem zelf samenstelt. Het is hetzelfde doel, een ander mechanisme.",
      "faq.q2": "Is dit niet gewoon SEO onder een nieuwe naam?",
      "faq.a2": "Nee, maar ze overlappen. Een site die technisch goed in elkaar zit, presteert in allebei beter. Het verschil zit in de uitkomst: SEO levert een positie in een lijst, GEO levert een vermelding in een antwoord. Een AI-systeem kiest niet de hoogste positie, het kiest de bron die het begrijpt en vertrouwt.",
      "faq.q3": "Hoe meten jullie of AI mijn bedrijf noemt?",
      "faq.a3": "We stellen de vragen die uw klanten ook stellen: ruim twintig koopvragen over vijf categorieën. Elke vraag herhalen we meerdere keren, omdat AI-antwoorden variëren. Daaruit komt hoe vaak u genoemd wordt, in welke context, en wie er in uw plaats verschijnt.",
      "faq.q4": "Kunnen jullie garanderen dat ChatGPT mijn bedrijf noemt?",
      "faq.a4": "Nee. Niemand kan dat, en wie het wel belooft, meet het niet. Wij sturen de signalen bij waar een model op afgaat en laten u elke maand zien wat dat doet. Soms beweegt het snel, soms niet. U ziet het volledige beeld, ook als het tegenvalt.",
      "faq.q5": "Hoe lang duurt het voordat ik iets merk?",
      "faq.a5": "De opstart duurt twee tot drie weken. Daarna is het een kwestie van maanden, niet dagen: externe bronnen moeten opnieuw worden opgehaald en modellen moeten het nieuwe beeld oppikken. We meten vanaf dag één, zodat u de beweging ziet in plaats van erop te wachten.",
      "faq.q6": "Moet mijn website opnieuw gebouwd worden?",
      "faq.a6": "Bijna nooit. Meestal gaat het om dingen die bovenop uw bestaande site komen: leesbare structuur, gestructureerde data, duidelijke antwoorden op echte vragen. Blijkt uit de scan dat de site technisch onleesbaar is voor crawlers, dan zeggen we dat eerlijk.",
      "faq.q7": "Werken jullie alleen in Noord-Nederland?",
      "faq.a7": "We zitten in Groningen en kennen die markt goed, maar het werk is niet aan een plaats gebonden. Een deel van onze opdrachtgevers zit buiten de regio.",
      "faq.q8": "Wat kost het?",
      "faq.a8": "Elk traject begint met een eenmalige opstart en loopt daarna maandelijks door. Welk pakket past, hangt af van uw branche, uw regio en hoeveel u zelf wilt oppakken. We nemen de kosten volledig door in een vrijblijvend gesprek, voordat er iets vastligt.",

      "about.mark": "Over FirstFound",
      "about.statement": "Gebouwd voor een zoeklandschap dat nog maar net begint.",
      "about.body":
        "GEO is jong. Dat is precies waarom specialisatie telt: er is geen handboek, alleen meten, interpreteren en bijsturen. Wij doen dit werk uitsluitend.",
      "about.p1.num": "01",
      "about.p1.title": "Eén vakgebied",
      "about.p1.body": "Geen bijzaak naast tien andere diensten.",
      "about.p2.num": "02",
      "about.p2.title": "Meetbaar",
      "about.p2.body": "Elk advies komt uit een meting die we met u doornemen.",
      "about.p3.num": "03",
      "about.p3.title": "Technisch",
      "about.p3.body": "We weten hoe crawlers, structured data en bronvermelding werken.",
      "about.p4.num": "04",
      "about.p4.title": "Transparant",
      "about.p4.body": "U ziet wat we meten. Ook wanneer een resultaat tegenvalt.",
      "about.localLine": "Gevestigd in het noorden. Gebouwd voor wat na de zoekmachine komt.",

      "contact.mark": "Contact",
      "contact.statement": "Word onderdeel van het antwoord.",
      "contact.lead": "Vertel kort wat u doet. We reageren binnen één werkdag.",
      "contact.emailLabel": "E-mail",
      "contact.phoneLabel": "Telefoon",
      "contact.baseLabel": "Vestiging",
      "contact.baseValue": "Groningen, Nederland",
      "contact.name": "Naam",
      "contact.email": "E-mail",
      "contact.company": "Bedrijf",
      "contact.message": "Bericht",
      "contact.submit": "Verstuur",
      "contact.sending": "Bezig",
      "contact.ok": "Bedankt. We reageren binnen één werkdag.",
      "contact.fail": "Versturen mislukt. Mail ons direct op info@firstfound.nl.",

      "footer.statement": "Word het antwoord.",
      "footer.navTitle": "Navigatie",
      "footer.contactTitle": "Contact",
      "footer.coords": "53.2194° N, 6.5665° O",
      "footer.rights": "Alle rechten voorbehouden.",

      "tool.lockedNote":
        "Twee dimensies van de index staan hier niet in: of een AI-systeem u daadwerkelijk noemt, en hoe uw concurrenten ervoor staan. Die komen uit echte modelbevragingen en nemen we door in een gesprek.",

      "audit.dim.access": "Toegankelijkheid",
      "audit.dim.structure": "Structuur",
      "audit.dim.entity": "Entiteitshelderheid",
      "audit.dim.answer": "Antwoordgereedheid",

      "audit.check.https_ok": "De site wordt via HTTPS geserveerd",
      "audit.check.https_missing": "Geen HTTPS: bronnen zonder HTTPS worden minder vertrouwd",
      "audit.check.h1_ok": "Eén duidelijke H1 op de pagina",
      "audit.check.h1_bad": "{count} H1-koppen gevonden, één is duidelijker",
      "audit.check.headings_ok": "{count} H2-koppen geven de pagina structuur",
      "audit.check.headings_thin": "Weinig koppen: AI heeft structuur nodig om een antwoord op te bouwen",
      "audit.check.canonical_ok": "Canonical URL ingesteld",
      "audit.check.canonical_missing": "Geen canonical URL",
      "audit.check.lang_ok": "Taal van de pagina is vastgelegd",
      "audit.check.lang_missing": "Geen taal vastgelegd in de html-tag",
      "audit.check.entity_ok": "Schema beschrijft uw organisatie als entiteit",
      "audit.check.entity_missing": "Geen Organization- of LocalBusiness-schema gevonden",
      "audit.check.title_ok": "Titel is aanwezig en goed van lengte",
      "audit.check.title_length": "Titel is {count} tekens, tussen 15 en 65 leest beter",
      "audit.check.title_missing": "Geen titel gevonden",
      "audit.check.description_ok": "Meta description aanwezig",
      "audit.check.description_missing": "Geen meta description",
      "audit.check.og_ok": "Open Graph-gegevens aanwezig",
      "audit.check.og_missing": "Geen Open Graph-gegevens",
      "audit.check.llmstxt_ok": "llms.txt gevonden",
      "audit.check.llmstxt_missing": "Geen llms.txt: hiermee vertelt u AI-systemen wat uw site is",
      "audit.check.faq_ok": "Vraag-en-antwoordstructuur gevonden",
      "audit.check.faq_missing": "Geen vraagstructuur: dit is precies wat AI overneemt",
      "audit.check.depth_ok": "Genoeg leesbare tekst ({count} woorden)",
      "audit.check.depth_thin": "Weinig leesbare tekst ({count} woorden)",

      "audit.grade.strong": "Sterk. AI-crawlers kunnen uw site goed lezen",
      "audit.grade.good": "Redelijk. Een paar dingen staan in de weg",
      "audit.grade.limited": "Beperkt. Belangrijke blokkades gevonden",
      "audit.grade.weak": "Zwak. AI-crawlers kunnen uw site nauwelijks lezen",

      "audit.check.crawlers_ok": "AI-crawlers mogen uw site bezoeken",
      "audit.check.crawlers_blocked": "{count} AI-crawler(s) geblokkeerd in robots.txt ({list})",
      "audit.check.rendering_ok": "Uw site is leesbaar zonder JavaScript",
      "audit.check.rendering_csr": "Uw site leunt zwaar op JavaScript, en AI-crawlers lezen dat niet",
      "audit.check.sitemap_ok": "Sitemap.xml gevonden",
      "audit.check.sitemap_missing": "Geen sitemap.xml gevonden",
      "audit.check.schema_ok": "Schema markup gevonden",
      "audit.check.schema_missing": "Geen schema markup gevonden",


      "error.method_not_allowed": "Methode niet toegestaan.",
      "error.bad_request": "Ongeldige aanvraag.",
      "error.forbidden": "Deze aanvraag is niet toegestaan.",
      "error.url_required": "Vul een website-URL in.",
      "error.url_invalid": "Dat is geen geldige URL.",
      "error.url_protocol": "Alleen http:// en https:// worden ondersteund.",
      "error.url_blocked_host": "Deze host kan niet gecontroleerd worden.",
      "error.url_dns": "Dit domein is niet gevonden. Klopt de URL?",
      "error.url_private": "Deze URL wijst naar een adres dat niet gecontroleerd kan worden.",
      "error.url_redirects": "Deze URL stuurt te vaak door.",
      "error.url_timeout": "De site reageerde niet op tijd.",
      "error.request_too_large": "De aanvraag is te groot.",
      "error.not_configured": "De server is niet geconfigureerd.",
      "error.rate_limited": "U heeft de gratis check al gebruikt. Neem contact op voor een volledige meting.",
      "error.audit_rate_limited": "U heeft net veel checks gedaan. Wacht even en probeer opnieuw.",
      "error.fields_required": "Vul bedrijfsnaam, branche en plaats in.",
      "error.upstream_unreachable": "Het AI-systeem was niet bereikbaar.",
      "error.server_error": "Er ging iets mis. Probeer het later opnieuw.",
      "error.network": "Er ging iets mis. Probeer het opnieuw.",
    },

    en: {
      "meta.title": "FirstFound | Become the answer",
      "meta.description":
        "AI systems increasingly decide which companies people discover. FirstFound helps brands become part of that answer.",
      "meta.ogAlt": "FirstFound, specialists in AI visibility",

      "nav.skip": "Skip to main content",
      "nav.label": "Main menu",
      "nav.geo": "GEO",
      "nav.visibility": "Visibility",
      "nav.method": "Approach",
      "nav.about": "About",
      "nav.contact": "Contact",
      "nav.cta": "Visibility scan",
      "nav.language": "Language",
      "nav.theme": "Switch between light and dark",
      "nav.menu": "Menu",

      "hero.mark": "GEO · AI visibility",
      "hero.title": "Become the answer.",
      "hero.sub":
        "AI systems increasingly decide which companies people discover. FirstFound helps brands become part of that answer.",
      "hero.cta": "Measure your visibility",
      "hero.secondary": "How GEO works",
      "hero.coords": "Groningen · 53.2194° N",

      "canvas.label": "Conceptual rendering",
      "canvas.prompt": "Question",
      "canvas.question": "Which specialist helps companies become more visible in AI?",
      "canvas.answerLabel": "Answer",
      "canvas.a1": "For AI visibility in the Netherlands,",
      "canvas.brand": "FirstFound",
      "canvas.a2": "comes up, an agency working solely on how brands appear in generated answers.",
      "canvas.sourcesLabel": "Sources",
      "canvas.s1": "firstfound.nl",
      "canvas.s2": "industry directory",
      "canvas.s3": "trade publication",
      "canvas.caption": "Not real output from an AI system.",

      "shift.mark": "The shift",
      "shift.from": "Search",
      "shift.to": "Answer",
      "shift.leftLabel": "Search engine",
      "shift.left1": "Ten blue links",
      "shift.left2": "The user compares",
      "shift.left3": "You compete for a position",
      "shift.rightLabel": "AI system",
      "shift.right1": "One generated answer",
      "shift.right2": "Three companies named",
      "shift.right3": "You are in it, or you are not",
      "shift.statement":
        "Visibility is no longer only about ranking first. Increasingly it is about whether your brand becomes part of the answer at all.",

      "geo.mark": "What GEO is",
      "geo.seo": "SEO optimises for search results.",
      "geo.geo": "GEO optimises for generated answers.",
      "geo.body":
        "An AI system does not pick the highest position. It assembles an answer from signals it trusts. GEO is the work of getting those signals in order.",
      "geo.signalsLabel": "Signals",
      "geo.sig1": "Content",
      "geo.sig2": "Authority",
      "geo.sig3": "Entities",
      "geo.sig4": "Sources",
      "geo.sig5": "Context",
      "geo.sig6": "Mentions",
      "geo.outputLabel": "Output",
      "geo.output": "AI answer",

      "index.mark": "AI Visibility Index",
      "index.title": "Visibility is measurable.",
      "index.lead":
        "We map four dimensions and repeat the measurement. You see not only where you stand, but which way it is moving.",
      "index.illustrative": "Illustrative values",
      "index.m1": "Brand presence",
      "index.m2": "Competitor visibility",
      "index.m3": "Source authority",
      "index.m4": "Entity clarity",
      "index.scanTitle": "Start with a snapshot",
      "index.scanLead":
        "Four dimensions, measured on your own site right now. No account, no waiting.",

      "tool.step1.label": "Instant scan",
      "tool.step1.title": "What can an AI system make of your site?",
      "tool.step1.inputLabel": "Website URL",
      "tool.step1.placeholder": "yourcompany.com",
      "tool.step1.submit": "Analyse",
      "tool.step1.submitting": "Working",
      "tool.step1.scoreSub": "technical foundation, out of 100",


      "tool.cta.text": "Curious what AI says about you now?",
      "tool.cta.button": "Book a call",
      "tool.note":
        "This scan reads your site the way an AI crawler does. What models then say about you is measured in the full index.",

      "services.mark": "Services",
      "services.title": "Four disciplines.",
      "services.s1.title": "AI Visibility",
      "services.s1.body": "Measure where and how your brand appears across AI systems.",
      "services.s1.detail": "Across several platforms, with your competitors alongside.",
      "services.s2.title": "GEO Strategy",
      "services.s2.body": "Improve the signals that decide whether you become part of the answer.",
      "services.s2.detail": "Ordered by effect, based on the measurement.",
      "services.s3.title": "Authority and content",
      "services.s3.body": "Strengthen the information ecosystem around your brand.",
      "services.s3.detail": "On your own site and on the sources AI actually cites.",
      "services.s4.title": "Monitoring",
      "services.s4.body": "Track how AI platforms represent you and your competitors.",
      "services.s4.detail": "Monthly, with an alert as soon as the picture shifts.",

      "method.mark": "Approach",
      "method.title": "Measure, then write.",
      "method.s1.title": "Analysis",
      "method.s1.body": "We measure how AI systems describe your market and who gets named today.",
      "method.s2.title": "Strategy",
      "method.s2.body": "We decide which topics, sources and pages will have the most effect.",
      "method.s3.title": "Optimisation",
      "method.s3.body": "We improve your content, your structure and your presence on cited sources.",
      "method.s4.title": "Monitoring",
      "method.s4.body": "We measure again. What AI recommends keeps shifting.",

      "packages.mark": "Working together",
      "packages.title": "One setup, then upkeep.",
      "packages.lead":
        "Every engagement starts with a one-off setup. After that a monthly package keeps the visibility current.",
      "packages.setup.step": "One-off",
      "packages.setup.title": "The setup",
      "packages.setup.line":
        "We map your whole presence and aim it at AI visibility, so the monthly work stands on a foundation.",
      "packages.setup.b1": "Baseline: dozens of buying questions across five categories, on several AI platforms",
      "packages.setup.b2": "Technical check: robots.txt, rendering, schema markup and sitemap",
      "packages.setup.b3": "Competitor analysis: who does get named in your region, and why",
      "packages.setup.b4": "Source analysis: which external platforms AI cites in your industry",
      "packages.setup.b5": "Your existing content reviewed and aimed at AI visibility",
      "packages.setup.b6": "Content foundation: the core pages that close the biggest gaps",
      "packages.setup.b7": "Strategic report with priorities for six months",
      "packages.setup.foot": "Turnaround 2 to 3 weeks",
      "packages.tiers.step": "Monthly",
      "packages.tiers.lead": "You choose how much we take off your hands.",
      "packages.cadence": "per month",
      "packages.swipe": "Swipe to compare",
      "packages.featured": "Most chosen",
      "packages.t1.name": "Monitor",
      "packages.t1.line": "Know where you stand.",
      "packages.t1.b1": "Monthly measurement across the major AI platforms",
      "packages.t1.b2": "Report with score, movement and market shifts",
      "packages.t1.b3": "An alert as soon as a competitor gains ground",
      "packages.t1.foot": "You get the insight. You handle execution.",
      "packages.t2.name": "Growth",
      "packages.t2.line": "Become visible without spending your time on it.",
      "packages.t2.b1": "Everything in Monitor",
      "packages.t2.b2": "We write the content, aimed at the gaps in the measurement",
      "packages.t2.b3": "Building authority on the sources AI cites",
      "packages.t2.b4": "Quarterly strategy call",
      "packages.t2.foot": "We deliver. You publish.",
      "packages.t3.name": "Full service",
      "packages.t3.line": "We execute.",
      "packages.t3.b1": "Everything in Growth",
      "packages.t3.b2": "Full execution, technical changes included",
      "packages.t3.b3": "Broader measurement across more platforms, regions and services",
      "packages.t3.b4": "Active competitor monitoring and a monthly call",
      "packages.t3.foot": "Nothing for you to do.",
      "packages.note":
        "Which package fits depends on your industry and region. We go through that, costs included, in a no-obligation call. <a href=\"#contact\">Get in touch</a>.",

      "faq.mark": "Frequently asked",
      "faq.title": "What people ask us.",
      "faq.q1": "What exactly is GEO?",
      "faq.a1": "Generative Engine Optimization. Where SEO gets you high in the search results, GEO gets you named in the answer an AI system assembles itself. Same goal, different mechanism.",
      "faq.q2": "Is this not just SEO under a new name?",
      "faq.a2": "No, but they overlap. A site that is technically sound performs better in both. The difference is the outcome: SEO earns a position in a list, GEO earns a mention in an answer. An AI system does not pick the highest position, it picks the source it understands and trusts.",
      "faq.q3": "How do you measure whether AI names my business?",
      "faq.a3": "We ask the questions your customers ask: over twenty buying questions across five categories. Each one is repeated several times, because AI answers vary. That gives us how often you are named, in what context, and who appears in your place.",
      "faq.q4": "Can you guarantee ChatGPT will name my business?",
      "faq.a4": "No. Nobody can, and anyone promising it is not measuring it. We improve the signals a model goes on and show you every month what that does. Sometimes it moves quickly, sometimes it does not. You see the whole picture, including when it disappoints.",
      "faq.q5": "How long before I notice anything?",
      "faq.a5": "The setup takes two to three weeks. After that it is a matter of months, not days: external sources have to be crawled again and models have to pick up the new picture. We measure from day one, so you watch the movement rather than wait for it.",
      "faq.q6": "Does my website need rebuilding?",
      "faq.a6": "Almost never. Usually it is work that sits on top of your existing site: readable structure, structured data, clear answers to real questions. If the scan shows the site is technically unreadable to crawlers, we will say so plainly.",
      "faq.q7": "Do you only work in the north of the Netherlands?",
      "faq.a7": "We are based in Groningen and know that market well, but the work is not tied to a place. Some of our clients are outside the region.",
      "faq.q8": "What does it cost?",
      "faq.a8": "Every engagement starts with a one-off setup and continues monthly. Which package fits depends on your industry, your region and how much you want to handle yourself. We go through the costs in full in a no-obligation call, before anything is agreed.",

      "about.mark": "About FirstFound",
      "about.statement": "Built for a search landscape that is only just beginning.",
      "about.body":
        "GEO is young. That is exactly why specialisation matters: there is no handbook, only measuring, interpreting and adjusting. This is the only work we do.",
      "about.p1.num": "01",
      "about.p1.title": "One field",
      "about.p1.body": "Not a sideline next to ten other services.",
      "about.p2.num": "02",
      "about.p2.title": "Measured",
      "about.p2.body": "Every recommendation comes from a measurement we go through with you.",
      "about.p3.num": "03",
      "about.p3.title": "Technical",
      "about.p3.body": "We know how crawlers, structured data and citation work.",
      "about.p4.num": "04",
      "about.p4.title": "Transparent",
      "about.p4.body": "You see what we measure. Including when a result disappoints.",
      "about.localLine": "Based in the north. Built for what comes after the search engine.",

      "contact.mark": "Contact",
      "contact.statement": "Become part of the answer.",
      "contact.lead": "Tell us briefly what you do. We reply within one working day.",
      "contact.emailLabel": "Email",
      "contact.phoneLabel": "Phone",
      "contact.baseLabel": "Based in",
      "contact.baseValue": "Groningen, the Netherlands",
      "contact.name": "Name",
      "contact.email": "Email",
      "contact.company": "Company",
      "contact.message": "Message",
      "contact.submit": "Send",
      "contact.sending": "Sending",
      "contact.ok": "Thanks. We'll reply within one working day.",
      "contact.fail": "Sending failed. Email us directly at info@firstfound.nl.",

      "footer.statement": "Become the answer.",
      "footer.navTitle": "Navigation",
      "footer.contactTitle": "Contact",
      "footer.coords": "53.2194° N, 6.5665° E",
      "footer.rights": "All rights reserved.",

      "tool.lockedNote":
        "Two dimensions of the index are not in here: whether an AI system actually names you, and how your competitors place. Those come from real model queries, and we go through them in a conversation.",

      "audit.dim.access": "Accessibility",
      "audit.dim.structure": "Structure",
      "audit.dim.entity": "Entity clarity",
      "audit.dim.answer": "Answer readiness",

      "audit.check.https_ok": "The site is served over HTTPS",
      "audit.check.https_missing": "No HTTPS: sources without it are trusted less",
      "audit.check.h1_ok": "One clear H1 on the page",
      "audit.check.h1_bad": "{count} H1 headings found, one is clearer",
      "audit.check.headings_ok": "{count} H2 headings give the page structure",
      "audit.check.headings_thin": "Few headings: AI needs structure to build an answer from",
      "audit.check.canonical_ok": "Canonical URL set",
      "audit.check.canonical_missing": "No canonical URL",
      "audit.check.lang_ok": "Page language is declared",
      "audit.check.lang_missing": "No language declared on the html tag",
      "audit.check.entity_ok": "Schema describes your organisation as an entity",
      "audit.check.entity_missing": "No Organization or LocalBusiness schema found",
      "audit.check.title_ok": "Title present and well sized",
      "audit.check.title_length": "Title is {count} characters, 15 to 65 reads better",
      "audit.check.title_missing": "No title found",
      "audit.check.description_ok": "Meta description present",
      "audit.check.description_missing": "No meta description",
      "audit.check.og_ok": "Open Graph data present",
      "audit.check.og_missing": "No Open Graph data",
      "audit.check.llmstxt_ok": "llms.txt found",
      "audit.check.llmstxt_missing": "No llms.txt: this is how you tell AI systems what your site is",
      "audit.check.faq_ok": "Question and answer structure found",
      "audit.check.faq_missing": "No question structure: this is exactly what AI reuses",
      "audit.check.depth_ok": "Enough readable text ({count} words)",
      "audit.check.depth_thin": "Little readable text ({count} words)",

      "audit.grade.strong": "Strong. AI crawlers can read your site well",
      "audit.grade.good": "Decent. A few things are getting in the way",
      "audit.grade.limited": "Limited. Significant blockers found",
      "audit.grade.weak": "Weak. AI crawlers can barely read your site",

      "audit.check.crawlers_ok": "AI crawlers are allowed to visit your site",
      "audit.check.crawlers_blocked": "{count} AI crawler(s) blocked in robots.txt ({list})",
      "audit.check.rendering_ok": "Your site is readable without JavaScript",
      "audit.check.rendering_csr": "Your site leans heavily on JavaScript, and AI crawlers don't read that",
      "audit.check.sitemap_ok": "Sitemap.xml found",
      "audit.check.sitemap_missing": "No sitemap.xml found",
      "audit.check.schema_ok": "Schema markup found",
      "audit.check.schema_missing": "No schema markup found",


      "error.method_not_allowed": "Method not allowed.",
      "error.bad_request": "Invalid request.",
      "error.forbidden": "This request is not allowed.",
      "error.url_required": "Please enter a website URL.",
      "error.url_invalid": "That isn't a valid URL.",
      "error.url_protocol": "Only http:// and https:// are supported.",
      "error.url_blocked_host": "This host can't be checked.",
      "error.url_dns": "Couldn't find that domain. Is the URL correct?",
      "error.url_private": "This URL points at an address that can't be checked.",
      "error.url_redirects": "This URL redirects too many times.",
      "error.url_timeout": "The site didn't respond in time.",
      "error.request_too_large": "The request is too large.",
      "error.not_configured": "The server isn't configured.",
      "error.rate_limited": "You've already used the free check. Get in touch for a full measurement.",
      "error.audit_rate_limited": "You've run a lot of checks just now. Give it a moment and try again.",
      "error.fields_required": "Please fill in company name, industry and city.",
      "error.upstream_unreachable": "The AI system was unreachable.",
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
