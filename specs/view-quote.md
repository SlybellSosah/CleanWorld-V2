# Spec: Request a quote (`/quote`)

- **Status:** implemented
- **Version:** 1.1
- **Created:** 2026-11-16
- **Last Updated:** 2026-11-16

---

## Problem Statement

Prospective customers on unreliable Juba mobile connections need a short, forgiving quote form that preserves progress across refreshes, never creates duplicate records on retry, and provides an immediate WhatsApp/phone/email escape hatch if submission or spam verification fails.

## Goals & Non-Goals

- **Goals:** Guide organisations and households through four focused steps, persist drafts locally with a `"Start over"` reset control, submit idempotently to `POST /api/quotes`, and offer pre-filled WhatsApp follow-up or fallback messaging.
- **Non-Goals:** Instant online price calculation, payment collection, or background Service Worker offline sync (deferred in backlog).

## Alternatives Considered

- **Single long form vs four-step wizard with `localStorage` draft:** Chose a four-step wizard so step 1 (`customerType`) tailors step 4 (`organisation`, `email`, `poReference`) without overwhelming mobile screens, while `localStorage` prevents lost typing on connection drops.
- **`sessionStorage` vs `localStorage` with explicit `"Start over"` button:** Chose `localStorage` so drafts survive mobile browser tab eviction, paired with an explicit `"Start over"` button (and automatic `clearDraft()` on success) so shared-device users can clear their answers.

## Risks & Limits

- **Shared devices:** Unsubmitted draft fields remain in `localStorage` (`cw.quote.draft.v1`) on the device until submitted or cleared via `"Start over"`; documented on `/quote` and [`specs/view-privacy.md`](view-privacy.md).
- **JavaScript disabled or slow hydration:** Multi-step form state requires JavaScript; the `"Good to know"` aside renders pre-rendered direct WhatsApp and telephone links so visitors without JS or on stalled mobile links can still request a quote immediately with zero layout shift.

---

## Dependencies

- Depends on: [`specs/api-quotes.md`](api-quotes.md); [`specs/integration-turnstile.md`](integration-turnstile.md); [`specs/ui-shell.md`](ui-shell.md); [`specs/view-privacy.md`](view-privacy.md); [`src/lib/validate.ts`](../src/lib/validate.ts); [`src/content/services.ts`](../src/content/services.ts); [`src/content/neighbourhoods.ts`](../src/content/neighbourhoods.ts); [`src/content/company.ts`](../src/content/company.ts)
- Consumed by: [`specs/view-home.md`](view-home.md), [`specs/view-services.md`](view-services.md) (links with `?service=<slug>`)

---

## Inputs

