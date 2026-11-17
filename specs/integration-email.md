# Spec: Staff notification email (Resend)

- **Status:** implemented
- **Version:** 1.1
- **Created:** 2026-11-16
- **Last Updated:** 2026-11-16

---

## Problem Statement

Staff in Juba monitor email and WhatsApp rather than keeping `/admin` open continuously, so each stored quote request must trigger a plain-text staff email without ever blocking quote persistence or sending duplicate emails on retry.

## Goals & Non-Goals

- **Goals:** Format a plain-text notification from the stored `QuoteRequest`, send via Resend HTTP API with an idempotency key and 10-second timeout, leave unconfigured environments safely in `pending`, and record `sent` vs `failed` monotonically.
- **Non-Goals:** HTML email templates (plain text eliminates markup injection) or automated confirmation emails to customers (deferred in backlog).

## Alternatives Considered

- **Cloudflare Email Workers / AWS SES vs Resend HTTP API:** Chose Resend because its REST endpoint requires a single `fetch` call with native `Idempotency-Key` support and fits Cloudflare's free Worker limits at Phase 1 volume.
- **HTML-formatted emails vs plain-text emails:** Chose plain text (`text` field only) so untrusted customer `scope` or `landmark` strings are never interpreted as HTML.

## Risks & Limits

- **Resend outage or daily free-tier cap:** Failed sends increment `notify_tries` (up to 10 attempts via the 5-minute cron) and remain visible in `/admin` (`unemailedCount`), ensuring no lead is silently lost.

---

## Dependencies

- Depends on: Resend HTTP API (`POST https://api.resend.com/emails`); Worker variables `RESEND_API_KEY` (secret), `NOTIFY_FROM`, `NOTIFY_TO`
- Consumed by: [`specs/api-quotes.md`](api-quotes.md)

---

## Inputs

| Field | Type | Required | Description |
|---|---|---|---|
| quote | `QuoteRequest` | yes | Stored quote request |
| RESEND_API_KEY | `string` | no | Secret; absent means email is not configured |
| NOTIFY_FROM | `string` | no | Verified sender address on the company domain |
| NOTIFY_TO | `string` | no | Comma-separated staff recipient addresses |

---

## Process

1. Trim and split `NOTIFY_TO` on commas. If `RESEND_API_KEY`, `NOTIFY_FROM`, or `NOTIFY_TO` is empty: return `"not_configured"`.
2. Build the message with `buildStaffEmail` ([`src/lib/messages.ts`](../src/lib/messages.ts)):
   - Subject: `New quote request <reference> — <service title> — <neighbourhood>`
   - Plain-text body lines (omitting empty optional fields): `Reference`, `Received`, `Customer`, `Organisation`, `Service`, `Details`, `How often`, `Neighbourhood`, `Landmark`, `Name`, `Phone`, `Email`, `PO / tender ref`.
3. `POST` to `https://api.resend.com/emails` with a 10-second `AbortSignal.timeout`, JSON body `{ from, to, subject, text }`, and header `Idempotency-Key: quote-<id>`.
4. If the HTTP status is 2xx: return `"sent"`.
5. Otherwise, or if the request throws or times out: return `"failed"`.

The caller (`notifyAndRecord`) records the `NotifyResult` monotonically (`WHERE notify_status != 'sent'`): `"sent"` sets `notify_status = 'sent'` without incrementing `notify_tries`; `"failed"` sets `notify_status = 'failed'` and increments `notify_tries + 1`; `"not_configured"` makes no database change.

---

## Outputs

### Success (`NotifyResult`)

```text
"sent"
```

### Non-delivery (`NotifyResult`)

```text
"failed" | "not_configured"
```

---

## Edge Cases

| # | Scenario | Classification | Handling |
|---|---|---|---|
| 1 | Variables missing | critical | `"not_configured"`; request stays `pending` (`notify_tries = 0`) and visible in `/admin` |
| 2 | Resend returns an error status | critical | `"failed"`; `notify_tries + 1`; retried by scheduled event |
| 3 | Network error or timeout | critical | `"failed"` after 10-second timeout |
| 4 | Optional fields empty | critical | Omitted from body; no `"undefined"` text |
| 5 | Retry after a send that succeeded | critical | `Idempotency-Key: quote-<id>` prevents duplicate emails; `WHERE notify_status != 'sent'` prevents status regression |
| 6 | Customer-supplied text contains markup | critical | Plain-text body only; no `html` field sent |
| 7 | Confirmation email to the customer | deferred | Backlog ([`project.md`](../project.md)) — customers are answered by phone or WhatsApp |

---

## Completion Checklist

- [x] Strict type definitions maintained (`worker/deps.ts`, `src/types.ts`)
- [x] Process steps implemented in order (`worker/notify.ts`, `src/lib/messages.ts`)
- [x] All critical edge cases handled
- [x] Tests written — one per critical edge case (`tests/unit/integration-email.test.ts`, `tests/unit/api-quotes.test.ts`)
- [x] Deferred edge cases added to the backlog (`project.md`)
- [x] Spec status updated to `implemented`
- [x] Dependencies notified of any interface changes (none)

---

## Changelog

| Version | Date | Change | Reason | Re-approved by |
|---|---|---|---|---|
| 1.0 | 2026-11-16 | Initial spec | — | Owner standing instruction (auto-approve) |
| 1.1 | 2026-11-16 | Fix `notifyAndRecord` so `"sent"` does not increment `notify_tries`, add 10s fetch timeout and monotonic `'sent'` guard, align `Outputs` with `NotifyResult`, and add Edge Case 7 to `project.md` backlog | EGM codebase review & auto-resolve | Owner standing instruction (auto-approve) |
