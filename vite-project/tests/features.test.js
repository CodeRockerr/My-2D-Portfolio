import test from "node:test";
import assert from "node:assert/strict";
import { rollingMean, chartPath } from "../src/features.js";

test("rolling mean uses complete windows and evicts old samples", () => {
  assert.deepEqual(rollingMean([1, 2, 3, 4, 5], 3), [null, null, 2, 3, 4]);
  assert.deepEqual(rollingMean([4, 5, 6], 1), [4, 5, 6]);
  assert.deepEqual(rollingMean([4, 5, 6], 3), [null, null, 5]);
});
test("invalid windows and non-finite data are rejected", () => {
  for (const window of [0, -1, 1.5, 4, NaN])
    assert.throws(() => rollingMean([1, 2, 3], window));
  assert.throws(() => rollingMean([1, NaN, 3], 2));
});
test("chart starts at first complete feature and never draws null values", () => {
  const path = chartPath([null, null, 101, 102]);
  assert.match(path.trim(), /^M420/);
  assert.ok(!/NaN|null/.test(path));
});
