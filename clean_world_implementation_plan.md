# Implementation Plan: Clean World Inc. Corporate Portal

This plan details the technical steps to build the brand-new B2B corporate digital portal for **Clean World Inc.** in South Sudan, following the approved UX Architecture & Strategy Document.

---

## 1. Goal Description
The objective is to implement a high-performance, responsive Single Page Application (SPA) in Vite + React styled with Tailwind CSS and Vanilla CSS. The site translates Clean World's physical corporate presence in Juba, South Sudan into a premium B2B ecosystem. It features:
* An authoritative **6-section narrative landing page**.
* An **instant B2B quotes calculator** and scheduling tool.
* An **Eco-Shop** for HSE-compliant bulk cleaning supplies.
* An **Academy (LMS)** for professional safety and cleaning certifications.
* **Interactive Leaflet maps** for coordinates pinning, route planning, and cleaner crew vehicle telemetry tracking.

---

## 2. User Review Required

> [!IMPORTANT]
> **Tech Stack Confirmation:** We initialized a Vite + React application in `/home/pop_i9/Development/Web/Clean_World_Inc` utilizing Tailwind CSS and Vanilla CSS for styling.
> **Dependency Approvals:** We installed the following NPM packages:
> - `leaflet` (for geolocation coordinates mapping and live tracking).
> - `lucide-react` (for clean SVG icons mapping).
> - `motion` (for smooth micro-animations).

---

## 3. Proposed Changes

Scaffolded the application in the `Clean_World_Inc` directory.

### [Component 1] Core Design System & Configuration

#### [MODIFY] package.json
Configure dependencies, scripts, and build outputs for Vite + React.

#### [MODIFY] src/index.css
Declare custom brand variables and base overrides:
- Accent Tones: Sustainable Green/Teal (`#10B981`), Sky Blue (`#38BDF8`), and Tactical Yellow (`#F9F54B`).
- Primary background (`#0F172A`), card surface (`#1E293B`).
- Modern font pairings (Outfit for headings, Inter for body, JetBrains Mono for telemetry).
- Glassmorphic card classes.

---

### [Component 2] Public Brand & Home Layout

#### [NEW] src/components/LandingPage.tsx
Implement the **six-section narrative landing page flow** in this exact order:
1. **Hero Section:** Full-screen solar-powered Juba infrastructure background, headline "Clean . Green . Sustainable.", Zip check gatekeeper inputs.
2. **About & Mission:** Established in 2021, bridging hygiene and active restoration.
3. **Integrated Services Grid:** Multi-column interactive grid for the 4 pillars (Consultancy, Facility Management, Fumigation, Landscaping).
4. **Clean World Advantage:** Key authority bullet points (100% South Sudanese owned, HSE compliant).
5. **Leadership Portal:** Pinned CEO Statement quoting Kevina Aber, highlighted with yellow border framing.
6. **Contact & Rapid Response Portal:** Hai Kuwait office coordinates in Juba and active 24/7 standby emergency banners.

---

### [Component 3] Dynamic Quote & Booking Funnel

#### [NEW] src/components/QuoteWizard.tsx
- **Step 1 (Scoping):** Handles bedrooms, bathrooms, square footage, standard/deep/move-in-out cleans. For Waste Management services, dynamically renders a volume slider (1 - 100 m³) and material risk tier (Class I Low, Class II Med, Class III High) with HSE compliance add-ons. Center coordinate pinning Leaflet map centered on Juba (Tongping, Gudele, Munuki, Amarat, Kololo, Kator, Juba 3).
- **Step 2 (Scheduling):** Availability calendars and subscription frequency discounts: Weekly (20% off), Bi-Weekly (15% off), Monthly (10% off), One-Time.
- **Step 3 (Checkout):** Inputs Juba address, and secure mobile money push requests (MTN MoMo, Zain Cash, m-GURUSH) simulating USSD 4-digit PIN verification modals and Cash on Arrival options.
- **Step 4 (Receipt):** Renders invoice reference number, GPS pinned coordinates, and total billing breakdown.

---

### [Component 4] Shop & Academy Portals

#### [NEW] src/components/EcoShopPage.tsx
Bento-grid shopping catalog featuring bulk biological detergents, search tools, Material Safety Data Sheet (MSDS) downloads, and Subscribe & Save widgets (15% discount).

#### [NEW] src/components/AcademyPage.tsx
Allows toggling between:
1. **On-Site Team Bootcamps:** Renders syllabus details, trainee sizer, regional dispatch hubs (Juba, Wau, Malakal, Yei, Kampala, Nairobi) with travel fees and tax levy.
2. **Low-Data Digital Portal:** Renders offline PDF guides, SMS/WhatsApp progress alerts, and B2B Manager Compliance Dashboard.
- **Certificate Registry Lookup:** Verifies issued badge credentials (`VALID CERTIFICATE LEDGER`, `RSS MOE & WHO APPROVED STAMP`) against verification database.

---

## 5. Verification Plan

### Automated Tests
- Run `npm run lint` to verify clean builds.
- Execute validation scripts to check that `<meta name="robots" content="noindex">` is absent from production headers.

### Manual Verification
- Deploy local dev server at `http://localhost:3000`.
- Verify the landing page narrative sections stack correctly and look premium on desktop/mobile screens.
- Test the Quote Slider to ensure totals calculate dynamically based on square dimensions.
- Test address coordinates selection on the Leaflet mapping component centered on Juba.
- Confirm payment processing via USSD pin input triggers successful booking completion.
- Confirm dynamic robots tag injection works correctly (noindex on dashboard, index on public landing page/academy).
