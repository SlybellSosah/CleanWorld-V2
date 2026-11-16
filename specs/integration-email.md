# Spec: Staff notification email (Resend)
**Status:** implemented
**Version:** 1.0
**Created:** 2026-11-16
**Last Updated:** 2026-11-16

---

## Dependencies
- Depends on: Resend HTTP API (`POST https://api.resend.com/emails`); Worker variables `RESEND_API_KEY` (secret), `NOTIFY_FROM`, `NOTIFY_TO`
- Consumed by: `api-quotes`

---

## Inputs

| Field | Type | Required | Description |
|---|---|---|---|
| quote | QuoteRequest | yes | The stored request |
| RESEND_API_KEY | string | no | Secret; absent means email is not configured |
| NOTIFY_FROM | string | no | Sender, an address on the verified company domain |
| NOTIFY_TO | string | no | Comma-separated staff addresses |

---

## Process

1. If any of the three variables is empty: return `not_configured`.
2. Build the message with `buildStaffEmail` (`src/lib/messages.ts`):
   - Subject: `New quote request <reference> — <service> — <neighbourhood>`
   - Plain-text body: reference, date, customer type, service, scope, frequency, neighbourhood, landmark, name, phone, organisation, email, purchase-order reference. Empty optional fields are omitted.
3. `POST` to Resend with `from`, `to` (array), `subject`, `text`, and header `Idempotency-Key: quote-<id>`.
4. If the response status is 2xx: return `sent`.
5. Otherwise, or if the request throws: return `failed`.

The caller records the result: `sent` → `notify_status = sent`; `failed` → `notify_status = failed`, `notify_tries + 1`; `not_configured` → no change.

---

## Outputs

### Success
```json
{ "result": "sent" }
```

### Error
```json
{ "result": "failed" }
{ "result": "not_configured" }
```

---

## Edge Cases

| # | Scenario | Classification | Handling |
|---|---|---|---|
| 1 | Variables missing | critical | `not_configured`; request stays `pending` and visible in the staff list |
| 2 | Resend returns an error status | critical | `failed`; retried by the scheduled event |
| 3 | Network error or timeout | critical | `failed` |
| 4 | Optional fields empty | critical | Lines omitted from the body; no "undefined" text |
| 5 | Retry after a send that succeeded but was not recorded | critical | `Idempotency-Key` prevents a duplicate email |
| 6 | Customer-supplied text contains markup | critical | Body is plain text only; nothing is rendered as HTML |
| 7 | Confirmation email to the customer | deferred | Backlog — customers are answered by phone or WhatsApp |

---

## Completion Checklist

- [x] Strict type definitions generated
- [x] Process steps implemented in order (`worker/notify.ts`, `src/lib/messages.ts`)
- [x] All critical edge cases handled
- [x] Tests written — one per critical edge case (`tests/unit/integration-email.test.ts`)
- [x] Deferred edge cases added to the backlog
- [x] Spec status updated to `implemented`
- [x] Dependencies notified of any interface changes (none)

---

## Changelog

| Version | Date | Change | Reason | Re-approved by |
|---|---|---|---|---|
| 1.0 | 2026-11-16 | Initial spec | — | Owner standing instruction (auto-approve) |
