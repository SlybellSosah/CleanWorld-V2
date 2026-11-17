# Spec: Quote API (`/api/quotes`, `/api/admin/quotes`)

- **Status:** implemented
- **Version:** 1.1
- **Created:** 2026-11-16
- **Last Updated:** 2026-11-16

---

## Problem Statement

Quote submissions must be persisted reliably in Cloudflare D1 before any external email call is attempted, return deterministic references across network retries or double taps, and retry failed staff email notifications automatically without external queue infrastructure.

## Goals & Non-Goals

- **Goals:** Validate and persist quote requests idempotently in D1, generate unambiguous human-readable references (`CW-XXXX-XXXX`), dispatch and retry staff emails asynchronously, and expose Access-protected list and status-update endpoints for `/admin`.
- **Non-Goals:** Per-IP edge rate limiting beyond Turnstile (deferred in backlog), directional status-transition locks that prevent staff correcting mistakes, or pagination beyond 200 rows in Phase 1.

## Alternatives Considered

- **Cloudflare Queues vs D1 `notify_status` + 5-minute Cron Trigger:** Chose D1 + Cron Trigger because Queues require a paid Workers plan, whereas D1 + Cron runs on Cloudflare's free plan and keeps the database row itself as the single audit record of notification state.
- **Sequential auto-increment IDs vs client UUID + random 8-character `CW-XXXX-XXXX` reference:** Chose client UUIDs for lossless retry idempotency and random 30-character-alphabet references (`23456789ABCDEFGHJKMNPQRSTVWXYZ`, omitting `0/O/1/I/L/U`) so references read clearly over phone calls and do not leak business volume.

## Risks & Limits

- **Cron vs `ctx.waitUntil` overlap:** Mitigated by skipping `pending` rows created less than 60 seconds ago in `pendingNotify` and guarding `recordNotify` with `WHERE notify_status != 'sent'` so a late error never overwrites a completed send.
- **Retry ceiling:** Scheduled retries stop at `notify_tries = 10`, leaving the request flagged in `/admin` (`unemailedCount`) for staff follow-up.

---

## Dependencies

- Depends on: global schema in [`project.md`](../project.md); [`specs/integration-turnstile.md`](integration-turnstile.md); [`specs/integration-email.md`](integration-email.md); [`specs/view-admin.md`](view-admin.md); D1 table `quote_requests`
- Consumed by: [`specs/view-quote.md`](view-quote.md), [`specs/view-admin.md`](view-admin.md)

---

## Inputs

### `POST /api/quotes`

| Field | Type | Required | Description |
|---|---|---|---|
| body | `QuoteRequestInput` (JSON) | yes | Validated against global schema in [`project.md`](../project.md); max `10,240` UTF-8 bytes (10 KB) |

### `GET /api/admin/quotes`

| Field | Type | Required | Description |
|---|---|---|---|
| status (query) | `QuoteStatus` | no | Optional status filter; omitted returns all statuses |

### `PATCH /api/admin/quotes/:id`

| Field | Type | Required | Description |
|---|---|---|---|
| id (path) | `string` (UUID) | yes | 36-character UUID of the quote request |
| status (body) | `QuoteStatus` | yes | New status (`<= 1,024` UTF-8 bytes JSON body; same-origin required) |

### Scheduled event (`*/5 * * * *`)

| Field | Type | Required | Description |
|---|---|---|---|
| cron trigger | `ScheduledController` | yes | Invoked every five minutes with no payload |

---

## Process

### `POST /api/quotes`

1. Read the request stream with a strict `10,240`-byte ceiling (`readJsonBounded`). If exceeded: return `PAYLOAD_TOO_LARGE` (`413`). If JSON parsing fails: return `INVALID_JSON` (`400`).
2. Validate with `validateQuote` ([`src/lib/validate.ts`](../src/lib/validate.ts)). If invalid: return `VALIDATION_FAILED` (`422`) with per-field messages.
3. Look up `id` in D1. If a row exists: return success with its `reference` (no second insert, no second email).
4. Verify the Turnstile token ([`specs/integration-turnstile.md`](integration-turnstile.md)). If rejected, re-check `findById(id)` once in case a concurrent retry already succeeded; otherwise return `SPAM_CHECK_FAILED` (`403`).
5. Generate an unambiguous reference with `makeReference` (`src/lib/reference.ts`) and insert the row with `status = 'new'`, `notify_status = 'pending'`, `notify_tries = 0`.
6. If the insert collides on `quote_requests.id` (concurrent duplicate submission): return the existing row's `reference` with no second email. If it collides on `quote_requests.reference`: retry with a fresh reference up to 3 times, then return `SERVER_ERROR` (`500`).
7. Defer staff email dispatch via `ctx.waitUntil` ([`specs/integration-email.md`](integration-email.md)), recording the outcome on the row.
8. Return success with `{ reference }`.

### `GET /api/admin/quotes`

1. Authorise ([`specs/view-admin.md`](view-admin.md)). If denied: return `UNAUTHORIZED` (`401`) or `ADMIN_NOT_CONFIGURED` (`503`).
2. If `status` query param is present and not a valid `QuoteStatus`: return `VALIDATION_FAILED` (`422`).
3. Query the latest 200 rows (`ORDER BY created_at DESC`, filtered by `status` if provided) and total `unemailedCount` (`notify_status != 'sent' AND status != 'spam'`).
4. Return success with `{ quotes, unemailedCount }`.

