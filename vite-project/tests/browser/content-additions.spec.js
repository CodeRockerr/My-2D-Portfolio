import { test, expect } from "@playwright/test";

test("recent projects have filterable cards, team details and public or private contact actions", async ({
  page,
}, info) => {
  for (const path of ["/#projects", "/overview/#projects"]) {
    await page.goto(path);
    await expect(page.locator(".project-card:visible")).toHaveCount(10);
    await expect(page.locator("#project-card-aequitas")).toHaveCount(0);
    for (const [id, category, detail, url] of [
      [
        "pocket-rivals",
        "Games & interaction",
        "repository is currently private",
        null,
      ],
      [
        "mayday-mayor",
        "Games & interaction",
        "Solana devnet",
        "https://github.com/darshrank/ready-raleigh",
      ],
      [
        "avatar",
        "AI applications",
        "simulated company",
        "https://github.com/samarthdshah/HackNC26",
      ],
    ]) {
      await page.getByRole("button", { name: category, exact: true }).click();
      await expect(page.locator(".project-card:visible")).toHaveCount(
        category === "Games & interaction" ? 2 : 4,
      );
      const card = page.locator(`#project-card-${id}`);
      await card.scrollIntoViewIfNeeded();
      await expect(card).toBeVisible();
      await expect(card).not.toContainText(
        /HackDay Winner|3rd Place|Best Use of/,
      );
      expect(
        await card.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
      ).toBeTruthy();
      if (await card.locator("img").count()) {
        await expect
          .poll(() =>
            card
              .locator("img")
              .evaluate((el) => el.complete && el.naturalWidth > 0),
          )
          .toBeTruthy();
      }
      const open = card.getByRole("button", { name: /Details/ });
      await open.click();
      const dialog = page.locator(`#project-${id}[open]`);
      await expect(dialog).toContainText(detail);
      await expect(
        dialog.getByRole("heading", { name: "Team project", exact: true }),
      ).toBeVisible();
      if (url) {
        const link = dialog.getByRole("link", { name: /on GitHub/ });
        await expect(link).toHaveAttribute("href", url);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", /noopener/);
      } else {
        await expect(dialog.locator('a[href*="github.com"]')).toHaveCount(0);
        await expect(
          dialog.getByRole("link", { name: /Ask me about this project/ }),
        ).toHaveAttribute("href", /^mailto:ashah45@ncsu.edu\?subject=/);
      }
      await page.screenshot({
        path: `test-results/project-${id}-${path.startsWith("/#") ? "game" : "overview"}-${info.project.name}.png`,
      });
      await page.keyboard.press("Escape");
      await expect(open).toBeFocused();
    }
    await page
      .getByRole("button", { name: "All projects", exact: true })
      .click();
    await expect(page.locator(".project-card:visible")).toHaveCount(10);
  }
});

test("new achievements preserve event years, both WolfHacks prizes and honest repository access", async ({
  page,
}, info) => {
  for (const path of ["/#achievements", "/achievements/"]) {
    await page.goto(path);
    const pocket = page.locator("#achievement-pocket-rivals");
    await expect(pocket).toContainText("Hack_NCState 9/26 HackDay");
    await expect(pocket).toContainText("HackDay Winner");
    await expect(pocket).toContainText("Repository currently private");
    await expect(
      pocket.getByRole("link", { name: /Ask about Pocket Rivals/ }),
    ).toHaveAttribute(
      "href",
      "mailto:ashah45@ncsu.edu?subject=Pocket%20Rivals",
    );
    await expect(pocket.locator('a[href*="github.com"]')).toHaveCount(0);

    for (const [id, event, prize, url] of [
      [
        "mayday-mayor",
        "WolfHacks 2026",
        "3rd Place & Best Use of Solana",
        "https://github.com/darshrank/ready-raleigh",
      ],
      [
        "avatar",
        "HackNC 2026",
        "Best Use of Snowflake API",
        "https://github.com/samarthdshah/HackNC26",
      ],
    ]) {
      const story = page.locator(`#achievement-${id}`);
      await expect(story).toContainText(event);
      await expect(story.locator(".achievement-result")).toContainText(prize);
      const link = story
        .getByRole("link", { name: /View .* on GitHub/ })
        .last();
      await expect(link).toHaveAttribute("href", url);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener/);
    }
    await expect(page.locator("#achievement-wolfvest")).toContainText(
      "HackNC 2025",
    );
    await expect(page.locator("#achievement-cppcon-2026")).toContainText(
      "AEQUITAS · Poster Presentation",
    );
    await expect(page.locator("#achievement-cppcon-2026")).not.toContainText(
      "Best Poster",
    );
    await pocket.scrollIntoViewIfNeeded();
    expect(
      await pocket.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    ).toBeTruthy();
    await page.screenshot({
      path: `test-results/pocket-rivals-${path === "/achievements/" ? "page" : "game"}-${info.project.name}.png`,
    });
  }
});

test("CppCon poster is readable and downloadable from achievements, AEQUITAS and research", async ({
  page,
}) => {
  const pdf = "/documents/cppcon-2026-poster.pdf";
  for (const path of [
    "/#achievements",
    "/achievements/",
    "/cppcon/",
    "/aequitas/",
    "/research/",
  ]) {
    await page.goto(path);
    await expect(
      page.getByRole("link", { name: /^Read poster \(PDF\)/ }),
    ).toHaveAttribute("href", pdf);
    const link = page.getByRole("link", { name: /^Download poster/ });
    await expect(link).toHaveAttribute("href", pdf);
    await expect(link).toHaveAttribute(
      "download",
      "Adit-Shah-CppCon-2026-Poster.pdf",
    );
  }
  const response = await page.request.get(pdf);
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: /^Download poster/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("Adit-Shah-CppCon-2026-Poster.pdf");
  expect(await download.failure()).toBeNull();
});

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
  await expect(page.locator(".project-card:visible")).toHaveCount(10);
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

test("achievement stories load poster, project and event artwork with working actions", async ({
  page,
}, info) => {
  for (const path of ["/#achievements", "/achievements/"]) {
    await page.goto(path);
    await expect(page.locator(".achievement-story")).toHaveCount(7);
    for (const [id, asset] of [
      ["cppcon-2026", "cppcon-2026-poster.webp"],
      ["mayday-mayor", "mayday-mayor.webp"],
      ["avatar", "avatar-logo.webp"],
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
