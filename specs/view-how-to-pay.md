# Spec: How to pay (`/how-to-pay`)

- **Status:** implemented
- **Version:** 1.1
- **Created:** 2026-11-16
- **Last Updated:** 2026-11-16

---

## Problem Statement

Customers in Juba pay by cash, mobile money, or institutional bank transfer rather than online cards, and the previous prototype dangerously asked visitors for mobile-money PINs. Visitors need clear, trustworthy payment instructions that explicitly warn against entering PINs on any website.

## Goals & Non-Goals

- **Goals:** Explain cash, mobile money, and institutional bank-transfer workflows; display prominent anti-phishing PIN guidance; render mobile-money merchant numbers only when confirmed at build time; and never publish bank account numbers publicly.
- **Non-Goals:** Online payment gateways, automated mobile-money push prompts, or editable payment details inside `/admin`.

## Alternatives Considered

- **Storing merchant numbers in D1 editable via `/admin` vs compile-time constants in `src/content/company.ts`:** Rejected database-editable merchant numbers so a compromised staff session can never redirect customer mobile-money payments to an attacker's number.
- **Publishing bank account details on `/how-to-pay` vs including them only on stamped quotations/invoices:** Chose stamped quotations/invoices only, matching institutional finance practice in Juba and reducing fraud exposure.

## Risks & Limits

- **Unconfirmed merchant numbers at launch:** Until the owner supplies confirmed MTN MoMo / m-Gurush merchant numbers (`merchantNumbers.confirmed = true`), production builds automatically render the fallback sentence stating that Clean World sends its merchant number with the confirmed job amount.

---

## Dependencies

- Depends on: [`specs/ui-shell.md`](ui-shell.md); [`src/content/company.ts`](../src/content/company.ts) (`merchantNumbers`)
- Consumed by: [`specs/view-quote.md`](view-quote.md) confirmation, [`specs/ui-shell.md`](ui-shell.md) header and footer

---

## Inputs

| Field | Type | Required | Description |
|---|---|---|---|
| merchantNumbers | `CompanyFact<MerchantNumber[]>` | no | `{ provider, number, name }[]` fixed at build time; never editable from `/admin` |

---

## Process

1. Render heading and introduction (`PageHeader`): Clean World never takes payment on this website; you pay after we confirm the job and the amount.
2. Render prominent warning note: never type your mobile-money PIN into a website, and never share it with anyone, including our staff.
3. Render `"Cash"`: pay the team leader when the job is complete and receive a receipt.
4. Render `"Mobile money"`: if `merchantNumbers` is visible and non-empty, list each provider, number, and registered name followed by the 3 payment steps; otherwise render the fallback sentence explaining that Clean World sends its merchant number together with the confirmed amount.
5. Render `"Bank transfer, for organisations"`: Clean World issues a stamped quotation carrying its bank details; organisations pay against the invoice; bank details are never published on the website.
6. Render `"Receipts and currency"`: every payment gets a receipt; each quotation states its currency and validity window.
7. Render closing `QuoteBand` linking to `/quote`.

---

## Outputs

### Success

Pre-rendered HTML; title `"How to pay — Clean World Inc."`.

### Error

None.

---

## Edge Cases

| # | Scenario | Classification | Handling |
|---|---|---|---|
| 1 | Merchant numbers unconfirmed in production | critical | No number is shown; fallback sentence is rendered |
| 2 | Any input field on this page | critical | Zero `<input>`, `<textarea>`, or `<select>` elements inside `<main>` |
| 3 | Bank details | critical | Never rendered on the website |

---

## Completion Checklist

- [x] Strict type definitions maintained (`src/types.ts`)
- [x] Process steps implemented in order (`src/routes/how-to-pay.tsx`)
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
| 1.1 | 2026-11-16 | Add `Alternatives Considered`, `Risks & Limits`, tighten PIN copy, and add unit test verifying non-empty unconfirmed merchant numbers are hidden | EGM codebase review & auto-resolve | Owner standing instruction (auto-approve) |
