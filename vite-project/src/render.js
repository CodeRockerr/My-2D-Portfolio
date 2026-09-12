import {
  profile,
  experience,
  projects,
  publications,
  awards,
  pages,
} from "./content.js";
import { SAMPLE_PRICES, rollingMean, chartPath } from "./features.js";
import { renderGame } from "./game-render.js";

export const escapeHtml = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const e = escapeHtml;
const arrow = '<span aria-hidden="true">↗</span>';
const tags = (items) =>
  `<ul class="tags" aria-label="Technologies">${items.map((tag) => `<li>${e(tag)}</li>`).join("")}</ul>`;
const external = (url, label, className = "text-link") =>
  `<a class="${className}" href="${e(url)}" target="_blank" rel="noopener noreferrer">${label} ${arrow}<span class="sr-only"> (opens in a new tab)</span></a>`;
const sectionHeading = (number, title, sub = "") =>
  `<div class="section-heading"><div><p class="eyebrow">${number}</p><h2>${title}</h2></div>${sub ? `<p>${sub}</p>` : ""}</div>`;

function header(page) {
  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="header-inner">
    <a class="wordmark" href="/" aria-label="Adit Shah, home"><span class="monogram" aria-hidden="true">as<span>.</span></span><span>Adit Shah<span class="wordmark-caption">Engineer & builder</span></span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav">Menu <span aria-hidden="true">☰</span></button>
    <nav id="main-nav" class="main-nav" aria-label="Main navigation">
      <a href="/aequitas/" ${page === "aequitas" ? 'aria-current="page"' : ""}>AEQUITAS</a>
      <a href="/#projects">Projects</a><a href="/#experience">Experience</a>
      <a href="/achievements/">Achievements</a><a href="/research/" ${page === "research" ? 'aria-current="page"' : ""}>Research</a>
      <a href="/#about">About</a><a href="/contact/">Contact</a>
      <a class="nav-resume" href="${profile.resume}" target="_blank" rel="noopener">Résumé ${arrow}<span class="sr-only"> (PDF, new tab)</span></a>
    </nav>
  </div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-top"><a class="wordmark" href="/"><span class="monogram" aria-hidden="true">as<span>.</span></span><span>Always building.<br><span class="muted">Always learning.</span></span></a>
    <div class="footer-links"><a class="text-link" href="/contact/">Contact ↗</a>${external(profile.github, "GitHub")}${external(profile.linkedin, "LinkedIn")}${external(profile.scholar, "Google Scholar")}<a class="text-link" href="/feedback/">Leave a note ${arrow}</a></div></div>
    <div class="footer-contact-links"><div><a href="mailto:${profile.email}">${profile.email}</a><a href="mailto:${profile.personalEmail}">${profile.personalEmail}</a></div><p>Check out my résumé <a href="${profile.resume}" target="_blank" rel="noopener">View PDF ↗</a><a href="${profile.resume}" download="Adit-Shah-Resume.pdf">Download ↓</a></p></div>
    <div class="footer-bottom"><p>© ${new Date().getFullYear()} Adit Shah · Made with curiosity in Raleigh, NC.</p><div><a href="/privacy/">Privacy</a><a href="/#studio">Back to the studio ↑</a></div></div></footer>`;
}

function studio() {
  return `<div class="studio-shell" id="studio">
    <div class="studio-topline"><span><i class="status-dot" aria-hidden="true"></i> ADIT’S STUDIO</span><button class="studio-expand" type="button" aria-haspopup="dialog">Enter studio <span aria-hidden="true">⤢</span></button></div>
    <div class="studio-world" tabindex="0" role="group" aria-label="Interactive engineering studio" aria-describedby="studio-help">
      <img class="studio-art" src="/art/studio.webp" width="1536" height="1024" alt="An isometric pixel-art studio with a coding desk, research bookshelf, electronics bench and mailbox." fetchpriority="high">
      <a class="hotspot hotspot-terminal" href="/aequitas/"><span class="hotspot-pin" aria-hidden="true">01</span><span class="hotspot-label">AEQUITAS ${arrow}</span></a>
      <a class="hotspot hotspot-research" href="/research/"><span class="hotspot-pin" aria-hidden="true">02</span><span class="hotspot-label">Research ${arrow}</span></a>
      <a class="hotspot hotspot-projects" href="/#projects"><span class="hotspot-pin" aria-hidden="true">03</span><span class="hotspot-label">Projects ${arrow}</span></a>
      <a class="hotspot hotspot-mail" href="/feedback/"><span class="hotspot-pin" aria-hidden="true">04</span><span class="hotspot-label">Leave a note ${arrow}</span></a>
      <div class="studio-player" aria-hidden="true"><span class="player-shadow"></span><span class="player-sprite"></span><span class="player-name">hello, world.</span></div>
      <span class="walk-target" aria-hidden="true"></span>
    </div>
    <div class="studio-bottomline"><p id="studio-help">Click a label to explore. Tap the floor to walk.</p><button class="studio-help-toggle" type="button" aria-expanded="false" aria-controls="studio-controls">Controls <span aria-hidden="true">?</span></button></div>
    <div id="studio-controls" class="studio-controls" hidden><p>Focus the room, then use <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or the arrow keys to move. Press <kbd>Enter</kbd> to visit the nearest station. Every station is also a regular link.</p></div>
  </div>`;
}

function projectArt(project) {
  if (project.visual === "wave")
    return `<div class="project-art art-wave" aria-hidden="true"><span class="art-label">COUGHSENSE / EDGE INFERENCE</span><div class="waveform">${Array.from({ length: 38 }, (_, i) => `<i style="--h:${[15, 24, 12, 36, 18, 60, 93, 70, 34, 65, 46, 18, 29][i % 13]}%"></i>`).join("")}</div><span class="art-bottom">AUDIO → FEATURES → INFERENCE</span></div>`;
  if (project.visual === "graph")
    return `<div class="project-art art-graph" aria-hidden="true"><span class="art-label">WOLFTRACE / CONNECT THE EVIDENCE</span><svg viewBox="0 0 440 200"><g fill="none" stroke="currentColor" stroke-width="1"><path d="M75 114 160 60 225 110 340 48M75 114 166 170 225 110 344 155M160 60 344 155M225 110 340 48"/></g><g fill="var(--paper)" stroke="currentColor" stroke-width="2"><circle cx="75" cy="114" r="15"/><circle cx="160" cy="60" r="10"/><circle cx="225" cy="110" r="24"/><circle cx="340" cy="48" r="12"/><circle cx="166" cy="170" r="12"/><circle cx="344" cy="155" r="16"/></g><circle cx="225" cy="110" r="7" fill="currentColor"/></svg><span class="art-bottom">SIGNALS BECOME CONNECTIONS</span></div>`;
  if (project.visual === "flow")
    return `<div class="project-art art-flow" aria-hidden="true"><span class="art-label">WOLFVEST / GUIDED ONBOARDING</span><div class="flow-cards"><span>01<br><b>Ask</b></span><i>→</i><span>02<br><b>Extract</b></span><i>→</i><span>03<br><b>Validate</b></span></div><span class="art-bottom">FROM CONVERSATION TO STRUCTURE</span></div>`;
  if (project.visual === "energy")
    return `<div class="project-art art-energy" aria-hidden="true"><span class="art-label">WATTWATCH / LIVE RESOURCE TRACKING</span><div class="resource-meters"><div><svg viewBox="0 0 60 60"><path d="M34 5 14 34h16l-4 21 22-31H32Z"/></svg><span>Energy</span></div><div><svg viewBox="0 0 60 60"><path d="M30 5C23 19 13 29 13 38a17 17 0 0 0 34 0C47 29 37 19 30 5Z"/></svg><span>Water</span></div></div><span class="art-bottom">SENSORS → INSIGHTS → SUSTAINABLE HABITS</span></div>`;
  if (project.visual === "market")
    return `<div class="project-art art-market" aria-hidden="true"><span class="art-label">STOCKX / DATA MEETS CONTEXT</span><svg viewBox="0 0 440 180"><path class="market-grid" d="M30 30h380M30 80h380M30 130h380"/><path class="market-trace" d="m30 135 35-30 35 10 35-45 35 15 35-25 35 8 35-30 35 22 35-15 35-25"/></svg><span class="art-bottom">MARKET DATA + TIME SERIES + NEWS SENTIMENT</span></div>`;
  if (project.visual === "recipe")
    return `<div class="project-art art-recipe" aria-hidden="true"><span class="art-label">RECIPEAI / FROM IMAGE TO RECIPE</span><div class="recipe-flow"><span class="recipe-scan"><svg viewBox="0 0 80 80"><path d="M8 24V8h16M56 8h16v16M72 56v16H56M24 72H8V56"/><circle cx="40" cy="40" r="22"/><path d="M27 43c9-25 23-16 27-21-2 26-12 33-27 21Z"/></svg></span><span>→</span><div><b>Identify</b><b>Understand</b><b>Cook</b></div></div><span class="art-bottom">COMPUTER VISION + SPOONACULAR</span></div>`;
  return `<div class="project-art art-engine" aria-hidden="true"><span class="art-label">ENGINE FOUNDATIONS / C++</span><div class="engine-code"><span>while</span> (running) {<br>&nbsp; processInput();<br>&nbsp; update(dt);<br>&nbsp; render();<br>}</div><span class="art-bottom">LEARNING BY BUILDING</span></div>`;
}

function projectCard(project) {
  return `<article id="project-card-${e(project.id)}" class="project-card" data-category="${e(project.category)}">${projectArt(project)}<div class="project-card-body"><div class="card-meta"><span>${e(project.category)}</span><span>${project.number}</span></div><h3>${e(project.name)}</h3><p>${e(project.summary)}</p>${tags(project.tags)}<div class="card-bottom"><span class="award-label">${e(project.badge)}</span><button class="text-link" type="button" data-project="${e(project.id)}" aria-haspopup="dialog">Details ${arrow}<span class="sr-only"> about ${e(project.name)}</span></button></div></div></article>`;
}

function projectDialogs() {
  return projects
    .map(
      (p) =>
        `<dialog id="project-${p.id}" class="project-dialog" aria-labelledby="title-${p.id}"><div class="dialog-body"><button class="dialog-close" type="button" aria-label="Close project details">×</button><p class="eyebrow">${e(p.category)} · ${e(p.badge)}</p><h2 id="title-${p.id}">${e(p.name)}</h2><p class="lead">${e(p.detail)}</p><h3>My contribution</h3><p>${e(p.role)}</p><ul class="detail-list">${p.points.map((point) => `<li>${e(point)}</li>`).join("")}</ul>${tags(p.tags)}${p.link ? `<a class="button primary" href="${p.link}">${e(p.linkText)} ${arrow}</a>` : `<a class="text-link" href="mailto:${profile.email}?subject=${encodeURIComponent(`Let's talk about ${p.name}`)}">Ask me about this project ${arrow}</a>`}</div></dialog>`,
    )
    .join("");
}

