import { expect, test, type Page } from "@playwright/test";

function captureRenderingErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /hydrat|cannot be a descendant|did not match/i.test(message.text())
    ) {
      errors.push(message.text());
    }
  });
  return errors;
}

for (const [lang, shareLabel] of [
  ["en", "Share"],
  ["km", "ចែករំលែក"],
] as const) {
  test(`${lang} blog and tag listings hydrate and filter`, async ({ page }) => {
    const errors = captureRenderingErrors(page);

    for (const path of [`/${lang}/blog`, `/${lang}/blog/tags/rag`]) {
      await page.goto(path);
      const cards = page.locator("main article");
      await expect(cards.first().locator("time")).toBeVisible();

      await page.getByRole("searchbox").fill("no-matching-post-000");
      await expect(cards).toHaveCount(0);
      expect(errors, path).toEqual([]);
    }
  });

  test(`${lang} article hydrates with a figure and Web Share`, async ({
    page,
  }) => {
    const errors = captureRenderingErrors(page);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "share", {
        value: async ({ url }: ShareData) => {
          sessionStorage.setItem("test-shared-url", url ?? "");
        },
      });
    });

    const path = `/${lang}/blog/rag-in-60-seconds`;
    await page.goto(path);
    const figure = page.locator("main figure").filter({
      has: page.locator('img[src="/notes/rag-six-steps.svg"]'),
    });
    await expect(figure.locator("figcaption")).toBeVisible();
    await page.getByRole("button", { name: shareLabel, exact: true }).click();
    expect(
      await page.evaluate(() => sessionStorage.getItem("test-shared-url")),
    ).toMatch(new RegExp(`${path}$`));
    expect(errors).toEqual([]);
  });
}
