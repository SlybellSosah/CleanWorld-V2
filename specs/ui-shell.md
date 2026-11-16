# Spec: Site shell (layout, navigation, contact, not-found, theme)
**Status:** implemented
**Version:** 1.0
**Created:** 2026-11-16
**Last Updated:** 2026-11-16

---

## Dependencies
- Depends on: `src/content/company.ts`; `src/content/services.ts`; `src/lib/whatsapp.ts`
- Consumed by: every view

---

## Inputs

| Field | Type | Required | Description |
|---|---|---|---|
| company facts | CompanyFact values | yes | Name, phone, WhatsApp, email, address |
| `VITE_SHOW_UNCONFIRMED` | `"1"` or unset | no | Shows unconfirmed facts in dev and preview builds |
| page meta | title, description, path | yes | Per route |

---

## Process

1. Render the document with `lang="en"`, viewport meta, and per-page title, description, canonical link and Open Graph tags.
2. Header: wordmark linking to `/`; links to Services, How to pay; "Request a quote" button. Under 768 px the links collapse into a menu button that opens a dialog.
3. A "Skip to content" link is the first focusable element.
4. Footer: service links, How to pay, Privacy, and each contact fact that is visible.
5. Contact bar, fixed to the bottom on screens under 768 px: "Call" and "WhatsApp" for visible facts, and "Get a quote". Hidden on `/quote` and `/admin`.
6. A fact is visible when `confirmed` is true, or `VITE_SHOW_UNCONFIRMED` is `1`. When any unconfirmed fact is shown, a banner states "Preview — showing details not yet confirmed by the owner".
7. Unknown paths render the not-found view with links to Home and Request a quote.
8. Theme: light pages (`#F8FAFC` background, `#0F172A` text) with navy feature sections (`#0F172A`); emerald `#047857` for actions on light, yellow `#F9F54B` for the main action on navy, sky `#0369A1` for links. Space Grotesk headings, Inter body, system monospace for references. Body text 16 px minimum; controls 48 px minimum height.
9. Motion: content fades and rises 12 px once when it enters the viewport; disabled when the device requests reduced motion.

---

## Outputs

### Success
Every page has one `h1`, a `main` landmark, a visible focus ring on all controls, and WCAG AA contrast.

### Error
Not-found view; HTTP 404 from the host.

---

## Edge Cases

| # | Scenario | Classification | Handling |
|---|---|---|---|
| 1 | Unconfirmed fact in a production build | critical | Not rendered; no empty label or dead link left behind |
| 2 | No visible phone or WhatsApp | critical | Contact bar shows only "Get a quote" |
| 3 | Keyboard user opens the mobile menu | critical | Focus moves into the dialog; Escape closes it and returns focus |
| 4 | Reduced-motion preference | critical | No transforms or fades are animated |
| 5 | Unknown URL | critical | Not-found view, status 404 |
| 6 | JavaScript unavailable | critical | Pre-rendered pages show all content and links |

---

## Completion Checklist

- [x] Strict type definitions generated
- [x] Process steps implemented in order (`src/root.tsx`, `src/components/`)
- [x] All critical edge cases handled
- [x] Tests written — one per critical edge case (`tests/unit/ui-shell.test.ts`, `tests/e2e/shell.spec.ts`)
- [x] Deferred edge cases added to the backlog (none)
- [x] Spec status updated to `implemented`
- [x] Dependencies notified of any interface changes (none)

---

## Changelog

| Version | Date | Change | Reason | Re-approved by |
|---|---|---|---|---|
| 1.0 | 2026-11-16 | Initial spec | — | Owner standing instruction (auto-approve) |
