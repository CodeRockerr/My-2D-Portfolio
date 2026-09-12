import { test, expect } from "@playwright/test";

test("reading view, filters, dialogs and downloads work", async ({
  page,
}, testInfo) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/overview/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Curious mind.",
  );
  await expect(page.locator(".studio-art")).toBeVisible();
  await expect(page.locator(".project-card:visible")).toHaveCount(7);
  await page
    .getByRole("button", { name: "C++ & systems", exact: true })
    .click();
  await expect(page.locator(".project-card:visible")).toHaveCount(1);
  await page
    .getByRole("button", { name: /Details.*Building a C\+\+ game engine/ })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close project details" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "All projects", exact: true }).click();
  await expect(page.locator(".project-card:visible")).toHaveCount(7);
  for (const path of [
    "/documents/adit-shah-resume.pdf",
    "/documents/coughsense-poster.pdf",
  ]) {
    const response = await page.request.get(path);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("application/pdf");
  }
  expect(errors).toEqual([]);
  await expect(
    page.getByRole("img", { name: "Adit Shah", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".resume-qr")).toHaveAttribute(
    "href",
    "/documents/adit-shah-resume.pdf",
  );
  await expect(
    page.getByRole("link", { name: "Save QR code" }),
  ).toHaveAttribute("download", "Adit-Shah-Resume-QR.png");
  await page
    .locator("#about")
    .screenshot({ path: `test-results/about-${testInfo.project.name}.png` });
  await page.locator(".resume-qr img").screenshot({
    path: `test-results/resume-qr-${testInfo.project.name}.png`,
  });
  await page.evaluate(() => {
    document.activeElement?.blur();
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.screenshot({
    path: `test-results/hero-${testInfo.project.name}.png`,
  });
  await page.screenshot({
    path: `test-results/home-${testInfo.project.name}.png`,
    fullPage: true,
  });
});

test("all pages are readable and fit the viewport", async ({
  page,
}, testInfo) => {
  for (const path of [
    "/",
    "/overview/",
    "/aequitas/",
    "/research/",
    "/achievements/",
    "/feedback/",
    "/contact/",
    "/cppcon/",
    "/privacy/",
    "/404.html",
  ]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
    ).toBeTruthy();
    const broken = await page
      .locator("img")
      .evaluateAll((images) =>
        images
          .filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => image.src),
      );
    expect(broken).toEqual([]);
    if (["/aequitas/", "/feedback/", "/research/"].includes(path))
      await page.screenshot({
        path: `test-results/${path.split("/")[1]}-${testInfo.project.name}.png`,
        fullPage: true,
      });
  }
});

test("keyboard movement and dialog focus stay scoped", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === "mobile",
    "Physical keyboard interaction is checked on desktop.",
  );
  await page.goto("/overview/");
  const world = page.locator(".studio-world");
  await expect(page.locator(".player-sprite")).toHaveAttribute(
    "style",
    /background-position/,
  );
  await world.focus();
  const start = await page.locator(".studio-player").getAttribute("style");
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(250);
  await page.keyboard.up("ArrowRight");
  expect(await page.locator(".studio-player").getAttribute("style")).not.toBe(
    start,
  );
  await page.getByRole("button", { name: /Details.*WolfTrace/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: /Details.*WolfTrace/ }),
  ).toBeFocused();
});

test("mobile navigation opens, closes and follows links", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile menu only.");
  await page.goto("/overview/");
  const menu = page.getByRole("button", { name: /Menu/ });
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page
    .locator("#main-nav")
    .getByRole("link", { name: "Research", exact: true })
    .click();
  await expect(page).toHaveURL(/\/research\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Questions worth",
  );
});

