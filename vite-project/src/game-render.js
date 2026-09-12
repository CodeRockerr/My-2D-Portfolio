import { STATIONS } from "./game-world.js";
import { profile } from "./content.js";

export function renderGame(panels) {
  return `<a class="skip-link" href="/overview/">Skip to content</a>
  <main id="main" class="game-screen">
    <div class="game-viewport" tabindex="0" role="group" aria-label="Adit’s playable portfolio" aria-describedby="game-instructions">
      <div class="game-map"><img class="game-map-art" src="/art/game-map.webp" width="1536" height="1024" alt="A top-down pixel-art workshop with glowing terminals, a trophy shelf, a workbench, arcade games, an armchair, a résumé desk and a mailbox." fetchpriority="high">
      ${STATIONS.map((station) => `<a class="game-object" href="${station.href}" data-hotspot="${station.id}" tabindex="-1" aria-label="Open ${station.title}" style="left:${station.bounds.left}%;top:${station.bounds.top}%;width:${station.bounds.right - station.bounds.left}%;height:${station.bounds.bottom - station.bounds.top}%"></a>`).join("")}
      ${STATIONS.map((station) => `<a class="game-station" href="${station.href}" data-station="${station.id}" style="left:${station.x}%;top:${station.y}%" aria-label="Explore ${station.title}"><span class="station-spark" aria-hidden="true">✦</span><span class="station-sign" aria-hidden="true">${station.number}</span><span class="station-tooltip">${station.title}</span></a>`).join("")}
      <div class="game-avatar" aria-hidden="true"><span class="game-avatar-shadow"></span><span class="game-avatar-sprite"></span><span class="game-avatar-tag">ADIT <span>▼</span></span><span class="game-avatar-prompt" hidden><kbd>E</kbd> Open</span></div><div class="game-destination" aria-hidden="true"></div><div class="terminal-glow" aria-hidden="true"></div>
      </div>
    </div>
    <header class="game-hud"><div class="game-id"><span class="game-id-icon" aria-hidden="true">A<span>.</span></span><div><h1>Adit’s world<span class="pixel-star" aria-hidden="true">✦</span></h1><p>Software · AI · Quant<span class="game-graduation"> | May 2027</span></p></div></div><div class="game-menu-buttons"><a class="pixel-button contact-shortcut" data-open-station="contact" href="/contact/">Contact Adit</a><button type="button" class="pixel-button" id="quick-travel-toggle" aria-expanded="false" aria-controls="quick-travel">Quick travel <kbd>M</kbd></button><a class="pixel-button achievements-shortcut" href="/achievements/" data-open-station="research">Achievements</a><a class="pixel-button read-mode" href="/overview/">Read portfolio <span aria-hidden="true">↗</span></a></div></header>
    <nav class="quick-travel" id="quick-travel" aria-label="Quick travel" hidden><p class="pixel-caption">CHOOSE A DESTINATION</p>${STATIONS.map((station) => `<a href="${station.href}" data-open-station="${station.id}"><span>${station.number}</span><div><b>${station.title}</b><small>${station.object}</small></div><i aria-hidden="true">↗</i></a>`).join("")}<a href="/research/" data-open-station="publications"><span>↗</span><div><b>Research & publications</b><small>CoughSense, papers and CppCon</small></div></a><a href="/feedback/" data-open-station="feedback"><span>↗</span><div><b>Feedback & suggestions</b><small>Share a note about the portfolio</small></div></a><a class="quick-read-link" href="/overview/">Read the portfolio as a page ↗</a></nav>
    <nav class="station-dock" aria-label="Explore the studio"><div class="dock-intro"><p class="pixel-caption">MAKE YOURSELF AT HOME</p><h2>Explore the studio</h2><p>Walk around, click an object, or choose a section below.</p></div><div class="dock-stations">${STATIONS.map((station) => `<a href="${station.href}" data-open-station="${station.id}"><span>${station.number}</span><b>${station.title}</b><i aria-hidden="true">↗</i></a>`).join("")}</div><p class="dock-progress">Stations explored <span id="discovery-count">0 / 7</span></p></nav>
    <aside class="game-welcome" hidden role="status"><h2></h2><p></p></aside>
    <footer class="game-footer">
      <div class="game-footer-contact"><p id="game-instructions"><span class="desktop-controls"><kbd>WASD</kbd> / arrows to move · </span>Click objects to explore</p><div class="game-footer-emails" aria-label="Email Adit"><a href="mailto:${profile.email}">${profile.email}</a><a href="mailto:${profile.personalEmail}">${profile.personalEmail}</a></div></div>
      <div class="game-interaction"><button type="button" id="interact" class="interact-button" disabled><kbd>E</kbd><span id="interaction-label">Explore the room</span></button><p id="station-hint" role="status">Click objects · E nearby</p></div>
      <div class="touch-dpad" role="group" aria-label="Movement controls"><button type="button" data-direction="up" aria-label="Move up">↑</button><button type="button" data-direction="left" aria-label="Move left">←</button><button type="button" data-direction="down" aria-label="Move down">↓</button><button type="button" data-direction="right" aria-label="Move right">→</button></div>
      <div class="game-footer-tools"><p>Check out my résumé</p><div class="footer-resume-links"><a href="${profile.resume}" data-open-station="resume">View résumé ↗</a><a href="${profile.resume}" download="Adit-Shah-Resume.pdf">Download ↓</a></div></div>
    </footer>
    <noscript><div class="game-nojs">Explore using the station links, or <a href="/overview/">read the complete portfolio</a>. Enable JavaScript to walk around.</div></noscript>
  </main>
  <dialog class="station-dialog" id="station-dialog" aria-labelledby="station-panel-title"><header class="station-panel-header"><div><p id="station-panel-object" class="pixel-caption"></p><h2 id="station-panel-title"></h2></div><button type="button" class="pixel-button station-close">Back to game <kbd>Esc</kbd></button></header><div id="station-panel-body" class="station-panel-body"></div></dialog>
  ${Object.entries(panels)
    .map(([id, html]) => `<template id="panel-${id}">${html}</template>`)
    .join("")}`;
}
