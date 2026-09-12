export const STATIONS = [
  {
    id: "aequitas",
    title: "AEQUITAS",
    object: "Research terminal",
    number: "01",
    x: 34,
    y: 35,
    approach: { x: 34, y: 33 },
    bounds: { left: 23, right: 44, top: 18, bottom: 29 },
    href: "/aequitas/",
    blurb: "C++20, Python and quantitative research.",
  },
  {
    id: "research",
    title: "Achievements",
    object: "Trophy shelf",
    number: "02",
    x: 69,
    y: 35,
    approach: { x: 69, y: 32 },
    bounds: { left: 60, right: 84, top: 14, bottom: 29 },
    href: "/achievements/",
    blurb: "HackNCState, HackNC, CoughSense and publications.",
  },
  {
    id: "experience",
    title: "Experience",
    object: "Workbench",
    number: "03",
    x: 35,
    y: 46,
    approach: { x: 27, y: 51 },
    bounds: { left: 8, right: 24, top: 32, bottom: 59 },
    href: "/overview/#experience",
    blurb: "The things I’ve built with teams.",
  },
  {
    id: "projects",
    title: "Projects",
    object: "Arcade cabinets",
    number: "04",
    x: 70,
    y: 46,
    approach: { x: 75, y: 51 },
    bounds: { left: 79, right: 94, top: 32, bottom: 60 },
    href: "/overview/#projects",
    blurb: "AI, embedded systems and C++ games.",
  },
  {
    id: "about",
    title: "About me",
    object: "Reading nook",
    number: "05",
    x: 35,
    y: 70,
    approach: { x: 31, y: 76 },
    bounds: { left: 8, right: 28, top: 69, bottom: 86 },
    href: "/overview/#about",
    blurb: "Meet the person behind the pixels.",
  },
  {
    id: "resume",
    title: "Résumé",
    object: "Writing desk",
    number: "06",
    x: 50,
    y: 66,
    approach: { x: 50, y: 70 },
    bounds: { left: 43, right: 57, top: 75, bottom: 92 },
    href: "/documents/adit-shah-resume.pdf",
    blurb: "My current résumé, ready to take with you.",
  },
  {
    id: "contact",
    title: "Contact",
    object: "Mailbox",
    number: "07",
    x: 68,
    y: 84,
    approach: { x: 72, y: 77 },
    bounds: { left: 77, right: 84, top: 70, bottom: 85 },
    href: "/contact/",
    blurb: "Email, LinkedIn, opportunities or a simple hello.",
  },
];

// Feedback remains directly linkable without needing an extra object on the map.
export const DESTINATIONS = [
  ...STATIONS,
  {
    id: "publications",
    title: "Research & publications",
    object: "Papers & presentations",
    number: "02",
    href: "/research/",
  },
  {
    id: "feedback",
    title: "Leave a note",
    object: "Feedback & suggestions",
    number: "07",
    href: "/feedback/",
  },
];
export const INTERACTION_REACH = 8;