function featureLab() {
  const means = rollingMean(SAMPLE_PRICES, 5);
  return `<section class="section container" aria-labelledby="feature-lab-heading"><div class="section-heading"><div><p class="eyebrow">TRY A SMALL IDEA</p><h2 id="feature-lab-heading">From prices to features.</h2></div><p>Move the window. Watch the rolling mean respond.</p></div><div class="feature-lab"><div class="feature-lab-copy"><p class="eyebrow">INTERACTIVE EXPLAINER</p><h3>One feature, step by step.</h3><p>A rolling mean averages a fixed window of recent prices. A larger window smooths more of the variation, while responding more slowly to changes.</p><label for="feature-window">Window size <output id="window-value" for="feature-window">5 samples</output></label><input type="range" id="feature-window" min="2" max="16" value="5" step="1"><p class="caption">2 samples <span>16 samples</span></p><p class="lab-disclaimer">Synthetic data, calculated in your browser. This illustrates a feature-engineering concept; it is not the AEQUITAS C++ extension or a performance benchmark.</p></div><div class="feature-lab-chart"><div class="chart-legend"><span><i class="price-key" aria-hidden="true"></i> Price</span><span><i class="mean-key" aria-hidden="true"></i> Rolling mean</span></div><svg viewBox="0 0 640 200" role="img" aria-labelledby="feature-chart-title feature-chart-description"><title id="feature-chart-title">Price and rolling mean</title><desc id="feature-chart-description">A five-sample rolling mean of 32 synthetic prices.</desc><g stroke="currentColor" stroke-opacity=".15"><path d="M20 30H620M20 80H620M20 130H620M20 180H620"/></g><path class="price-line" d="${chartPath(SAMPLE_PRICES)}"/><path class="mean-line" id="feature-path" d="${chartPath(means)}"/></svg><dl class="feature-results"><div><dt>Latest price</dt><dd>${SAMPLE_PRICES.at(-1).toFixed(2)}</dd></div><div><dt>Latest mean</dt><dd><output id="feature-average">${means.at(-1).toFixed(2)}</output></dd></div><div><dt>Complete windows</dt><dd><output id="feature-count">28</output></dd></div></dl><details class="sample-data"><summary>View the sample data</summary><p>${SAMPLE_PRICES.map((price) => price.toFixed(2)).join(", ")}</p><p>The first window − 1 samples have no complete rolling mean.</p></details></div></div></section>`;
}