test("feedback delivers through a mocked provider and never sends analytics", async ({
  page,
}) => {
  const external = [];
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1"))
      external.push(request.url());
  });
  let received;
  await page.route("https://formspree.io/f/testform", async (route) => {
    received = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"ok":true}',
    });
  });
  await page.goto("/feedback/");
  await page
    .getByLabel("Your message")
    .fill("The studio looks great. A suggestion from a test.");
  await page.getByRole("button", { name: "Send private note" }).click();
  await expect(page.getByRole("status")).toContainText("delivered privately");
  expect(received.message).toContain("suggestion from a test");
  await expect(page.getByLabel("Your message")).toHaveValue("");
  expect(
    external.every((url) => url === "https://formspree.io/f/testform"),
  ).toBeTruthy();
});

test("feedback errors preserve the draft and offer email", async ({ page }) => {
  await page.route("https://formspree.io/f/testform", (route) =>
    route.fulfill({ status: 429, body: "{}" }),
  );
  await page.goto("/feedback/");
  await page
    .getByLabel("Your message")
    .fill("Please preserve this message when the provider fails.");
  await page.getByRole("button", { name: "Send private note" }).click();
  await expect(page.getByRole("status")).toContainText("Too many attempts");
  await expect(page.getByLabel("Your message")).toHaveValue(
    "Please preserve this message when the provider fails.",
  );
  await expect(
    page.getByRole("link", { name: "Open email draft" }),
  ).toHaveAttribute("href", /^mailto:/);
});

test("unconfigured feedback prepares an honest email fallback", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:5175/feedback/");
  await page
    .getByLabel("Your message")
    .fill("A thoughtful note with special characters & symbols.");
  await page.getByRole("button", { name: "Continue in email" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Nothing has been sent yet",
  );
  await expect(
    page.getByRole("link", { name: "Open email draft" }),
  ).toBeFocused();
});

test("content remains available without JavaScript", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport:
      testInfo.project.name === "mobile"
        ? { width: 390, height: 844 }
        : { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5175/overview/");
  await expect(
    page.getByRole("heading", { name: "Different problems. Same curiosity." }),
  ).toBeVisible();
  await expect(
    page
      .locator("#main-nav")
      .getByRole("link", { name: "AEQUITAS", exact: true }),
  ).toBeVisible();
  await page
    .locator("#main-nav")
    .getByRole("link", { name: "AEQUITAS", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "AEQUITAS",
  );
  await context.close();
});

test("reading studio has no pause option and still supports keyboard movement", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/overview/");
  await page.getByRole("button", { name: /Controls/ }).click();
  await expect(page.locator(".motion-toggle")).toHaveCount(0);
  const world = page.locator(".studio-world");
  await world.focus();
  const initial = await page.locator(".studio-player").getAttribute("style");
  await page.keyboard.down("ArrowRight");
  await expect(page.locator(".studio-player")).not.toHaveAttribute(
    "style",
    initial,
  );
  await page.keyboard.up("ArrowRight");
});

test("expanded studio restores the page and its focus when closed", async ({
  page,
}) => {
  await page.goto("/overview/");
  await page.getByRole("button", { name: "Enter studio" }).click();
  await expect(
    page.getByRole("dialog", { name: "Explore Adit’s studio" }),
  ).toBeVisible();
  await expect(page.locator(".studio-world")).toBeFocused();
  await page.getByRole("button", { name: "Back to portfolio" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Enter studio" }),
  ).toBeFocused();
  await expect(page.locator(".hero .studio-shell")).toBeVisible();
});

test("feature explainer recalculates from a user-controlled window", async ({
  page,
}) => {
  await page.goto("/aequitas/");
  const slider = page.getByRole("slider", { name: /Window size/ });
  await slider.fill("16");
  await expect(page.locator("#window-value")).toHaveText("16 samples");
  await expect(page.locator("#feature-count")).toHaveText("17");
  await expect(page.locator("#feature-average")).toHaveText("107.19");
  await expect(
    page.getByText("Synthetic data, calculated in your browser.", {
      exact: false,
    }),
  ).toBeVisible();
});
