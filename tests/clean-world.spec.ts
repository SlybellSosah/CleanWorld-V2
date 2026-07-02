import { test, expect } from '@playwright/test';

test.describe('Clean World Inc E2E Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to local website
    await page.goto('/');
  });

  test('HSE Compliance Academy certificate verification registry', async ({ page }) => {
    // Click Training Academy navbar link
    await page.locator('#nav-link-academy').click();

    // Verify header exists
    await expect(page.getByRole('heading', { name: 'Verify HSE Credentials' })).toBeVisible();

    // 1. Test invalid certificate ID
    await page.getByPlaceholder('Enter Certificate ID (e.g. CW-CERT-4201)').fill('CW-CERT-0000');
    await page.getByRole('button', { name: 'Verify Certificate' }).click();

    // Assert validation error card is shown
    await expect(page.locator('text=No certificate matching "CW-CERT-0000" was located')).toBeVisible();

    // 2. Test valid certificate ID
    await page.getByPlaceholder('Enter Certificate ID (e.g. CW-CERT-4201)').fill('CW-CERT-4201');
    await page.getByRole('button', { name: 'Verify Certificate' }).click();

    // Assert student details card is shown
    await expect(page.locator('text=VALID CERTIFICATE LEDGER')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Rebecca Nyandeng' })).toBeVisible();
    await expect(page.locator('text=Course: Safe Chemical & Cleaning Product Handling')).toBeVisible();
    await expect(page.locator('text=RSS MOE & WHO')).toBeVisible();
  });

  test('B2B Quote Funnel Booking and Invoice Receipt Coordinates', async ({ page }) => {
    // Click Get a Free Quote CTA button in navbar
    await page.locator('#nav-cta-assessment').click();

    // Step 1: Click "Select Schedule"
    await expect(page.getByText('Select Special Add-ons')).toBeVisible();
    await page.getByRole('button', { name: 'Select Schedule' }).click();

    // Step 2: Click "Proceed to Checkout"
    await expect(page.getByText('Arrival Time Window')).toBeVisible();
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();

    // Step 3: Enter checkout details
    await expect(page.getByRole('heading', { name: 'Complete booking checkout' })).toBeVisible();

    const checkoutForm = page.locator('#step3-checkout');
    await checkoutForm.getByPlaceholder('e.g. Rebecca Nyandeng').first().fill('Rebecca Nyandeng');
    await checkoutForm.getByPlaceholder('e.g. rebecca@juba.com').fill('rebecca@juba.com');
    await checkoutForm.getByPlaceholder('e.g. +211 912 400 300').fill('+211 912 400 300');
    await checkoutForm.getByPlaceholder('e.g. Plot 42, Airport Road, Tongping').fill('Plot 42, Airport Road, Tongping');

    // Fill in required mobile money details (default MTN MoMo)
    await checkoutForm.getByPlaceholder('e.g. +211 928 300 401').fill('+211 928 300 401');

    // Verify map container is visible
    const mapContainer = page.locator('#step3-checkout .h-64');
    await expect(mapContainer).toBeVisible();

    // Click Authorize & Book
    await page.getByRole('button', { name: 'Authorize & Book' }).click();

    // Fill USSD PIN in MTN MoMo verification modal
    await expect(page.getByText('MTN MoMo Verification')).toBeVisible();
    await page.getByPlaceholder('••••').fill('1234');
    await page.getByRole('button', { name: 'Confirm & Authorize' }).click();

    // Verify confirmation and invoice reference receipt
    await expect(page.locator('#receipt-card')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Booking Confirmed!' })).toBeVisible();
    await expect(page.locator('text=GPS Pinned Location')).toBeVisible();
  });

  test('Live Cleaner Crew Telemetry Vehicle Tracker', async ({ page }) => {
    // Click Client Portal navbar link
    await page.locator('#nav-link-client-dashboard').click();

    // Verify Dashboard active bookings list renders
    await expect(page.getByText('Your Cleaning Bookings')).toBeVisible();

    // Locate the first pending booking and click "Track Crew"
    const trackCrewBtn = page.getByRole('button', { name: 'Track Crew' }).first();
    await expect(trackCrewBtn).toBeVisible();
    await trackCrewBtn.click();

    // Verify tracking modal displays telemetry details
    await expect(page.getByText('LIVE VEHICLE DISPATCH TRACKER')).toBeVisible();
    await expect(page.getByText('ESTIMATED ARRIVAL')).toBeVisible();
    await expect(page.getByText('Juba Plate: SSD-309A')).toBeVisible();

    // Close the tracker modal
    await page.getByRole('button', { name: 'Close Tracker' }).click();
    await expect(page.getByText('LIVE VEHICLE DISPATCH TRACKER')).not.toBeVisible();
  });

  test('Cleaner Portal Active Route Guidance Map', async ({ page }) => {
    // Click Cleaner Dispatch navbar link
    await page.locator('#nav-link-cleaner-portal').click();

    // Verify Cleaner Active Jobs Dashboard
    await expect(page.getByText("Today's Assigned Route")).toBeVisible();

    // Select the first assigned job card by its booking ID prefix "CW-"
    const jobCard = page.locator('button:has-text("CW-")').first();
    await expect(jobCard).toBeVisible();
    await jobCard.click();

    // Verify that the route map component and customer details open
    await expect(page.locator('.border-slate-855')).toBeVisible();
    await expect(page.getByText('Access & Entry Code')).toBeVisible();
  });

  test('Search Engine Indexability, OpenGraph, & JSON-LD Structured Schema dynamic updates', async ({ page }) => {
    // 1. Check Homepage SEO & Metadata
    await expect(page).toHaveTitle('Clean World Inc. | Clean . Green . Sustainable.');

    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /Clean World Inc. is South Sudan’s leading/);

    const metaRobots = page.locator('meta[name="robots"]');
    await expect(metaRobots).toHaveAttribute('content', 'index, follow');

    // Check OpenGraph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', 'Clean World Inc. | Clean . Green . Sustainable.');

    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute('content', 'website');

    // Check JSON-LD local business schema
    const schemaScript = page.locator('script#clean-world-jsonld-schema');
    await expect(schemaScript).toHaveAttribute('type', 'application/ld+json');
    const schemaContent = await schemaScript.textContent();
    expect(schemaContent).toContain('LocalBusiness');
    expect(schemaContent).toContain('Hai Kuwait, Juba');

    // 2. Navigate to Client Dashboard (Secure Portal) - Should exclude indexing
    await page.locator('#nav-link-client-dashboard').click();
    await expect(page).toHaveTitle('Client Dashboard | Clean World Inc.');
    await expect(metaRobots).toHaveAttribute('content', 'noindex, nofollow');

    // 3. Navigate to Cleaner Portal (Secure Portal) - Should exclude indexing
    await page.locator('#nav-link-cleaner-portal').click();
    await expect(page).toHaveTitle('Cleaner Portal | Clean World Inc.');
    await expect(metaRobots).toHaveAttribute('content', 'noindex, nofollow');

    // 4. Navigate back to a public view (Academy) - Should re-enable indexing & Course schema
    await page.locator('#nav-link-academy').click();
    await expect(page).toHaveTitle('Academy (LMS) | Clean World Inc.');
    await expect(metaRobots).toHaveAttribute('content', 'index, follow');

    // Verify Course schema exists
    const academySchemaContent = await schemaScript.textContent();
    expect(academySchemaContent).toContain('Course');
    expect(academySchemaContent).toContain('Mosquito & Vector Control');
  });

});
