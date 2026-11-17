# Clean World Inc. — Rebuild Design

Status: **historical phase 0–1 design & research baseline** · Version 2 · 2026-11-16

> **Note:** Phases 0–1 are now implemented on `feature/rebuild`. Active source-of-truth schemas, architectural rules, and feature contracts live in [`project.md`](../project.md), [`architecture/blueprint.md`](../architecture/blueprint.md), and the 10 feature specifications in [`specs/`](./). Sections below preserve the original audit, South Sudan market research, and multi-phase roadmap.

This design is based on a full audit of the current code, a comparison of the code with the planning documents in `specs/` and `architecture/`, and web research on payments, mapping and the cleaning-services market in South Sudan. Version 2 incorporates an independent seven-reviewer check of version 1.

---

## 1. Summary

The current site is a polished prototype. It shows what the business could offer, but nothing behind it is connected: there is no database, pages have no addresses of their own, and bookings, payments, logins and vehicle tracking are demonstrations. A quote submitted today is not delivered to anyone.

The rebuild replaces it with a smaller site that works:

1. **Real pages with their own addresses**, fast on a phone, built to win institutional contracts (UN agencies, NGOs, embassies, hotels) and household jobs.
2. **A quote request that reaches the business**: saved in a database, emailed to staff, and handed to WhatsApp.
3. **Payment handled off the website**, the way Juba pays: quotation and bank transfer for organisations; cash or mobile money for households. No card checkout.
4. **A neighbourhood picker and an optional map** so customers can say where they are in a city with few street addresses.
5. **A shop that is a catalogue**, ordered by WhatsApp.

The client dashboard, cleaner portal, login and vehicle tracking are left out of this rebuild. They can come back as real features once the operation needs them.

**One urgent item, separate from the rebuild.** Both payment screens in the current site ask visitors to type their mobile-money PIN into the page. Real mobile money never works that way, and the pattern trains customers to give their PIN to websites. If the current site is publicly reachable, those two screens should be removed now, before anything else.

---

## 2. What the investigation found

### 2.1 The current code

| Area | Finding |
|---|---|
| Navigation | No page addresses. One setting in memory switches seven views (`src/App.tsx`). No links to individual pages, no back button; a refresh returns to Home. |
| Data | No database and no server. The site sends nothing to the business. (It does load map tiles, fonts and some images from other websites.) Everything shown is sample data held in memory and lost on refresh. |
| Quote and booking | Forms show a success message with a random reference but do not send the request anywhere (`LandingPage.tsx`, `FumigationPanel.tsx`, `ConsultancyPage.tsx`). |
| Payment | A demonstration "USSD" screen waits on a timer and produces a made-up transaction reference (`QuoteWizard.tsx`, `EcoShopPage.tsx`). Both ask for a mobile-money PIN. |
| Login | Any phone number with any four digits signs in (`LoginModal.tsx`). |
| Map | Leaflet using OpenStreetMap's public tile servers, which are not meant for production sites. The route and "live tracking" are animations, not data (`MapComponent.tsx`). |
| Weight | One JavaScript file of about 850 KB; about 9.6 MB of images in `public/`, of which about 4 MB are unused; the logo and 13 other images are loaded from third-party hosts that may remove them. |
| Accessibility | Form labels are not linked to their inputs; pop-ups cannot be closed from the keyboard; text as small as 9 px; a dark-only, low-contrast theme; about 54 never-ending animations. |
| Leftovers | Seven unused packages, template files from the tool that generated the first version, and 18 screenshots (10 MB) in the root, which `tests/screenshot.spec.ts` regenerates. |
| Pricing | Five separate price calculators that give different answers for the same job, and an exchange rate of 1,300 SSP written into the code ten times. |

### 2.2 The planning documents versus the code

There are no literally empty files in the repository. The documents in `specs/` and `architecture/` are the nearest thing: several are unedited templates or finished change logs, and they describe features that were never built (a Next.js site, real payments, staff roles) or have since been removed (the Academy).

