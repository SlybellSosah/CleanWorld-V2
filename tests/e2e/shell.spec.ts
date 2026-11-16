import { expect, test } from "@playwright/test";

test.describe("spec ui-shell", () => {
  test("edge case 03: the phone menu traps focus and Escape returns it", async ({ page }) => {
    test.skip(test.info().project.name !== "phone", "menu button exists only on small screens");
    await page.goto("/");
    const open = page.getByRole("button", { name: "Open menu" });
    await open.click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu).toBeVisible();
    expect(await page.evaluate(() => document.activeElement?.closest("dialog") !== null)).toBe(true);
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(open).toBeFocused();
  });

  test("edge case 04: reduced motion shows content without animating it", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    expect(await h1.evaluate((el) => getComputedStyle(el).transform)).toBe("none");
  });

  test("edge case 05: an unknown address returns 404 and the not-found view", async ({ page }) => {
    const response = await page.goto("/no-such-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  });

  test("edge case 06: pages show their content without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/services/fumigation");
    await expect(page.getByRole("heading", { level: 1, name: "Fumigation and pest control" })).toBeVisible();
    await expect(page.getByText("Mosquito control: clearing breeding sites")).toBeVisible();
    await context.close();
  });
});
