# Competitive Cleaning Business App Specifications

This document outlines the custom instructions, system rules, and design specifications for generating and coding features for the Clean World booking platform.

## System Architecture & Roles
The application must support two distinct portals built on a shared database schema:
- **Client Role:** Access to a multi-step booking funnel, scheduling dashboard, card-on-file billing, and tipping.
- **Provider (Cleaner) Role:** Access to a mobile-optimized routing view, job checklists, and photo-upload validation.

## Core Frontend Components to Generate

### Component A: The 3-Step Wizard with Dynamic Pricing
- **Step 1: Scoping**
  - Selectors for Bedrooms (1-6+), Bathrooms (1-4+), and Square Footage ranges.
  - Base clean selector: Standard, Deep Clean (adds multiplier), Move-In/Out Clean (adds flat fee).
  - Toggleable Add-on Cards: Inside Fridge, Inside Oven, Cabinets, Interior Windows, Pet Hair, Wet Wiping Baseboards.
- **Step 2: Frequency & Scheduling**
  - Frequency Selector: One-Time (Base Price), Weekly (20% off), Bi-Weekly (15% off), Monthly (10% off).
  - Visual Date & Time Slot Picker: Integrates with an availability array to prevent double-booking.
- **Step 3: Secure Checkout**
  - Standard contact inputs (Name, Email, Phone, Address, Entry instructions/Key codes).
  - Secure Credit Card Payment form (Stripe-compatible layout).
- **Persistent Sidebar (Sticky Dynamic Invoice):**
  - Displays selected options, breakdowns of fees, the subscription discount applied, taxes, and the final estimated total changing in real-time.
  - Displays a persistent section for trust badges: "Licensed, Bonded, Insured" and "24-Hour Happiness Guarantee."

### Component B: ZIP Code Service Area Gatekeeper
- A prominent landing page component.
- Takes a ZIP/Postal code, matches it against an array of served territories, and:
  - If match: Advances the user seamlessly to Step 1 of the booking wizard.
  - If no match: Displays a polite card capturing their email to notify them when service expands to their area.

### Component C: Cleaner Mobile-First Checklist & Proof-of-Clean
- Viewport optimized specifically for mobile screens (PWA pattern).
- Visualizes the current assigned job details: address, entry code, clean type, and list of selected add-ons.
- **Dynamic Task Checklist:** Renders checklist items based on the job type (e.g., if deep clean, highlight baseboards; if inside fridge add-on, show fridge checklist).
- **Photo Upload Component:** A visual drag-and-drop or camera-trigger module for uploading "Before" and "After" photos for quality control.

## State Management & Validation Rules
- **Client Billing State:** Card validation must happen before a booking is confirmed in the database. Implement pre-authorization patterns rather than instant charges.
- **Rescheduling Engine Logic:** Clients can reschedule autonomously through their dashboard up to 24 hours prior to the job start time. Within 24 hours, the button disables and prompts them to call customer service.
- **Clean Verification:** Prevent the cleaner from marking a job as "Complete" in their UI until all required checklist items are toggled and at least one "After" photo is uploaded.

## Design Language & Accessibility Guidelines
- Clean, modern, high-contrast typography (sans-serif, robust hierarchy).
- Palette: Dominated by crisp whites, soft sky blues, and clean teals/greens to subconsciously reinforce "cleanliness" and freshness.
- Accessibility: Full ARIA label support on all wizard step selectors, keyboard-navigable scheduling calendars, and touch-target sizes of at least 48px for mobile cleaner views.
