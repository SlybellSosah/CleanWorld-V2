import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { publicPaths } from "../../src/content/paths";

for (const path of publicPaths) {
  test(`${path} is pre-rendered, has one h1, hides preview banner in production, and has no accessibility violations`, async ({ page, request }) => {
    const html = await (await request.get(path)).text();
    expect(html).toMatch(/<h1[\s>]/);
    expect(html).toContain('name="description"');
    expect(html).not.toContain("Preview — showing details not yet confirmed by the owner");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
  });
}

test("spec view-home step 02: what we do cards preserve service order, decorative card images, and reduced-motion stillness", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const section = page.locator('section[aria-labelledby="what-title"]');
  const cards = section.locator("a.service-card");
  await expect(cards).toHaveCount(5);

  const hrefs = await cards.evaluateAll((els) => els.map((el) => el.getAttribute("href")));
  expect(hrefs).toEqual([
    "/services/fumigation",
    "/services/cleaning",
    "/services/waste-collection",
    "/services/landscaping",
    "/services/consultancy",
  ]);

  const photos = cards.locator("img.card-photo-img");
  await expect(photos).toHaveCount(5);
  for (let i = 0; i < 5; i++) {
    await expect(photos.nth(i)).toHaveAttribute("alt", "");
    await expect(photos.nth(i)).toHaveAttribute("loading", "lazy");
  }

  const firstCardItem = section.locator("li.service-card-item").first();
  await expect(firstCardItem).toBeVisible();
  await expect(firstCardItem).not.toHaveAttribute("tabindex");
  await expect(firstCardItem).toHaveCSS("transform", "none");
  await expect(firstCardItem).toHaveCSS("opacity", "1");
  await expect(page.locator('main img:not([alt=""])')).toHaveCount(0);
});

test("spec view-home step 03: who we work with customer cards render workflow steps, decorative card images, and reduced-motion stillness", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const section = page.locator('section[aria-labelledby="who-title"]');
  const cards = section.locator("article.audience-card");
  await expect(cards).toHaveCount(2);
  await expect(cards.nth(0).getByRole("heading", { level: 3, name: "Organisations" })).toBeVisible();
  await expect(cards.nth(1).getByRole("heading", { level: 3, name: "Households" })).toBeVisible();

  await expect(section.getByRole("link", { name: "Request a quote for an organisation" })).toHaveAttribute("href", "/quote");
  await expect(section.getByRole("link", { name: "Request a quote for your home" })).toHaveAttribute("href", "/quote");

  await expect(section.locator(".audience-step")).toHaveCount(8);
  const photos = section.locator("img.card-photo-img");
  await expect(photos).toHaveCount(2);
  for (let i = 0; i < 2; i++) {
    await expect(photos.nth(i)).toHaveAttribute("alt", "");
    await expect(photos.nth(i)).toHaveAttribute("loading", "lazy");
  }

  for (let i = 0; i < 2; i++) {
    await expect(cards.nth(i)).toHaveCSS("opacity", "1");
    await expect(cards.nth(i)).toHaveCSS("transform", "none");
  }
  await expect(page.locator('main img:not([alt=""])')).toHaveCount(0);
});

test("spec view-home edge case 02: no statistics, badges or certification claims", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).not.toContainText(/ISO|\d+\+|clients served|certified/i);
});

test("spec view-home edge case 03: all images in main are decorative and backdrop/card images degrade cleanly", async ({ page, request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toContain('rel="preload"');
  expect(html).toContain('href="/hero-juba-1x.avif"');
  expect(html).toMatch(/fetchpriority="high"/i);

  await page.goto("/");
  await expect(page.locator('main img:not([alt=""])')).toHaveCount(0);

  const backdrop = page.locator(".hero-backdrop");
  await expect(backdrop).toHaveAttribute("aria-hidden", "true");
  const bgImage = await backdrop.evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(bgImage).toContain("hero-juba");

  if (test.info().project.name === "desktop") {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const slipBox = await page.locator('form[aria-labelledby="slip-title"]').boundingBox();
    const ctaBox = await page.locator('section.hero-visual-tile a[href="/quote"]').boundingBox();
    expect(slipBox).not.toBeNull();
    expect(ctaBox).not.toBeNull();
    expect(Math.abs(slipBox!.y + slipBox!.height - (ctaBox!.y + ctaBox!.height))).toBeLessThanOrEqual(1);
  }

  await page.route("**/hero-juba-*", (route) => route.abort());
  await page.route("**/cards/*", (route) => route.abort());
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
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

test("spec ui-shell: document head declares SVG, ICO, PNG, and Apple touch icons that load cleanly", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator('head link[rel="icon"][href="/favicon.ico"]')).toHaveCount(1);
  await expect(page.locator('head link[rel="icon"][type="image/svg+xml"][href="/favicon.svg"]')).toHaveCount(1);
  await expect(page.locator('head link[rel="icon"][type="image/png"][href="/favicon.png"]')).toHaveCount(1);
  await expect(page.locator('head link[rel="apple-touch-icon"][href="/apple-touch-icon.png"]')).toHaveCount(1);

  for (const iconPath of ["/favicon.svg", "/favicon.ico", "/favicon.png", "/apple-touch-icon.png"]) {
    const res = await request.get(iconPath);
    expect(res.status()).toBe(200);
    expect((await res.body()).byteLength).toBeGreaterThan(100);
  }
});

test("spec view-privacy edge case 01: the page says how to ask for deletion", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByText(/To have your details corrected or deleted/)).toBeVisible();
});
