import { expect, test } from "@playwright/test";

test.describe("spec ui-shell", () => {
  test("edge case 03: the phone menu traps focus, closes on same-route click, and Escape returns focus", async ({ page }) => {
    test.skip(test.info().project.name !== "phone", "menu button exists only on small screens");
    await page.goto("/");
    const open = page.getByRole("button", { name: "Open menu" });
    await open.click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu).toBeVisible();
    expect(await page.evaluate(() => document.activeElement?.closest("dialog") !== null)).toBe(true);
    await menu.getByRole("link", { name: "Home" }).click();
    await expect(menu).toBeHidden();

    await open.click();
    await expect(menu).toBeVisible();
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

  test("edge case 05: an unknown address returns 404 and the not-found view", async ({ page, request }) => {
    const response = await page.goto("/no-such-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
    expect((await request.get("/__spa-fallback")).status()).toBe(404);
  });

  test("edge case 06: Home, service pages, quote fallback, and 404 show their content without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto("/");
    const homeH1 = page.getByRole("heading", { level: 1, name: /Cleaner compounds/ });
    await expect(homeH1).toBeVisible();
    await expect(homeH1).toHaveCSS("opacity", "1");
    await expect(page.locator("li.service-card-item").first()).toHaveCSS("opacity", "1");

    await page.goto("/services/fumigation");
    await expect(page.getByRole("heading", { level: 1, name: "Fumigation and pest control" })).toBeVisible();
    await expect(page.getByText("Mosquito control: clearing breeding sites")).toBeVisible();

    await page.goto("/quote");
    await expect(page.getByRole("heading", { level: 1, name: "Request a quote" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Message on WhatsApp" })).toBeVisible();

    const notFoundRes = await page.goto("/no-such-page");
    expect(notFoundRes?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();

    await context.close();
  });
});
