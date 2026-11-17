import { expect, test } from "@playwright/test";

test.describe("spec view-admin", () => {
  test("staff see a request with tap-to-call phone in the row and can change its status", async ({ page, request }) => {
    const name = `Admin ${Date.now()} ${test.info().project.name}`;
    const created = await (
      await request.post("/api/quotes", {
        data: { id: crypto.randomUUID(), customerType: "household", service: "cleaning", neighbourhood: "Munuki", name, phone: "0922000111" },
      })
    ).json();
    const reference: string = created.data.reference;

    await page.goto("/admin");
    const row = page.locator("li", { hasText: reference });
    await expect(row.locator('summary a[href="tel:+211922000111"]')).toBeVisible();
    await row.locator("summary").click();
    await expect(row.getByText(name).first()).toBeVisible();
    await row.getByLabel("Status").selectOption("contacted");

    await expect
      .poll(async () => {
        const list = await (await request.get("/api/admin/quotes?status=contacted")).json();
        return list.data.quotes.some((q: { reference: string }) => q.reference === reference);
      })
      .toBe(true);
  });

  test("edge case 06: a failed status update restores only that row's previous value", async ({ page, request }) => {
    const created = await (
      await request.post("/api/quotes", {
        data: { id: crypto.randomUUID(), customerType: "household", service: "cleaning", neighbourhood: "Kator", name: "Rollback Test", phone: "0922000222" },
      })
    ).json();
    await page.goto("/admin");
    const row = page.locator("li", { hasText: created.data.reference });
    await row.locator("summary").click();
    await page.route("**/api/admin/quotes/*", (route) => route.abort());
    await row.getByLabel("Status").selectOption("won");
    await expect(page.getByRole("alert")).toContainText("Could not update");
    await expect(row.getByLabel("Status")).toHaveValue("new");
  });

  test("edge case 07: the staff page is not indexable and excluded from sitemap.xml", async ({ page, request }) => {
    await page.goto("/admin");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /admin");
    expect(robots).toContain("Sitemap: https://cleanworld.live/sitemap.xml");

    const sitemapRes = await request.get("/sitemap.xml");
    expect(sitemapRes.status()).toBe(200);
    const sitemap = await sitemapRes.text();
    expect(sitemap).toContain("<loc>https://cleanworld.live/</loc>");
    expect(sitemap).toContain("<loc>https://cleanworld.live/services/fumigation</loc>");
    expect(sitemap).not.toContain("/admin");
    expect(sitemap).not.toContain("/404");
  });
});