function home() {
  return `<main id="main">
    <section class="hero container" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow"><span class="status-dot" aria-hidden="true"></span> SOFTWARE · SYSTEMS · APPLIED AI</p><h1 id="hero-title">Curious mind.<br>Thoughtful code.<br><em>Real-world impact.</em></h1><p class="hero-intro">I’m Adit, a software engineer who likes to understand how things work—and build them better.</p><p class="hero-description">From quantitative research tools to on-device AI, I build across the stack. Currently pursuing my MS in Computer Science at NC State.</p><div class="hero-actions"><a class="button primary" href="#projects">Explore my work <span aria-hidden="true">↓</span></a><a class="button secondary" href="mailto:${profile.email}">Let’s connect ${arrow}</a></div><p class="availability"><span class="status-dot" aria-hidden="true"></span> Open to new-grad roles · Graduating May 2027</p><div class="hero-socials">${external(profile.github, "GitHub")}${external(profile.linkedin, "LinkedIn")}${external(profile.scholar, "Scholar")}</div></div>${studio()}</section>
    <div class="proof-strip container" aria-label="Highlights"><span><b>NC State</b> MS Computer Science</span><span><b>Best Poster Award</b> AI Student Symposium ’26</span><span><b>C++ · Python</b> Systems & applied AI</span><span><b>May 2027</b> New-grad opportunities</span></div>
    <section class="section container" id="aequitas" aria-labelledby="aequitas-heading"><div class="section-heading"><div><p class="eyebrow">01 / FEATURED WORK</p><h2 id="aequitas-heading">Where markets meet engineering.</h2></div><p>A dedicated look at my quantitative research platform.</p></div>
      <article class="aequitas-feature"><div class="aequitas-copy"><p class="eyebrow light">QUANTITATIVE RESEARCH PLATFORM</p><h3>AEQUITAS<span aria-hidden="true">.</span></h3><p>Market data, financial models and AI-assisted research in one real-time workspace.</p>${tags(["C++20", "pybind11", "Python", "FastAPI", "Next.js"])}<div class="feature-links"><a class="button cream" href="/aequitas/">Inside the project ${arrow}</a>${external(profile.aequitas, "Open platform", "text-link light-link")}</div><p class="feature-note">Presenting the C++20 feature-engineering work at CppCon 2026.</p></div><div class="quant-diagram" aria-label="Conceptual AEQUITAS pipeline: market data to C++ feature computation to Python research"><div class="quant-heading"><span>RESEARCH PIPELINE</span><span class="status-dot" aria-hidden="true"></span></div><div class="signal-chart" aria-hidden="true"><svg viewBox="0 0 420 150"><defs><pattern id="chart-grid" width="42" height="30" patternUnits="userSpaceOnUse"><path d="M 42 0 L 0 0 0 30" fill="none" stroke="currentColor" stroke-opacity=".14"/></pattern></defs><rect width="420" height="150" fill="url(#chart-grid)"/><path d="M0 119 24 115 46 125 66 102 91 106 111 76 138 94 161 68 181 86 203 73 228 90 253 56 270 65 293 43 314 52 337 26 357 43 377 22 400 31 420 12" fill="none" stroke="currentColor" stroke-width="2.5"/></svg></div><ol class="pipeline-mini"><li><small>01 / INGEST</small><b>Market data</b></li><li><small>02 / COMPUTE</small><b>C++20 features</b></li><li><small>03 / RESEARCH</small><b>Python workspace</b></li></ol><p>Conceptual illustration · not live market data</p></div></article></section>
    <section class="section container" id="projects" aria-labelledby="projects-heading"><div class="section-heading"><div><p class="eyebrow">02 / SELECTED PROJECTS</p><h2 id="projects-heading">Different problems. Same curiosity.</h2></div><p>Applied AI, embedded systems and the foundations of interactive software.</p></div><div class="project-filters" role="group" aria-label="Filter projects">${["All projects", ...new Set(projects.map((project) => project.category))].map((filter, i) => `<button type="button" data-filter="${e(filter)}" aria-pressed="${i === 0}">${e(filter)}</button>`).join("")}</div><p id="filter-status" class="sr-only" role="status" aria-live="polite"></p><div class="project-grid">${projects.map(projectCard).join("")}</div></section>
    <section class="section experience-section" id="experience"><div class="container">${sectionHeading("03 / EXPERIENCE", "Built with teams. Used by people.", "Production work across research, startups and business software.")}<div class="experience-list">${experience.map((job, i) => `<article class="experience-item"><div class="experience-date"><span>${e(job.dates)}</span><small>${e(job.location)}</small></div><div class="experience-body"><span class="experience-index" aria-hidden="true">0${i + 1}</span><h3>${e(job.role)}</h3><p class="company">${e(job.company)}</p><p>${e(job.description)}</p><ul>${job.highlights.map((h) => `<li>${e(h)}</li>`).join("")}</ul>${tags(job.tags)}</div></article>`).join("")}</div></div></section>
    <section class="section container" id="research">${sectionHeading("04 / RESEARCH & RECOGNITION", "Ideas beyond the codebase.", "Research, presentations and a few milestones along the way.")}<div class="research-preview"><div class="research-preview-art"><a href="/research/#coughsense"><img src="/art/coughsense-poster.webp" width="1900" height="1426" loading="lazy" alt="CoughSense research poster presented at NC State’s AI Student Symposium 2026"></a><span class="award-stamp">BEST<br>POSTER<br><small>NC STATE · 2026</small></span></div><div class="research-preview-copy"><p class="eyebrow">ON-DEVICE AI · AWARD-WINNING RESEARCH</p><h3>Small device.<br>Meaningful possibilities.</h3><p>CoughSense explores privacy-preserving cough detection on an Arduino microcontroller. Our team presented it at NC State’s AI Student Symposium 2026 and received the Best Poster Award.</p><a class="text-link" href="/research/">Research & publications ${arrow}</a><div class="conference-note"><span class="mini-icon" aria-hidden="true">↗</span><p><b>Also at CppCon 2026</b><br>C++20/pybind11 feature engineering for AEQUITAS. <a href="/cppcon/">About the presentation</a></p></div></div></div></section>
    <section class="section about-section" id="about"><div class="container about-grid"><div><p class="eyebrow">05 / THE PERSON BEHIND THE PROJECTS</p><div class="about-intro"><figure class="about-portrait"><a href="/art/adit-portrait.webp" target="_blank" rel="noopener noreferrer" aria-label="View full photo of Adit Shah (opens in a new tab)"><img src="/art/adit-portrait.webp" width="1200" height="1553" alt="Adit Shah" loading="lazy"></a></figure><h2>Hi, I’m Adit.<br><em>I like figuring things out.</em></h2></div><p class="lead">I’m a graduate student at NC State, working at the intersection of software engineering, systems and applied AI.</p><p>I enjoy taking an idea through the details that make it useful: connecting the data, building the interface and understanding the tradeoffs underneath. This semester, I’m getting closer to the hardware by building an engine and games in C++.</p><p>Away from the keyboard, you’ll often find me following cricket or exploring another interesting corner of technology.</p><div class="hero-socials">${external(profile.github, "GitHub")}${external(profile.linkedin, "LinkedIn")}${external(profile.scholar, "Google Scholar")}</div></div><div class="education-card"><p class="eyebrow">CURRENT CHAPTER</p><h3>North Carolina<br>State University</h3><p>MS in Computer Science</p><div class="education-stat"><span>Expected graduation</span><b>May 2027</b></div><div class="education-stat"><span>GPA</span><b>3.80 / 4.00</b></div><hr><p class="eyebrow">PREVIOUSLY</p><h4>Pandit Deendayal Energy University</h4><p>B.Tech, Computer Science & Engineering<br>2021–2025 · CGPA 9.39 / 10</p><div class="resume-access"><a class="resume-qr" href="${profile.resume}" target="_blank" rel="noopener" aria-label="Open Adit Shah’s current résumé (PDF, new tab)"><img src="/art/resume-qr.svg" width="128" height="128" loading="lazy" alt="QR code linking to Adit Shah’s current résumé"></a><div><p>Scan to open my résumé on your phone.</p><a class="text-link" href="${profile.resume}" download="Adit-Shah-Resume.pdf">Download résumé ↓</a><a class="text-link save-qr" href="/art/resume-qr.png" download="Adit-Shah-Resume-QR.png">Save QR code ↓</a></div></div></div></div></section>
    <section class="contact-section container" id="contact"><p class="eyebrow">NEXT CHAPTER / LET’S CONNECT</p><h2>Good things start<br>with a conversation<span>.</span></h2><p>I’m exploring new-grad opportunities in software development, software engineering, AI, and quantitative development or research for May 2027.</p><div class="hero-actions"><a class="button primary" href="mailto:${profile.email}">Say hello ${arrow}</a><a class="button secondary" href="/feedback/">Leave feedback ${arrow}</a></div><a class="contact-email" href="mailto:${profile.email}">${profile.email}</a></section>
  </main>${projectDialogs()}<dialog id="studio-dialog" class="studio-dialog" aria-label="Explore Adit’s studio"><button class="studio-exit button secondary" type="button">← Back to portfolio</button><div id="studio-mount"></div></dialog>`;
}

