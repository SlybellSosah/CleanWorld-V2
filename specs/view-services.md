# Spec: Services (`/services`, `/services/:slug`)
**Status:** implemented
**Version:** 1.0
**Created:** 2026-11-16
**Last Updated:** 2026-11-16

---

## Dependencies
- Depends on: `ui-shell`; `src/content/services.ts`
- Consumed by: `view-home`, `view-quote`

---

## Inputs

| Field | Type | Required | Description |
|---|---|---|---|
| slug (path) | ServiceSlug | on detail pages | |
| Service | object | yes | `slug`, `title`, `summary`, `intro`, `includes[]`, `method[]`, `safety[]`, `frequency`, `goodFor[]` |

---

## Process

### `/services`
1. Heading and one-sentence introduction.
2. One card per service with title, summary and link to its page.
3. Call to action to `/quote`.

### `/services/:slug`
1. Find the service by slug. If none: render the not-found view.
2. Heading (service title) and introduction.
3. Sections: "What is included", "How we work", "Safety", "How often", "Good for".
4. "Request a quote for <service>" linking to `/quote?service=<slug>`.
5. Links to the other services.
6. Every service slug is in the pre-render list (`src/content/paths.ts`).

Content rules: plain language; no prices; no certifications, client names or equipment claims that the owner has not confirmed.

---

## Outputs

### Success
Pre-rendered HTML per service; title "<Service> in Juba — Clean World Inc.".

### Error
Not-found view for unknown slugs.

---

## Edge Cases

| # | Scenario | Classification | Handling |
|---|---|---|---|
| 1 | Unknown slug | critical | Not-found view |
| 2 | Service added to `services.ts` | critical | Its page is pre-rendered automatically because paths derive from the list |
| 3 | Quote link | critical | Carries `?service=<slug>` so the form pre-selects it |

---

## Completion Checklist

- [x] Strict type definitions generated
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
