# Spec: Home (`/`)

- **Status:** implemented
- **Version:** 1.7
- **Created:** 2026-11-16
- **Last Updated:** 2026-11-16

---

## Problem Statement

Institutional procurement officers and Juba householders landing on `/` must understand within seconds what Clean World does, how quoting and off-site payment work for their segment, and how to start a quote request without encountering fabricated statistics or unconfirmed claims.

## Goals & Non-Goals

- **Goals:** Present the five services (fumigation first), differentiate organisation procurement from household booking, explain why environmental health matters in Juba, surface the confirmed founder quote, and funnel visitors to `/quote` or `/services/:slug`.
- **Non-Goals:** Public price calculators, client logo walls without written client consent, or live chat widgets.

## Alternatives Considered

- **Equal weight to all five services vs leading with fumigation and cleaning:** Chose leading with fumigation/mosquito control and cleaning because malaria and cholera prevention represent the most urgent institutional and household demand in Juba.
- **Inline vector illustrations vs compressed AVIF/WebP/JPEG card images with solid-colour fallbacks:** Chose responsive raster images (`< 120 KB` per variant, `loading="lazy"`, `alt=""`) over complex multi-plane SVGs to cut DOM size while preserving legibility if images fail to load.

## Risks & Limits

- **Generated decorative imagery:** Current card images are generated placeholders (`content-source/generated/`), marked decorative (`alt=""`) and never presented as named staff or client sites; replacing them with real dated photography is tracked in the Phase 2 backlog ([`project.md`](../project.md)).

---

## Dependencies

- Depends on: [`specs/ui-shell.md`](ui-shell.md); [`src/content/services.ts`](../src/content/services.ts); [`src/content/company.ts`](../src/content/company.ts)
- Consumed by: none

---

## Inputs

| Field | Type | Required | Description |
|---|---|---|---|
| services | `Service[]` | yes | `slug`, `title`, `summary`, `goodFor` |
| company facts | `CompanyFact` values | no | `address`, `founderName`, `founderRole`, `founderQuote` |

---

## Process

1. Hero (`HeroBento`): full-bleed dark-navy section under the header over the self-hosted dusk Juba backdrop and gradient scrim, showing the visible `address` pill (falling back to `"Juba, South Sudan"`), `h1` headline, summary paragraph, primary `"Request a quote"` CTA (`/quote`), secondary `"See services"` CTA (`/services`), and a desktop quick-start form (`GET /quote?service=<slug>`) with a service `<select>` and `"Continue"` submit button.
2. "What we do": one card per service in the order defined by `services.ts` (fumigation first), displaying a decorative responsive AVIF/WebP/JPEG image (`alt=""`, `loading="lazy"`) over a solid-colour fallback surface, title, summary, primary audience tag (`goodFor[0]`), and link to `/services/:slug`.
3. "Who we work with": two customer-type cards — Organisations (written quotation, purchase order, work & invoice, bank transfer) and Households (send a request, phone or WhatsApp price, work completed, cash or mobile money) — each with decorative responsive imagery, a 4-step workflow list, and a CTA link to `/quote`.
4. "How it works": four numbered step cards (send a request, call-back and site visit, clear price / written quotation, work completed then off-site payment) plus an outline link to `/how-to-pay`.
5. "Why this work matters in Juba": dark-navy section with three cards covering mosquito breeding sites, surface/water disinfection, and uncollected waste, using no unverified company statistics.
6. Founder panel: figure and blockquote rendered only when both `founderName` and `founderQuote` are visible facts (including `founderRole` when visible).

---

## Outputs

### Success

Pre-rendered HTML containing all visible sections; title `"Clean World Inc. — Cleaning, fumigation and waste services in Juba"`.

### Error

None; the page makes no runtime data requests.

---

## Edge Cases

| # | Scenario | Classification | Handling |
|---|---|---|---|
| 1 | Founder facts unconfirmed in production | critical | Founder panel omitted completely |
| 2 | No verified client count, year or certificate | critical | No company statistics, badges or client logos are shown |
| 3 | Image fails to load | critical | Hero and cards remain legible on solid background colours; images have `alt=""` |

---

## Completion Checklist

- [x] Strict type definitions maintained (`src/types.ts`)
- [x] Process steps implemented in order (`src/routes/home.tsx`, `src/components/HeroBento.tsx`, `src/components/AudienceSection.tsx`)
- [x] All critical edge cases handled
- [x] Tests written — one per critical edge case (`tests/unit/ui-shell.test.tsx`, `tests/e2e/pages.spec.ts`)
- [x] Deferred edge cases added to the backlog (none)
- [x] Spec status updated to `implemented`
- [x] Dependencies notified of any interface changes (none)

---

## Changelog

| Version | Date | Change | Reason | Re-approved by |
|---|---|---|---|---|
| 1.0 | 2026-11-16 | Initial spec | — | Owner standing instruction (auto-approve) |
| 1.1 | 2026-11-16 | Add self-hosted dusk skyline hero backdrop and navy scrim | Match visual atmosphere with solid-navy fallback and WCAG AA contrast | Owner request |
| 1.2 | 2026-11-16 | Redesign "What we do" into a responsive service card subgrid | Owner visual reference | Owner request |
| 1.3 | 2026-11-16 | Redesign "Who we work with" into two customer-type cards with 4-step workflow rails | Clarify institutional vs household process | Owner request |
| 1.4 | 2026-11-16 | Unified hero bar, rounded step/health/founder cards, and pill arrow CTAs | Owner typography and surface refinement | Owner request |
| 1.5 | 2026-11-16 | Full-bleed viewport-height hero bar and responsive AVIF/WebP/JPEG decorative card images | Owner layout and image update | Owner request |
| 1.6 | 2026-11-16 | Remove redundant bottom `QuoteBand` from Home above `Footer` | Avoid duplicate closing CTA above Footer | Owner standing instruction (auto-approve) |
| 1.7 | 2026-11-16 | Align `Inputs` with code, document desktop quote slip, calibrate generated-image and pricing copy, and add automated unit test for Edge Case 1 | EGM codebase review & auto-resolve | Owner standing instruction (auto-approve) |
