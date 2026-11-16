# Spec: Home (`/`)
**Status:** implemented
**Version:** 1.0
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

1. Hero (navy): heading stating what Clean World does and where; one sentence of support; "Request a quote" (primary) and "See services" (secondary).
2. "What we do": one card per service, in the order set by `services.ts` (fumigation and mosquito control first), each linking to its service page.
3. "Who we work with": two panels — organisations (quotation, purchase order, invoice, bank transfer) and households (quick booking, cash or mobile money) — each with a link into `/quote`.
4. "How it works": four numbered steps — request, call-back and site visit, quotation, service and payment.
5. "Why Juba needs this": three short statements on mosquito-borne illness, disinfection and waste, with no statistics that are not sourced in `specs/rebuild-design.md`.
6. Founder panel: rendered only if the founder name and quote are visible facts.
7. Closing call to action (navy) linking to `/quote`.

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
