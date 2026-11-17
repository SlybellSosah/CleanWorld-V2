# Spec: Site shell (layout, navigation, contact, not-found, theme)

- **Status:** implemented
- **Version:** 1.4
- **Created:** 2026-11-16
- **Last Updated:** 2026-11-16

---

## Problem Statement

Visitors in Juba browse primarily on mobile connections and need immediate access to Clean World's services, quote form, and phone or WhatsApp contact details on every page, without unconfirmed company claims leaking into production or JavaScript stalls hiding content.

## Goals & Non-Goals

- **Goals:** Consistent header, footer, mobile quick-contact dock, skip link, per-page SEO/Open Graph metadata, WCAG AA contrast, zero-JS readability across all routes (including 404), and build-time gating of unconfirmed `CompanyFact` values.
- **Non-Goals:** Authenticated customer navigation, theme switching, or third-party analytics/font requests.

## Alternatives Considered

- **Runtime SSR in the Cloudflare Worker vs static pre-rendering (`ssr: false`):** Rejected runtime SSR because public pages have no per-request server data; pre-rendering static HTML eliminates Worker compute on public page views while serving complete HTML to crawlers and no-JS browsers.
- **JavaScript animation library (`motion`) vs CSS transitions + `IntersectionObserver`:** Replaced `motion` in v1.4 because SSR/pre-rendering serialized inline `opacity: 0` into HTML (hiding Home content without JS) and added ~40 KB of compressed JS to every route. CSS transitions gated by `prefers-reduced-motion: no-preference` keep HTML visible by default and keep compressed JS under 100 KB per route.
- **Copying `__spa-fallback.html` vs pre-rendering `/404` for `404.html`:** Replaced `__spa-fallback.html` (`<p>Loading…</p>`) with pre-rendered `/404` promoted to `build/client/404.html` so unknown URLs render full navigation and `<h1>Page not found</h1>` even without JavaScript.

## Risks & Limits

- **Shared `build/client` asset directory:** Preview builds with `VITE_SHOW_UNCONFIRMED=1` (`npm run preview:draft`) write into `build/client`. Mitigated by keeping `npm run preview` and `npm run build` clean (unconfirmed hidden) and enforcing `node tools/postbuild.mjs --verify-production` in `npm run deploy`.

---

## Dependencies

- Depends on: [`src/content/company.ts`](../src/content/company.ts); [`src/content/services.ts`](../src/content/services.ts); [`src/lib/whatsapp.ts`](../src/lib/whatsapp.ts)
- Consumed by: every view

---

## Inputs

| Field | Type | Required | Description |
|---|---|---|---|
| company facts | `CompanyFact` values | yes | Name, phone, WhatsApp, email, address, siteUrl |
| `VITE_SHOW_UNCONFIRMED` | `"1"` or unset | no | Shows unconfirmed facts in local dev and `preview:draft` builds |
| page meta | `PageMeta` (`title`, `description`, `path`, `noindex?`) | yes | Per route |

---

## Process

1. Render the HTML document with `lang="en"`, viewport meta, Clean World tab icons (`favicon.svg`, `favicon.ico`, `favicon.png`) and home-screen icon (`apple-touch-icon.png`), and per-page title, description, canonical link (on indexable pages) and Open Graph tags with `logo.jpg` as preview image.
2. Header: decorative company logo mark (`public/logo-mark.png`, `alt=""`) beside "Clean World" linking to `/`; `Space Grotesk` links to Services and How to pay with an active indicator; confirmed telephone link from `768 px` upward (icon on medium screens, icon + number from `1024 px`); and a pill "Request a quote" CTA. Under `768 px`, links collapse into a modal `<dialog>` menu containing Home, Services, How to pay, Privacy, confirmed phone link, and Request a quote.
3. Render a "Skip to content" link as the first focusable element.
4. Footer: dark-navy section with service links, Request a quote, How to pay, Privacy, each visible contact fact, and copyright line using `fact(company.name)`. Subpage closing `<QuoteBand />` sections (`/services`, `/services/:slug`, `/how-to-pay`, `/privacy`) use a light card container above the footer.
5. Mobile contact bar: fixed pill dock under `768 px` showing "Call" and "WhatsApp" for visible facts plus "Get a quote". Hidden on `/quote` and `/admin` (exact path segment match).
6. Visibility rule: a fact is shown when `confirmed` is `true` or `VITE_SHOW_UNCONFIRMED` is `"1"`. When any unconfirmed fact is shown, render the top notice `"Preview — showing details not yet confirmed by the owner"`.
7. Unknown paths return HTTP `404` with the pre-rendered not-found view (`404.html`), linking to Home and Request a quote; `postbuild.mjs` also generates `sitemap.xml` for all public indexable routes.
8. Theme: light page background (`#F8FAFC`) and white cards (`#FFFFFF`) paired with dark-navy feature sections (`#0F172A`), emerald (`#047857`) primary actions on light, yellow (`#F9F54B` with `#0F172A` text) dark-surface CTAs, sky (`#0369A1`) links, self-hosted `Space Grotesk` and `Inter` variable fonts, and system monospace for reference codes. Minimum 16 px body copy and 48 px control height.
9. Motion: CSS entrance and hover transitions run only under `@media (prefers-reduced-motion: no-preference)`; below-the-fold scroll reveals progressively enhance via `IntersectionObserver` so pre-rendered HTML defaults to `opacity: 1`. Nothing loops.

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
| 3 | Keyboard user opens the mobile menu | critical | Focus moves into the dialog; Escape or link activation closes it |
| 4 | Reduced-motion preference | critical | No transforms, width transitions or fades are animated |
| 5 | Unknown URL | critical | Pre-rendered not-found view, status 404 |
| 6 | JavaScript unavailable | critical | Pre-rendered pages (including `/` and `404`) show all content and links |

---

## Completion Checklist

- [x] Strict type definitions maintained (`src/types.ts`)
- [x] Process steps implemented in order (`src/root.tsx`, `src/components/`, `tools/postbuild.mjs`)
- [x] All critical edge cases handled
- [x] Tests written — one per critical edge case (`tests/unit/ui-shell.test.tsx`, `tests/e2e/shell.spec.ts`)
- [x] Deferred edge cases added to the backlog (none)
- [x] Spec status updated to `implemented`
- [x] Dependencies notified of any interface changes (none)

---

## Changelog

| Version | Date | Change | Reason | Re-approved by |
|---|---|---|---|---|
| 1.0 | 2026-11-16 | Initial spec | — | Owner standing instruction (auto-approve) |
| 1.1 | 2026-11-16 | Replace placeholder icon with owner logo across header, footer, icons and Open Graph preview | Owner supplied logo | Owner request |
| 1.2 | 2026-11-16 | Add `favicon.svg` + `favicon.ico` suite, rounded card surfaces, `Space Grotesk` nav/eyebrows, and pill arrow buttons | Owner visual direction | Owner request |
| 1.3 | 2026-11-16 | Add Request a quote link to Footer and place subpage `QuoteBand` on a light card container | Close bottom-of-page navigation and avoid double-navy band stacking | Owner standing instruction (auto-approve) |
| 1.4 | 2026-11-16 | Remove `motion` in favour of CSS progressive enhancement, pre-render `404.html` and `sitemap.xml`, close `768–1023 px` header phone gap, and add `ContactBar` unconfirmed-fact unit test | EGM codebase review & auto-resolve | Owner standing instruction (auto-approve) |