### `PATCH /api/admin/quotes/:id`

1. Authorise and verify same-origin (`Origin` / `Sec-Fetch-Site`).
2. Parse body with a `1,024`-byte ceiling (`INVALID_JSON` or `PAYLOAD_TOO_LARGE` on failure) and validate `status` (`VALIDATION_FAILED` if unknown).
3. Update `status` for `id`. If no row matched: return `NOT_FOUND` (`404`).
4. Return success with `{ quote }`.

### Scheduled event (`*/5 * * * *`)

1. Select up to 20 rows where `((notify_status = 'pending' AND created_at <= now - 60s) OR notify_status = 'failed')` and `notify_tries < 10`, oldest first.
2. For each row: send the staff notification and record the result monotonically (`WHERE notify_status != 'sent'`).

### Any other `/api/*` path or method

1. Return `METHOD_NOT_ALLOWED` (`405`) when a known endpoint receives an unsupported HTTP method, or `NOT_FOUND` (`404`) for unknown `/api/*` paths.

---

## Outputs

### Success — `POST /api/quotes`

```json
{ "status": "success", "data": { "reference": "CW-7K4M-2QXD" } }
```

### Success — `GET /api/admin/quotes`

```json
{ "status": "success", "data": { "quotes": [ { "id": "…", "reference": "…", "status": "new", "notifyStatus": "sent" } ], "unemailedCount": 0 } }
```

### Success — `PATCH /api/admin/quotes/:id`

```json
{ "status": "success", "data": { "quote": { "id": "…", "reference": "…", "status": "contacted", "notifyStatus": "sent" } } }
```

### Error

```json
{ "status": "error", "code": "VALIDATION_FAILED", "message": "Some details need correcting.", "fields": { "phone": "Enter a phone number we can call, for example 0912 345 678." } }
```

| Code | HTTP |
|---|---|
| INVALID_JSON | 400 |
| UNAUTHORIZED | 401 |
| SPAM_CHECK_FAILED | 403 |
| NOT_FOUND | 404 |
| METHOD_NOT_ALLOWED | 405 |
| PAYLOAD_TOO_LARGE | 413 |
| VALIDATION_FAILED | 422 |
| SERVER_ERROR | 500 |
| ADMIN_NOT_CONFIGURED | 503 |

---

## Edge Cases

| # | Scenario | Classification | Handling |
|---|---|---|---|
| 1 | Required field missing or malformed | critical | `VALIDATION_FAILED` with a message per field; nothing stored |
| 2 | Same `id` sent twice (sequential or concurrent) | critical | Returns the first reference; one row, one email |
| 3 | Organisation without an organisation name | critical | `VALIDATION_FAILED` on `organisation` |
| 4 | Neighbourhood `Other` without a landmark | critical | `VALIDATION_FAILED` on `landmark` |
| 5 | Local (`0912 345 678`) or trunk-zero (`+211 0912 345 678`) phone | critical | Stored as `+211912345678` |
| 6 | Spam check enabled and token missing or rejected | critical | `SPAM_CHECK_FAILED`; nothing stored |
| 7 | Email send fails | critical | Row kept; `notify_status = failed`, `notify_tries + 1`; retried by cron up to 10 tries |
| 8 | Email not configured | critical | Row kept with `notify_status = pending`, `notify_tries = 0` |
| 9 | Flood of requests from one address | deferred | Backlog — Turnstile is the only limit in v1 |
| 10 | Body is not JSON or exceeds `10,240` UTF-8 bytes | critical | `INVALID_JSON` (400) or `PAYLOAD_TOO_LARGE` (413) before buffering unbound streams |
| 11 | Admin call without valid staff sign-in or from foreign `Origin` | critical | `UNAUTHORIZED` (401) or `ADMIN_NOT_CONFIGURED` (503); no data returned |
| 12 | Admin sets an unknown status | critical | `VALIDATION_FAILED` (422); row unchanged |

---

## Completion Checklist

- [x] Strict type definitions maintained (`src/types.ts`, SQL migrations)
- [x] Process steps implemented in order (`worker/index.ts`, `worker/quotes.ts`, `worker/admin.ts`, `worker/notify.ts`, `worker/d1-repo.ts`, `worker/http.ts`)
- [x] All critical edge cases handled
- [x] Tests written — one per critical edge case (`tests/unit/api-quotes.test.ts`)
- [x] Deferred edge cases added to the backlog
- [x] Spec status updated to `implemented`
- [x] Dependencies notified of any interface changes (`specs/view-admin.md` consumes `unemailedCount`)

---

## Changelog

| Version | Date | Change | Reason | Re-approved by |
|---|---|---|---|---|
| 1.0 | 2026-11-16 | Initial spec | — | Owner standing instruction (auto-approve) |
| 1.1 | 2026-11-16 | Add bounded UTF-8 stream reader, concurrent duplicate-`id` handling, 60s `pending` cron grace window, `unemailedCount` and `PATCH` output documentation, same-origin check, and Edge Case 11 router tests | EGM codebase review & auto-resolve | Owner standing instruction (auto-approve) |
