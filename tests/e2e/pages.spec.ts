import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { publicPaths } from "../../src/content/paths";

for (const path of publicPaths) {
  test(`${path} is pre-rendered, has one h1 and no accessibility violations`, async ({ page, request }) => {
    const html = await (await request.get(path)).text();
    expect(html).toMatch(/<h1[\s>]/);
    expect(html).toContain('name="description"');

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await page.waitForTimeout(1000); // entrance fades must finish before contrast is measured
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
  });
}

test("spec view-home edge case 02: no statistics, badges or certification claims", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).not.toContainText(/ISO|\d+\+|clients served|certified/i);
});

test("spec view-home edge case 03: the page uses no content images that could fail", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main img")).toHaveCount(0);
});

test("spec view-services edge case 01: an unknown service shows not found", async ({ page }) => {
  await page.goto("/services/car-wash");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});

test("spec view-services edge case 03: the quote link carries the service", async ({ page }) => {
  await page.goto("/services/waste-collection");
  await page.getByRole("link", { name: "Request a quote for waste" }).click();
  await expect(page).toHaveURL(/\/quote\?service=waste-collection$/);
});

test("spec view-how-to-pay edge cases 02 and 03: no inputs, no bank details, PIN warning shown", async ({ page }) => {
  await page.goto("/how-to-pay");
  await expect(page.locator("main").locator("input, textarea, select")).toHaveCount(0);
  await expect(page.getByText("Never type your mobile-money PIN into a website.")).toBeVisible();
  await expect(page.locator("main")).not.toContainText(/account number|IBAN|SWIFT/i);
});

test("spec view-how-to-pay edge case 01: with no merchant number the fallback sentence shows", async ({ page }) => {
  await page.goto("/how-to-pay");
  await expect(page.getByText("We send you our merchant number together with your confirmed amount")).toBeVisible();
});

test("spec view-privacy edge case 01: the page says how to ask for deletion", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByText(/To have your details corrected or deleted/)).toBeVisible();
});
