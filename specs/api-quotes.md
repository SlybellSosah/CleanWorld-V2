# Spec: Quote API
**Status:** implemented
**Version:** 1.0
**Created:** 2026-11-16
**Last Updated:** 2026-11-16

---

## Dependencies
- Depends on: global schema in `project.md`; `integration-turnstile`; `integration-email`; D1 table `quote_requests`
- Consumed by: `view-quote`, `view-admin`

---

## Inputs

### `POST /api/quotes`
Body: `QuoteRequestInput` as JSON (see `project.md`). Maximum body size 10 KB.

### `GET /api/admin/quotes`
| Field | Type | Required | Description |
|---|---|---|---|
| status (query) | QuoteStatus | no | Filter; omitted returns all |

### `PATCH /api/admin/quotes/:id`
| Field | Type | Required | Description |
|---|---|---|---|
| status | QuoteStatus | yes | New status |

### Scheduled event (every five minutes)
No input.

---

## Process

### POST /api/quotes
1. If the body is larger than 10 KB: return `PAYLOAD_TOO_LARGE`.
2. Parse JSON. If it fails: return `INVALID_JSON`.
3. Validate with `validateQuote` (`src/lib/validate.ts`). If it fails: return `VALIDATION_FAILED` with per-field messages.
4. Look up `id`. If a row exists: return success with its reference (no second insert, no second email).
5. Verify the spam token (`integration-turnstile`). If it fails: return `SPAM_CHECK_FAILED`.
6. Generate a reference with `makeReference`. Insert the row with `status = new`, `notify_status = pending`.
7. If the insert fails on the unique reference: generate a new reference and retry, up to three times; then return `SERVER_ERROR`.
8. Start the staff notification without waiting for it (`integration-email`), recording the result on the row.
9. Return success with the reference.

### GET /api/admin/quotes
1. Authorise (see `view-admin`). If it fails: return `UNAUTHORIZED` or `ADMIN_NOT_CONFIGURED`.
2. If `status` is present and not a QuoteStatus: return `VALIDATION_FAILED`.
3. Select the latest 200 rows, newest first, filtered by status if given.
4. Return success with the rows.

### PATCH /api/admin/quotes/:id
1. Authorise.
2. Validate `status`. If invalid: return `VALIDATION_FAILED`.
3. Update the row. If no row matched: return `NOT_FOUND`.
4. Return success with the updated row.

### Scheduled event
1. Select up to 20 rows where `notify_status` is `pending` or `failed` and `notify_tries < 10`, oldest first.
2. For each: send the staff notification and record the result.

### Any other `/api/*` path or method
Return `NOT_FOUND` or `METHOD_NOT_ALLOWED`.

---

## Outputs

### Success — POST
```json
{ "status": "success", "data": { "reference": "CW-7K4M-2QXD" } }
```

### Success — admin
```json
{ "status": "success", "data": { "quotes": [ { "id": "…", "reference": "…", "status": "new", "notifyStatus": "sent" } ] } }
```

### Error
```json
{ "status": "error", "code": "VALIDATION_FAILED", "message": "Some details need correcting.", "fields": { "phone": "Enter a phone number we can call." } }
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
| 2 | Same `id` sent twice | critical | Second call returns the first reference; one row, one email |
| 3 | Organisation without an organisation name | critical | `VALIDATION_FAILED` on `organisation` |
| 4 | Neighbourhood `Other` without a landmark | critical | `VALIDATION_FAILED` on `landmark` |
| 5 | Local phone format `0912 345 678` | critical | Stored as `+211912345678` |
| 6 | Spam check enabled and token missing or rejected | critical | `SPAM_CHECK_FAILED`; nothing stored |
| 7 | Email send fails | critical | Row is kept; `notify_status = failed`, `notify_tries + 1`; the scheduled event retries |
| 8 | Email not configured | critical | Row is kept with `notify_status = pending`; tries are not counted |
| 9 | Flood of requests from one address | deferred | Backlog — Turnstile is the only limit in v1 |
| 10 | Body is not JSON | critical | `INVALID_JSON` |
| 11 | Admin call without valid staff sign-in | critical | `UNAUTHORIZED`; no data returned |
| 12 | Admin sets an unknown status | critical | `VALIDATION_FAILED`; row unchanged |

---

## Completion Checklist

- [x] Strict type definitions generated (`src/types.ts`, SQL migration)
- [x] Process steps implemented in order (`worker/quotes.ts`, `worker/admin.ts`, `worker/notify.ts`)
- [x] All critical edge cases handled
- [x] Tests written — one per critical edge case (`tests/unit/api-quotes.test.ts`)
- [x] Deferred edge cases added to the backlog
- [x] Spec status updated to `implemented`
- [x] Dependencies notified of any interface changes (none)

---

## Changelog

| Version | Date | Change | Reason | Re-approved by |
|---|---|---|---|---|
| 1.0 | 2026-11-16 | Initial spec | — | Owner standing instruction (auto-approve) |
