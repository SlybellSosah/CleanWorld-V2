import { test, expect } from '@playwright/test';
import path from 'path';

const viewports = [
  { width: 360, height: 800, name: '360px_30pct', isMobile: true },
  { width: 600, height: 800, name: '600px_50pct', isMobile: true },
  { width: 1280, height: 800, name: '1280px_100pct', isMobile: false }
];

async function navigateToView(page: any, label: string, viewId: string, isMobile: boolean) {
  if (isMobile) {
    // Open mobile menu
    const toggleBtn = page.locator('#nav-mobile-toggle');
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();
    await page.waitForTimeout(500); // Wait for transition
    // Click the button inside the mobile drawer
    const drawerLink = page.locator(`#nav-mobile-drawer button:has-text("${label}")`);
    await expect(drawerLink).toBeVisible();
    await drawerLink.click();
    await page.waitForTimeout(500); // Wait for view to update and transition
  } else {
    // Desktop: Click the nav link directly
    const navLink = page.locator(`#nav-link-${viewId}`);
    await expect(navLink).toBeVisible();
    await navLink.click();
    await page.waitForTimeout(500);
  }
}

test.describe('Capture Screenshots at Different Viewports', () => {
  for (const vp of viewports) {
    test(`Capture screenshot at ${vp.width}x${vp.height}`, async ({ page }) => {
      // Set viewport size
      await page.setViewportSize({ width: vp.width, height: vp.height });
      
      // Navigate to home page
      await page.goto('/');
      await page.waitForTimeout(1000); // let animations settle
      
      // Take screenshot of home page
      await page.screenshot({
        path: `screenshot_home_${vp.name}.png`,
        fullPage: true
      });

      // Navigate to Academy
      await navigateToView(page, 'Training Academy', 'academy', vp.isMobile);
      await page.screenshot({
        path: `screenshot_academy_${vp.name}.png`,
        fullPage: true
      });

      // Navigate to Services
      await navigateToView(page, 'Services', 'services', vp.isMobile);
      await page.screenshot({
        path: `screenshot_services_${vp.name}.png`,
        fullPage: true
      });

      // Navigate to Shop
      await navigateToView(page, 'Shop', 'shop', vp.isMobile);
      await page.screenshot({
        path: `screenshot_shop_${vp.name}.png`,
        fullPage: true
      });

      // Navigate to Client Portal
      await navigateToView(page, 'Client Portal', 'client-dashboard', vp.isMobile);
      await page.screenshot({
        path: `screenshot_client_${vp.name}.png`,
        fullPage: true
      });

      // Navigate to Cleaner Dispatch
      await navigateToView(page, 'Cleaner Dispatch', 'cleaner-portal', vp.isMobile);
      await page.screenshot({
        path: `screenshot_cleaner_${vp.name}.png`,
        fullPage: true
      });
    });
  }
});
