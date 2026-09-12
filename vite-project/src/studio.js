import { inFloor, stepTowards } from "./studio-math.js";

export function setupStudio() {
  const world = document.querySelector(".studio-world");
  if (!world) return;
  const player = world.querySelector(".studio-player");
  const sprite = world.querySelector(".player-sprite");
  const marker = world.querySelector(".walk-target");
  const help = document.querySelector(".studio-help-toggle");
  const shell = document.querySelector(".studio-shell");
  const expand = document.querySelector(".studio-expand");
  const dialog = document.getElementById("studio-dialog");
  const home = shell.parentElement;
  const placeholder = document.createComment("studio home position");
  shell.before(placeholder);
  const movementKeys = new Set([
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "w",
    "a",
    "s",
    "d",
  ]);
  const keys = new Set();
  const stations = [
    { x: 39, y: 45, href: "/aequitas/" },
    { x: 65, y: 46, href: "/research/" },
    { x: 30, y: 63, href: "/#projects" },
    { x: 75, y: 73, href: "/feedback/" },
  ];
  let position = { x: 51, y: 70 },
    target = null,
    frame = 0,
    previousTime = 0;

  function paint(moving = false, time = 0, dx = 0) {
    player.style.left = `${position.x}%`;
    player.style.top = `${position.y}%`;
    player.classList.toggle("moving", moving);
    const index = moving ? 1 + (Math.floor(time / 150) % 2) : 0;
    sprite.style.backgroundPosition = `${(index * 100) / 3}% 0`;
    if (moving && dx) sprite.style.transform = dx < 0 ? "scaleX(-1)" : "none";
  }
  function stop() {
    keys.clear();
    target = null;
    cancelAnimationFrame(frame);
    frame = 0;
    marker.style.display = "none";
    paint();
  }
  function tick(time) {
    const dt = Math.min((time - previousTime) / 1000 || 0, 0.05);
    previousTime = time;
    const old = { ...position };
    const dx =
      Number(keys.has("ArrowRight") || keys.has("d")) -
      Number(keys.has("ArrowLeft") || keys.has("a"));
    const dy =
      Number(keys.has("ArrowDown") || keys.has("s")) -
      Number(keys.has("ArrowUp") || keys.has("w"));
    if (dx || dy) {
      target = null;
      marker.style.display = "none";
      const length = Math.hypot(dx, dy);
      const next = {
        x: position.x + (dx / length) * dt * 17,
        y: position.y + (dy / length) * dt * 24,
      };
      if (inFloor(next)) position = next;
      else if (inFloor({ x: next.x, y: position.y })) position.x = next.x;
      else if (inFloor({ x: position.x, y: next.y })) position.y = next.y;
    } else if (target) {
      position = stepTowards(position, target, dt * 24);
      if (Math.hypot(position.x - target.x, position.y - target.y) < 0.1) {
        target = null;
        marker.style.display = "none";
      }
    }
    const moving = Math.hypot(position.x - old.x, position.y - old.y) > 0.001;
    paint(moving, time, position.x - old.x);
    if (keys.size || target) frame = requestAnimationFrame(tick);
    else {
      frame = 0;
      paint();
    }
  }
  function start() {
    if (!frame) {
      previousTime = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }
  help.addEventListener("click", () => {
    const expanded = help.getAttribute("aria-expanded") !== "true";
    help.setAttribute("aria-expanded", String(expanded));
    document.getElementById("studio-controls").hidden = !expanded;
  });
  expand.addEventListener("click", () => {
    document.getElementById("studio-mount").append(shell);
    dialog.showModal();
    world.focus({ preventScroll: true });
  });
  dialog
    .querySelector(".studio-exit")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    stop();
    home.insertBefore(shell, placeholder.nextSibling);
    expand.focus({ preventScroll: true });
  });
  dialog.addEventListener("click", (event) => {
    if (event.target.closest("a")) dialog.close();
  });
  world.addEventListener("pointerdown", (event) => {
    if (event.target.closest("a, button") || event.button !== 0) return;
    const rect = world.getBoundingClientRect();
    const point = {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    };
    if (!inFloor(point)) return;
    world.focus({ preventScroll: true });
    target = point;
    marker.style.left = `${point.x}%`;
    marker.style.top = `${point.y}%`;
    marker.style.display = "block";
    start();
  });
  world.addEventListener("keydown", (event) => {
    if (
      event.target !== world ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    )
      return;
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (movementKeys.has(key)) {
      event.preventDefault();
      keys.add(key);
      start();
    } else if (event.key === "Enter") {
      const nearest = [...stations].sort(
        (a, b) =>
          Math.hypot(a.x - position.x, a.y - position.y) -
          Math.hypot(b.x - position.x, b.y - position.y),
      )[0];
      window.location.assign(nearest.href);
    } else if (event.key === "Escape") stop();
  });
  window.addEventListener("keyup", (event) =>
    keys.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key),
  );
  world.addEventListener("focusout", stop);
  window.addEventListener("blur", stop);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
  });
  // Avoid burning animation frames when the studio scrolls out of view.
  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) stop();
  }).observe(world);
  paint();
}
