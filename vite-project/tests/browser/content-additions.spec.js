import { test, expect } from "@playwright/test";

test("footer provides both email addresses and current resume actions", async ({
  page,
}) => {
  for (const path of ["/", "/overview/"]) {
    await page.goto(path);
    const footer = page.locator(path === "/" ? ".game-footer" : ".site-footer");
    for (const address of ["ashah45@ncsu.edu", "shahadit62@gmail.com"]) {
      await expect(
        footer.getByRole("link", { name: address, exact: true }),
      ).toHaveAttribute("href", `mailto:${address}`);
    }
    await expect(footer).toContainText("Check out my résumé");
    await expect(footer).not.toContainText("Animation:");
    const download = footer.getByRole("link", {
      name: "Download",
      exact: false,
    });
    await expect(download).toHaveAttribute(
      "href",
      "/documents/adit-shah-resume.pdf",
    );
    await expect(download).toHaveAttribute("download", "Adit-Shah-Resume.pdf");
    if (path === "/") {
      await footer
        .getByRole("link", { name: "View résumé", exact: false })
        .click();
      await expect(page.locator("#station-panel-title")).toHaveText("Résumé");
    }
  }
});

test("undergraduate projects have distinct visuals, filters and complete details", async ({
  page,
}, info) => {
  await page.goto("/#projects");
  await expect(page.locator(".project-card:visible")).toHaveCount(7);
  for (const [name, category, detail] of [
    ["WattWatch", "IoT & mobile", "94% billing accuracy"],
    ["StockX", "Data & quantitative", "500+ financial data points per minute"],
    ["RecipeAI", "AI applications", "Spoonacular API"],
  ]) {
    await page.getByRole("button", { name: category, exact: true }).click();
    const card = page
      .locator(".project-card:visible")
      .filter({ has: page.getByRole("heading", { name, exact: true }) });
    await card.getByRole("button", { name: /Details/ }).click();
    await expect(page.locator(".project-dialog[open]")).toContainText(detail);
    await page.keyboard.press("Escape");
    await expect(card.getByRole("button", { name: /Details/ })).toBeFocused();
  }
  await page.getByRole("button", { name: "All projects", exact: true }).click();
  await page.locator("#project-card-wattwatch").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `test-results/new-projects-${info.project.name}.png`,
  });
});

test("achievement stories show the poster and official event artwork with working project actions", async ({
  page,
}, info) => {
  for (const path of ["/#achievements", "/achievements/"]) {
    await page.goto(path);
    await expect(page.locator(".achievement-story")).toHaveCount(3);
    for (const [id, asset] of [
      ["coughsense", "coughsense-poster.webp"],
      ["wolftrace", "hackncstate-2026.png"],
      ["wolfvest", "hacknc-2025.png"],
    ]) {
      const story = page.locator(`#achievement-${id}`);
      await story.locator("img").scrollIntoViewIfNeeded();
      await expect(story.locator("img")).toHaveAttribute(
        "src",
        `/art/${asset}`,
      );
      await expect
        .poll(() =>
          story
            .locator("img")
            .evaluate((image) => image.complete && image.naturalWidth > 0),
        )
        .toBeTruthy();
      expect(
        await story.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
      ).toBeTruthy();
      await page.screenshot({
        path: `test-results/achievement-${id}-${path === "/achievements/" ? "page" : "game"}-${info.project.name}.png`,
      });
    }
    await page
      .getByRole("button", { name: "Explore WolfTrace", exact: false })
      .click();
    await expect(page.locator(".project-dialog[open]")).toContainText("Neo4j");
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Explore WolfTrace", exact: false }),
    ).toBeFocused();
    await expect(page.locator(".achievement-milestone")).toContainText(
      "of 75 projects",
    );
    await page
      .getByRole("button", { name: "Explore WattWatch", exact: false })
      .click();
    await expect(page.locator(".project-dialog[open]")).toContainText(
      "94% billing accuracy",
    );
    await page.keyboard.press("Escape");
  }
});