function aequitas() {
  return `<main id="main"><section class="page-hero container"><a class="back-link" href="/">← Back to the studio</a><p class="eyebrow">FEATURED PROJECT / QUANTITATIVE SOFTWARE</p><h1>AEQUITAS<span class="accent">.</span></h1><p class="page-lead">A research workspace for turning market data into quantitative insight.</p>${tags(["C++20", "pybind11", "Python", "FastAPI", "Next.js", "LangGraph", "WebSockets"])}<div class="hero-actions">${external(profile.aequitas, "Explore the platform", "button primary")}<a class="button secondary" href="#cppcon">C++20 & CppCon ↓</a></div></section>
    <section class="container aequitas-overview"><div class="project-thesis"><p class="eyebrow light">THE IDEA</p><h2>Connect the research workflow.<br><em>Go deeper on the computation.</em></h2><p>AEQUITAS brings market-data ingestion, financial models and AI-assisted strategy exploration together. My C++20/pybind11 work focuses on accelerating quantitative feature engineering within the Python-based platform.</p></div><div class="stack-grid"><article><span>01</span><h3>Market data</h3><p>Live equity data and WebSocket price streaming feed the research workspace.</p></article><article><span>02</span><h3>Financial models</h3><p>Risk and pricing methods including Monte Carlo VaR/CVaR, Black–Scholes Greeks and Kalman-filtered pairs trading.</p></article><article><span>03</span><h3>Research workflows</h3><p>A LangGraph pipeline supports strategy generation and critique alongside a Next.js interface.</p></article></div></section>
    <section class="section container" id="cppcon">${sectionHeading("C++20 / PYBIND11", "Accelerating feature engineering.", "The systems work behind my CppCon 2026 poster.")}<div class="technical-grid"><div><p class="eyebrow">CPPCON 2026 POSTER</p><h3 class="poster-title">Accelerating Quantitative Feature Engineering — A C++20/pybind11 Extension for a Python-Based Trading Research Platform</h3><p>The presentation explores moving quantitative feature computation into a C++20 extension while retaining a Python research workflow through pybind11.</p><p>This work is part of AEQUITAS, connecting my interest in quantitative software with C++ systems engineering.</p><a class="text-link" href="mailto:${profile.email}?subject=AEQUITAS%20C%2B%2B20%20feature%20engineering">Discuss the implementation ${arrow}</a></div><div class="architecture-card"><p class="eyebrow">INTEGRATION AT A GLANCE</p><ol class="architecture-flow"><li><span>Python</span><small>Research & orchestration</small></li><li><span>pybind11</span><small>Language bindings</small></li><li><span>C++20</span><small>Quantitative feature computation</small></li></ol><p class="caption">Conceptual integration, not a benchmark.</p></div></div></section>
    ${featureLab()}
    <section class="section container"><div class="reading-panel"><p class="eyebrow">ENGINEERING NOTES</p><h2>The interesting part is in the details.</h2><p>The extension creates a useful setting for discussing the boundary between Python productivity and native computation: data representation, interface design, numerical correctness and the cost of moving data between runtimes.</p><p>Detailed implementation notes, reproducible benchmarks and the CppCon poster will be linked here when available.</p><div class="hero-actions">${external(profile.aequitas, "Visit AEQUITAS", "button primary")}<a class="button secondary" href="/cppcon/">Meet at CppCon ${arrow}</a></div></div></section>
  </main>`;
}

