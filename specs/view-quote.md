# Spec: Request a quote (`/quote`)
**Status:** implemented
**Version:** 1.0
**Created:** 2026-11-16
**Last Updated:** 2026-11-16

---

## Dependencies
- Depends on: `api-quotes`; `integration-turnstile`; `ui-shell`; `src/lib/validate.ts`; `src/content/services.ts`; `src/content/neighbourhoods.ts`; `src/content/company.ts`
- Consumed by: `view-home`, `view-services` (link with `?service=<slug>`)

---

## Inputs

| Field | Type | Required | Description |
|---|---|---|---|
| service (query) | ServiceSlug | no | Pre-selects the service |
| form fields | QuoteRequestInput | yes | See `project.md` |
| saved draft | QuoteDraft | no | `localStorage` key `cw.quote.draft.v1`: fields, step, id |

---

## Process

1. On load: read the saved draft. If none, create one with a new UUID. If `service` is in the query and valid, set it.
2. Show one step at a time with a progress bar: (1) Who are you, (2) What do you need, (3) Where, (4) Contact.
3. On every change: save the draft.
4. On "Continue": validate the current step's fields with `validateStep`. If invalid: show each message under its field, move focus to the first invalid field, stay on the step.
5. On "Back": go to the previous step without validating.
6. On "Send request": validate everything; obtain a spam token if enabled; `POST /api/quotes` with a 15-second timeout.
7. On success: clear the draft, show the confirmation with the reference, the next steps for the customer type, and (if a WhatsApp number is available) "Continue on WhatsApp" with the reference pre-filled.
8. On `VALIDATION_FAILED`: show the field messages and go to the first step that has one.
9. On any other failure or timeout: keep the draft; show "We could not send your request", a "Try again" button, and (if a WhatsApp number is available) "Send by WhatsApp instead", which opens WhatsApp with the whole request as text.

---

## Outputs

### Success
Confirmation panel: reference, "what happens next" list, WhatsApp button, link to `/how-to-pay`.

### Error
Inline field messages, or the send-failure panel described in step 9. No `alert()`.

---

## Edge Cases

| # | Scenario | Classification | Handling |
|---|---|---|---|
| 1 | Refresh or return mid-form | critical | Draft restores fields and step |
| 2 | "Send" pressed twice, or retried after a timeout | critical | Same `id` is sent; the API returns the same reference |
| 3 | Step submitted with a required field empty | critical | Message under the field; focus moves to it |
| 4 | Network failure or timeout | critical | Failure panel with "Try again" and WhatsApp fallback; draft kept |
| 5 | Household customer | critical | Organisation, email-required and purchase-order fields are not shown |
| 6 | Spam widget fails to load | critical | Failure panel shown on submit with the WhatsApp fallback |
| 7 | `?service=` is not a known service | critical | Ignored |
| 8 | Device offline for hours | deferred | Backlog — no background resend in v1 |
| 9 | No confirmed WhatsApp number | critical | WhatsApp buttons are not rendered; "Try again" remains |
| 10 | `localStorage` unavailable | critical | Form works without saving |

---

## Completion Checklist

- [x] Strict type definitions generated
- [x] Process steps implemented in order (`src/features/quote/`)
- [x] All critical edge cases handled
- [ ] Tests written — one per critical edge case (`tests/e2e/quote.spec.ts`, `tests/unit/view-quote.test.ts`). Cases 6 and 9 have no automated test: see Changelog
- [x] Deferred edge cases added to the backlog
- [x] Spec status updated to `implemented`
- [x] Dependencies notified of any interface changes (none)

---

## Changelog

| Version | Date | Change | Reason | Re-approved by |
|---|---|---|---|---|
| 1.0 | 2026-11-16 | Initial spec | — | Owner standing instruction (auto-approve) |
| 1.0 | 2026-11-16 | Test gap recorded | Case 6 needs a Turnstile site key to exercise; case 9 needs a production build. Case 9's rule is covered by `tests/unit/ui-shell.test.ts`; case 6 is untested | — |
