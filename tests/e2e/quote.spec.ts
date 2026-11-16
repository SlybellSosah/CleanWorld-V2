import { expect, test } from "@playwright/test";
import { fillHousehold, REFERENCE } from "./helpers";

test.describe("spec view-quote", () => {
  test("a household request reaches the staff list", async ({ page, request }) => {
    const name = `E2E ${Date.now()} ${test.info().project.name}`;
    await page.goto("/quote");
    await fillHousehold(page, name);
    await page.getByRole("button", { name: "Send request" }).click();

    await expect(page.getByRole("heading", { name: "Request sent" })).toBeVisible();
    const reference = await page.getByTestId("reference").innerText();
    expect(reference).toMatch(REFERENCE);
    await expect(page.getByRole("link", { name: "Continue on WhatsApp" })).toHaveAttribute("href", new RegExp(reference));

    const list = await (await request.get("/api/admin/quotes")).json();
    const stored = list.data.quotes.find((q: { reference: string }) => q.reference === reference);
    expect(stored).toMatchObject({ name, phone: "+211912345678", neighbourhood: "Tongping", status: "new" });
  });

  test("edge case 01: a refresh restores the draft and the step", async ({ page }) => {
    await page.goto("/quote");
    await page.getByLabel("A household").check();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Service", { exact: true }).selectOption("waste-collection");
    await page.getByLabel("Tell us about the job").fill("Two bins a week");
    await page.reload();
    await expect(page.getByRole("heading", { name: "What do you need?" })).toBeVisible();
    await expect(page.getByLabel("Service", { exact: true })).toHaveValue("waste-collection");
    await expect(page.getByLabel("Tell us about the job")).toHaveValue("Two bins a week");
  });

  test("edge case 02: sending the same request twice gives one reference", async ({ request }) => {
    const data = {
      id: crypto.randomUUID(),
      customerType: "household",
      service: "fumigation",
      neighbourhood: "Gudele",
      name: "Idempotent Test",
      phone: "0912345678",
    };
    const first = await (await request.post("/api/quotes", { data })).json();
    const second = await (await request.post("/api/quotes", { data })).json();
    expect(second.data.reference).toBe(first.data.reference);
  });

  test("edge case 03: an empty required field shows a message and takes focus", async ({ page }) => {
    await page.goto("/quote");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Choose organisation or household.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Who is this for?" })).toBeVisible();
    await expect(page.getByLabel("An organisation")).toBeFocused();
  });

  test("edge case 04: a network failure keeps the details and offers retry and WhatsApp", async ({ page }) => {
    await page.goto("/quote");
    await fillHousehold(page);
    await page.route("**/api/quotes", (route) => route.abort());
    await page.getByRole("button", { name: "Send request" }).click();

    await expect(page.getByText("We could not send your request.")).toBeVisible();
    await expect(page.getByLabel("Your name")).toHaveValue("Test Customer");
    const fallback = page.getByRole("link", { name: "Send by WhatsApp instead" });
    await expect(fallback).toHaveAttribute("href", /wa\.me\/211928300400\?text=.*Tongping/);

    await page.unroute("**/api/quotes");
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByRole("heading", { name: "Request sent" })).toBeVisible();
  });

  test("edge case 05: a household is not asked for organisation details", async ({ page }) => {
    await page.goto("/quote");
    await fillHousehold(page);
    await expect(page.getByLabel("Organisation", { exact: true })).toHaveCount(0);
    await expect(page.getByLabel("Purchase order or tender reference")).toHaveCount(0);
  });

  test("edge case 07: the service in the link is pre-selected only when it exists", async ({ page }) => {
    await page.goto("/quote?service=landscaping");
    await page.getByLabel("An organisation").check();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByLabel("Service", { exact: true })).toHaveValue("landscaping");

    await page.evaluate(() => localStorage.clear());
    await page.goto("/quote?service=car-wash");
    await page.getByLabel("An organisation").check();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByLabel("Service", { exact: true })).toHaveValue("");
  });

  test("edge case 10: the form works when device storage is unavailable", async ({ page }) => {
    await page.addInitScript(() => {
      Storage.prototype.setItem = () => {
        throw new Error("storage disabled");
      };
      Storage.prototype.getItem = () => {
        throw new Error("storage disabled");
      };
    });
    await page.goto("/quote");
    await fillHousehold(page);
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page.getByRole("heading", { name: "Request sent" })).toBeVisible();
  });
});
