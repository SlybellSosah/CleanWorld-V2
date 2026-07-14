# UX Architecture & Strategy Document: Clean World Inc.

This document outlines the UX architecture, brand design guidelines, global sitemap, core user flows, and wireframe layouts for **Clean World Inc.** The platform is engineered to translate Clean World's physical corporate presence in South Sudan into a high-converting digital ecosystem. It is designed to target high-level corporate stakeholders (including oilfield and aviation sectors) while housing interactive features for service quotes, booking, product retail, and professional certifications.

---

## 1. Executive Summary & Brand Positioning

### Brand Overview & Market Context
Clean World Inc. is established as South Sudan’s leading environmental consultancy and facility management partner. Since its founding in 2021, the company has operated from Juba, bridging the gap between sterile hygiene and active ecological restoration. 

The digital presence is designed to serve as an authoritative B2B portal and commercial conversion engine targeting:
* **High-Level Corporate Stakeholders & HSE Officers:** Multinational oilfields, aviation companies, and corporate offices seeking certified facility management partners compliant with international Health, Safety, and Environment (HSE) standards.
* **Local Businesses & Estates:** Seeking fumigation, pest control, and professional landscaping services.
* **Eco-Conscious Organizations:** Looking to purchase bulk green cleaning products that are non-toxic and biodegradable.
* **Professional Cleaning Technicians:** Seeking industry certifications and environmental training modules via the Academy.

### ### Strategic Design System & Color Tokens (Premium Dark Mode)
To subconsciously communicate safety, authority, ecological restoration, and cutting-edge innovation, the website's layout is governed by a precision-engineered dark-mode palette:

| Token Name | Hex Code | Semantic UI / UX Function |
| :--- | :--- | :--- |
| **Deep Navy Canvas** | `#0F172A` / `#020617` | **Primary Background:** Canvas color for root layouts to guarantee premium high contrast. |
| **Clean Slate** | `#1E293B` | **Card Surface:** Main background for cards, tables, and popup modals. |
| **Pristine White** | `#FFFFFF` | **Text Primary:** High-contrast main headers and primary typography. |
| **Muted Blue-Gray** | `#94A3B8` | **Text Secondary:** Body copy, descriptions, and structural metadata. |
| **Sustainable Green** | `#10B981` | **Sustainability/Success:** Success states, verified badges, and environmental markers. |
| **Sky Blue** | `#38BDF8` | **Primary Accent:** Border glows, maps telemetry pathing, and tooltip overlays. |
| **Tactical Yellow** | `#F9F54B` | **Call-to-Action:** Main CTAs, scheduling, and highlighted notifications. |

---

## 2. Global Sitemap & Information Architecture

The directory sitemap outlines the page hierarchy, dividing access between the public brand narrative, the interactive quote/booking flows, the e-commerce store, the academy, and the secure client/student panels.

```text
Clean World Inc. (Root View State / App)
├── Public Brand & Corporate Narrative (ActiveView.Home)
│   ├── Hero Section (Full-screen solar Juba background, Zip checker)
│   ├── About & Mission Section (Est. 2021, Juba history)
│   ├── Services Grid Summary (Teaser grid of 4 pillars)
│   ├── Advantage Section (100% South Sudanese, HSE compliant)
│   ├── Leadership Portal (CEO Statement)
│   └── Contact & stand-by Emergency Banner
│
├── Dynamic Services Dashboard (ActiveView.Services)
│   ├── Environmental Consultancy Tab (Active sectors SVG donut, nilepet B2B modal)
│   ├── Cleaning & Waste Management Tab (Cleaning vs. Waste services switcher)
│   ├── Fumigation & Pest Control Tab (Treatment intensity tier calculator)
│   └── Landscaping & Garden Design Tab (Soil & Turf restoration sizer)
│
├── B2B Quote & Booking Wizard (ActiveView.QuoteFlow)
│   ├── Step 1: Scoping (Standard items, or conditional volume slider/risk tier for Waste)
│   ├── Step 2: Scheduling (Calendars and subscription discount rates)
│   ├── Step 3: Checkout (Address input, GPS coordinates map pinning, Mobile money gateway selection)
│   └── Step 4: Confirmation (Receipt invoice reference and telemetry details)
│
├── Eco-Shop (ActiveView.Shop)
│   ├── Shopping Catalog (MSDS sheets, Subscribe & Save widgets)
│   ├── Cart Drawer (Interactive quantity modifiers)
│   └── Order confirmation log
│
├── Educational Hub / Academy (ActiveView.Academy)
│   ├── Mode Selector: On-Site Team Bootcamps vs. Low-Data Digital Portal
│   ├── B2B Group Estimator & Manager Compliance Dashboard
│   └── Registry Verification Lookup (Verify certificate codes against Juba database)
│
├── Client Dashboard (ActiveView.ClientDashboard)
│   ├── Active Cleaning Bookings (List of schedule bookings)
│   ├── Live Cleaner Crew Telemetry Vehicle Tracker (Simulated real-time dispatch map)
│   └── Product Order History logs
│
└── Provider / Cleaner Portal (ActiveView.CleanerPortal)
    ├── Assigned Route List dashboard
    └── Cleaner Active Route Guidance Map (Assigned job route mapping)
```