function awardFeatures() {
  const stamps = {
    coughsense: "BEST<br>POSTER",
    wolftrace: "2ND<br>PLACE",
    wolfvest: "SNOWFLAKE<br>API",
  };
  return `<div class="achievement-list">${awards
    .map(
      (
        award,
      ) => `<article class="achievement-story" id="achievement-${e(award.id)}" aria-label="${e(award.project)} — ${e(award.title)}">
    <div class="achievement-art achievement-art-${e(award.id)}"><a href="${e(award.imageHref || award.eventUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${e(award.imageHref ? "Open CoughSense poster PDF" : "Visit " + award.event + " event page")} (new tab)"><img src="${award.image}" width="${award.imageWidth}" height="${award.imageHeight}" loading="lazy" alt="${e(award.imageAlt)}"></a>${award.eventUrl ? `<div class="achievement-art-caption"><b>${e(award.event)}</b><span>${e(award.institution)}</span></div>` : ""}<span class="achievement-stamp" aria-hidden="true">${stamps[award.id]}<small>${award.year}</small></span></div>
    <div class="achievement-copy"><p class="eyebrow">${e(award.category)}</p><h3>${e(award.headline)}</h3><p class="achievement-result">${e(award.project)} · ${e(award.title)}</p><p>${e(award.description)}</p>${award.id === "coughsense" ? `<a class="text-link" href="${award.href}">${e(award.linkText)} ${arrow}</a>` : `<button class="text-link" type="button" data-project="${e(award.id)}" aria-haspopup="dialog">${e(award.linkText)} ${arrow}</button>`}<p class="achievement-note">${e(award.note)}</p></div>
  </article>`,
    )
    .join("")}</div>`;
}

