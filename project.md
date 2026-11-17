# Clean World Inc. — Project Source of Truth (B.L.A.S.T. v2.0)

Last updated: 2026-11-16 · Branch: `feature/rebuild`

This file is the B.L.A.S.T. (Blueprint, Link, Architect, Spec, Test/Trigger) source of truth. Feature behaviour lives in [`specs/`](specs/) using Spec-Driven Development (SDD: one specification per feature verified by unit and end-to-end tests). Initial investigation and market research live in [`specs/rebuild-design.md`](specs/rebuild-design.md).

## 1. Blueprint

### User story

A facilities officer at an NGO in Juba, or a householder, finds Clean World on their phone, sees what the company does and why it can be trusted, and sends a quote request in under two minutes. Staff receive the request, call back, quote, and are paid off the website by bank transfer, cash or mobile money.

### North Star answers

| Question | Answer |
|---|---|
| Who is it for? | Organisations (UN, NGOs, embassies, hotels, clinics) and households in Juba. |
| What is the single outcome? | Every submitted quote request is persisted in D1 before email dispatch and remains flagged in `/admin` until staff are notified. |
| What is the source of truth for data? | The `quote_requests` table in Cloudflare D1. |
| What is delivered to the user? | A reference code (`CW-XXXX-XXXX`) and a WhatsApp hand-off. |
| What must never happen? | A request silently lost; a mobile-money PIN requested; an unconfirmed company fact published. |
| What is out of scope? | Customer accounts, cleaner portal, live tracking, card or automatic mobile-money payment. |

### Global data schema

All feature specs must conform to these shapes. TypeScript definitions in [`src/types.ts`](src/types.ts) are maintained to match them.

**QuoteRequestInput** (browser → API)

| Field | Type | Required | Rule |
|---|---|---|---|
| id | string | yes | RFC 4122/9562 UUID v1–v8 created on the device; idempotency key |
| customerType | `"organisation"` \| `"household"` | yes | |
| service | ServiceSlug | yes | `fumigation`, `cleaning`, `waste-collection`, `landscaping`, `consultancy` |
| scope | string | no | up to 500 characters |
| frequency | Frequency | no | `one-time`, `weekly`, `fortnightly`, `monthly`, `contract` |
| neighbourhood | string | yes | a name from [`src/content/neighbourhoods.ts`](src/content/neighbourhoods.ts), or `Other` |
| landmark | string | when neighbourhood is `Other` | up to 200 characters |
| name | string | yes | 2–100 characters |
| phone | string | yes | normalised to E.164; South Sudan local (`09…`, `01…`, `9…`, `1…`) and trunk-zero (`+2110…`) numbers become `+211…`; international E.164 numbers accepted |
| organisation | string | when customerType is `organisation` | 2–150 characters (ignored when `household`) |
| email | string | no (organisation only) | valid email format, up to 200 characters (hidden and ignored when `household`) |
| poReference | string | no (organisation only) | up to 100 characters (hidden and ignored when `household`) |
| turnstileToken | string | when spam check is enabled | up to 2,048 characters |

**QuoteRequest** (stored) = input fields (excluding `turnstileToken`) plus `reference`, `createdAt`, `status`, `notifyStatus`, `notifyTries`. Columns: [`worker/db/migrations/0001_quote_requests.sql`](worker/db/migrations/0001_quote_requests.sql) and [`worker/db/migrations/0002_indexes.sql`](worker/db/migrations/0002_indexes.sql) (note: `0001_quote_requests.sql` also pre-provisions nullable `latitude`, `longitude`, and `plus_code` columns reserved for Phase 3 map pins).

- `status`: typical workflow progression is `new` → `contacted` → `quoted` → `won` (with `lost` and `spam` for closed/invalid leads); `/admin` permits setting any valid `QuoteStatus` directly so staff can correct accidental taps.
- `notifyStatus`: `pending`, `sent`, `failed` (`sent` is monotonic and never overwritten by a late retry error).

**API envelope** (every `/api/*` response)

```json
{ "status": "success", "data": {} }
```

```json
{ "status": "error", "code": "ERROR_CODE", "message": "Human-readable", "fields": { "phone": "…" } }
```

**CompanyFact** — `{ value: T, confirmed: boolean }` in [`src/content/company.ts`](src/content/company.ts) (`name`, `phone`, `whatsapp`, `email`, `address`, `siteUrl`, `founderName`, `founderRole`, `founderQuote`, `merchantNumbers`). A fact with `confirmed: false` is never rendered in a production build.

## 2. Link (integrations)

