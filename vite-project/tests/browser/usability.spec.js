import { test, expect } from "@playwright/test";

test("E works at the top and bottom of a workbench and the side of the résumé desk", async ({
  page,
}, info) => {
  test.skip(
    info.project.name === "mobile",
    "World-coordinate walking is checked with the whole map visible.",
  );
  await page.goto("/");
  await expect(page.locator("body")).toHaveClass(/game-ready/);
  for (const [x, y, title] of [
    [26, 34, "Experience"],
    [26, 63, "Experience"],
    [60, 81, "Résumé"],
  ]) {
    const rect = await page.locator(".game-map").boundingBox();
    await page.mouse.click(
      rect.x + (rect.width * x) / 100,
      rect.y + (rect.height * y) / 100,
    );
    await expect(page.locator(".game-avatar")).toHaveAttribute(
      "data-x",
      x.toFixed(2),
      { timeout: 10000 },
    );
    await expect(page.locator(".game-avatar")).toHaveAttribute(
      "data-y",
      y.toFixed(2),
      { timeout: 10000 },
    );
    await expect(page.locator("#interact")).toBeEnabled();
    await page.keyboard.press("e");
    await expect(page.locator("#station-panel-title")).toHaveText(title);
    await page.keyboard.press("Escape");
  }
  // The visible object is clickable as well as its floating label.
  await page
    .locator('[data-hotspot="aequitas"]')
    .click({ position: { x: 10, y: 10 } });
  await expect(page.locator("#station-panel-title")).toHaveText("AEQUITAS");
});

test("contact is one click away with email, LinkedIn and a copy action", async ({
  page,
}, info) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async (text) => {
          window.copiedForTest = text;
        },
      },
      configurable: true,
    });
  });
  await page.goto("/");
  const contact = page.getByRole("link", { name: "Contact Adit" });
  await expect(contact).toBeVisible();
  await contact.click();
  await expect(page.locator("#station-panel-title")).toHaveText("Contact");
  await expect(page.getByRole("link", { name: "Email Adit" })).toHaveAttribute(
    "href",
    /^mailto:ashah45@ncsu.edu/,
  );
  await expect(
    page.getByRole("link", { name: /Open LinkedIn/ }),
  ).toHaveAttribute("href", "https://www.linkedin.com/in/shah-adit0404/");
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.locator(".copy-email-status")).toContainText(
    "Email address copied",
  );
  expect(await page.evaluate(() => window.copiedForTest)).toBe(
    "ashah45@ncsu.edu",
  );
  await page.locator("#station-panel-body").evaluate((el) => {
    el.scrollTop = 0;
  });
  await page.screenshot({
    path: `test-results/contact-panel-${info.project.name}.png`,
  });
  await page.getByRole("link", { name: /Leave a note/ }).click();
  await expect(page.locator("#station-panel-title")).toHaveText("Leave a note");
  await expect(page.getByLabel("Your message")).toBeVisible();
});

test("denied clipboard access keeps the email selectable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw new Error("Permission denied");
        },
      },
      configurable: true,
    });
  });
  await page.goto("/contact/");
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.locator(".copy-email-status")).toContainText(
    "Copy this address: ashah45@ncsu.edu",
  );
  expect(await page.evaluate(() => getSelection().toString())).toBe(
    "ashah45@ncsu.edu",
  );
});

test("both hackathon awards appear exclusively in achievements", async ({
  page,
}, info) => {
  for (const path of ["/achievements/", "/#research"]) {
    await page.goto(path);
    const cards = page.locator(".achievement-story");
    await expect(cards).toHaveCount(3);
    await expect(cards.filter({ hasText: "HackNCState 2026" })).toContainText(
      "2nd Place",
    );
    await expect(cards.filter({ hasText: "HackNCState 2026" })).toContainText(
      "WolfTrace",
    );
    await expect(cards.filter({ hasText: "HackNC 2025" })).toContainText(
      "Best Use of Snowflake API",
    );
    await expect(cards.filter({ hasText: "HackNC 2025" })).toContainText(
      "WolfVest",
    );
  }
  await page.locator("#awards").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `test-results/awards-panel-${info.project.name}.png`,
  });
  await page.goto("/#projects");
  await expect(
    page.locator(".award-label").filter({ hasText: "HackNCState 2026" }),
  ).toHaveCount(0);
  await expect(
    page.locator(".award-label").filter({ hasText: "HackNC 2025" }),
  ).toHaveCount(0);
});

test("layout fits the entire room and reserves space for readable controls", async ({
  page,
}, info) => {
  for (const size of [
    { width: 1440, height: 900 },
    { width: 390, height: 664 },
    { width: 320, height: 568 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(size);
    await page.goto("/");
    await expect(page.locator("body")).toHaveClass(/game-ready/);
    const screen = await page.locator(".game-screen").boundingBox();
    const avatar = await page.locator(".game-avatar").boundingBox();
    const footer = await page.locator(".game-footer").boundingBox();
    const viewport = await page.locator(".game-viewport").boundingBox();
    const contact = await page.locator(".contact-shortcut").boundingBox();
    const header = await page.locator(".game-hud").boundingBox();
    expect(header.y + header.height).toBeLessThanOrEqual(viewport.y + 1);
    for (const link of await page.locator(".dock-stations a").all()) {
      const rect = await link.boundingBox();
      expect(rect.height).toBeGreaterThanOrEqual(44);
      expect(
        await link.evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
      ).toBeGreaterThanOrEqual(14);
    }
    for (const tool of await page.locator(".game-footer-tools > *").all()) {
      const rect = await tool.boundingBox();
      expect(rect.y + rect.height).toBeLessThanOrEqual(screen.height + 1);
    }
    const map = await page.locator(".game-map").boundingBox();
    expect(avatar.height / map.height).toBeCloseTo(164 / 1024, 2);
    expect(map.x).toBeGreaterThanOrEqual(viewport.x);
    expect(map.y).toBeGreaterThanOrEqual(viewport.y);
    expect(map.x + map.width).toBeLessThanOrEqual(
      viewport.x + viewport.width + 1,
    );
    expect(map.y + map.height).toBeLessThanOrEqual(
      viewport.y + viewport.height + 1,
    );
    expect(viewport.y + viewport.height).toBeLessThanOrEqual(footer.y + 1);
    expect(contact.x + contact.width).toBeLessThanOrEqual(size.width);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <= innerWidth &&
          (innerWidth <= 760 ||
            document.documentElement.scrollHeight <= innerHeight),
      ),
    ).toBeTruthy();
    await page.screenshot({
      path: `test-results/layout-${size.width}-${size.height}-${info.project.name}.png`,
      fullPage: true,
    });
  }
});
