# Spec: Spam check (Cloudflare Turnstile)

- **Status:** implemented
- **Version:** 1.1
- **Created:** 2026-11-16
- **Last Updated:** 2026-11-16

---

## Problem Statement

`POST /api/quotes` is publicly callable without login and triggers database writes and staff emails; automated bot submissions must be filtered without blocking legitimate customers when Turnstile is unprovisioned or unreachable on weak mobile networks.

## Goals & Non-Goals

- **Goals:** Lazily mount Cloudflare Turnstile on Step 4 of `/quote`, request a fresh single-use token per submit attempt, fall back to the WhatsApp/phone/email failure panel if the script or challenge errors/times out, and verify tokens server-side with an 8-second timeout.
- **Non-Goals:** Failing closed when `TURNSTILE_SECRET` is unconfigured (optional until provisioned) or storing rejected bot requests in D1.

## Alternatives Considered

- **Image puzzle CAPTCHA vs Cloudflare Turnstile:** Chose Turnstile because non-interactive challenges avoid frustrating mobile users in Juba and stay free on Cloudflare.
- **Failing closed when `TURNSTILE_SECRET` is unset vs disabling check when unset:** Chose disabling when unset so owner deployments prior to Turnstile key provisioning never drop real customer requests; once `TURNSTILE_SECRET` is set, missing or invalid tokens are strictly rejected.

## Risks & Limits

- **No per-IP rate limit in v1:** When `TURNSTILE_SECRET` is unset, `POST /api/quotes` has no bot check; per-IP edge rate limiting beyond Turnstile is tracked in the backlog ([`project.md`](../project.md)).

---

## Dependencies

- Depends on: Turnstile widget (`https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit`) and `POST https://challenges.cloudflare.com/turnstile/v0/siteverify`; build variable `VITE_TURNSTILE_SITE_KEY`; Worker secret `TURNSTILE_SECRET`
- Consumed by: [`specs/api-quotes.md`](api-quotes.md), [`specs/view-quote.md`](view-quote.md)

---

## Inputs

| Field | Type | Required | Description |
|---|---|---|---|
| token | `string` (`<= 2048` chars) | when enabled | Single-use token produced by the browser widget |
| remoteIp | `string` | no | `CF-Connecting-IP` header passed to `siteverify` |
| TURNSTILE_SECRET | `string` | no | Worker secret; absent means server verification is disabled |
| VITE_TURNSTILE_SITE_KEY | `string` | no | Build-time public site key; absent means the browser widget is not rendered |

---

## Process

### Server (`worker/turnstile.ts`)

1. If `TURNSTILE_SECRET` is empty: return `"ok"` (check disabled).
2. If `token` is empty: return `"rejected"`.
3. `POST` `secret`, `response`, and optional `remoteip` to `siteverify` with an 8-second `AbortSignal.timeout`.
4. If HTTP status is 2xx and JSON has `success: true`: return `"ok"`.
5. Otherwise, or if the request throws or times out: return `"rejected"`.

### Browser (`src/features/quote/Turnstile.tsx`)

1. If no site key is configured: render nothing and send no token.
2. When Step 4 mounts: load `api.js?render=explicit` once (deduplicating `<script>` tags) and render the widget, cleaning up with `turnstile.remove(id)` on unmount.
3. After every submit attempt: call `reset()` so retries obtain a fresh single-use token.
4. If the script fails to load, no token is produced within 8 seconds, or Turnstile invokes `error-callback` or `timeout-callback`: mark the widget `unavailable` so submitting `/quote` transitions straight to the failure panel with the WhatsApp fallback ([`specs/view-quote.md`](view-quote.md) Edge Case 6).

---

## Outputs

### Success (`SpamResult`)

```text
"ok"
```

### Error (`SpamResult`)

```text
"rejected"
```

---

## Edge Cases

| # | Scenario | Classification | Handling |
|---|---|---|---|
| 1 | `TURNSTILE_SECRET` not set | critical | `"ok"`; API accepts requests without a token |
| 2 | Secret set, token missing | critical | `"rejected"` |
| 3 | `siteverify` says token is invalid | critical | `"rejected"` |
| 4 | `siteverify` unreachable or times out | critical | `"rejected"` — `/quote` then offers WhatsApp/phone/email fallback |
| 5 | Retry after failed submit | critical | Browser resets widget and sends a fresh token on the next attempt |

---

## Completion Checklist

- [x] Strict type definitions maintained (`worker/deps.ts`, `src/features/quote/Turnstile.tsx`)
- [x] Process steps implemented in order (`worker/turnstile.ts`, `src/features/quote/Turnstile.tsx`)
- [x] All critical edge cases handled
- [x] Tests written — one per critical edge case (`tests/unit/integration-turnstile.test.ts`, `tests/e2e/quote.spec.ts`)
- [x] Deferred edge cases added to the backlog (none)
- [x] Spec status updated to `implemented`
- [x] Dependencies notified of any interface changes (none)

---

## Changelog

| Version | Date | Change | Reason | Re-approved by |
|---|---|---|---|---|
| 1.0 | 2026-11-16 | Initial spec | — | Owner standing instruction (auto-approve) |
| 1.1 | 2026-11-16 | Add `error-callback`, `timeout-callback`, script deduplication, widget unmount cleanup, 8s server timeout, and automated E2E test for Case 5 | EGM codebase review & auto-resolve | Owner standing instruction (auto-approve) |
