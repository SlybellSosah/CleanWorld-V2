# Clean World Inc. — Project Source of Truth (B.L.A.S.T. v2.0)

Last updated: 2026-11-16 · Branch: `feature/rebuild`

This file is the B.L.A.S.T. source of truth. Feature behaviour lives in `/specs/` (SDD). The design rationale and research live in `specs/rebuild-design.md`.

## 1. Blueprint

### User story

A facilities officer at an NGO in Juba, or a householder, finds Clean World on their phone, sees what the company does and why it can be trusted, and sends a quote request in under two minutes. Staff receive the request, call back, quote, and are paid off the website by bank transfer, cash or mobile money.

### North Star answers

| Question | Answer |
|---|---|
| Who is it for? | Organisations (UN, NGOs, embassies, hotels, clinics) and households in Juba. |
| What is the single outcome? | A quote request reaches staff and is never lost. |
| What is the source of truth for data? | The `quote_requests` table in Cloudflare D1. |
| What is delivered to the user? | A reference code and a WhatsApp hand-off. |
| What must never happen? | A request silently lost; a mobile-money PIN requested; an unconfirmed company fact published. |
| What is out of scope? | Customer accounts, cleaner portal, live tracking, card or automatic mobile-money payment. |

### Global data schema

All feature specs must conform to these shapes. TypeScript definitions are generated from them in `src/types.ts`.

**QuoteRequestInput** (browser → API)

| Field | Type | Required | Rule |
|---|---|---|---|
| id | string | yes | UUID created on the device; idempotency key |
| customerType | `"organisation"` \| `"household"` | yes | |
| service | ServiceSlug | yes | `cleaning`, `fumigation`, `waste-collection`, `landscaping`, `consultancy` |
| scope | string | no | up to 500 characters |
| frequency | Frequency | no | `one-time`, `weekly`, `fortnightly`, `monthly`, `contract` |
| neighbourhood | string | yes | a name from `src/content/neighbourhoods.ts`, or `Other` |
| landmark | string | when neighbourhood is `Other` | up to 200 characters |
| name | string | yes | 2–100 characters |
| phone | string | yes | normalised to E.164; local `09…` numbers become `+2119…` |
| organisation | string | when customerType is `organisation` | 2–150 characters |
| email | string | no | valid email format |
| poReference | string | no | up to 100 characters |
| turnstileToken | string | when spam check is enabled | |

**QuoteRequest** (stored) = input fields plus `reference`, `createdAt`, `status`, `notifyStatus`, `notifyTries`. Columns: `worker/db/migrations/0001_quote_requests.sql`.

- `status`: `new` → `contacted` → `quoted` → `won`; `lost` and `spam` may be set from any state.
- `notifyStatus`: `pending`, `sent`, `failed`.

**API envelope** (every `/api/*` response)

```json
{ "status": "success", "data": { } }
{ "status": "error", "code": "ERROR_CODE", "message": "Human-readable", "fields": { "phone": "…" } }
```

**CompanyFact** — `{ value: T, confirmed: boolean }`. A fact with `confirmed: false` is not rendered in a production build.

## 2. Link (integrations)

| Integration | Spec | Needed before launch |
|---|---|---|
| Cloudflare D1 | `specs/api-quotes.md` | `wrangler d1 create clean-world`; put the id in `wrangler.jsonc` |
| Resend email | `specs/integration-email.md` | Domain verified; `RESEND_API_KEY`, `NOTIFY_FROM`, `NOTIFY_TO` |
| Cloudflare Turnstile | `specs/integration-turnstile.md` | Site key (`VITE_TURNSTILE_SITE_KEY`) and `TURNSTILE_SECRET` |
| Cloudflare Access | `specs/view-admin.md` | Access application over `/admin*` and `/api/admin/*`; `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD` |

## 3. Architect

Structure and rules: `architecture/blueprint.md`.

## Spec Index

All feature specs live in `/specs/`. Each conforms to the global schema above.

| Spec | Status |
|---|---|
| `specs/view-home.md` | implemented |
| `specs/view-services.md` | implemented |
| `specs/view-quote.md` | implemented |
| `specs/view-how-to-pay.md` | implemented |
| `specs/view-privacy.md` | implemented |
| `specs/view-admin.md` | implemented |
| `specs/api-quotes.md` | implemented |
| `specs/integration-email.md` | implemented |
| `specs/integration-turnstile.md` | implemented |
| `specs/ui-shell.md` | implemented |

Reference documents (not feature specs): `specs/rebuild-design.md`, `specs/pest_control_guide.md`. Superseded documents: `specs/archive/`, `architecture/archive/`.

## Backlog

Deferred edge cases and later phases.

| Item | Source |
|---|---|
| Sectors, Compliance and About pages; motion polish; real photography | rebuild-design phase 2 |
| Interactive map, pin picker, Plus Codes, coverage page | rebuild-design phase 3 |
| Shop catalogue with WhatsApp ordering | rebuild-design phase 4 |
| Payment records, quotation and invoice PDFs, change log | rebuild-design phase 5 |
| Weekly database export to R2 | rebuild-design 9.5 |
| Automatic deletion of requests after 24 months | view-privacy edge case 2 |
| Rate limiting per IP on `POST /api/quotes` beyond Turnstile | api-quotes edge case 9 |
| Admin pagination beyond the latest 200 requests | view-admin edge case 5 |
| Offline queueing of a request for later automatic resend | view-quote edge case 8 |
| Juba Arabic translation | rebuild-design section 3 |
| JavaScript per page is 157–167 KB compressed against the 150 KB target | rebuild-design section 5 |
| Automated tests for the spam widget (view-quote case 6, integration-turnstile case 5) once keys exist | spec changelogs |
| Automated check that a production build hides unconfirmed facts (view-home case 1, view-quote case 9) | spec changelogs |

## Pre-Launch Spec Audit

- [x] All specs in `/specs/` have status `implemented`
- [ ] Every spec's completion checklist is fully ticked (three have recorded test gaps)
- [x] No specs remain `draft`, `approved` or `amended` with open changes
- [x] All deferred edge cases are in the backlog above
- [x] Spec index is complete
- [ ] Owner fact sheet confirmed (`src/content/company.ts` — every fact is currently unconfirmed)
- [ ] Integrations in section 2 provisioned

## Handoff Log

| Date | Entry |
|---|---|
| 2026-11-16 | Investigation and design (`specs/rebuild-design.md`). Mobile-money PIN screens removed from the old site. |
| 2026-11-16 | Rebuild phases 0–1 on `feature/rebuild`: hosting proof, specs, shell, Home, Services, Quote, How to pay, Privacy, Worker API, staff list. Specs approved under the owner's standing instruction to auto-approve. |
