# Spec: Spam check (Cloudflare Turnstile)
**Status:** implemented
**Version:** 1.0
**Created:** 2026-11-16
**Last Updated:** 2026-11-16

---

## Dependencies
- Depends on: Turnstile widget script and `POST https://challenges.cloudflare.com/turnstile/v0/siteverify`; build variable `VITE_TURNSTILE_SITE_KEY`; Worker secret `TURNSTILE_SECRET`
- Consumed by: `api-quotes`, `view-quote`

---

## Inputs

| Field | Type | Required | Description |
|---|---|---|---|
| token | string | when enabled | Value produced by the widget |
| remoteIp | string | no | Caller address, passed to Turnstile |
| TURNSTILE_SECRET | string | no | Absent means the check is disabled |

---

## Process

### Server
1. If `TURNSTILE_SECRET` is empty: return `ok` (check disabled).
2. If `token` is empty: return `rejected`.
3. `POST` `secret`, `response` and `remoteip` to siteverify.
4. If the response JSON has `success: true`: return `ok`.
5. Otherwise, or if the request throws: return `rejected`.

### Browser
1. If `VITE_TURNSTILE_SITE_KEY` is empty: render nothing and send no token.
2. Otherwise load the widget script when the contact step is shown and render the widget.
3. Request a fresh token for every submit attempt.
4. If the script has not loaded within eight seconds: mark the check unavailable (see `view-quote` edge case 6).

---

## Outputs

### Success
```json
{ "result": "ok" }
```

### Error
```json
{ "result": "rejected" }
```

---

## Edge Cases

| # | Scenario | Classification | Handling |
|---|---|---|---|
| 1 | Secret not set | critical | `ok`; the API accepts requests without a token |
| 2 | Secret set, token missing | critical | `rejected` |
| 3 | Siteverify says the token is invalid | critical | `rejected` |
| 4 | Siteverify unreachable | critical | `rejected` — the form then offers WhatsApp |
| 5 | Token reused on a retry | critical | Browser requests a new token for each attempt |

---

## Completion Checklist

- [x] Strict type definitions generated
- [x] Process steps implemented in order (`worker/turnstile.ts`, `src/features/quote/Turnstile.tsx`)
- [x] All critical edge cases handled
- [ ] Tests written — one per critical edge case (`tests/unit/integration-turnstile.test.ts`). Case 5 has no automated test: see Changelog
- [x] Deferred edge cases added to the backlog (none)
- [x] Spec status updated to `implemented`
- [x] Dependencies notified of any interface changes (none)

---

## Changelog

| Version | Date | Change | Reason | Re-approved by |
|---|---|---|---|---|
| 1.0 | 2026-11-16 | Initial spec | — | Owner standing instruction (auto-approve) |
| 1.0 | 2026-11-16 | Test gap recorded | Case 5 and the browser widget cannot be exercised without a Turnstile site key; test when keys are provisioned | — |
