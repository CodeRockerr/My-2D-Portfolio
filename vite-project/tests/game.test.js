import test from "node:test";
import assert from "node:assert/strict";
import {
  STATIONS,
  canWalk,
  findPath,
  clearSegment,
  movePlayer,
  nearestStation,
  interactiveStation,
} from "../src/game-world.js";

test("E works along the different accessible edges of each object", () => {
  const positions = {
    aequitas: [
      [28, 32],
      [34, 33],
      [46, 32],
    ],
    research: [
      [61, 33],
      [69, 32],
      [76, 31],
    ],
    experience: [
      [26, 34],
      [26, 51],
      [26, 63],
    ],
    projects: [
      [76, 35],
      [75, 51],
      [77, 64],
    ],
    about: [
      [18, 65],
      [31, 76],
      [27, 90],
    ],
    resume: [
      [50, 70],
      [40, 80],
      [60, 81],
    ],
    contact: [
      [80, 66],
      [72, 77],
      [87, 76],
      [80, 89],
    ],
  };
  for (const [id, points] of Object.entries(positions)) {
    for (const [x, y] of points) {
      const point = { x, y };
      assert.ok(canWalk(point));
      assert.equal(
        interactiveStation(point)?.id,
        id,
        `Wrong station at ${x},${y}`,
      );
    }
  }
  assert.equal(
    interactiveStation({ x: 50, y: 58 }),
    null,
    "No interactions from across the room",
  );
  assert.equal(
    interactiveStation({ x: 50, y: 80 }),
    null,
    "No interactions from inside an obstacle",
  );
  assert.equal(interactiveStation({ x: 26, y: 32 }, "up")?.id, "aequitas");
  assert.equal(interactiveStation({ x: 26, y: 32 }, "left")?.id, "experience");
  assert.equal(
    interactiveStation({ x: 50, y: 70 }, "up")?.id,
    "resume",
    "Facing away does not disable E",
  );
});

test("every station is reachable from spawn and every other station without crossing furniture", () => {
  const points = [{ x: 50, y: 58 }, ...STATIONS.map((s) => s.approach)];
  for (const from of points) {
    for (const to of points) {
      const path = findPath(from, to);
      assert.ok(
        path.length,
        `No route from ${JSON.stringify(from)} to ${JSON.stringify(to)}`,
      );
      assert.deepEqual(path.at(-1), to);
      let previous = from;
      for (const step of path) {
        assert.ok(clearSegment(previous, step), "Route crosses furniture");
        previous = step;
      }
    }
  }
});

test("walls and furniture block movement while permitting movement along their edges", () => {
  assert.equal(canWalk({ x: 50, y: 20 }), false);
  assert.equal(canWalk({ x: 50, y: 80 }), false);
  assert.deepEqual(findPath({ x: 50, y: 58 }, { x: 50, y: 80 }), []);
  assert.deepEqual(movePlayer({ x: 50, y: 74.9 }, 0.5, 0.5), {
    x: 50.5,
    y: 74.9,
  });
  assert.deepEqual(movePlayer({ x: 50, y: 30 }, 0, -0.5), { x: 50, y: 30 });
  for (const station of STATIONS)
    assert.equal(nearestStation(station.approach), station);
});

test("facing does not select a farther object across the corridor", () => {
  assert.equal(interactiveStation({ x: 26, y: 63 }, "down")?.id, "experience");
});
