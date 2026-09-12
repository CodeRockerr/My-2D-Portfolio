import { test, expect } from "@playwright/test";

async function openStation(page, id) {
  if (id === "feedback") {
    await page.locator("#quick-travel-toggle").click();
    await page.locator('#quick-travel [data-open-station="feedback"]').click();
  } else
    await page.locator(`.station-dock [data-open-station="${id}"]`).click();
  await expect(page.locator("#station-dialog")).toBeVisible();
}

test("the homepage is a full-screen playable world with working station panels", async ({
  page,
}, info) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("body")).toHaveClass(/game-ready/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Adit’s world✦",
  );
  await expect(page.locator(".game-avatar")).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        innerWidth <= 760 ||
        document.documentElement.scrollHeight <= innerHeight + 1,
    ),
  ).toBeTruthy();
  await page.screenshot({ path: `test-results/game-${info.project.name}.png` });
  const titles = {
    aequitas: "AEQUITAS",
    research: "Achievements",
    experience: "Experience",
    projects: "Projects",
    about: "About me",
    resume: "Résumé",
    contact: "Contact",
  };
  for (const [id, title] of Object.entries(titles)) {
    await openStation(page, id);
    await expect(page.locator("#station-panel-title")).toHaveText(title);
    expect(
      (await page.locator("#station-panel-body").innerText()).length,
    ).toBeGreaterThan(100);
    const overflow = await page
      .locator("#station-panel-body")
      .evaluate((el) => el.scrollWidth > el.clientWidth + 1);
    expect(overflow).toBeFalsy();
    if (id === "about") {
      await expect(
        page.getByRole("img", { name: "Adit Shah", exact: true }),
      ).toBeVisible();
      await page.screenshot({
        path: `test-results/game-about-${info.project.name}.png`,
      });
    }
    if (id === "resume")
      await expect(
        page.locator("#station-panel-body .game-qr-link"),
      ).toHaveAttribute("href", "/documents/adit-shah-resume.pdf");
    await page.getByRole("button", { name: /Back to game/ }).click();
  }
  await expect(page.locator("#discovery-count")).toHaveText("7 / 7");
  expect(errors).toEqual([]);
});

test("keyboard movement reaches a station, E opens it and Escape returns to the world", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("body")).toHaveClass(/game-ready/);
  await page.locator(".game-viewport").focus();
  await page.keyboard.down("ArrowDown");
  await expect
    .poll(async () =>
      Number(await page.locator(".game-avatar").getAttribute("data-y")),
    )
    .toBeGreaterThan(68);
  await page.keyboard.up("ArrowDown");
  await expect(page.locator("#interact")).toBeEnabled();
  await page.keyboard.press("e");
  await expect(page.locator("#station-panel-title")).toHaveText("Résumé");
  const position = await page.locator(".game-avatar").getAttribute("data-y");
  await page.keyboard.press("ArrowDown");
  await expect(page.locator(".game-avatar")).toHaveAttribute(
    "data-y",
    position,
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("#station-dialog")).not.toBeVisible();
  await expect(page.locator(".game-viewport")).toBeFocused();
});

test("clicking a map station opens immediately without requiring movement", async ({
  page,
}, info) => {
  test.skip(
    info.project.name === "mobile",
    "Mobile station access is also covered by the dock test.",
  );
  await page.goto("/");
  await expect(page.locator("body")).toHaveClass(/game-ready/);
  const initialPosition = await page
    .locator(".game-avatar")
    .getAttribute("data-x");
  await page.locator('[data-station="projects"]').click();
  await expect(page.locator(".game-avatar")).toHaveAttribute(
    "data-x",
    initialPosition,
  );
  await expect(page.locator("#station-panel-title")).toHaveText("Projects", {
    timeout: 10000,
  });
  await page
    .getByRole("button", { name: "C++ & systems", exact: true })
    .click();
  await expect(page.locator(".project-card:visible")).toHaveCount(1);
  const details = page.getByRole("button", {
    name: /Details.*Building a C\+\+ game engine/,
  });
  await details.click();
  await expect(page.locator(".project-dialog[open]")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(details).toBeFocused();
  await expect(page.locator("#station-dialog")).toBeVisible();
});

test("quick travel, direct links and browser history preserve game navigation", async ({
  page,
}) => {
  await page.goto("/#about");
  await expect(page.locator("#station-panel-title")).toHaveText("About me");
  await page.getByRole("button", { name: /Back to game/ }).click();
  await page.locator("#quick-travel-toggle").click();
  await page.locator('#quick-travel [data-open-station="experience"]').click();
  await expect(page.locator("#station-panel-title")).toHaveText("Experience");
  await page.getByRole("button", { name: /Back to game/ }).click();
  await expect(page.locator(".game-viewport")).toBeFocused();
  await openStation(page, "research");
  await page.goBack();
  await expect(page.locator("#station-dialog")).not.toBeVisible();
  await page.goForward();
  await expect(page.locator("#station-panel-title")).toHaveText("Achievements");
});

test("feature calculations and feedback work inside the game", async ({
  page,
}) => {
  await page.route("https://formspree.io/f/testform", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"ok":true}',
    }),
  );
  await page.goto("/#aequitas");
  const slider = page.getByRole("slider", { name: /Window size/ });
  await slider.fill("16");
  await expect(page.locator("#feature-count")).toHaveText("17");
  await page.getByRole("button", { name: /Back to game/ }).click();
  await openStation(page, "feedback");
  await page
    .getByLabel("Your message")
    .fill("A test note from the game portfolio.");
  await page.getByRole("button", { name: "Send private note" }).click();
  await expect(
    page.locator("#station-dialog").getByRole("status"),
  ).toContainText("delivered privately");
});

test("touch controls move the player while the whole room stays in view", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "mobile",
    "Touch directional pad is mobile only.",
  );
  await page.goto("/");
  await expect(page.locator("body")).toHaveClass(/game-ready/);
  const camera = await page.locator(".game-map").getAttribute("style");
  const control = await page
    .getByRole("button", { name: "Move right", exact: true })
    .boundingBox();
  await page.mouse.move(
    control.x + control.width / 2,
    control.y + control.height / 2,
  );
  await page.mouse.down();
  await expect
    .poll(async () =>
      Number(await page.locator(".game-avatar").getAttribute("data-x")),
    )
    .toBeGreaterThan(54);
  await page.mouse.up();
  expect(await page.locator(".game-map").getAttribute("style")).toBe(camera);
  await page.screenshot({ path: "test-results/game-mobile-moving.png" });
});

test("walking stays enabled without a motion toggle and navigation remains available", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".game-motion")).toHaveCount(0);
  await page.keyboard.down("ArrowRight");
  const frames = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const seen = new Set();
        const start = performance.now();
        const sample = () => {
          seen.add(document.querySelector(".game-avatar-sprite").dataset.frame);
          if (performance.now() - start < 600) requestAnimationFrame(sample);
          else resolve([...seen]);
        };
        sample();
      }),
  );
  await page.keyboard.up("ArrowRight");
  expect(frames.length).toBeGreaterThanOrEqual(4);
  await openStation(page, "projects");
  await expect(page.locator(".project-card:visible")).toHaveCount(7);
});

test("the game offers a complete reading path without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5175/");
  await page
    .getByRole("link", { name: "read the complete portfolio", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "Different problems. Same curiosity." }),
  ).toBeVisible();
  await context.close();
});