| Integration | Spec | Needed before launch |
|---|---|---|
| Cloudflare D1 | [`specs/api-quotes.md`](specs/api-quotes.md) | `database_id` configured in [`wrangler.jsonc`](wrangler.jsonc); run `npm run db:migrate:remote` on the target account |
| Resend email | [`specs/integration-email.md`](specs/integration-email.md) | Domain verified; Worker secrets/vars `RESEND_API_KEY`, `NOTIFY_FROM`, `NOTIFY_TO` |
| Cloudflare Turnstile | [`specs/integration-turnstile.md`](specs/integration-turnstile.md) | Build env `VITE_TURNSTILE_SITE_KEY` and Worker secret `TURNSTILE_SECRET` |
| Cloudflare Access | [`specs/view-admin.md`](specs/view-admin.md) | Access application over `/admin*` and `/api/admin/*`; Worker vars `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD` |

## 3. Architect

Structure and rules: [`architecture/blueprint.md`](architecture/blueprint.md).

## 4. Spec Index

All feature specs live in [`specs/`](specs/). Each conforms to the global schema above.

| Spec | Version | Status |
|---|---|---|
| [`specs/ui-shell.md`](specs/ui-shell.md) | v1.4 | implemented |
| [`specs/view-home.md`](specs/view-home.md) | v1.7 | implemented |
| [`specs/view-services.md`](specs/view-services.md) | v1.1 | implemented |
| [`specs/view-quote.md`](specs/view-quote.md) | v1.1 | implemented |
| [`specs/view-how-to-pay.md`](specs/view-how-to-pay.md) | v1.1 | implemented |
| [`specs/view-privacy.md`](specs/view-privacy.md) | v1.1 | implemented |
| [`specs/view-admin.md`](specs/view-admin.md) | v1.1 | implemented |
| [`specs/api-quotes.md`](specs/api-quotes.md) | v1.1 | implemented |
| [`specs/integration-email.md`](specs/integration-email.md) | v1.1 | implemented |
| [`specs/integration-turnstile.md`](specs/integration-turnstile.md) | v1.1 | implemented |

Reference documents (not feature specs): [`specs/rebuild-design.md`](specs/rebuild-design.md), [`specs/pest_control_guide.md`](specs/pest_control_guide.md). Superseded documents: `specs/archive/`, `architecture/archive/`.

## 5. Backlog

Deferred edge cases and later phases.

| Item | Source |
|---|---|
| Sectors, Compliance and About pages; real dated photography | [`specs/rebuild-design.md`](specs/rebuild-design.md) phase 2 |
| Interactive map, pin picker, Plus Codes, coverage page | [`specs/rebuild-design.md`](specs/rebuild-design.md) phase 3 |
| Shop catalogue with WhatsApp ordering | [`specs/rebuild-design.md`](specs/rebuild-design.md) phase 4 |
| Payment records, quotation and invoice PDFs, change log | [`specs/rebuild-design.md`](specs/rebuild-design.md) phase 5 |
| Weekly database export to R2 | [`specs/rebuild-design.md`](specs/rebuild-design.md) section 9.5 |
| Automatic deletion of requests after 24 months | [`specs/view-privacy.md`](specs/view-privacy.md) edge case 2 |
| Rate limiting per IP on `POST /api/quotes` beyond Turnstile | [`specs/api-quotes.md`](specs/api-quotes.md) edge case 9 |
| Admin pagination beyond the latest 200 requests | [`specs/view-admin.md`](specs/view-admin.md) edge case 5 |
| Offline queueing of a request for later automatic resend | [`specs/view-quote.md`](specs/view-quote.md) edge case 8 |
| Confirmation email to the customer | [`specs/integration-email.md`](specs/integration-email.md) edge case 7 |
| Juba Arabic translation | [`specs/rebuild-design.md`](specs/rebuild-design.md) section 3 |

## 6. Pre-Launch Spec Audit

- [x] All specs in `specs/` have status `implemented`
- [x] Every spec's completion checklist is fully ticked (unit and E2E suites cover all critical edge cases)
- [x] No specs remain `draft`, `approved` or `amended` with open changes
- [x] All deferred edge cases are in the backlog above
- [x] Spec index is complete
- [x] Owner fact sheet confirmed (`src/content/company.ts`, 2026-11-16) — mobile-money merchant numbers still to be supplied
- [ ] External production integrations in section 2 provisioned (Resend, Turnstile, Cloudflare Access, remote D1 migration)

## 7. Handoff Log

| Date | Entry |
|---|---|
| 2026-11-16 | Investigation and design (`specs/rebuild-design.md`). Mobile-money PIN screens removed from the old site. |
| 2026-11-16 | Rebuild phases 0–1 on `feature/rebuild`: hosting proof, specs, shell, Home, Services, Quote, How to pay, Privacy, Worker API, staff list. Specs approved under the owner's standing instruction to auto-approve. |
| 2026-11-16 | EGM full-codebase review and auto-resolve: removed `motion` (cutting per-page compressed JS from 157–167 KB to ~115–121 KB and fixing no-JS visibility), hardened Worker Access/idempotency/email/Turnstile/body-stream handling, added `sitemap.xml` and pre-rendered `404.html`, and closed all spec test gaps. |
