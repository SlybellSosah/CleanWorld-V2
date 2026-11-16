# Spec: Site shell (layout, navigation, contact, not-found, theme)
**Status:** implemented
**Version:** 1.2
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

1. Render the document with `lang="en"`, viewport meta, the Clean World emblem as SVG/ICO/PNG tab icons (`favicon.svg`, `favicon.ico`, `favicon.png`) and home-screen icon (`apple-touch-icon.png`), and per-page title, description, canonical link and Open Graph tags including the full logo (`logo.jpg`) as the preview image.
2. Header: the company logo mark (`public/logo-mark.png`, decorative, empty `alt`) beside the name "Clean World", together linking to `/`; uppercase wide-tracked `Space Grotesk` links to Services and How to pay with an active dot indicator, confirmed telephone link on desktop, and a rounded split-pill "Request a quote" CTA with nested circular arrow disc. Under 768 px the links collapse into a menu button that opens a dialog.
3. A "Skip to content" link is the first focusable element.
4. Footer: full-bleed dark-navy section with service links, How to pay, Privacy, and each contact fact that is visible.
5. Contact bar, fixed to the bottom as a floating pill dock on screens under 768 px: "Call" and "WhatsApp" for visible facts, and "Get a quote". Hidden on `/quote` and `/admin`.
6. A fact is visible when `confirmed` is true, or `VITE_SHOW_UNCONFIRMED` is `1`. When any unconfirmed fact is shown, a banner states "Preview — showing details not yet confirmed by the owner".
7. Unknown paths render the not-found view with links to Home and Request a quote.
8. Theme: light ambient canvas (`#F8FAFC` paper, `#FFFFFF` generous `1.75rem` rounded bento cards) with dark navy feature containers (`#0F172A`); emerald `#047857` for actions on light, yellow `#F9F54B` (paired with navy `#0F172A` text) for accent tiles and dark-surface CTAs, sky `#0369A1` for links. Tightly tracked `Space Grotesk` headings/eyebrows, Inter body, system monospace for references. Full-pill (`rounded-full`) split buttons with nested circular arrow discs that animate with directional fly-through under reduced-motion gates. Body text 16 px minimum; controls 48 px minimum height.
9. Motion: content fades and rises once when it enters the viewport; hover disc/card choreography uses CSS individual transforms (`translate`, `rotate`, `scale`) and springs gated behind `prefers-reduced-motion: no-preference`. Nothing loops.

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
| 1.1 | 2026-11-16 | Placeholder leaf icon replaced by the owner's logo in header, footer, tab icon, home-screen icon and link preview | Owner supplied the logo | Owner request |
| 1.2 | 2026-11-16 | Vector `favicon.svg` + multi-res `favicon.ico` suite, Cleandy-inspired rounded bento surfaces, uppercase wide-tracked grotesque nav/eyebrows, and split-pill circular arrow disc buttons | Owner requested Cleandy typography/rounded bento/hover styling and favicon while keeping brand colors | Owner request |