Several facts need confirming because the sources disagree or no evidence was found for them:

- **Founding year.** The planning documents say 2021; the site says "Since 2024" in one place and "12+ Years" in another.
- **Contact details.** The planning documents, the footer and the search-engine data each give different phone numbers and email addresses.
- **Location.** The office is described as Hai Kuwait but placed on the map at Tongping's coordinates.
- **Claims without evidence in the repository:** ISO 9001/14001, "200+ clients", "250+ sites", "Juba EPA approved", Nilepet and Dar Petroleum as clients, a 5% local sales tax, Juba postal codes, every price, and the exchange rate (the 2026 market rate was several times 1,300).
- **Sample customers** carry the names of national figures and should be replaced.

**Worth keeping:** the service descriptions in `src/data.ts`; `specs/pest_control_guide.md`, which is the clearest writing in the repository; the product list as a draft; the brand colours and fonts; the founder's photo and quote; the WhatsApp contact links; and the cleaner checklists, as internal material.

### 2.3 The market in Juba

- **Buyers.** UN agencies, international NGOs and embassies buy cleaning, fumigation and waste services through published requests for quotation and long-term agreements. WHO, UNOPS, UNICEF, IOM, WFP and the EU Delegation have all run such tenders in Juba ([UNOPS](https://www.ungm.org/Public/Notice/218981), [IOM](https://www.ungm.org/Public/Notice/290863)). How hotels, banks and clinics buy was not confirmed; direct quotes are likely.
- **What wins the work.** Paperwork and references. One NGO vendor checklist asks for a certificate of incorporation, tax clearance, tax identification number, city council trade licence, Chamber of Commerce membership, operating licence, three client recommendation letters, audited accounts and a banker's letter ([Amref](https://amref.org/wp-content/uploads/2025/08/TENDER-DOCUMENT-AMREF-SSD-PQ-T-2025-001.pdf)).
- **Online competition is thin.** One competitor website was found. It shows no licences, no named clients and no quote form ([TechPro](https://www.techprosolutionssd.com/fumigation-services-juba.html)).
- **Demand.** The largest cholera outbreak on record, at roughly 100,000 cases by early 2026 ([WHO](https://www.afro.who.int/sites/default/files/2026-03/South%20Sudan%20IDSR%20Weekly%20Bulletin%20Week%2010%2C%202-8%20March%202026%20.pdf)); malaria at about 40% of outpatient visits; the 2025 floods. These favour mosquito control, disinfection, drainage and latrine cleaning, and post-flood clean-up.
- **Audience.** About 1.6 million internet users, 13% of the population, nearly all on mobile, with Facebook dominant ([DataReportal](https://datareportal.com/reports/digital-2026-south-sudan)). Procurement officers browse on desktop and want PDFs.
- **Pricing.** No published Juba price lists were found. Tenders price per cleaner per month, per fumigation round, or per waste trip.

### 2.4 Payments in South Sudan

- **No online payment gateway could be confirmed for a South Sudan-registered business.** Paystack, Pesapal and Flutterwave do not list South Sudan. No Juba bank was found offering online card acceptance.
- **Mobile money is available but thinly used.** Operators include m-Gurush and MTN MoMo. Under 6% of adults had an account in 2021, and the central bank's target is 30% by 2027 ([GSMA](https://www.gsma.com/mobilefordevelopment/blog/south-sudan-mobile-moneys-role-in-the-road-to-recovery/)). The main obstacle is agents running short of cash ([Sudans Post](https://www.sudanspost.com/south-sudans-digital-finance-mirage/)).
- **Businesses are required to accept it** and to display their merchant number, under a July 2025 Bank of South Sudan directive ([Sudans Post](https://www.sudanspost.com/central-bank-declares-mobile-money-legal-tender-urges-businesses-to-comply/)).
- **Automatic integration is not practical yet.** m-Gurush publishes no developer interface. MTN lists South Sudan for its MoMo interface, but developers report that local support to go live is very hard to reach.
- **Institutions pay by bank transfer** against a quotation, purchase order and invoice, commonly on 30-day terms.
- **The currency moves fast.** The street rate went from about 5,500 to about 7,700 SSP per US dollar between December 2025 and July 2026 ([Radio Tamazuj](https://www.radiotamazuj.org/en/news/article/rising-dollar-worsens-cost-of-living-crisis-in-juba)). A 2023 central bank order requires prices to be quoted in SSP ([Central Banking](https://www.centralbanking.com/central-banks/currency/7954276/south-sudan-central-bank-orders-pricing-in-pounds)); no later update was found.

### 2.5 Maps for Juba

- OpenStreetMap covers Juba well: about 578,000 mapped buildings and roads, with an active humanitarian mapping project.
- Online place search does not: public search services failed on or misplaced Tongping, Thongpiny and Hai Kuwait.
- A complete map of the Juba metro area is about 13 MB as one file (bounding box 31.45, 4.72 to 31.72, 4.98, zoom 0–15) and can be hosted on Cloudflare at no charge at this traffic.
- Commercial map providers either forbid commercial use on their free plans or cost $20–30 a month, with no advantage in Juba.

---

## 3. Cost, order of work and going live

**Running cost.** The design runs on Cloudflare's free plan: hosting, database, spam protection and staff sign-in (up to 50 staff). Map file storage is free at this size but requires a payment card on the Cloudflare account. Email notification fits a free plan at this volume. The only expected recurring cost is the domain name. These limits are to be re-checked in phase 0.

**Order of work.** Phases are in section 11. The first working release (phase 1) is deliberately small: Home, Services and a quote request that reaches staff. Everything else follows in phases that can each be approved separately. No dates are given because they depend on how quickly the facts in section 13 arrive.

**Going live.** The new site is built alongside the current one and replaces it when phase 1 passes its checks. Old addresses do not need redirects because the current site has only one address. The PIN screens should be removed from the current site immediately (section 1).

**Not included.** Customer accounts, a staff mobile app, live vehicle tracking, online card payment, automatic mobile-money collection, a training academy, and languages other than English.

---

## 4. Decisions for the owner

| # | Decision | Recommended | Alternative | What the alternative costs |
|---|---|---|---|---|
| 1 | Customer dashboard and cleaner portal | Leave out | Build later as real features with accounts | A separate project of similar size to this one; needs staff to keep job data up to date daily. |
| 2 | Look | Light pages with dark navy feature sections | Keep dark-only | Harder to read outdoors on a phone and when printed; contrast must still be fixed. |
| 3 | Shop | Catalogue; each product opens WhatsApp with the item named | Leave the shop out until stock and prices are settled | Nothing to build; add later. |
| 4 | Public prices | None; "request a quote", with indicative ranges only where you confirm them | Publish a full SSP price list | You must update the list whenever the rate moves; adds a pricing and currency settings screen. |
| 5 | Quote currency | SSP on the website; USD stated on formal quotations where your bank confirms it is permitted | SSP only, or USD shown publicly | USD shown publicly may conflict with the 2023 pricing order; confirm with your bank or lawyer. |
| 6 | Map | Neighbourhood list always; interactive map added in phase 3 | List only, no interactive map | Customers describe their location by neighbourhood and landmark, or share a WhatsApp location. Saves phase 3. |
| 7 | Photos | Your own photos of staff and jobs; generated images only as decoration | Generated images throughout | Institutional buyers may read generated staff photos as misleading. |
| 8 | Domain and Cloudflare account | The business owns both; staff email addresses are listed for sign-in | Developer-owned account | The business depends on the developer for access. |
| 9 | Headline services | Lead with fumigation and mosquito control, disinfection, and contract cleaning | Equal weight to all five service lines | Less focus on what current health conditions make most in demand. |

---

## 5. Design principles

1. **Everything shown is real.** Every button does what it says. No demonstration data, unverified figures or sample testimonials.
2. **Built for Juba's network.** Each page loads in under 150 KB of JavaScript and under 500 KB in total, measured compressed, on first visit.
3. **WhatsApp and phone first.** Every page has tap-to-call and a WhatsApp button. If a form cannot be sent, the same details go by WhatsApp.
4. **Two audiences.** Organisations need paperwork; households need a quick booking.
5. **One place for each fact.** Company details, service areas and any prices are defined once.
6. **Unconfirmed means absent.** Each company fact carries a confirmed flag. Anything unconfirmed is left off the page, so building never waits on a missing fact and nothing unverified is published.

---

## 6. Site structure

| Address | Page | Phase |
|---|---|---|
| `/` | Home: what Clean World does, for whom, proof, and the quote button | 1 |
| `/services` and one page per service | Cleaning; fumigation and pest control; waste collection; landscaping; environmental and safety consultancy. Each covers scope, method, chemicals and safety, and frequency | 1 |
| `/quote` | Request a quote (section 7) | 1 |
| `/how-to-pay` | Payment methods and steps (section 8) | 1 |
| `/sectors` | Who we serve: UN and NGOs, embassies and compounds, hotels and banks, clinics, households | 2 |
| `/compliance` | Registration details, licences, policies, and a downloadable capability statement and vendor pack | 2 |
| `/about` | Company story, the founder, people and training | 2 |
| `/coverage` | Service areas and waste-collection zones | 3 |
| `/shop` | Product catalogue with safety information | 4 |
| `/privacy` | What is collected and how long it is kept | 1 |

Unknown addresses return a proper "not found" page. `/admin` is a private staff area, not linked and not listed for search engines.

---

## 7. The quote request

One form replaces the current wizard and the four separate forms.

1. **Who are you?** Organisation or household.
2. **What do you need?** Service, size or scope, how often.
3. **Where?** Choose a neighbourhood from a list and add a landmark. From phase 3, optionally drop a pin on a map.
4. **Contact.** Name and phone. For organisations: organisation name, email, and an optional purchase-order or tender reference.
5. **Confirmation.** A reference code, what happens next, and a button that opens WhatsApp with the reference filled in.

**If something goes wrong**

- Progress is saved on the device, so a dropped connection or refresh loses nothing.
- Each request carries a unique identifier created on the device, so pressing "send" twice or retrying never creates a duplicate.
- If sending fails or times out, the form keeps the details, offers "Try again", and offers "Send by WhatsApp instead", which opens WhatsApp with the full request as text.
- If the spam check cannot load, the WhatsApp route is offered straight away.

**What staff receive**

- The request is saved first. An email then goes to the staff addresses on file.
- If the email fails, the request is marked "not yet notified" and retried automatically every few minutes. The staff area shows any request still waiting, so none is lost silently.

**After the request**

| | Organisation | Household or small business |
|---|---|---|
| Next step | Call-back and site visit | WhatsApp or phone confirmation |
| Document | Stamped quotation with tax number, bank details, purchase-order field and payment terms | Confirmation with the amount, by WhatsApp |
| Payment | Bank transfer against invoice | Cash on completion, or mobile money |

Until phase 5, staff prepare quotations and invoices from a document template supplied with the site. From phase 5 the staff area can produce them.

---

## 8. Payments

The website never takes money and never asks for a PIN. It explains how to pay, and staff confirm payment.

**From phase 1**

- **Cash on completion**, with a receipt. The default for households.
- **Mobile money to the company's merchant number.** The `/how-to-pay` page shows the merchant numbers and the steps to pay from a phone. The numbers are fixed when the site is built from the confirmed fact sheet; they cannot be changed from the staff area, so a compromised staff login cannot redirect payments. Staff send the amount to the customer by WhatsApp. The customer replies with the transaction message or a screenshot.
- **Bank transfer** against a stamped quotation, for organisations. Bank details appear on the quotation, not on the website.

**From phase 5**

- Staff record payments against requests and produce quotation and invoice PDFs from the staff area.

**Later, only if it becomes possible**

- Automatic MTN MoMo collection, once the company has a merchant account and MTN confirms it can go live in South Sudan.
- Card payment, if a Juba bank confirms online card acceptance in writing.

**Currency**

- The website shows no prices unless decision 4 chooses a public price list.
- Each quotation states its currency, the exchange rate used and the date of that rate. The price is valid for seven days. Payment terms (for example 30 days from invoice) are separate and stated on the quotation.
- If a price list is published later, the rate is one staff setting with a date; conversions are hidden when the rate is more than seven days old.

---

## 9. Technical design

### 9.1 Stack

| Layer | Choice |
|---|---|
| Interface | React 19, TypeScript, Tailwind v4, Motion (all in use today) |
| Pages | React Router 7 in framework mode, each public page pre-built as HTML |
| Hosting | Cloudflare Workers with static files |
| Server code | One Worker handling `/api/*`, `/admin*` and, from phase 3, `/tiles/*` |
| Database | Cloudflare D1 |
| Spam check | Cloudflare Turnstile |
| Staff sign-in | Cloudflare Access; the Worker also verifies the Access token on every `/admin*` and `/api/admin/*` request |
| Email | Resend, called from the Worker, sending from an address on the company domain |
| Tests | Vitest for logic; Playwright with axe for flows and accessibility |

Removed packages: `@google/genai`, `express`, `dotenv`, `@types/express`, `autoprefixer`, `esbuild`, `tsx`.

**What must change in the hosting setup.** `wrangler.jsonc` currently has no server entry and sends every unknown address to the Home page; `vite.config.ts` builds a single-page app. The rebuild adds a Worker entry, the database binding, a real "not found" page, and rules so `/api/*`, `/admin*` and `/tiles/*` reach the Worker first.

**Phase 0 proof.** Before any page is designed, a throwaway build must show three things on Cloudflare: one service page delivered as pre-built HTML; a `POST /api/quotes` reaching the Worker and writing a row; and an unknown address returning a 404. If React Router's framework mode does not work with the Cloudflare build plugin, the fallback is React Router in single-page mode with a build step that renders each public page to HTML.

### 9.2 Code layout

```
app/
  routes/          one file per page
  components/      Button, Field, Dialog, Section, Card
  features/quote/  form steps, validation, draft saving
  features/map/    map view, pin picker, zones (phase 3)
  content/         services, sectors, products, company facts (typed, with confirmed flags)
  lib/             reference codes, WhatsApp links, currency formatting (pure functions)
worker/
  index.ts         API routes
  db/              schema and migrations
specs/             one view-*.md per page, approved before its code is written
tests/
```

No component file over about 300 lines. Each page's `view-*.md` follows the project's existing format (Status, Dependencies, Inputs, Process, Outputs, edge cases) and is marked implemented when its tests pass.

### 9.3 Data

Phase 1 has one table.

```sql
CREATE TABLE quote_requests (
  id            TEXT PRIMARY KEY,        -- identifier created on the device
  reference     TEXT NOT NULL UNIQUE,    -- e.g. CW-7K4M-2QXD
  created_at    TEXT NOT NULL,
  customer_type TEXT NOT NULL CHECK (customer_type IN ('organisation','household')),
  service       TEXT NOT NULL,
  scope         TEXT,
  frequency     TEXT,
  neighbourhood TEXT NOT NULL,
  landmark      TEXT,
  latitude      REAL,
  longitude     REAL,
  plus_code     TEXT,
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  organisation  TEXT,
  email         TEXT,
  po_reference  TEXT,
  status        TEXT NOT NULL DEFAULT 'new'
                CHECK (status IN ('new','contacted','quoted','won','lost','spam')),
  notify_status TEXT NOT NULL DEFAULT 'pending'
                CHECK (notify_status IN ('pending','sent','failed')),
  notify_tries  INTEGER NOT NULL DEFAULT 0
);
```

Reference codes are random and hard to guess, so they reveal nothing about how many requests the business receives. Status moves forward from `new`; staff can set `lost` or `spam` at any point.

Phase 5 adds payment fields (amount, currency, rate, method, paid date) and a change log.

### 9.4 API

| Endpoint | Behaviour |
|---|---|
| `POST /api/quotes` | Checks the spam token and every field; saves; returns the reference. Sending the same `id` again returns the same reference. Errors return `{ "error": code, "fields": {...} }`. |
| `GET /api/admin/quotes` | List, newest first, filter by status. Staff only. |
| `PATCH /api/admin/quotes/:id` | Change status. Staff only. |
| Scheduled task, every five minutes | Sends email for requests with `notify_status` pending or failed; gives up after ten tries and leaves the request flagged in the staff area. |

### 9.5 Environments, secrets, backups

- Two deployments: preview (for checking) and production.
- Secrets (email key, spam-check key) are stored as Cloudflare secrets, never in the repository.
- The database is exported to file storage weekly by a scheduled task; D1's built-in point-in-time recovery covers the last 30 days.

### 9.6 Privacy

- The site collects only what a quote needs: name, phone, optional email, organisation and location.
- Requests are kept for 24 months, then deleted, unless they became a contract.
- No advertising trackers. Visitor counts use Cloudflare's cookieless analytics.
- A privacy page states this in plain language.

---

## 10. Map (phase 3)

**Always available: the neighbourhood list.** About 40 Juba neighbourhoods with coordinates and spelling variants (Tongping / Tompping / Thongpiny; Hai Kuwait / Hai Kuweit), built once from OpenStreetMap and checked by the owner. This is the default way to give a location and needs no map.

**Optional: the interactive map.** Loaded only when the visitor taps "Show map", so nobody pays for it by default.

- Renderer: MapLibre GL JS with `@vis.gl/react-maplibre`.
- Map data: a file of the Juba metro area from the Protomaps build of OpenStreetMap, stored in Cloudflare R2 and served through the Worker, with the fonts and icons it needs hosted alongside. "© OpenStreetMap" is shown.
- If the map has not appeared within eight seconds, or fails for any reason, the page returns to the list and says so. No second map library is shipped.
- If the owner prefers not to put a card on the Cloudflare account, the same map can use OpenFreeMap's free public service, at the cost of depending on a service with no uptime promise.

**Pin flow.** "Use my location", then a draggable pin, then a short Plus Code and a map link saved with the request and added to the WhatsApp message.

**Coverage page.** One file of service and waste-collection zones, using OpenStreetMap neighbourhood outlines where they exist and hand-drawn ones where they do not (Gudele, Tongping), each linked to a collection day.

**Check before release.** The map is tested on one named low-cost Android phone on a throttled connection.

---

## 11. Phases

| Phase | Contents | Passes when | Needs from owner |
|---|---|---|---|
| 0 | Remove PIN screens from the current site. Hosting proof (9.1). Clean the repository. Shared components and colours. | The three proofs pass on Cloudflare; `npm run lint` passes. | Decisions 2 and 8; Cloudflare account and domain. |
| 1 | Home, Services, Quote, How to pay, Privacy. Database, email, WhatsApp hand-off, staff list. | A request sent from a phone appears in the staff area and staff inbox; a forced email failure is retried and flagged; each page is under budget in Lighthouse and has no axe violations. | Fact sheet items 1–5 and 9; staff email addresses. |
| 2 | Sectors, Compliance, About. Image pipeline. Motion. | Same page checks; every image under 120 KB. | Items 6, 7 and 10; photos. |
| 3 | Neighbourhood coordinates, interactive map, pin, coverage page. | A pin dropped on the test phone arrives with its Plus Code; a blocked map falls back to the list. | Decision 6; service areas and collection days. |
| 4 | Shop catalogue with WhatsApp ordering. | Each product opens WhatsApp with the item named. | Decision 3; item 8. |
| 5 | Payment records, quotation and invoice PDFs, change log. | Staff can price a request and download a PDF. | Bank details; quotation wording. |

The existing tests check the demonstration flows and are replaced phase by phase.

---

## 12. Look, images and motion

**Look.** Keep emerald and sky as accents, Space Grotesk for headings, Inter for text, JetBrains Mono for reference codes. Move to light pages with dark navy feature sections. The yellow button colour in `specs/design.md` stays on navy sections; on light pages the main button is emerald, because yellow on white cannot meet contrast requirements. Body text at least 16 px, touch targets at least 48 px, contrast to WCAG AA.

**Images.** A build step converts every image to AVIF and WebP at several widths and loads images below the first screen only when needed. All images, including the logo, are hosted with the site. Real, dated photographs of Clean World's own staff and jobs are used wherever a picture represents the company. Generated images are used only as decoration and are never presented as staff, clients or completed jobs. Regenerating images needs an image tool or photographs from the owner; neither is in the repository today.

**Motion.**

- Content fades and rises slightly as it comes into view, once.
- The quote form slides between steps, with a progress bar.
- Service cards lift when pressed; pages cross-fade.
- The map pin drops with a small bounce.

Only opacity and position are animated. Nothing loops. Everything is switched off when the device asks for reduced motion. Nothing delays the first screen.

**Accessibility and search.** Every input has a linked label and an inline error message. One shared pop-up component handles keyboard focus and Escape. Each page has its own title, description and preview image in its pre-built HTML. Business details for search engines come only from confirmed facts.

---

## 13. What the owner needs to supply or do

**Fact sheet**

1. Legal company name, year founded, registration number and tax identification number.
2. Office address and its exact location.
3. Phone numbers, WhatsApp number, email addresses and the domain name.
4. Services offered today and neighbourhoods served.
5. Staff email addresses for sign-in and for receiving requests.
6. Licences and memberships held, with copies.
7. Clients who agree to be named, and reference letters.
8. Shop products with real names, sizes, prices and safety data sheets.
9. Mobile-money merchant numbers.
10. The founder's approved quote and biography.

**To do away from the website**

- Register business merchant accounts with MTN MoMo and m-Gurush.
- Hold company bank accounts in SSP and USD and obtain a banker's letter.
- Ask the bank how USD may be quoted on formal quotations.
- Register as a vendor on the UN supplier portal (UNGM) and the South Sudan NGO Forum tender board.
- Create or hand over the Cloudflare account and domain.

---

## 14. Risks and open questions

| Risk | Handling |
|---|---|
| React Router pre-building may not fit the Cloudflare build | Phase 0 proof, with a named fallback. |
| Email delivery from the Worker depends on domain setup | Retry and flagging; WhatsApp hand-off does not depend on email. |
| Facts arrive slowly | Unconfirmed facts are left off; phases list what each needs. |
| The interactive map is slow on older phones | The list is the default; the map is optional and tested on a real low-cost phone. |
| Rules on quoting in USD | Website shows SSP only until the bank confirms. |

**Not confirmed by research:** current mobile-money fees; whether any Juba bank offers online card acceptance; licensing rules for fumigation chemicals; published Juba prices for these services; WhatsApp usage figures; Cloudflare free-plan limits as of today (to be re-checked in phase 0).

---

## 15. Other sources

- MTN MoMo countries: https://momodevelopercommunity.mtn.com/momo-api-production-q-a-7/what-are-the-countries-where-momo-apis-are-live-95
- Juba waste collection figures: https://dlca.logcluster.org/node/6032
- OpenStreetMap tile policy: https://operations.osmfoundation.org/policies/tiles/
- Protomaps on Cloudflare: https://docs.protomaps.com/deploy/cloudflare
- Cloudflare static file limits: https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