function achievements() {
  return `<main id="main"><section class="page-hero container achievements-hero"><a class="back-link" href="/">← Back to the world</a><p class="eyebrow">ACHIEVEMENTS / HACKATHONS & RESEARCH</p><h1>Ideas beyond<br><em>the codebase.</em></h1><p class="page-lead">Research, team projects and recognition for the work.</p></section><section class="section container recognition-section" id="awards" aria-label="Awards">${awardFeatures()}<article class="achievement-milestone"><span class="milestone-rank">TOP 5 <small>of 75 projects</small></span><div><p class="eyebrow">SMART INDIA HACKATHON</p><h3>WattWatch</h3><p>Recognized for a full-stack IoT application for energy and water tracking.</p></div><button class="text-link" type="button" data-project="wattwatch" aria-haspopup="dialog">Explore WattWatch ${arrow}</button></article><a class="button secondary" href="/research/">Research, publications & posters ${arrow}</a></section></main>`;
}

function contact() {
  return `<main id="main"><section class="page-hero container contact-hero"><a class="back-link" href="/">← Back to the world</a><p class="eyebrow">CONTACT / ADIT SHAH</p><h1>Let’s start<br><em>a conversation.</em></h1><p class="page-lead">Have a role in mind, a project to discuss, or just want to say hello? Here’s how to reach me.</p><p class="availability"><span class="status-dot" aria-hidden="true"></span> Open to new-grad roles · Graduating May 2027</p></section><section class="container contact-options" aria-label="Ways to contact Adit"><article class="contact-primary"><p class="eyebrow">EMAIL ME</p><a class="direct-email" href="mailto:${profile.email}">${profile.email}</a><p>For opportunities, introductions and project conversations.</p><p>Personal email: <a href="mailto:${profile.personalEmail}">${profile.personalEmail}</a></p><div class="hero-actions"><a class="button primary" href="mailto:${profile.email}?subject=Hello%20Adit">Email Adit ${arrow}</a><button class="button secondary" type="button" data-copy-email>Copy email address</button></div><p class="copy-email-status" role="status"></p><noscript><p>You can also select and copy the email address above.</p></noscript></article><article class="contact-secondary"><p class="eyebrow">CONNECT ON LINKEDIN</p><h2>Keep in touch.</h2><p>Connect with me and continue the conversation.</p>${external(profile.linkedin, "Open LinkedIn", "button secondary")}</article><article class="contact-note"><div><h2>Have feedback on the portfolio?</h2><p>Ideas, suggestions and comments are welcome.</p></div><a class="text-link" href="/feedback/">Leave a note ${arrow}</a></article></section><section class="container contact-interests"><p class="eyebrow">WHAT I’M LOOKING FOR</p><p>Software development, software engineering, AI, and quantitative developer or researcher roles.</p><div class="hero-socials">${external(profile.github, "GitHub")}${external(profile.scholar, "Google Scholar")}<a class="text-link" href="${profile.resume}" download>Download résumé ↓</a></div></section></main>`;
}

