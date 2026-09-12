// The open central floor, in percentages of the generated environment image.
export const FLOOR = [
  { x: 49, y: 48 },
  { x: 70, y: 64 },
  { x: 50, y: 87 },
  { x: 36, y: 67 },
];

export function inFloor(point) {
  let inside = false;
  for (let i = 0, j = FLOOR.length - 1; i < FLOOR.length; j = i++) {
    const a = FLOOR[i],
      b = FLOOR[j];
    if (
      a.y > point.y !== b.y > point.y &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x
    )
      inside = !inside;
  }
  return inside;
}

export function stepTowards(position, target, distance) {
  const dx = target.x - position.x,
    dy = target.y - position.y;
  const length = Math.hypot(dx, dy);
  if (length <= distance || length === 0) return { ...target };
  return {
    x: position.x + (dx / length) * distance,
    y: position.y + (dy / length) * distance,
  };
}
