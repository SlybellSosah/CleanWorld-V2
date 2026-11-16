# Spec: Home (`/`)
**Status:** implemented
**Version:** 1.5
**Created:** 2026-11-16
**Last Updated:** 2026-11-16

---

## Dependencies
- Depends on: `ui-shell`; `src/content/services.ts`; `src/content/company.ts`
- Consumed by: none

---

## Inputs

| Field | Type | Required | Description |
|---|---|---|---|
| services | Service[] | yes | Title, summary, slug, icon |
| company facts | CompanyFact values | no | Founder name, quote and photo; founding year |

---

## Process

1. Full-bleed screen-filling Hero (`HeroBento`): edge-to-edge dark navy bar flush directly under the menu bar (`md:min-h-[calc(100svh-4.5rem)]`) with inner `.wrap` alignment matching the header, layered over the self-hosted dusk Juba skyline backdrop and gradient scrim, presenting a location pill, 8-spoke starburst caption, `h1` headline, support sentence, yellow primary split-pill CTA and outline secondary CTA alongside the desktop quick-start quote slip.
2. "What we do": one rounded-bento card per service in a responsive subgrid, in the order set by `services.ts` (fumigation and mosquito control first), featuring self-hosted realistic AVIF/WebP/JPEG card photography (`<picture>` with `alt=""` and `loading="lazy"` inside an inset container with solid colour fallback), staggered scroll reveal and reduced-motion-safe hover elevation and image zoom, each linking to its service page.
3. "Who we work with": two rounded-bento buyer dossiers — organisations (quotation, purchase order, invoice, bank transfer) and households (quick booking, phone or WhatsApp price, cash or mobile money) — each featuring self-hosted realistic AVIF/WebP/JPEG photography (`alt=""`, `loading="lazy"`) with solid colour fallback, a 4-step workflow rail, reduced-motion-safe hover choreography, and a split-pill link into `/quote`.
4. "How it works": four numbered rounded-bento step cards — request, call-back and site visit, quotation, service and payment — plus an outline pill CTA to `/how-to-pay`.
5. "Why this work matters in Juba": full-bleed dark navy section housing three rounded sub-cards on mosquito-borne illness, disinfection and waste, with no statistics that are not sourced in `specs/rebuild-design.md`.
6. Founder panel: rounded bento quote card rendered only if the founder name and quote are visible facts.
7. Closing call to action (rounded navy bento band) linking to `/quote`.

---

## Outputs

### Success
Pre-rendered HTML containing all of the above; title "Clean World Inc. — Cleaning, fumigation and waste services in Juba".

### Error
None; the page has no data requests.

---

## Edge Cases

| # | Scenario | Classification | Handling |
|---|---|---|---|
| 1 | Founder facts unconfirmed in production | critical | Founder panel omitted entirely |
| 2 | No verified client count, year or certificate | critical | No statistics, badges or client logos are shown |
| 3 | Image fails to load | critical | Hero and cards remain legible on a solid colour; images are decorative with empty `alt` |

---

## Completion Checklist

- [x] Strict type definitions generated
- [x] Process steps implemented in order (`src/routes/home.tsx`)
- [x] All critical edge cases handled
- [ ] Tests written — one per critical edge case (`tests/e2e/pages.spec.ts`, `tests/unit/ui-shell.test.ts`). Case 1 was checked by hand on a production build, not by an automated test
- [x] Deferred edge cases added to the backlog (none)
- [x] Spec status updated to `implemented`
- [x] Dependencies notified of any interface changes (none)

---

## Changelog

| Version | Date | Change | Reason | Re-approved by |
|---|---|---|---|---|
| 1.0 | 2026-11-16 | Initial spec | — | Owner standing instruction (auto-approve) |
| 1.1 | 2026-11-16 | Add self-hosted decorative dusk skyline background image and navy scrim to the hero section | Match atmosphere of previous design while keeping solid-navy fallback and WCAG AA contrast | Owner request |
| 1.2 | 2026-11-16 | Redesign "What we do" into a responsive subgrid of illustrated service cards with inline SVG scenes and scroll/hover motion | Owner requested graphics and motion inspired by service card references | Owner request |
| 1.3 | 2026-11-16 | Redesign "Who we work with" into dual-world buyer dossiers with multi-plane inline SVG scenes, 4-step workflow rails, and reduced-motion-safe hover/spotlight choreography | Owner requested graphics and advanced motion effects backed by EGM analysis | Owner request |
| 1.4 | 2026-11-16 | Adopt Cleandy-inspired unified 1-tile rounded bento hero, rounded-3xl step/health/founder cards, and split-pill circular disc CTAs while preserving Clean World brand colors | Owner requested Cleandy typography, rounded corners, hover styling, and a unified 1-tile hero while maintaining theme colors | Owner request |
| 1.5 | 2026-11-16 | Make hero bar full-bleed viewport-height under the menu bar; replace vector illustrations in "What we do" and "Who we work with" with optimized realistic photography (`alt=""`, solid surface fallback) | Owner requested full-screen-width hero bar and realistic photographic card placeholders | Owner request |
