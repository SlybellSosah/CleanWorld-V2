import type { Page } from "@playwright/test";

export async function fillHousehold(page: Page, name = "Test Customer") {
  await page.getByLabel("A household").check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Service", { exact: true }).selectOption("cleaning");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Neighbourhood").selectOption("Tongping");
  await page.getByLabel("Nearest landmark").fill("Near the airport gate");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Your name").fill(name);
  await page.getByLabel("Phone number").fill("0912 345 678");
}

export const REFERENCE = /^CW-[2-9A-Z]{4}-[2-9A-Z]{4}$/;
