# Blueprint — structure and rules

Last updated: 2026-11-16

## Layout (B.L.A.S.T.)

```
project.md            source of truth: schema, spec index, backlog
specs/                one SDD spec per feature
architecture/         this file; structural decisions
tools/                build and maintenance scripts
src/                  the site (React Router "app directory")
  root.tsx            document shell
  routes.ts           route table
  routes/             one file per page
  components/         shared interface pieces
  features/quote/     quote form
  content/            typed content: company facts, services, neighbourhoods, paths
  lib/                pure functions, no browser or Worker APIs, time and randomness injected
  types.ts            types generated from the global schema
worker/               Cloudflare Worker: API, staff gate, scheduled retry
  db/migrations/      D1 schema
tests/                Vitest unit tests (tests/unit) and Playwright flows (tests/e2e)
content-source/       original images, not served
```

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Pages | React Router 7 framework mode, `ssr: false`, every public path pre-rendered | Real URLs and HTML for search engines with no server-rendering runtime. React Router 8 requires Vite 7; the workspace standard is Vite 6. |
| Hosting | One Cloudflare Worker with static assets from `build/client` | `run_worker_first` sends `/api/*` and `/admin*` to the Worker; everything else is a static file. |
| Not found | `tools/postbuild.mjs` copies the SPA fallback to `404.html` | Cloudflare returns it with a 404 status; it hydrates the not-found route. |
| Server code | Handlers take their dependencies as arguments (`worker/deps.ts`) | Testable without a Worker runtime. |
| Shared rules | Validation, phone normalising, reference codes and message text live in `src/lib/` | One implementation used by browser and Worker. |
| Company facts | `src/content/company.ts`, each with a `confirmed` flag | Unconfirmed facts are hidden unless the build sets `VITE_SHOW_UNCONFIRMED=1` (dev and preview only). |
| Motion | `motion` with `LazyMotion`; reveal on scroll, step transitions | Honours reduced-motion; nothing loops. |
| Fonts | Self-hosted Inter and Space Grotesk variable fonts | No render-blocking third-party request. |

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Interface with hot reload on port 3000; `/api` proxied to port 8787 |
| `npm run dev:worker` | Worker and local database on port 8787 |
| `npm run preview` | Production build served by the Worker locally |
| `npm run lint` | Type generation and `tsc --noEmit` for the site and the Worker |
| `npm test` | Unit tests |
| `npm run test:e2e` | Playwright flows against `npm run preview` |
| `npm run db:migrate:local` | Apply database migrations locally |

## Spec Reference

| Area | Spec | Status |
|---|---|---|
| Layout, navigation, contact bar, not-found | `/specs/ui-shell.md` | implemented (v1.3) |
| Home | `/specs/view-home.md` | implemented (v1.6) |
| Services | `/specs/view-services.md` | implemented (v1.0) |
| Quote request | `/specs/view-quote.md` | implemented (v1.0) |
| How to pay | `/specs/view-how-to-pay.md` | implemented (v1.0) |
| Privacy | `/specs/view-privacy.md` | implemented (v1.0) |
| Staff list | `/specs/view-admin.md` | implemented (v1.0) |
| Quote API and retry | `/specs/api-quotes.md` | implemented (v1.0) |
| Email | `/specs/integration-email.md` | implemented (v1.0) |
| Spam check | `/specs/integration-turnstile.md` | implemented (v1.0) |