---

## 3. Core Feature Specifications & User Flows

### A. Instant Service Quotes & Scope Builder
* **User Flow:**
  1. Corporate client clicks "Get a Quote" (highlighted in Tactical Yellow).
  2. Selects service pillar and specifies specs (e.g. bedrooms/bathrooms, or conditional volume slider/risk tier for Waste).
  3. Dynamic invoice calculations adapt in real-time.
  4. User clicks "Select Schedule" and proceeds to lock in the booking parameters.
* **Key UI Components:**
  - **Pillar Selector:** Visual tab grid with custom icons mapping to the 4 services.
  - **Dynamic Estimator Slider:** Sliders configured for refuse volume sizers.
  - **Invoice Sidebar:** A floating sidebar showing total estimated costs, subscription discounts, taxes, and SSP conversion estimates in real-time.

### B. B2B Booking Engine & Geolocation
* **User Flow:**
  1. Flow transitions from the Quote selector.
  2. **Calendar:** User selects dates and arrival time windows.
  3. **Address & Pinning:** User chooses Juba neighborhood, and drags a marker on the map to pin exact coordinates.
  4. **Payment Gateways:** User enters contact profile and selects MTN MoMo, Zain Cash, m-GURUSH, or Cash.
  5. If mobile wallet is selected, triggers simulated USSD 4-digit PIN verification modal before confirming.
* **Key UI Components:**
  - **Multistep Progress Tracker:** Stepper indicating steps: Your Clean -> Schedule -> Checkout -> Receipt.
  - **Interactive Map Pinning:** Leaflet coordinate-capture map centered on Juba.
  - **USSD Push Verification:** Simulates network transit checks with animated loading spinner.

### C. Eco-Shop (HSE-Compliant Supplies)
* **User Flow:**
  1. User enters Shop to source non-toxic, eco-certified cleaning chemicals.
  2. Search bar filters by query, category, and catalog entries.
  3. Reviews biological ingredients and MSDS sheets.
  4. Clicks "Add to Cart" or modifies quantity, opening a slide-out cart.
  5. Checkout log records transaction status with m-GURUSH option.
* **Key UI Components:**
  - **Subscribe & Save Toggle:** Widget allowing B2B recurring supplies at a 15% discount.
  - **Material Safety Data Sheet (MSDS) Download Button:** A dedicated PDF link on product details.
  - **Cart Drawer:** Quantity selector and clear cart helpers.

### D. Educational Hub & LMS (Academy)
* **User Flow:**
  1. Trainee selects training mode (On-Site Team Bootcamp vs. Digital Portal).
  2. On-Site mode allows using the B2B trainee sizer and regional dispatch calculator.
  3. Digital mode features a Manager Compliance Dashboard to monitor team progress.
  4. Trainee uses registry lookup to verify ID codes (e.g., `CW-CERT-4201`).
* **Key UI Components:**
  - **B2B Group Estimator:** Trainee increment buttons and location selector.
  - **B2B Manager Dashboard:** Progress tracking bars for John Garang, Rebecca Nyandeng, Emmanuel Deng, Kevin Aber Jr.
  - **Registry Lookup Form:** Input field returning validation states (`VALID CERTIFICATE LEDGER` vs `Search Error`).

---

## 4. Page-by-Page Wireframe Layouts

