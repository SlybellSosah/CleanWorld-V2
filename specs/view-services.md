# Spec: Services (`/services`, `/services/:slug`)

- **Status:** implemented
- **Version:** 1.1
- **Created:** 2026-11-16
- **Last Updated:** 2026-11-16

---

## Problem Statement

Buyers evaluating Clean World need dedicated, shareable URLs describing what each service includes, how work is carried out safely, and who it suits, with a direct link that pre-selects that service in `/quote`.

## Goals & Non-Goals

- **Goals:** Pre-render an index page (`/services`) and one detail page per service (`/services/:slug`) from a single typed list (`src/content/services.ts`), pre-selecting `?service=<slug>` on quote links.
- **Non-Goals:** Public per-unit SSP pricing (quotations are tailored after scope confirmation) or unverified chemical/ISO certifications.

## Alternatives Considered

- **Single tabbed `/services` view vs individual `/services/:slug` routes:** Rejected a single tabbed view because procurement officers share direct links to specific services (such as fumigation or waste collection) and search engines index dedicated URLs better.
- **CMS-backed service records in D1 vs typed TypeScript module (`src/content/services.ts`):** Chose a typed module because the five service lines change rarely, require zero database reads on public traffic, and drive build-time route pre-rendering directly.

## Risks & Limits

- **Slug renames:** Renaming a `ServiceSlug` changes its public URL and validation enum; if a slug is ever renamed in a future phase, add a Worker redirect from the old path.

---

## Dependencies

- Depends on: [`specs/ui-shell.md`](ui-shell.md); [`src/content/services.ts`](../src/content/services.ts)
- Consumed by: [`specs/view-home.md`](view-home.md), [`specs/view-quote.md`](view-quote.md)

---

## Inputs

| Field | Type | Required | Description |
|---|---|---|---|
| slug (path) | `ServiceSlug` | on detail pages | URL parameter matched against `services` |
| Service | `Service` | yes | `slug`, `title`, `short`, `summary`, `intro`, `includes[]`, `method[]`, `safety[]`, `frequency`, `goodFor[]` |

---

## Process

### `/services`

1. Render heading and one-sentence introduction (`PageHeader`).
2. Render one card per service with numbered `short` badge, `title`, `summary`, primary audience tag, and link to `/services/:slug`.
3. Render closing `QuoteBand` linking to `/quote`.

### `/services/:slug`

1. Look up the service by `slug`. If none matches: render the not-found view.
2. Render heading (`service.title`) and `service.intro`.
3. Render content sections: `"What is included"`, `"How we work"`, `"Safety"`, `"How often"`, and `"Good for"`.
4. Render closing `QuoteBand` (`"Request a quote for <short>"`) linking to `/quote?service=<slug>`.
5. Render navigation links to the other four services.
6. Include every service slug in `prerenderPaths` ([`src/content/paths.ts`](../src/content/paths.ts)).

Content rules: plain language; no prices; no certifications, client names or equipment claims that the owner has not confirmed.

---

## Outputs

### Success

Pre-rendered HTML per service; title `"<Service title> in Juba — Clean World Inc."`.

### Error

Not-found view for unknown slugs.

---

## Edge Cases

| # | Scenario | Classification | Handling |
|---|---|---|---|
| 1 | Unknown slug | critical | Not-found view |
| 2 | Service added to `services.ts` | critical | Pre-rendered automatically because `publicPaths` derives from `services` |
| 3 | Quote link | critical | Carries `?service=<slug>` so `/quote` pre-selects it |

---

## Completion Checklist

- [x] Strict type definitions maintained (`src/types.ts`)
- [x] Process steps implemented in order (`src/routes/services.tsx`, `src/routes/service.tsx`)
- [x] All critical edge cases handled
- [x] Tests written — one per critical edge case (`tests/unit/view-services.test.ts`, `tests/e2e/pages.spec.ts`)
- [x] Deferred edge cases added to the backlog (none)
- [x] Spec status updated to `implemented`
- [x] Dependencies notified of any interface changes (none)

---

## Changelog

| Version | Date | Change | Reason | Re-approved by |
|---|---|---|---|---|
| 1.0 | 2026-11-16 | Initial spec | — | Owner standing instruction (auto-approve) |
| 1.1 | 2026-11-16 | Escape `<service>` placeholders, include `short` in `Inputs`, and add `Alternatives Considered` and `Risks & Limits` | EGM codebase review & auto-resolve | Owner standing instruction (auto-approve) |