function research() {
  return `<main id="main"><section class="page-hero container"><a class="back-link" href="/">← Back to the studio</a><p class="eyebrow">RESEARCH / PRESENTATIONS / RECOGNITION</p><h1>Questions worth<br><em>working on.</em></h1><p class="page-lead">Applied research, shared ideas and lessons from taking a prototype into the real world.</p>${external(profile.scholar, "Google Scholar", "button primary")}</section>
    <section class="section container recognition-section" id="awards"><a class="button secondary" href="/achievements/">View achievements ${arrow}</a></section>
    <section class="section container" id="coughsense"><div class="award-banner"><span aria-hidden="true">✦</span><div><b>Best Poster Award</b><p>NC State · AI Student Symposium 2026</p></div></div><div class="technical-grid"><div><p class="eyebrow">EMBEDDED MACHINE LEARNING</p><h2>CoughSense</h2><p class="lead">Arduino TinyML-based real-time cough detection.</p><p>A team prototype exploring cough detection entirely on an Arduino Nano 33 BLE Sense, keeping audio on the device. The workflow combines Coswara audio data, Mel Filterbank Energy features, a convolutional neural network and Edge Impulse deployment.</p><p><b>Authors:</b> Adit Shah, Darsh Rank and Pratham Patel<br><b>Course:</b> CSC 542 · NC State</p>${tags(["TinyML", "Arduino Nano 33 BLE Sense", "MFE", "CNN", "Edge Impulse"])}<a class="button primary" href="/documents/coughsense-poster.pdf" target="_blank" rel="noopener">Read the poster ${arrow}<span class="sr-only"> (PDF, new tab)</span></a></div><a class="poster-preview" href="/documents/coughsense-poster.pdf" target="_blank" rel="noopener"><img src="/art/coughsense-poster.webp" width="1900" height="1426" alt="CoughSense poster showing the audio processing pipeline, neural network architecture and evaluation results"><span>Open full-resolution poster (PDF) ${arrow}</span></a></div><div class="research-takeaways"><article><h3>Why on-device?</h3><p>Local inference avoids sending raw audio to a remote server.</p></article><article><h3>What did we explore?</h3><p>Audio features, augmentation and neural-network deployment on constrained hardware.</p></article><article><h3>What’s next?</h3><p>More investigation into robustness, evaluation and resource tradeoffs beyond the prototype.</p></article></div></section>
    <section class="section container" id="publications">${sectionHeading("PUBLICATIONS", "Written & published.", "Publication records and citation details are available on Google Scholar.")}<div class="publication-list">${publications.map((p, i) => `<article><span class="publication-year">${p.year}</span><div><p class="eyebrow">${e(p.venue)}</p><h3>${e(p.title)}</h3></div>${external(profile.scholar, `Scholar<span class="sr-only"> record for publication ${i + 1}</span>`)}</article>`).join("")}</div></section>
    <section class="section container"><div class="conference-card"><p class="eyebrow">CONFERENCE PRESENTATION</p><h2>CppCon 2026</h2><p class="lead">Accelerating Quantitative Feature Engineering — A C++20/pybind11 Extension for a Python-Based Trading Research Platform</p><p>Part of AEQUITAS, my quantitative research platform.</p><a class="text-link" href="/aequitas/#cppcon">Explore the work ${arrow}</a></div></section></main>`;
}

function feedback() {
  return `<main id="main"><section class="page-hero container"><a class="back-link" href="/">← Back to the studio</a><p class="eyebrow">THE STUDIO MAILBOX</p><h1>A thought?<br><em>I’m all ears.</em></h1><p class="page-lead">A suggestion, something that didn’t work, or an idea we should build together. I’d love to hear it.</p></section><section class="container feedback-layout"><div class="feedback-aside"><div class="mailbox-illustration" aria-hidden="true"><span>✉</span></div><h2>A private note to me.</h2><p>Your message is not published on the site. Name and email are optional; include an email if you’d like a reply.</p><p>Prefer your own inbox?<br><a class="text-link" href="mailto:${profile.email}">${profile.email} ${arrow}</a></p><a href="/privacy/">How your message is handled</a></div><form id="feedback-form" class="feedback-form" aria-describedby="feedback-mode"><p id="feedback-mode" class="form-mode">Preparing the mailbox…</p><label for="category">What’s on your mind?</label><select id="category" name="category"><option value="suggestion">A suggestion</option><option value="issue">Something isn’t working</option><option value="comment">A general comment</option><option value="collaboration">A collaboration or opportunity</option></select><label for="message">Your message <span>(required)</span></label><textarea id="message" name="message" rows="6" minlength="10" maxlength="3000" required placeholder="What would you like to share?" aria-describedby="message-count"></textarea><p class="field-hint" id="message-count">10–3,000 characters</p><div class="form-row"><div><label for="name">Name <span>(optional)</span></label><input id="name" name="name" autocomplete="name" maxlength="100" placeholder="Your name"></div><div><label for="email">Email <span>(optional)</span></label><input id="email" name="email" type="email" autocomplete="email" maxlength="254" placeholder="you@example.com"></div></div><div class="honeypot" aria-hidden="true"><label for="website">Leave this field empty</label><input id="website" name="_gotcha" tabindex="-1" autocomplete="off"></div><button id="feedback-submit" class="button primary" type="submit">Continue in email ${arrow}</button><p id="feedback-status" role="status" aria-live="polite"></p><div id="email-fallback" hidden><p>Your email draft is ready. Review it and press Send in your email app.</p><a class="button secondary" id="email-draft" href="mailto:${profile.email}">Open email draft ${arrow}</a><button class="text-link" id="copy-feedback" type="button">Copy message</button></div><noscript><p>This form needs JavaScript. Please <a href="mailto:${profile.email}">email your feedback directly</a>.</p></noscript></form></section></main>`;
}

