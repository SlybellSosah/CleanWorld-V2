# Spec: How to pay (`/how-to-pay`)
**Status:** implemented
**Version:** 1.0
**Created:** 2026-11-16
**Last Updated:** 2026-11-16

---

## Dependencies
- Depends on: `ui-shell`; `src/content/company.ts` (`merchantNumbers`)
- Consumed by: `view-quote` confirmation, footer

---

## Inputs

| Field | Type | Required | Description |
|---|---|---|---|
| merchantNumbers | CompanyFact<{ provider, number, name }[]> | no | Fixed at build time; never editable from the staff area |

---

## Process

1. Introduction: Clean World never takes payment on this website; you pay after we confirm the job and the amount.
2. Warning panel: never type your mobile-money PIN into a website, and never share it with anyone, including our staff.
3. "Cash": pay the team leader when the job is complete; you receive a receipt.
4. "Mobile money": if merchant numbers are visible, list each provider with its number and registered name, then the steps — wait for our message with the amount, pay to the number from your own phone, send us the confirmation message on WhatsApp. If no numbers are visible: state that we accept mobile money and will send our merchant number with your confirmation.
5. "Bank transfer (organisations)": we issue a stamped quotation with our bank details; pay against the invoice; bank details are never published on the website.
6. "Receipts and currency": every payment is receipted; each quotation states its currency and how long the price is valid.
7. Call to action to `/quote`.

---

## Outputs

### Success
Pre-rendered HTML; title "How to pay — Clean World Inc.".

### Error
None.

---

## Edge Cases

| # | Scenario | Classification | Handling |
|---|---|---|---|
| 1 | Merchant numbers unconfirmed in production | critical | No number is shown; the fallback sentence is shown |
| 2 | Any input field on this page | critical | There are none: the page collects nothing |
| 3 | Bank details | critical | Never rendered |

---

## Completion Checklist

- [x] Strict type definitions generated
- [x] Process steps implemented in order (`src/routes/how-to-pay.tsx`)
- [x] All critical edge cases handled
- [x] Tests written — one per critical edge case (`tests/e2e/pages.spec.ts`)
- [x] Deferred edge cases added to the backlog (none)
- [x] Spec status updated to `implemented`
- [x] Dependencies notified of any interface changes (none)

---

## Changelog

| Version | Date | Change | Reason | Re-approved by |
|---|---|---|---|---|
| 1.0 | 2026-11-16 | Initial spec | — | Owner standing instruction (auto-approve) |
