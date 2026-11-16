# Spec: Privacy (`/privacy`)
**Status:** implemented
**Version:** 1.0
**Created:** 2026-11-16
**Last Updated:** 2026-11-16

---

## Dependencies
- Depends on: `ui-shell`; `src/content/company.ts`
- Consumed by: footer, `view-quote` contact step

---

## Inputs

None.

---

## Process

1. "What we collect": the details you enter in a quote request — name, phone, optional email, organisation, neighbourhood and landmark, and what you ask for.
2. "Why": to contact you about your request and prepare a quotation.
3. "Who sees it": Clean World staff. It is stored with Cloudflare and notification emails are sent through Resend. It is not sold or used for advertising.
4. "How long": 24 months, unless the request became a contract.
5. "On your device": an unfinished request is saved on your own device until you send it or clear it. No advertising cookies.
6. "Your choices": ask us to correct or delete your details, using any visible contact fact.

---

## Outputs

### Success
Pre-rendered HTML; title "Privacy — Clean World Inc.".

### Error
None.

---

## Edge Cases

| # | Scenario | Classification | Handling |
|---|---|---|---|
| 1 | No contact fact visible | critical | The sentence reads "contact us through the details on your quotation" |
| 2 | Deleting requests after 24 months | deferred | Backlog — manual until a scheduled task is added |

---

## Completion Checklist

- [x] Strict type definitions generated (none needed)
- [x] Process steps implemented in order (`src/routes/privacy.tsx`)
- [x] All critical edge cases handled
- [x] Tests written — one per critical edge case (`tests/e2e/pages.spec.ts`)
- [x] Deferred edge cases added to the backlog
- [x] Spec status updated to `implemented`
- [x] Dependencies notified of any interface changes (none)

---

## Changelog

| Version | Date | Change | Reason | Re-approved by |
|---|---|---|---|---|
| 1.0 | 2026-11-16 | Initial spec | — | Owner standing instruction (auto-approve) |
