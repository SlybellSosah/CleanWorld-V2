# Spec: Staff request list (`/admin`)

- **Status:** implemented
- **Version:** 1.1
- **Created:** 2026-11-16
- **Last Updated:** 2026-11-16

---

## Problem Statement

Staff need a protected, mobile-friendly view to see incoming quote requests, spot any request whose email notification failed, call customers directly, and track request statuses without building a custom password/account system.

## Goals & Non-Goals

- **Goals:** Authenticate every `/admin*` and `/api/admin/*` request in the Worker via Cloudflare Access RS256 JWT verification, flag un-emailed leads across all filters, show tap-to-call phone numbers in list rows, and update request statuses with single-row optimistic rollback.
- **Non-Goals:** Custom staff user/password tables, public search indexing (`noindex`, excluded from `robots.txt` and `sitemap.xml`), or pagination beyond 200 rows in Phase 1.

## Alternatives Considered

- **Custom staff login & session database vs Cloudflare Access + Worker JWT verification:** Chose Cloudflare Access (free up to 50 users) verified in the Worker with WebCrypto RS256 so Clean World manages staff access by email list with zero password storage or third-party JWT libraries.
- **Trusting edge Access routing alone vs re-verifying `Cf-Access-Jwt-Assertion` inside the Worker:** Re-verify inside `worker/access.ts` (failing closed with `503 ADMIN_NOT_CONFIGURED` if `ACCESS_TEAM_DOMAIN` or `ACCESS_AUD` is unset) so a misconfigured route or `workers.dev` URL never exposes customer data.

## Risks & Limits

- **JWKS key rotation & upstream availability:** `worker/access.ts` caches valid JWKS keys for 1 hour, refuses to cache empty/error responses, falls back to cached keys on transient upstream errors, and refreshes once on unknown `kid` after a 60-second cooldown.
- **200-row ceiling:** Lists the latest 200 requests; cursor pagination is tracked in the backlog ([`project.md`](../project.md)).

---

## Dependencies

- Depends on: [`specs/api-quotes.md`](api-quotes.md); [`specs/ui-shell.md`](ui-shell.md); Cloudflare Access; Worker variables `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`, `ADMIN_DEV_BYPASS`
- Consumed by: staff only

---

## Inputs

| Field | Type | Required | Description |
|---|---|---|---|
| `Cf-Access-Jwt-Assertion` header | `string` | yes in production | RS256 JWT added by Cloudflare Access |
| status filter | `QuoteStatus \| "all"` | no | Client filter, defaults to `"all"` |

---

## Process

### Authorise (Worker, for `/admin*` and `/api/admin/*`)

1. If `ADMIN_DEV_BYPASS` is `"1"` and the request hostname is `localhost` or `127.0.0.1`: allow.
2. Normalise `ACCESS_TEAM_DOMAIN` (stripping `https://` and trailing `/`). If `ACCESS_TEAM_DOMAIN` or `ACCESS_AUD` is empty: deny with `ADMIN_NOT_CONFIGURED` (`503`).
3. Read `Cf-Access-Jwt-Assertion`. If absent or not a 3-part RS256 JWT: deny with `UNAUTHORIZED` (`401`).
4. Fetch signing keys from `https://<team>/cdn-cgi/access/certs` with a 5-second timeout (cached for 1 hour when non-empty; refreshed once on unknown `kid` after a 60-second cooldown).
5. Verify the RS256 signature, `aud` contains `ACCESS_AUD`, `iss` equals `https://<team>`, optional `nbf` is not in the future, and `exp` is in the future. If any check fails: deny with `UNAUTHORIZED` (`401`).
6. Allow. Serve `/admin*` HTML responses with `Cache-Control: private, no-store`, and require same-origin `Origin` / `Sec-Fetch-Site` on state-changing `/api/admin/*` calls.

For direct `/admin*` document requests, Worker denials return a plain-text `401` (`"You are not signed in as staff."`) or `503` (`"Staff sign-in is not set up yet."`) response before serving HTML. If a staff session expires after the page is open, client `fetch` calls display the matching message in place of the list.

### Page

1. Fetch `GET /api/admin/quotes` (with optional `?status=` filter, aborting superseded requests on rapid filter changes).
2. Display the total `unemailedCount` (active non-spam requests whose `notifyStatus` is not `sent`) above the list regardless of the active status filter.
3. List requests newest first, showing on each summary row: `reference`, customer (`organisation ?? name`), `createdAt`, service title, `neighbourhood`, tap-to-call `phone` link, `status`, and `"not emailed"` badge when applicable.
4. Expanding a request displays all stored fields (`name`, `phone`, `organisation`, `email`, `poReference`, `customerType`, `scope`, formatted `frequency`, `landmark`, `notifyStatus`/`notifyTries`, and `status` selector).
5. Changing a row's status sends `PATCH /api/admin/quotes/:id`; on failure, only that row's previous status is restored and an alert banner names the reference.

---

## Outputs

### Success

Staff request list with global un-emailed counter, expandable details, and inline status selector.

### Error

Worker plain-text `401`/`503` on unauthenticated direct document requests, or in-page alert message (`"You are not signed in as staff."`, `"Staff sign-in is not set up yet."`, or `"Could not load requests."`) when API requests fail.

---

## Edge Cases

| # | Scenario | Classification | Handling |
|---|---|---|---|
| 1 | No token | critical | 401; no data returned |
| 2 | Token with wrong audience, issuer, signature, future `nbf`, or expired `exp` | critical | 401 |
| 3 | Access variables not set in production | critical | 503; never open by default |
| 4 | `ADMIN_DEV_BYPASS=1` on a non-local host | critical | Ignored; normal Access checks apply |
| 5 | More than 200 requests | deferred | Backlog — latest 200 only |
| 6 | Status update fails | critical | Single-row previous status restored; alert shown |
| 7 | Search engines | critical | `noindex, nofollow` meta tag, `Disallow: /admin` in `robots.txt`, and omitted from `sitemap.xml` |

---

## Completion Checklist

- [x] Strict type definitions maintained (`src/types.ts`)
- [x] Process steps implemented in order (`worker/access.ts`, `worker/index.ts`, `worker/admin.ts`, `src/routes/admin.tsx`)
- [x] All critical edge cases handled
- [x] Tests written — one per critical edge case (`tests/unit/view-admin.test.ts`, `tests/unit/api-quotes.test.ts`, `tests/e2e/admin.spec.ts`)
- [x] Deferred edge cases added to the backlog
- [x] Spec status updated to `implemented`
- [x] Dependencies notified of any interface changes (none)

---

## Changelog

| Version | Date | Change | Reason | Re-approved by |
|---|---|---|---|---|
| 1.0 | 2026-11-16 | Initial spec | — | Owner standing instruction (auto-approve) |
| 1.1 | 2026-11-16 | Harden JWKS cache/key-rotation/domain parsing, add tap-to-call phone to list rows and delivery status to details, use global `unemailedCount`, generate `sitemap.xml` excluding `/admin`, and isolate per-row rollback | EGM codebase review & auto-resolve | Owner standing instruction (auto-approve) |
