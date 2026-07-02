# Implementation Plan: Responsive Layout & Readability Upgrades

This plan details the technical steps to resolve text visibility and readability issues under narrow viewports (30%-50% of standard desktop width, i.e., mobile/tablet scales). We will make the device mockups fully responsive and upgrade small, low-contrast typography across all components to meet WCAG AA standards.

## Proposed Changes

### 1. Responsive Portal Shells

#### [MODIFY] [CleanerPortal.tsx](file:///home/pop_i9/Development/Web/Clean_World_Inc/src/components/CleanerPortal.tsx)
- Modify the phone shell container to apply phone borders, fixed height (`h-[820px]`), and notch (`h-6`) **only** on medium-and-above viewports (`md:` breakpoint).
- On mobile viewports, remove the borders, notch, and fixed height so that it spans `w-full min-h-screen` natively.
- Upgrade any low-contrast texts (`text-slate-500`, `text-slate-600`) to readable gray shades (`text-slate-400` or `text-slate-300`).

---

### 2. Global Typography & Contrast Enhancements

We will audit and refactor all major components to replace low-contrast text styles (`text-slate-500`, `text-slate-550`, `text-slate-600`, `text-slate-650`) on dark backgrounds with higher contrast classes (`text-slate-400` or `text-slate-300`), and bump ultra-small font sizes (`text-[9px]`, `text-[10px]`) to readable sizes.

#### [MODIFY] [AcademyPage.tsx](file:///home/pop_i9/Development/Web/Clean_World_Inc/src/components/AcademyPage.tsx)
- Replace all occurrences of low-contrast `text-slate-500` with `text-slate-400` or `text-emerald-400` (for labels).
- Bump sub-labels and metadata text sizes (e.g. from `text-[9px]` or `text-[10px]` to `text-xs` or `text-[11px]`).

#### [MODIFY] [ClientDashboard.tsx](file:///home/pop_i9/Development/Web/Clean_World_Inc/src/components/ClientDashboard.tsx)
- Upgrade `text-slate-500` classes in booking lists and metadata info panels to `text-slate-400`.
- Ensure all detail text remains readable on mobile viewports.

#### [MODIFY] [EcoShopPage.tsx](file:///home/pop_i9/Development/Web/Clean_World_Inc/src/components/EcoShopPage.tsx)
- Increase contrast on safety sheets and order summary labels.
- Replace `text-slate-500` with `text-slate-400` / `text-slate-350`.

#### [MODIFY] [ServicesPage.tsx](file:///home/pop_i9/Development/Web/Clean_World_Inc/src/components/ServicesPage.tsx)
- Audit and adjust complexity labels, operational specifications table elements, and equipment tags to use higher contrast colors.
- Adjust `text-slate-500`/`text-slate-650` classes in tables to `text-slate-400`.

#### [MODIFY] [Footer.tsx](file:///home/pop_i9/Development/Web/Clean_World_Inc/src/components/Footer.tsx)
- Improve contrast of licensing info and bottom links (`text-slate-500` -> `text-slate-400`).

---

## Verification Plan

### Automated Tests
- Run `npm run lint` to ensure no TypeScript or compilation errors.
- Run `npx playwright test` to verify that E2E tests still pass successfully.

### Manual Verification
- Deploy local dev server at `http://localhost:3000`.
- Inspect the Cleaner Portal at `360px` width: check that it fills the screen perfectly without horizontal scroll and that mock borders/notch are hidden.
- Review readability of all metadata and labels under dark mode at small screens.