function privacy() {
  return `<main id="main"><section class="page-hero container"><a class="back-link" href="/">← Back to the studio</a><p class="eyebrow">PRIVACY</p><h1>A small site.<br><em>A clear policy.</em></h1></section><article class="reading-panel container privacy-copy"><h2>Analytics</h2><p>This version of the portfolio does not load PostHog, Google Analytics, session recording or advertising trackers. A future analytics integration will be documented here before it is enabled.</p><h2>Your feedback</h2><p>Feedback is private and intended for Adit Shah. If the form says “Send private note,” your message, category and any name or email you provide are sent to Formspree for delivery. Formspree may process technical information for delivery and spam prevention. Please see <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">Formspree’s privacy policy (new tab)</a>.</p><p>If the form says “Continue in email,” it prepares an email draft on your device. You review and send it through your own email app. Preparing a draft does not submit feedback.</p><p>Your name and email are optional for the web form. An email sent through your email app will include your sender address. Please avoid including sensitive information in either channel.</p><h2>Storage and hosting</h2><p>The site does not store your feedback in browser storage. Your hosting provider may process routine request logs. External links, including Google Scholar and GitHub, have their own privacy practices.</p><h2>Questions or deletion requests</h2><p>Contact <a href="mailto:${profile.email}">${profile.email}</a> about your message or personal information.</p></article></main>`;
}

function cppcon() {
  return `<main id="main"><section class="page-hero container"><a class="back-link" href="/">← Back to the portfolio</a><p class="eyebrow">MEET ME AT / CPPCON 2026</p><h1>Let’s talk C++.<br><em>And what it can build.</em></h1><p class="page-lead">I’m Adit Shah, an NC State MS Computer Science student presenting work from AEQUITAS and exploring new-grad opportunities for May 2027.</p></section><section class="container section"><div class="conference-card"><p class="eyebrow">MY POSTER PRESENTATION</p><h2>Accelerating Quantitative Feature Engineering</h2><p class="lead">A C++20/pybind11 Extension for a Python-Based Trading Research Platform</p><p>This work is part of AEQUITAS. It explores C++20 feature computation connected to a Python research workflow through pybind11.</p><div class="hero-actions"><a class="button primary" href="/aequitas/#cppcon">Explore AEQUITAS ${arrow}</a><a class="button secondary" href="mailto:${profile.email}?subject=Hello%20from%20CppCon">Continue the conversation ${arrow}</a></div></div></section><section class="container conference-followup"><h2>More of what I build</h2><p>My work also spans full-stack applications, applied AI, embedded research and C++ game-engine coursework.</p><div class="hero-actions"><a class="text-link" href="/#projects">Selected projects ${arrow}</a><a class="text-link" href="/#experience">Experience ${arrow}</a><a class="text-link" href="${profile.resume}" download>Download résumé ↓</a></div></section></main>`;
}

function gameHome() {
  const overview = home();
  const section = (id) => {
    const expression = new RegExp(
      `<section\\b[^>]*\\bid="${id}"[\\s\\S]*?</section>`,
    );
    const match = overview.match(expression);
    if (!match) throw new Error(`Missing portfolio section: ${id}`);
    return match[0];
  };
  const panelPage = (html) =>
    html
      .replace(/<main id="main"[^>]*>/, '<div class="panel-page">')
      .replace("</main>", "</div>")
      .replace(/<h1([ >])/g, "<h2$1")
      .replaceAll("</h1>", "</h2>");
  const panels = {
    aequitas: panelPage(aequitas()),
    research: panelPage(achievements()),
    publications: panelPage(research()),
    experience: section("experience"),
    projects: section("projects"),
    about: section("about"),
    feedback: panelPage(feedback()),
    contact: panelPage(contact()),
    resume: `<section class="game-resume"><p class="eyebrow">READY FOR THE NEXT CHAPTER</p><h3>Adit Shah</h3><p class="lead">MS Computer Science · NC State<br>Graduating May 2027</p><p>Exploring new-grad opportunities in software engineering, AI, and quantitative development or research.</p><div class="game-resume-actions"><a class="button primary" href="${profile.resume}" target="_blank" rel="noopener">Open résumé PDF ↗</a><a class="button secondary" href="${profile.resume}" download="Adit-Shah-Resume.pdf">Download résumé ↓</a></div><div class="game-resume-qr"><a class="game-qr-link" href="${profile.resume}" target="_blank" rel="noopener"><img src="/art/resume-qr.svg" width="180" height="180" alt="QR code for Adit Shah’s current résumé"></a><div><p>Take it with you.<br>Scan to open on your phone.</p><a class="text-link" href="/art/resume-qr.png" download="Adit-Shah-Resume-QR.png">Save QR code ↓</a></div></div><a class="text-link" href="mailto:${profile.email}">${profile.email} ↗</a></section>`,
  };
  return renderGame(panels) + projectDialogs();
}

export function renderPage(page) {
  if (page === "home") return gameHome();
  const renderers = {
    overview: home,
    aequitas,
    research,
    achievements,
    feedback,
    contact,
    privacy,
    cppcon,
    404: () =>
      '<main id="main" class="page-hero container"><p class="eyebrow">404 / A SMALL DETOUR</p><h1>This room<br>doesn’t exist.</h1><p class="page-lead">Let’s get you back to familiar ground.</p><a class="button primary" href="/">Back to the studio ←</a></main>',
  };
  if (!pages[page]) throw new Error(`Unknown page: ${page}`);
  return (
    header(page) +
    renderers[page]() +
    (page === "achievements" ? projectDialogs() : "") +
    footer()
  );
}
