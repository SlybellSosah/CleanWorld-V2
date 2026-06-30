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

## 2. Dynamic Pricing Engine Formula
The dynamic pricing engine drives high conversion by updating estimated totals in real time on the sticky interactive sidebar.

### A. Base Calculators
- **Base Fee:** $45.00
- **Bedroom Multiplier:** +$15.00 per bedroom
- **Bathroom Multiplier:** +$10.00 per bathroom
- **Square Footage Range Adder:**
  - *< 1,000 sq ft:* +$0.00
  - *1,000 - 1,999 sq ft:* +$20.00
  - *2,000 - 2,999 sq ft:* +$40.00
  - *3,000+ sq ft:* +$65.00

### B. Service Type Multipliers
$$\text{Clean Cost} = (\text{Base Fee} + \text{Rooms Subtotal} + \text{SqFt Adder}) \times \text{Type Multiplier}$$

- **Standard Clean:** $1.0\times$ multiplier
- **Deep Clean:** $1.35\times$ multiplier *(adds focused attention on baseboards and detailed disinfection)*
- **Move-In / Move-Out Clean:** Flat +$50.00 base charge with $1.2\times$ multiplier

### C. Toggleable Add-on Items (Flat rates)
- Inside Fridge: +$25.00
- Inside Oven: +$30.00
- Cabinets: +$20.00
- Interior Windows: +$35.00
- Pet Hair Treatment: +$15.00
- Wet Wiping Baseboards: +$15.00

### D. Frequency Discounts
- **One-Time:** $0\%$ discount (Base Rate)
- **Weekly:** $20\%$ subscription discount (Applied to subtotal before taxes)
- **Bi-Weekly:** $15\%$ subscription discount
- **Monthly:** $10\%$ subscription discount

---

## 3. High-Conversion 3-Step Wizard Flow

### Step 1: Scoping & Base Parameters
- Collect parameters: Bedrooms, Bathrooms, Sq Footage, Clean Type, and Add-ons.
- **Strict Constraint:** Address and area verification via Juba postal area validation must be checked immediately. Only validated users can advance to scheduling.

### Step 2: Frequency & Real-Time Availability Scheduling
- Pick frequency (Weekly, Bi-weekly, Monthly, One-Time).
- Selection of scheduled dates integrated against a live availability checker to avoid provider double-booking.

### Step 3: Billing & Secure Checkout
- Contact details (Name, Phone, Email, Entry Access Code).
- Credit card authorization input matching Stripe-compliant presentation.
- Real-time pre-authorization validation before persisting the booking.

---

## 4. Cleaner Field Operations Workflow
The mobile-optimized dispatch interface enforces strict operational hygiene to support premium-tier services:

- **GPS Integration:** Dynamic links to local directions in Juba.
- **State-Enforced Checklist Completion:** Cleaners cannot click "Complete Job" until every required item corresponding to the clean type and add-ons is checked off.
- **Visual Proof of Clean:** Before and After camera/upload components requiring at least one verified image upload to close the dispatch ticket.

---

## 5. Visual Language & Front-End Design System
- **Color Palette:**
  - Primary Background: `#FFFFFF` (Crisp White) with soft `#F8FAFC` offsets.
  - Accent Palette: Sky Blues (`#0284C7`, `#38BDF8`) and Decontamination Teals/Greens (`#10B981`, `#059669`) which subconsciously trigger "hygiene, compliance, and clean air".
- **Typography:**
  - Header Typeface: **Space Grotesk** / Modern High-Contrast Sans-serif for dynamic layouts and high-converting CTAs.
  - Body Typeface: **Inter** for supreme reading clarity.
  - Telemetry Details: **JetBrains Mono** or **Fira Code** for billing statements, licenses, and metadata records.
- **Accessibility:** Touch targets $\ge 48\text{px}$, comprehensive ARIA controls on calendar grids, and clean contrast compliance.