// Feet positions in percentages of the top-down map. Bounds include a clearance
// around each furniture sprite, so the player cannot walk through the objects.
export const OBSTACLES = [
  { left: 7, right: 24, top: 31, bottom: 60 },
  { left: 78, right: 94, top: 30, bottom: 61 },
  { left: 8, right: 29, top: 68, bottom: 88 },
  { left: 43, right: 57, top: 75, bottom: 94 },
  { left: 76, right: 85, top: 71, bottom: 86 },
  { left: 88, right: 95, top: 80, bottom: 94 },
];
export function canWalk({ x, y }) {
  return (
    x >= 7 &&
    x <= 94 &&
    y >= 30 &&
    y <= 90 &&
    !OBSTACLES.some(
      (o) => x >= o.left && x <= o.right && y >= o.top && y <= o.bottom,
    )
  );
}
export function distance(a, b) {
  return Math.hypot((a.x - b.x) * 1.5, a.y - b.y);
}
export function nearestStation(point) {
  return STATIONS.reduce((best, station) =>
    stationDistance(point, station) < stationDistance(point, best)
      ? station
      : best,
  );
}
export function stationDistance(point, { bounds }) {
  return distance(point, {
    x: Math.max(bounds.left, Math.min(bounds.right, point.x)),
    y: Math.max(bounds.top, Math.min(bounds.bottom, point.y)),
  });
}
export function interactiveStation(point, facing) {
  if (!canWalk(point)) return null;
  const direction = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[
    facing
  ];
  const candidates = STATIONS.filter(
    (station) => stationDistance(point, station) <= INTERACTION_REACH,
  );
  const closestDistance = Math.min(
    ...candidates.map((station) => stationDistance(point, station)),
  );
  const score = (station) => {
    const d = stationDistance(point, station);
    if (!direction || !d) return d;
    const b = station.bounds;
    const dx = (Math.max(b.left, Math.min(b.right, point.x)) - point.x) * 1.5;
    const dy = Math.max(b.top, Math.min(b.bottom, point.y)) - point.y;
    // Use facing only to break close ties, never to prefer a farther object.
    // Facing away never removes an otherwise reachable interaction.
    return d + 3 * (1 - (dx * direction[0] + dy * direction[1]) / d);
  };
  return (
    candidates
      .filter(
        (station) => stationDistance(point, station) <= closestDistance + 0.5,
      )
      .sort((a, b) => score(a) - score(b))[0] ?? null
  );
}
export function movePlayer(position, dx, dy) {
  const next = { ...position };
  if (canWalk({ x: next.x + dx, y: next.y })) next.x += dx;
  if (canWalk({ x: next.x, y: next.y + dy })) next.y += dy;
  return next;
}

// A* on a small map grid. Click-to-walk takes connected floor routes, and never
// cuts diagonally through furniture corners. The queue is bounded to 2,500 cells.
export function findPath(from, to) {
  if (!canWalk(from) || !canWalk(to)) return [];
  const cell = (p) => ({
    x: Math.round(p.x / 2) * 2,
    y: Math.round(p.y / 2) * 2,
  });
  const nearby = (p) => {
    const c = cell(p);
    const candidates = [];
    for (let dx = -2; dx <= 2; dx += 2)
      for (let dy = -2; dy <= 2; dy += 2) {
        const point = { x: c.x + dx, y: c.y + dy };
        if (canWalk(point) && clearSegment(p, point)) candidates.push(point);
      }
    return candidates.sort((a, b) => distance(p, a) - distance(p, b))[0];
  };
  const start = nearby(from),
    goal = nearby(to);
  if (!start || !goal) return [];
  const key = (p) => `${p.x},${p.y}`;
  const open = [{ ...start, g: 0, f: distance(start, goal), parent: null }];
  const costs = new Map([[key(start), 0]]);
  let iterations = 0;
  while (open.length && iterations++ < 2500) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift();
    if (current.g > costs.get(key(current))) continue;
    if (key(current) === key(goal)) {
      const path = [to];
      for (let n = current; n; n = n.parent) path.unshift({ x: n.x, y: n.y });
      return path;
    }
    for (const [dx, dy] of [
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
      [-2, -2],
      [-2, 2],
      [2, -2],
      [2, 2],
    ]) {
      const next = { x: current.x + dx, y: current.y + dy };
      if (!canWalk(next) || !clearSegment(current, next)) continue;
      const g = current.g + distance(current, next);
      if (g >= (costs.get(key(next)) ?? Infinity)) continue;
      costs.set(key(next), g);
      open.push({ ...next, g, f: g + distance(next, goal), parent: current });
    }
  }
  return [];
}
export function clearSegment(a, b) {
  const steps = Math.max(1, Math.ceil(distance(a, b) * 4));
  for (let i = 0; i <= steps; i++)
    if (
      !canWalk({
        x: a.x + ((b.x - a.x) * i) / steps,
        y: a.y + ((b.y - a.y) * i) / steps,
      })
    )
      return false;
  return true;
}