### Homepage Wireframe (Six-Section Narrative Flow)
The homepage structure is designed to guide high-level stakeholders through a logical narrative, establishing credibility and converting interest into action.

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo] Clean World Inc.      Services   Shop   Academy   [Get a Quote] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ 1. HERO SECTION (High-impact visual banner)                    │   │
│   │   [Background: Full-Screen Solar-Powered Juba Infrastructure]  │   │
│   │                                                                │   │
│   │   Headline:  "Clean . Green . Sustainable."                    │   │
│   │   Sub-head:  "South Sudan’s trusted guide for a cleaner,       │   │
│   │              greener future."                                  │   │
│   │                                                                │   │
│   │   [Check Availability (Juba)]  [Get Instant Quote (Tactical)]  │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ 2. ABOUT & MISSION SECTION                                     │   │
│   │   Narrative: Founded in 2021, leading environmental            │   │
│   │   consultancy in South Sudan. Dedicated to bridging the        │   │
│   │   gap between sterile hygiene and active ecological restoration.│   │
│   │   [Learn Our History]                                          │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ 3. OUR INTEGRATED ECOSYSTEM (Services Grid)                    │   │
│   │   ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌────────┐ │   │
│   │   │ Consultancy   │ │ Facility Mgmt │ │ Fumigation    │ │ Green  │ │   │
│   │   │ HSE Audits    │ │ B2B Corporate │ │ Pest Control  │ │ Land-  │ │   │
│   │   └───────────────┘ └───────────────┘ └───────────────┘ └────────┘ │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ 4. THE CLEAN WORLD ADVANTAGE                                   │   │
│   │   - 100% South Sudanese Owned                                  │   │
│   │   - Certified Environmental Consultants                        │   │
│   │   - Full PPE Compliance & Strict HSE International Standards   │   │
│   │   - Non-Toxic, Eco-Friendly Biological Chemicals               │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ 5. LEADERSHIP PORTAL (CEO Statement)                           │   │
│   │   Kevina Aber, CEO & Founder:                                  │   │
│   │   "We are not just maintaining your facilities;                │   │
│   │    we are protecting your future."                             │   │
│   │   [Read Executive Message]                                     │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ 6. CONTACT & RAPID RESPONSE PORTAL                             │   │
│   │   Location: Hai Kuwait, Juba, South Sudan                      │   │
│   │   Email: info@cleanworld.com   Phone: +211 924 444 044         │   │
│   │                                       +211 917 105 461         │   │
│   │   [⚠️ Emergency Response Teams Standing By 24/7 Banner]          │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ Footer: Location Map Links, Verification Registry Lookup, Next.js SEO  │
└────────────────────────────────────────────────────────────────────────┘
```

### B2B Quote & Booking Layout
```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo]                      Progress: [■■■□□] 3. Geolocation & Location│
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌───────────────────────────────┐   ┌────────────────────────────┐   │
│   │ 1. ASSIGN SITE COORDINATES    │   │ ESTIMATED PROJECT SCOPE    │   │
│   │                               │   │                            │   │
│   │ Address: [Hai Kuwait, Juba  ] │   │  Pillar: Facility Mgmt     │   │
│   │                               │   │  Area Size: 2,500 sq meters│   │
│   │ ┌───────────────────────────┐ │   │  HSE Class: Standard       │   │
│   │ │ [📍 Drag Map Marker to ]  │ │   │  ────────────────────────  │   │
│   │ │   Exact Facility Gate     │ │   │  Base Rate:       $850.00  │   │
│   │ │                           │ │   │  Discount (Contract):-$120.00│   │
│   │ └───────────────────────────┘ │   │  Estimated Total: $730.00  │   │
│   │ Lat: 4.85329   Lng: 31.58301  │   │                            │   │
│   │                               │   │  [ Request Assessment ]    │   │
│   │ [ Back ]    [ Continue ]      │   │                            │   │
│   └───────────────────────────────┘   └────────────────────────────┘   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Technical Integration & UX Triggers Checklist

### A. SEO, Indexability & Auditing
- [ ] **Next.js Pre-Rendering:** All public pages utilize static generation (SSG) or dynamic server rendering (SSR) to ensure full text and HTML tags are served to web crawl spiders.
- [ ] **Rank Math & Meta Tags:** Unique titles, descriptions, and OpenGraph parameters mapped to all routes.
- [ ] **Noindex Security Audits:** Automatic checks configured in CI pipelines to prevent any accidental deployment of `<meta name="robots" content="noindex">` on production URLs.
- [ ] **Structured Schema (JSON-LD):**
  - `LocalBusiness` configured on the homepage, identifying Juba address coordinates, operating hours, and customer service lines.
  - `Product` schema on the store page (indexing prices and safety specs).
  - `Course` schema on Academy pages (indexing certifications).

### B. Core Web Vitals (CWV) Performance
- [ ] **Image Optimization:** All corporate assets (such as Juba solar site photography) optimized using the Next.js `<Image>` component to serve `.webp`/`.avif` formats dynamically.
- [ ] **Cumulative Layout Shift (CLS) Guard:** Explicit width/height proportions set on all images, bento cards, and interactive map blocks to prevent screen shifts.
- [ ] **Font Caching:** Fonts loaded locally using `font-display: swap` to prevent visual delays.

### C. UX Triggers & Mobile Interactions
- [ ] **CSS Inputs Validation:** Use of CSS `:user-valid` and `:user-invalid` selectors to provide instant green/red outline feedback during address or phone number entries.
- [ ] **Skeleton Loaders:** Displayed for coverage maps, calendar slots, and checkout details during loading events.
- [ ] **Mobile Touch Optimization:** Large touch targets (minimum 48x48px) for toggles, forms, and shopping cart slides to accommodate field operators on mobile devices.
- [ ] **WhatsApp Integration:** Floating action button positioned bottom-right with pre-defined quick message templates for rapid corporate inquiries.