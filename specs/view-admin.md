# Spec: Staff request list (`/admin`)
**Status:** implemented
**Version:** 1.0
**Created:** 2026-11-16
**Last Updated:** 2026-11-16

---

## Dependencies
- Depends on: `api-quotes`; Cloudflare Access; Worker variables `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`, `ADMIN_DEV_BYPASS`
- Consumed by: staff only

---

## Inputs

| Field | Type | Required | Description |
|---|---|---|---|
| `Cf-Access-Jwt-Assertion` header | string | yes in production | Token added by Cloudflare Access |
| status filter | QuoteStatus \| `all` | no | Defaults to `all` |

---

## Process

### Authorise (Worker, for `/admin*` and `/api/admin/*`)
1. If `ADMIN_DEV_BYPASS` is `1` and the request host is `localhost` or `127.0.0.1`: allow.
2. If `ACCESS_TEAM_DOMAIN` or `ACCESS_AUD` is empty: deny with `ADMIN_NOT_CONFIGURED`.
3. Read the token from the header. If absent: deny with `UNAUTHORIZED`.
4. Fetch the signing keys from `https://<team>/cdn-cgi/access/certs` (cached for one hour).
5. Verify the RS256 signature, the `aud` claim contains `ACCESS_AUD`, the `iss` claim is `https://<team>`, and `exp` is in the future. If any check fails: deny with `UNAUTHORIZED`.
6. Allow.

For `/admin*` page requests a denial returns a plain-text response with the same status; an allowed request is served the static page.

### Page
1. Fetch `GET /api/admin/quotes` (with the status filter).
2. Show a count of requests not yet emailed to staff (`notifyStatus` not `sent`) above the list.
3. List requests, newest first: reference, date, customer, service, neighbourhood, phone (tap to call), status.
4. Selecting a request shows all its fields.
5. Changing the status select calls `PATCH`; on success the row updates; on failure the previous value is restored and a message is shown.

---

## Outputs

### Success
The list as described.

### Error
A message in place of the list: "You are not signed in as staff" (401), "Staff sign-in is not set up yet" (503), or "Could not load requests".

---

## Edge Cases

| # | Scenario | Classification | Handling |
|---|---|---|---|
| 1 | No token | critical | 401; no data |
| 2 | Token with wrong audience, issuer, signature or expired | critical | 401 |
| 3 | Access variables not set in production | critical | 503; never open by default |
| 4 | `ADMIN_DEV_BYPASS=1` on a non-local host | critical | Ignored; normal checks apply |
| 5 | More than 200 requests | deferred | Backlog — latest 200 only |
| 6 | Status update fails | critical | Previous value restored; message shown |
| 7 | Search engines | critical | Page has `noindex`; not in the sitemap |

---

## Completion Checklist

- [x] Strict type definitions generated
- [x] Process steps implemented in order (`worker/access.ts`, `worker/admin.ts`, `src/routes/admin.tsx`)
- [x] All critical edge cases handled
- [x] Tests written — one per critical edge case (`tests/unit/view-admin.test.ts`, `tests/e2e/admin.spec.ts`)
- [x] Deferred edge cases added to the backlog
- [x] Spec status updated to `implemented`
- [x] Dependencies notified of any interface changes (none)

---

## Changelog

| Version | Date | Change | Reason | Re-approved by |
|---|---|---|---|---|
| 1.0 | 2026-11-16 | Initial spec | — | Owner standing instruction (auto-approve) |
