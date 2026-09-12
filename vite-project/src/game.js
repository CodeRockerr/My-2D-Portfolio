import {
  STATIONS,
  DESTINATIONS,
  canWalk,
  distance,
  movePlayer,
  interactiveStation,
  findPath,
} from "./game-world.js";

export function setupGame({ onPanelOpen = () => {} } = {}) {
  const viewport = document.querySelector(".game-viewport");
  if (!viewport) return;
  const map = viewport.querySelector(".game-map");
  const avatar = viewport.querySelector(".game-avatar");
  const sprite = avatar.querySelector(".game-avatar-sprite");
  const destination = viewport.querySelector(".game-destination");
  const dialog = document.getElementById("station-dialog");
  const body = document.getElementById("station-panel-body");
  const interact = document.getElementById("interact");
  const quickTravel = document.getElementById("quick-travel");
  const travelToggle = document.getElementById("quick-travel-toggle");
  const welcome = document.querySelector(".game-welcome");
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  const directions = {
    ArrowUp: "up",
    w: "up",
    ArrowDown: "down",
    s: "down",
    ArrowLeft: "left",
    a: "left",
    ArrowRight: "right",
    d: "right",
  };
  const rows = { down: 0, left: 1, right: 2, up: 3 };
  // Measured alpha bounds of the unmodified 4×4 sheet. Align feet and visible
  // height, rather than assuming generated figures are centered in each cell.
  const frameBounds = [
    [113, 42, 251, 285],
    [90, 43, 229, 291],
    [74, 42, 213, 291],
    [61, 42, 200, 291],
    [110, 32, 253, 287],
    [86, 32, 229, 284],
    [70, 29, 215, 287],
    [60, 31, 203, 283],
    [108, 26, 253, 285],
    [84, 26, 230, 282],
    [76, 25, 223, 285],
    [50, 25, 198, 281],
    [113, 18, 248, 259],
    [91, 17, 225, 265],
    [77, 17, 212, 265],
    [64, 17, 200, 265],
  ];
  const held = new Set(),
    visited = new Set();
  let position = { x: 50, y: 58 },
    facing = "down",
    path = [];
  let frameId = 0,
    previousTime = 0,
    frameClock = 0;
  let near = null,
    activeStation = null,
    returnFocus = viewport;

  function closeTravel() {
    quickTravel.hidden = true;
    travelToggle.setAttribute("aria-expanded", "false");
  }
  function toggleTravel() {
    const open = quickTravel.hidden;
    quickTravel.hidden = !open;
    travelToggle.setAttribute("aria-expanded", String(open));
    stop();
    if (open) quickTravel.querySelector("a").focus();
    else viewport.focus({ preventScroll: true });
  }
  function dismissWelcome() {
    welcome.hidden = true;
  }
  function clearRoute() {
    path = [];
    destination.hidden = true;
  }
  function stop() {
    held.clear();
    clearRoute();
    cancelAnimationFrame(frameId);
    frameId = 0;
    paint(false);
  }
  function camera() {
    const { width, height } = viewport.getBoundingClientRect();
    const scale = Math.max(
      0.01,
      Math.min((width - 16) / 1536, (height - 16) / 1024),
    );
    const x = (width - 1536 * scale) / 2;
    const y = (height - 1024 * scale) / 2;
    map.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    viewport.dataset.cameraScale = scale.toFixed(3);
    map.style.setProperty("--label-scale", 1 / scale);
  }

  function paint(moving = false, now = 0) {
    avatar.style.left = `${position.x}%`;
    avatar.style.top = `${position.y}%`;
    avatar.dataset.x = position.x.toFixed(2);
    avatar.dataset.y = position.y.toFixed(2);
    const column = moving ? Math.floor(now / 140) % 4 : 0;
    const row = rows[facing];
    const index = row * 4 + column;
    const [left, top, right, bottom] = frameBounds[index];
    const factor = 132 / (bottom - top);
    const cell = 313.5 * factor;
    sprite.dataset.frame = String(index);
    sprite.dataset.facing = facing;
    sprite.style.width = `${cell}px`;
    sprite.style.height = `${cell}px`;
    sprite.style.left = `${82 - ((left + right) / 2) * factor}px`;
    sprite.style.top = `${141 - bottom * factor}px`;
    sprite.style.backgroundPosition = `${(column * 100) / 3}% ${(row * 100) / 3}%`;
    avatar.classList.toggle("walking", moving);
    const candidate = interactiveStation(position, facing);
    if (candidate !== near) {
      near = candidate;
      interact.disabled = !near;
      avatar.querySelector(".game-avatar-prompt").hidden = !near;
      document.getElementById("interaction-label").textContent = near
        ? `Explore ${near.title}`
        : "Explore the room";
      document.getElementById("station-hint").textContent = near
        ? near.blurb
        : "Click objects · E nearby";
      document
        .querySelectorAll(".game-station, .dock-stations a")
        .forEach((link) => {
          const selected =
            (link.dataset.station || link.dataset.openStation) === near?.id;
          link.classList.toggle("nearby", selected);
        });
    }
  }
  function openStation(id, { updateHash = true } = {}) {
    const station = DESTINATIONS.find((entry) => entry.id === id);
    if (!station) return;
    stop();
    dismissWelcome();
    closeTravel();
    returnFocus = document.activeElement?.closest(".game-screen")
      ? document.activeElement
      : viewport;
    activeStation = id;
    document.getElementById("station-panel-title").textContent = station.title;
    document.getElementById("station-panel-object").textContent =
      `${station.number} / ${station.object}`;
    body.replaceChildren(
      document.getElementById(`panel-${id}`).content.cloneNode(true),
    );
    body.scrollTop = 0;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector(".station-close").focus({ preventScroll: true });
    if (STATIONS.some((entry) => entry.id === id)) visited.add(id);
    document.getElementById("discovery-count").textContent =
      `${visited.size} / ${STATIONS.length}`;
    document
      .querySelectorAll(`[data-open-station="${id}"], [data-station="${id}"]`)
      .forEach((node) => node.classList.add("discovered"));
    if (updateHash) history.pushState({ station: id }, "", `#${id}`);
    onPanelOpen(id, body);
  }
  function tick(now) {
    // The first RAF timestamp can precede performance.now() from this frame.
    // A negative step against a zero-length starting waypoint would divide by zero.
    const dt = Math.max(0, Math.min((now - previousTime) / 1000 || 0, 0.04));
    previousTime = now;
    frameClock = now;
    const old = { ...position };
    let dx = Number(held.has("right")) - Number(held.has("left"));
    let dy = Number(held.has("down")) - Number(held.has("up"));
    if (dx || dy) {
      clearRoute();
      const length = Math.hypot(dx, dy);
      position = movePlayer(
        position,
        (dx / length) * dt * 16,
        (dy / length) * dt * 24,
      );
    } else if (path.length) {
      const next = path[0],
        length = distance(position, next),
        travel = dt * 24;
      if (length <= travel) {
        position = next;
        path.shift();
      } else
        position = {
          x: position.x + ((next.x - position.x) / length) * travel,
          y: position.y + ((next.y - position.y) / length) * travel,
        };
      dx = position.x - old.x;
      dy = position.y - old.y;
    }
    const moving = distance(position, old) > 0.001;
    if (moving) {
      facing =
        Math.abs(dx * 1.5) > Math.abs(dy)
          ? dx > 0
            ? "right"
            : "left"
          : dy > 0
            ? "down"
            : "up";
      dismissWelcome();
    }
    paint(moving, now);
    if (held.size || path.length) frameId = requestAnimationFrame(tick);
    else {
      frameId = 0;
      destination.hidden = true;
      paint(false, now);
    }
  }
  function start() {
    if (!frameId) {
      previousTime = performance.now();
      frameId = requestAnimationFrame(tick);
    }
  }
  function travel(point) {
    const route = findPath(position, point);
    if (!route.length) return;
    held.clear();
    path = route;
    destination.hidden = false;
    destination.style.left = `${point.x}%`;
    destination.style.top = `${point.y}%`;
    dismissWelcome();
    closeTravel();
    viewport.focus({ preventScroll: true });
    start();
  }
  viewport.addEventListener("pointerdown", (event) => {
    if (event.target.closest("a,button") || event.button !== 0) return;
    const rect = map.getBoundingClientRect();
    const point = {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    };
    if (canWalk(point)) travel(point);
  });
  document.querySelectorAll("[data-station], [data-hotspot]").forEach((link) =>
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      openStation(link.dataset.station || link.dataset.hotspot);
    }),
  );
  document.querySelectorAll("[data-open-station]").forEach((link) =>
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      openStation(link.dataset.openStation);
    }),
  );
  document.addEventListener("keydown", (event) => {
    if (
      document.querySelector("dialog[open]") ||
      event.target.closest("input,textarea,select") ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    )
      return;
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (key === "m" && !event.repeat) {
      event.preventDefault();
      toggleTravel();
      return;
    }
    if (key === "Escape") {
      closeTravel();
      stop();
      viewport.focus({ preventScroll: true });
      return;
    }
    if (!quickTravel.hidden) return;
    if (directions[key]) {
      event.preventDefault();
      held.add(directions[key]);
      start();
    }
    if (
      (key === "e" || (key === "Enter" && event.target === viewport)) &&
      near
    ) {
      event.preventDefault();
      openStation(near.id);
    }
  });
  window.addEventListener("keyup", (event) =>
    held.delete(
      directions[event.key.length === 1 ? event.key.toLowerCase() : event.key],
    ),
  );
  document.querySelectorAll("[data-direction]").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      held.add(button.dataset.direction);
      start();
    });
    for (const name of ["pointerup", "pointercancel", "lostpointercapture"])
      button.addEventListener(name, () =>
        held.delete(button.dataset.direction),
      );
  });
  interact.addEventListener("click", () => {
    if (near) openStation(near.id);
  });
  travelToggle.addEventListener("click", toggleTravel);
  dialog
    .querySelector(".station-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    activeStation = null;
    body.replaceChildren();
    if (DESTINATIONS.some((s) => `#${s.id}` === location.hash))
      history.replaceState(null, "", location.pathname + location.search);
    (returnFocus?.isConnected && returnFocus.getClientRects().length
      ? returnFocus
      : viewport
    ).focus({
      preventScroll: true,
    });
  });
  // Reuse the same in-game panels when following internal links in their content.
  dialog.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (
      !link ||
      link.target ||
      link.hasAttribute("download") ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    )
      return;
    const url = new URL(link.href);
    if (url.origin !== location.origin) return;
    let id = DESTINATIONS.find(
      (station) =>
        (url.pathname === "/" && url.hash === `#${station.id}`) ||
        station.href === url.pathname,
    )?.id;
    if (url.pathname === "/overview/" && url.hash)
      id = DESTINATIONS.find((station) => url.hash === `#${station.id}`)?.id;
    if (id) {
      event.preventDefault();
      if (activeStation !== id) openStation(id);
      const anchorId = url.hash.slice(1);
      if (anchorId && anchorId !== id) {
        const target = body.querySelector(`[id="${CSS.escape(anchorId)}"]`);
        target?.scrollIntoView({
          block: "start",
          behavior: media.matches ? "instant" : "smooth",
        });
      }
    }
  });
  function followHash() {
    const hash = location.hash.slice(1);
    const id = hash === "achievements" ? "research" : hash;
    if (DESTINATIONS.some((station) => station.id === id)) {
      if (activeStation !== id) openStation(id, { updateHash: false });
    } else if (dialog.open) dialog.close();
  }
  window.addEventListener("hashchange", followHash);
  window.addEventListener("popstate", followHash);
  window.addEventListener("resize", () => paint(false, frameClock));
  new ResizeObserver(() => camera()).observe(viewport);
  window.addEventListener("blur", stop);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
  });
  map.querySelector("img").addEventListener("error", () => {
    welcome.dataset.error = "true";
    welcome.hidden = false;
    welcome.querySelector("h2").textContent = "The map couldn’t load.";
    welcome.querySelector("p").textContent =
      "Quick travel still opens every part of the portfolio.";
  });
  destination.hidden = true;
  camera();
  paint();
  followHash();
  document.body.classList.add("game-ready");
}
