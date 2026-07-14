# Implementation Plan: Navigation Cleanup & Role-Based Auth

This plan details the steps to execute the UX and architectural roadmap to separate marketing pages, client workspaces, and worker tools.

## User Review Required

> [!IMPORTANT]
> **Authentication state details:**
> We will introduce a global state `currentUser` (`{ email: string, role: 'client' | 'cleaner' } | null`) in `App.tsx`.
> - If `currentUser` is null, the public header navigation is visible, and the right side displays a **"Log In"** button.
> - Clicking **"Log In"** opens a premium, dark-mode custom Modal offering preset quick-login buttons for either a **Client** (`client@cleanworld.live`) or **Cleaner Crew** (`cleaner@cleanworld.live`).
> - Once authenticated, the "Log In" button is replaced by a **User Profile Avatar** with a dropdown menu allowing navigation to their respective private dashboards and logs.

> [!TIP]
> **Subdomain Simulation (`ops.cleanworld.live`):**
> We will add a persistent operational banner at the top of the **Cleaner Portal** UI to indicate it is running on the isolated subdomain `ops.cleanworld.live` (with optimized offline-first service parameters), matching the strategic decoupling recommendation.

---

## Proposed Changes

### Core Types

#### [MODIFY] [types.ts](file:///home/pop_i9/Development/Web/Clean_World_Inc/src/types.ts)
- Define `UserSession` type:
  ```typescript
  export interface UserSession {
    email: string;
    role: 'client' | 'cleaner';
  }
  ```

---

### Shared Layout & Authentication

#### [NEW] [LoginModal.tsx](file:///home/pop_i9/Development/Web/Clean_World_Inc/src/components/LoginModal.tsx)
- Create a beautiful, premium dark-mode modal container.
- Implement preset click-to-login options (Corporate/Residential Client vs. Field Cleaner) with pre-filled mock credentials.
- Add micro-animations using Framer Motion.

#### [MODIFY] [Navbar.tsx](file:///home/pop_i9/Development/Web/Clean_World_Inc/src/components/Navbar.tsx)
- Receive `currentUser` and `setCurrentUser` props.
- Filter out `ActiveView.ClientDashboard` and `ActiveView.CleanerPortal` from public `navItems`.
- Render a unified "Log In" button instead of the portal links.
- Render a User Profile Avatar with dropdown options when logged in.

#### [MODIFY] [App.tsx](file:///home/pop_i9/Development/Web/Clean_World_Inc/src/App.tsx)
- Manage the global `currentUser` state.
- Pass auth states to `Navbar`.
- Add route guards: if a user tries to access `ActiveView.ClientDashboard` or `ActiveView.CleanerPortal` without being logged in, redirect them to the home page or prompt the login modal.

---

### Footer & Operations Hub

#### [MODIFY] [Footer.tsx](file:///home/pop_i9/Development/Web/Clean_World_Inc/src/components/Footer.tsx)
- Update portals list to label Cleaner Dispatch as `Operations Portal (ops.cleanworld.live)`.
- Update click handlers to align with new portal views.

#### [MODIFY] [CleanerPortal.tsx](file:///home/pop_i9/Development/Web/Clean_World_Inc/src/components/CleanerPortal.tsx)
- Add a top badge/header segment: `[ Simulated Subdomain: ops.cleanworld.live ]` with network latency indicators to emphasize separation.

---

## Verification Plan

### Automated Tests
- Run `npm run lint` and `npm run build` to verify correctness.
- Update Playwright E2E tests in `tests/clean-world.spec.ts` and `tests/screenshot.spec.ts` if they try to click public navbar buttons for dashboards directly. Instead, click the "Log In" button and authenticate first.

### Manual Verification
- Verify that "Client Portal" and "Cleaner Dispatch" are no longer visible on the public header.
- Verify clicking "Log In" opens the modal.
- Verify logging in as Client redirects to Client Dashboard and displays a dropdown avatar.
- Verify logging in as Cleaner redirects to Cleaner Dispatch (with simulated ops subdomain header banner).
