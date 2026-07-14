# Clean World Inc. - Project Dashboard

Welcome to the central project dashboard for **Clean World Inc.**, South Sudan's premier eco-responsible hygiene service booking and dispatch platform.

---

## 🚀 Project Overview

Clean World Inc. connects B2B corporate entities, residential clients, and field cleaner operations in South Sudan. The portal integrates advanced service scoping, geolocation route mapping, certificate credential verification registries, and secure billing flows (including local mobile money push networks).

### 🛠️ Technology Stack
- **Frontend Core:** React 19 (TypeScript) + Vite 6
- **Styling:** CSS-first design with Vanilla CSS & Tailwind CSS
- **Interactivity:** Motion (framer-motion) & Leaflet maps (GPS coordinates mapping / route visualization)
- **Quality Assurance:** Playwright E2E integration tests & static types checking

---

## 🚪 System Portals

The application supports three distinct portals:
1. **Client Portal (`ActiveView.Home`, `ActiveView.Services`, `ActiveView.Shop`, `ActiveView.ClientDashboard`)**
   - Public marketing & narrative (history, advantages, 4 service pillars).
   - Eco-Shop: Bulk biological detergents and Subscribe & Save widgets with MSDS links.
   - Client Dashboard: Private authenticated view containing cleaning orders history and crew dispatch maps.
2. **Provider (Cleaner) Portal (`ActiveView.CleanerPortal`)**
   - Simulated subdomain: `ops.cleanworld.live` with offline optimization parameters.
   - GPS route planning and mobile-optimized checklists.
3. **B2B Environmental Scoping Portal**
   - Renders animated SVG donut sectors demonstrating regulatory environmental compliance scopes (EIA, ESG, etc.).
   - Access to B2B scoping audit request flows for corporate groups (Nilepet, Dar Petroleum).

---

## 🌲 The 4 Core Service Pillars

1. **Environmental Consultancy:** Regulatory audits, Active Compliance sectors visualization, HSE docs mapping.
2. **Cleaning & Logistics:** Standard corporate cleaning alongside a sub-tab switcher for **Waste Management Services** (incorporating material hazard modifiers).
3. **Fumigation & Pest Control:** Preventative, eradication, and perimeter protection treatments with Vector containment.
4. **Landscaping & Garden Design:** Lawn restoration sizers, flora rehabilitation, and native turf design layouts.

---

## 📂 Codebase Folder Layout

Following the BLAST/SDD framework specifications:
- **`/specs/`**: Contains specifications, design systems guides, domain documentation, and implementation roadmaps.
- **`/architecture/`**: Houses global architecture guidelines, pricing mathematics, sitemaps, and wireframes.
- **`/tools/`**: Reserved for automation scripts, CLI utilities, and seed managers.
- **`/src/`**: Project source code (React views, components, state management hooks, and types).
- **`/tests/`**: Playwright browser automation test suite.

---

## 📋 Guides & Checklists
- [BLAST & SDD Checklist](file:///home/pop_i9/Development/Web/Clean_World_Inc/blast_checklist.md) — Pre-development governance rules and lifecycle gates.
- [Sources & References](file:///home/pop_i9/Development/Web/Clean_World_Inc/specs/sources.md) — Index of all documentation paths.
