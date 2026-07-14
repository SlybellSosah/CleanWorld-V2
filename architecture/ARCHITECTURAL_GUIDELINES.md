# Clean World SaaS Application Architecture & Design Guidelines

This document serves as the authoritative architectural blueprint and engineering guide for **Clean World**, a dual-sided, subscription-first booking and dispatch platform tailored for South Sudan's premier eco-responsible hygiene service.

---

## 1. System Topology & Dual-Sided Portals
The platform supports two distinct, isolated client-side views powered by a cohesive core state model.

```
                  ┌────────────────────────────────────────┐
                  │            Clean World App             │
                  └───────────────────┬────────────────────┘
                                      │
               ┌───────────────────────┴───────────────────────┐
               ▼                                               ▼
    ┌────────────────────┐                           ┌────────────────────┐
    │   Client Portal    │                           │  Provider Portal   │
    ├────────────────────┤                           ├────────────────────┤
    │ • Service Scoping  │                           │ • Mobile Dispatch  │
    │ • Dynamic Pricing  │                           │ • GPS & Directions │
    │ • Booking Wizard   │                           │ • Task Checklist   │
    │ • Client Dashboard │                           │ • Photo Proof (QC) │
    └────────────────────┘                           └────────────────────┘
```

---

## 2. Service Pricing Formulas

The dynamic pricing engine updates estimated totals in real time based on active service specifications:

### A. Cleaning Services (Management Pillar)
$$\text{Cleaning Cost} = (\text{Base Fee} + \text{Addons}) \times \text{Clean Depth Multiplier} \times (1 - \text{Discount}) \times 1.05$$
- **Base Fee (Area-based):**
  - *< 1,000 sq ft:* $80.00
  - *1,000 - 1,999 sq ft:* $130.00
  - *2,000 - 2,999 sq ft:* $180.00
  - *3,000 - 4,999 sq ft:* $230.00
  - *5,000+ sq ft:* $320.00
- **Clean Depth Multiplier:** Standard ($1.0\times$), Deep ($1.5\times$).
- **Add-on Items:** Inside Fridge (+$35), Inside Oven (+$35), Cabinets (+$30), Interior Windows (+$40), Wet Wiping Baseboards (+$25).

### B. Waste Collection & Disposal (Cleaning Portal Sub-Tab)
$$\text{Waste Cost} = (\text{Volume} \times \$15.00) \times \text{Risk Multiplier} + \text{Addons} \times (1 - \text{Discount}) \times 1.05$$
- **Refuse Volume:** 1 to 100 m³ (cubic meters).
- **Risk Multiplier:** Class I Low ($1.0\times$), Class II Medium ($1.3\times$), Class III High ($1.8\times$).
- **Add-on Items:** HSE Waste Binning (+$50), Bio-Safe Solutions (+$75), Secure Disposal Certification (+$40).

### C. Fumigation & Pest Control (Fumigation Pillar)
$$\text{Fumigation Cost} = (\text{Base Fee} \times \text{Intensity Multiplier} + \text{Addons}) \times (1 - \text{Discount}) \times 1.05$$
- **Base Fee (Area-based):**
  - *< 1,000 sq ft:* $95.00
  - *1,000 - 1,999 sq ft:* $145.00
  - *2,000 - 2,999 sq ft:* $195.00
  - *3,000+ sq ft:* $255.00
- **Intensity Multiplier:** Preventative ($1.0\times$), Eradication ($1.4\times$), Perimeter protection ($1.8\times$).
- **Add-on Items:** Malaria Vector Containment (+$45), Larvicide Treatment (+$30), Rodent Baiting (+$35).

### D. Landscaping & Garden Design (Landscaping Pillar)
$$\text{Landscaping Cost} = (\text{Base Fee} \times \text{Eco-Design Multiplier} + \text{Addons}) \times (1 - \text{Discount}) \times 1.05$$
- **Base Fee (Area-based):**
  - *< 500 sq m:* $110.00
  - *500 - 1,499 sq m:* $180.00
  - *1,500 - 2,999 sq m:* $260.00
  - *3,000+ sq m:* $350.00
- **Eco-Design Multiplier:** Mowing & Trim ($1.0\times$), Turf Design ($1.5\times$), Flora Restoration ($2.0\times$).
- **Add-on Items:** Irrigation Regulation (+$60), Flower Bed Design (+$45), Native Grass Planting (+$30).

---

## 3. High-Conversion 3-Step Wizard Flow

### Step 1: Scoping & Base Parameters
- Dynamic scoping layouts. Standard Bedroom/Bathroom counters render for Cleaning, Fumigation, and Landscaping. 
- Volume sliders and Risk Class selectors render for Waste Management.
- **Verification Gate:** Address check via Juba Neighborhood Selector. Telemetry values (LAT/LNG coordinates) are mapped dynamically.

### Step 2: Frequency & Real-Time Availability Scheduling
- Pick frequency: Weekly (20% off), Bi-weekly (15% off), Monthly (10% off), One-Time (0% off).
- Selection of scheduled dates integrated against Juba availability logs.

### Step 3: Billing & Secure Checkout
- Contact details, entry access code, and mobile money (MTN MoMo, Zain Cash, m-GURUSH) USSD push PIN verification or Cash on Arrival.

---

## 4. Visual Language & Front-End Design System
- **Color Palette (Premium Dark Mode):**
  - Primary Background: `#0F172A` (Deep Navy Canvas)
  - Card Surface: `#1E293B` (Clean Slate)
  - Accent Tones: Sustainable Green/Teal (`#10B981`), Sky Blue (`#38BDF8`), and Tactical Yellow (`#F9F54B`).
- **Typography:**
  - Header Typeface: **Outfit** / **Space Grotesk**
  - Body Typeface: **Inter**
  - Telemetry Details: **JetBrains Mono**
