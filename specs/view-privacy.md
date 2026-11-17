# Spec: Privacy (`/privacy`)

- **Status:** implemented
- **Version:** 1.1
- **Created:** 2026-11-16
- **Last Updated:** 2026-11-16

---

## Problem Statement

Organisations and householders submitting site locations and phone numbers need a plain-English statement of what data Clean World collects, who handles it, how long it is kept, and how to ask for correction or deletion.

## Goals & Non-Goals

- **Goals:** State clearly what quote details are collected, name Cloudflare and Resend as processors, state the 24-month retention rule, explain local device draft storage (`Start over`), confirm zero advertising cookies, and show how to request deletion using visible contact facts.
- **Non-Goals:** Cookie-consent banners (no advertising or tracking cookies are used) or automated self-service deletion endpoints in Phase 1.

## Alternatives Considered

- **Multi-page legalistic boilerplate vs plain-English definition list (`<dl>`):** Chose a concise six-part definition list so householders and facilities officers can read every commitment on one mobile screen.
- **Automated cron purge in Phase 1 vs manual deletion with 24-month policy (cron deferred):** Deferred automatic 24-month purge to the backlog ([`project.md`](../project.md)) while request volume is low and staff verify whether past quotes became active contracts.

## Risks & Limits

- **24-month retention enforcement:** Until the scheduled retention task in the backlog is built, staff manually review and delete non-contract requests older than 24 months.

---

## Dependencies

- Depends on: [`specs/ui-shell.md`](ui-shell.md); [`src/content/company.ts`](../src/content/company.ts)
- Consumed by: [`specs/ui-shell.md`](ui-shell.md) header and footer, [`specs/view-quote.md`](view-quote.md) contact step

---

## Inputs

| Field | Type | Required | Description |
|---|---|---|---|
| company contact facts | `CompanyFact<string>` | no | `email`, `phone`, `whatsapp` (used in priority order for deletion/correction contact instructions) |

---

## Process

1. Render `"What we collect"`: the details entered in a quote request — name, phone number, optional email, organisation, neighbourhood and landmark, and job description.
2. Render `"Why"`: to contact the customer about their request and prepare a quotation.
3. Render `"Who sees it"`: Clean World staff; stored with Cloudflare and emailed to staff through Resend; never sold or used for advertising.
4. Render `"How long we keep it"`: 24 months, unless the request became a contract.
5. Render `"On your device"`: an unfinished request is saved on the visitor's own device until sent or cleared with `"Start over"`; no advertising cookies.
6. Render `"Your choices"`: how to ask for correction or deletion using the first visible contact fact (`email`, `phone`, or `whatsapp`), falling back when none is visible.
7. Render closing `QuoteBand` linking to `/quote`.

---

## Outputs

### Success

Pre-rendered HTML; title `"Privacy — Clean World Inc."`.

### Error

None.

---

## Edge Cases

| # | Scenario | Classification | Handling |
|---|---|---|---|
| 1 | No contact fact visible | critical | Renders `"contact us through the details on your quotation"` |
| 2 | Deleting requests after 24 months | deferred | Backlog — manual until a scheduled retention task is added |

---

## Completion Checklist

- [x] Strict type definitions maintained (none needed)
- [x] Process steps implemented in order (`src/routes/privacy.tsx`)
- [x] All critical edge cases handled
- [x] Tests written — one per critical edge case (`tests/unit/ui-shell.test.tsx`, `tests/e2e/pages.spec.ts`)
- [x] Deferred edge cases added to the backlog
- [x] Spec status updated to `implemented`
- [x] Dependencies notified of any interface changes (none)

---

## Changelog

| Version | Date | Change | Reason | Re-approved by |
|---|---|---|---|---|
| 1.0 | 2026-11-16 | Initial spec | — | Owner standing instruction (auto-approve) |
| 1.1 | 2026-11-16 | List contact facts in `Inputs`, include `whatsapp` fallback and closing `QuoteBand`, align `"Start over"` wording, and add unit test for Edge Case 1 | EGM codebase review & auto-resolve | Owner standing instruction (auto-approve) |