| Field | Type | Required | Description |
|---|---|---|---|
| service (query) | `ServiceSlug` | no | Pre-selects `fields.service` (and clamps `step <= 1` if changing an existing draft's service) |
| form fields | `QuoteRequestInput` | yes | Validated per step and on submit (see [`project.md`](../project.md)) |
| saved draft | `QuoteDraft` | no | `localStorage` key `cw.quote.draft.v1`: `{ step: 0..3, fields: { id, ... } }` |

---

## Process

1. On load: read `cw.quote.draft.v1` from `localStorage` (healing malformed UUIDs and clamping `step` to `0..3`), or create a fresh draft with a new UUID. If `?service=<slug>` is valid and differs from the draft's service, set `fields.service` and ensure `step <= 1`.
2. Show one step at a time with a progress bar (`Step N of 4`):
   - **Step 1 — Who is this for?** `customerType` (`organisation` or `household`).
   - **Step 2 — What do you need?** `service`, optional `scope` (`<= 500` chars), optional `frequency`.
   - **Step 3 — Where is the site?** `neighbourhood` (list or `Other`), `landmark` (required when `neighbourhood` is `Other`, `<= 200` chars).
   - **Step 4 — How do we reach you?** `name`, `phone`; when `customerType === "organisation"`, also `organisation` (required), optional `email`, and optional `poReference`; Turnstile widget (when enabled); and link to `/privacy`.
3. On every field change: save the draft to `localStorage`. When any progress exists, show a `"Start over"` button that clears `localStorage` and resets to Step 1 with a fresh UUID.
4. On `"Continue"`: validate the current step's fields with `validateStep`. If invalid: render inline field messages, move focus to the first invalid control, and stay on the step.
5. On `"Back"`: move to `step - 1` without validating.
6. On `"Send request"`: validate the full payload with `validateQuote` (ignoring hidden organisation-only fields when `customerType === "household"`). If Turnstile is enabled: if the widget reported an error/timeout (`unavailable`), show the failure panel immediately; if still solving, prompt the user to wait; otherwise attach the token, `POST /api/quotes` with a 15-second timeout, and reset the Turnstile widget after the attempt.
7. On success: clear the draft, show the confirmation view with the `reference` code, tailored 3-step `"What happens next"` list (`organisation` vs `household`), `"Continue on WhatsApp"` button (when `company.whatsapp` is visible) pre-filled with the reference, and link to `/how-to-pay`.
8. On `VALIDATION_FAILED`: render the returned field errors and jump to the earliest step with an error.
9. On any other error or timeout: keep the draft; render `"We could not send your request"`, `"Try again"`, `"Send by WhatsApp instead"` (carrying the full request text when `company.whatsapp` is visible), and visible telephone/`mailto:` contact links.

---

## Outputs

### Success

Confirmation panel: reference code, customer-specific `"What happens next"` steps, WhatsApp follow-up button (when visible), and link to `/how-to-pay`.

### Error

Inline field error messages, or the failure alert panel with retry and WhatsApp/phone/email fallbacks. Never `alert()`.

---

## Edge Cases

| # | Scenario | Classification | Handling |
|---|---|---|---|
| 1 | Refresh or return mid-form | critical | Draft restores fields and clamped step; `"Start over"` resets cleanly |
| 2 | "Send request" pressed twice, or retried after timeout | critical | Same `id` is sent; API returns the same reference |
| 3 | Step submitted with a required field empty | critical | Inline message under the field; focus moves to it |
| 4 | Network failure or timeout | critical | Failure panel with `"Try again"` and WhatsApp/phone/email fallbacks; draft kept |
| 5 | Household customer | critical | Organisation, optional email and purchase-order fields are hidden and ignored in validation/messages |
| 6 | Spam widget script or challenge fails | critical | Widget marks itself unavailable; submit shows failure panel with WhatsApp fallback |
| 7 | `?service=` is not a known service | critical | Ignored |
| 8 | Device offline for hours | deferred | Backlog — no automatic background resend in v1 |
| 9 | No confirmed WhatsApp number | critical | WhatsApp buttons are omitted; `"Try again"` remains |
| 10 | `localStorage` unavailable or corrupted | critical | Form heals malformed IDs/steps and works without storage |

---

## Completion Checklist

- [x] Strict type definitions maintained (`src/types.ts`)
- [x] Process steps implemented in order (`src/features/quote/`, `src/routes/quote.tsx`)
- [x] All critical edge cases handled
- [x] Tests written — one per critical edge case (`tests/e2e/quote.spec.ts`, `tests/unit/view-quote.test.ts`, `tests/unit/ui-shell.test.tsx`)
- [x] Deferred edge cases added to the backlog
- [x] Spec status updated to `implemented`
- [x] Dependencies notified of any interface changes (none)

---

## Changelog

| Version | Date | Change | Reason | Re-approved by |
|---|---|---|---|---|
| 1.0 | 2026-11-16 | Initial spec | — | Owner standing instruction (auto-approve) |
| 1.1 | 2026-11-16 | Document step-to-field mapping, fix household hidden-field validation, add `"Start over"` control and `<noscript>` fallback, fix Turnstile `error-callback`, and add automated tests for Cases 6 and 9 | EGM codebase review & auto-resolve | Owner standing instruction (auto-approve) |
