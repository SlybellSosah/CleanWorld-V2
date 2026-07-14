# Clean World Design System Guidelines

This document details the visual guidelines, design tokens, and CSS rules implemented across the **Clean World** platform to ensure a high-craft B2B aesthetic.

---

## 1. Design Tokens & Color System

To support the deep-tech, environmental compliance vibe, the application is locked down into a premium dark mode scheme:

| Token | CSS Variable / Hex | Usage |
|---|---|---|
| **Primary Background** | `#0F172A` | Primary canvas color for page roots |
| **Card Surface** | `#1E293B` | Main background for cards, tables, and popups |
| **Pristine White** | `#FFFFFF` | High-contrast main headers and primary text |
| **Muted Blue-Gray** | `#94A3B8` | Body copy, descriptions, and metadata |
| **Sustainable Green** | `#10B981` | Success states, active tags, and environmental markers |
| **Sky Blue** | `#38BDF8` | Primary accent, border glows, and tooltips |
| **Tactical Yellow** | `#F9F54B` | Main call-to-actions, scheduling buttons, and highlights |

---

## 2. Typography Hierarchy

Consistent font pairings define the premium B2B style:

- **Headings (Display):** *Outfit* or *Space Grotesk*
  - Bold, high-contrast tracking for clean title scale.
  - Examples: App headers, pillar titles, invoice totals.
- **Body Text:** *Inter*
  - Maximizes reading comfort in tables, inputs, and descriptions.
- **Telemetry & Metrics:** *JetBrains Mono* or *Fira Code*
  - Monospaced formatting for values, GPS coordinates, ZIP codes, and bill breakdowns.

---

## 3. Premium UI & Layout Guidelines

### Glassmorphism & Depth
- All active visual cards use a thin border (`border border-slate-800/80`) and a soft backdrop blur (`backdrop-blur-md bg-[#1E293B]/60`) to create layering.
- Accent shadows: Use subtle glows on priority buttons (e.g., `shadow-[0_10px_20px_rgba(249,245,75,0.15)]`).

### Interactive Transitions & Animations
- **Pill Switchers:** Navigation indicators must slide horizontally using CSS transitions (`transition-all duration-300 ease-out`) rather than jumping instantly.
- **Hover States:** Interactive elements scale up slightly on hover (`hover:scale-[1.02]`) and fade border colors smoothly.
- **Pulse Indicators:** Status badges (such as "Live Pulse" or "24/7 Priority Emergency") feature a pulsing green indicator (`animate-ping`) to demonstrate real-time server connections.

### Image Guidelines
- Never use blank placeholders. All visuals must represent actual high-definition scenes:
  - **Hygiene/Cleaning:** `/cleaning_hero.png` (eco-safe commercial gear).
  - **Refuse/Logistics:** `/waste_hero.png` (recycling facility with solar panel array).
