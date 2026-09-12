import test from "node:test";
import assert from "node:assert/strict";
import { inFloor, stepTowards } from "../src/studio-math.js";
import { renderPage } from "../src/render.js";
import { pages, projects } from "../src/content.js";

test("character stays on open floor, away from room furniture and edges", () => {
  assert.equal(inFloor({ x: 51, y: 70 }), true);
  for (const point of [
    { x: 0, y: 0 },
    { x: 100, y: 100 },
    { x: 30, y: 30 },
    { x: 80, y: 70 },
  ])
    assert.equal(inFloor(point), false);
  let position = { x: 51, y: 70 };
  for (let i = 0; i < 100; i++) {
    position = stepTowards(position, { x: 50, y: 55 }, 0.5);
    assert.ok(inFloor(position));
  }
  assert.deepEqual(position, { x: 50, y: 55 });
});
test("walking arrives at the destination without overshooting or NaN", () => {
  assert.deepEqual(stepTowards({ x: 1, y: 1 }, { x: 1, y: 1 }, 5), {
    x: 1,
    y: 1,
  });
  assert.deepEqual(stepTowards({ x: 1, y: 1 }, { x: 2, y: 2 }, 5), {
    x: 2,
    y: 2,
  });
});
test("all published pages contain semantic content before client JavaScript", () => {
  for (const page of Object.keys(pages)) {
    const html = renderPage(page);
    assert.match(html, /<main id="main"/);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    assert.match(html, /Skip to content/);
    assert.ok(!html.includes("undefined"));
  }
  assert.throws(() => renderPage("unpublished"));
});
test("all project buttons resolve to unique dialogs", () => {
  const html = renderPage("home");
  assert.equal(new Set(projects.map((p) => p.id)).size, projects.length);
  for (const { id } of projects)
    assert.match(html, new RegExp(`id="project-${id}"`));
});
