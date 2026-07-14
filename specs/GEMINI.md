# Competitive Cleaning & Environmental Business App Specifications

This document outlines the custom instructions, system rules, and design specifications for generating and coding features for the Clean World booking platform.

## System Architecture & Roles
The application supports three distinct portals built on a shared state model:
- **Client Portal:** Access to a multi-step booking funnel, scheduling dashboard, mobile money push / Cash billing, and tipping.
- **Provider (Cleaner) Portal:** Access to a mobile-optimized routing view, job checklists, and photo-upload validation.
- **B2B Environmental Scoping Portal:** Technical scoping audit dashboard for large corporate clients (Nilepet, Dar Petroleum, etc.).

## The 4 Core Service Pillars
The Clean World platform highlights four key service pillars:
1. **Environmental Consultancy:** Regulatory-grade environmental audits for industrial facilities, government projects, and multinational ESG programs. Renders an animated SVG donut ring showing active compliance sectors (EIA, Waste Mapping, HSE Docs, ESG Scoring).
2. **Cleaning Services:** Integrates standard B2B/Residential Cleaning Services and an interactive sub-tab switcher for **Waste Management Services & Logistics**.
3. **Fumigation & Pest Control:** Treatment intensity tiers (Preventative, Eradication, Perimeter protection) with malaria vector and larvicide addons.
4. **Landscaping & Garden Design:** Lawn and garden design tiers (Mowing, Turf Engineering, Soil & Flora Restoration) with custom flower bed layouts.

---

## Core Frontend Components

### Component A: The 3-Step Wizard with Dynamic Pricing
- **Step 1: Scoping (Conditional Rendering)**
  - **Standard Cleaning/Fumigation/Landscaping:** Selectors for Bedrooms (1-6+), Bathrooms (1-4+), square footage ranges, clean depth level, and specialized add-ons.
  - **Waste Management Services:** Conditionally rendered when `isWasteService` is true. Features:
    - Volume Slider (1 - 100 m³)
    - Material Risk Classification selector (Class I Low, Class II Med, Class III High)
    - HSE Compliance Add-ons Checklist (HSE Waste Binning, Bio-Safe Solutions, Eco-Sorting)
- **Step 2: Frequency & Scheduling**
  - Frequency Selector: One-Time (Base Price), Weekly (20% off), Bi-Weekly (15% off), Monthly (10% off).
  - Date & Time Slot Picker: Integrates with Juba-local availability arrays.
- **Step 3: Secure Checkout**
  - Contact inputs, mobile money USSD push (MTN MoMo, Zain Cash, m-GURUSH) PIN validation and Cash on Arrival, and Juba neighborhood operating district selectors.
- **Persistent Sidebar (Sticky Dynamic Invoice):**
  - Displays selected options, breakdowns of fees, the subscription discount applied, taxes, and the final estimated total changing in real-time.
  - Conditionally displays refuse volume & risk multipliers for Waste dispatches instead of bedrooms/bathrooms.

### Component B: Services Page Tab Bar
- A streamlined, pill-shaped selector with four main tabs:
  - **Environmental Consultancy** (renders SVG Donut, operational specifications table, machinery tags, and opens the Nilepet B2B scoping modal).
  - **Cleaning Services** (renders secondary switcher for Cleaning vs. Waste Management).
  - **Fumigation & Pest Control** (renders size range estimators).
  - **Landscaping & Garden Design** (renders lawn size in sq meters estimators).
- Toggling tabs displays live pricing calculators and links to the booking wizard with parameters prefilled.

---

## Design Language & Aesthetics Guidelines (Premium Dark Mode)
- **Primary Background:** `#0F172A` (Deep Navy Canvas)
- **Card Surface:** `#1E293B` (Clean Slate)
- **Text Primary:** `#FFFFFF` (Pristine White)
- **Text Secondary:** `#94A3B8` (Muted Blue-Gray)
- **Primary Accent:** `#10B981` (Sustainable Teal/Green)
- **Secondary Accent:** `#38BDF8` (Sky Blue)
- **Call-to-Action:** `#F9F54B` (Tactical Yellow)
- **Typography:**
  - Headings: **Outfit** / **Space Grotesk**
  - Body: **Inter**
  - Telemetry/Metrics: **JetBrains Mono**
