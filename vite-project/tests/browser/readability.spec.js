import { test, expect } from "@playwright/test";

test("hackathon results stay in the dedicated achievements panel", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".game-screen")).not.toContainText("HackNC");
  await page.locator('.station-dock [data-open-station="research"]').click();
  await expect(page.locator("#station-panel-title")).toHaveText("Achievements");
  await expect(page.locator(".achievement-story")).toHaveCount(3);
  await expect(
    page.locator(".achievement-story").filter({ hasText: "HackNCState 2026" }),
  ).toContainText("HackNCState 2026");
  await page
    .getByRole("link", { name: /Research, publications & posters/ })
    .click();
  await expect(page.locator("#station-panel-title")).toHaveText(
    "Research & publications",
  );
  await expect(
    page.getByRole("heading", { name: "CoughSense", exact: true }),
  ).toBeVisible();
});

test("number markers clear furniture and the section dock remains readable", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("body")).toHaveClass(/game-ready/);
  const issues = await page.evaluate(() => {
    const objects = [...document.querySelectorAll(".game-object")].map(
      (el) => ({ id: el.dataset.hotspot, rect: el.getBoundingClientRect() }),
    );
    const overlaps = (a, b) =>
      Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
      Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
    return [...document.querySelectorAll(".game-station")].flatMap((el) => {
      const rect = el.getBoundingClientRect();
      const failures = objects
        .filter((object) => overlaps(rect, object.rect))
        .map((object) => `${el.dataset.station} covers ${object.id}`);
      if (rect.height < 31)
        failures.push(`${el.dataset.station} label too small`);

      return failures;
    });
  });
  expect(issues).toEqual([]);
  for (const link of await page.locator(".dock-stations a").all()) {
    await expect(link).toBeInViewport();
    expect(
      await link.evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
    ).toBeGreaterThanOrEqual(16);
  }
  await page.screenshot({
    path: `test-results/readable-world-${info.project.name}.png`,
  });
});

test("all directions use one aligned sheet with a four-frame walking cycle", async ({
  page,
}, info) => {
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("body")).toHaveClass(/game-ready/);
  for (const [key, facing] of [
    ["ArrowRight", "right"],
    ["ArrowLeft", "left"],
    ["ArrowUp", "up"],
    ["ArrowDown", "down"],
  ]) {
    await page.keyboard.down(key);
    await expect(page.locator(".game-avatar-sprite")).toHaveAttribute(
      "data-facing",
      facing,
    );
    const frames = await page.evaluate(
      () =>
        new Promise((resolve) => {
          const start = performance.now();
          const seen = new Set();
          window.walkPreview ??= {};
          function sample() {
            const sprite = document.querySelector(".game-avatar-sprite");
            window.walkPreview[sprite.dataset.frame] = sprite.outerHTML;
            seen.add(
              document.querySelector(".game-avatar-sprite").dataset.frame,
            );
            if (performance.now() - start < 600) requestAnimationFrame(sample);
            else resolve([...seen]);
          }
          sample();
        }),
    );
    expect(frames.length).toBeGreaterThanOrEqual(4);
    if (facing === "right") {
      expect(
        await page
          .locator(".game-avatar-sprite")
          .evaluate((el) => getComputedStyle(el).backgroundImage),
      ).toContain("unified-player.webp");
      await page.locator(".game-avatar").screenshot({
        path: `test-results/side-walk-${info.project.name}.png`,
      });
    }
    await page.keyboard.up(key);
  }
  if (info.project.name === "desktop") {
    await page.evaluate(() => {
      const gallery = document.createElement("div");
      gallery.id = "walk-preview";
      gallery.style.cssText =
        "position:fixed;inset:20px auto auto 20px;z-index:100;background:#243348;padding:12px;display:grid;grid-template-columns:repeat(4,164px);gap:6px";
      gallery.innerHTML = Object.entries(window.walkPreview)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(
          ([frame, html]) =>
            `<div style="position:relative;width:164px;height:166px;border-bottom:1px solid #edcd85">${html}<small style="position:absolute;bottom:0;color:white">Frame ${frame}</small></div>`,
        )
        .join("");
      document.body.append(gallery);
    });
    await page
      .locator("#walk-preview")
      .screenshot({ path: "test-results/walking-contact-sheet.png" });
  }
});
