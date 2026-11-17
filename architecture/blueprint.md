# Blueprint — structure and rules

Last updated: 2026-11-16

## Layout (B.L.A.S.T.)

```text
project.md            source of truth: schema, spec index, backlog
specs/                one SDD spec per feature
architecture/         this file; structural decisions
tools/                build and asset generation scripts
src/                  the site (React Router "app directory")
  root.tsx            document shell
  routes.ts           route table
  routes/             one file per page
  components/         shared interface pieces
  features/quote/     quote form
  content/            typed content: company facts, services, neighbourhoods, paths
  lib/                pure functions, no browser or Worker APIs, time and randomness injected
  types.ts            types maintained to match the global schema
worker/               Cloudflare Worker: API, staff gate, scheduled retry
  db/migrations/      D1 schema and indexes
tests/                Vitest unit tests (tests/unit) and Playwright flows (tests/e2e)
content-source/       original/generated source images, not served directly
```

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Pages | React Router 7 framework mode, `ssr: false`, every public path pre-rendered | Real URLs and HTML for search engines and no-JS browsers with zero server-rendering runtime. |
| Hosting | One Cloudflare Worker with static assets from `build/client` | `run_worker_first` sends `/api/*` and `/admin*` to the Worker; everything else is served directly as a static asset. |
| Post-build (`tools/postbuild.mjs`) | Promotes pre-rendered `/404` to `build/client/404.html`, removes `__spa-fallback.html`, writes `sitemap.xml`, and guards `deploy` against unconfirmed preview banners | Cloudflare serves `404.html` with HTTP 404 (working with and without JS), and crawlers discover public routes from `sitemap.xml`. |
| Offline asset scripts (`tools/build-*.mjs`) | `build-hero-image.mjs`, `build-card-images.mjs`, and `build-favicons.mjs` rasterise/compress images with `sharp` | Produces `< 120 KB` AVIF/WebP/JPEG responsive assets and icons ahead of time with zero runtime image-processing cost. |
| Server code | Handlers take dependencies as arguments (`worker/deps.ts`) and read bounded UTF-8 byte streams (`worker/http.ts`) | Testable in Node/Vitest without a Worker runtime and resilient against oversized request bodies. |
| Shared rules | Validation, phone normalising, reference codes and message text live in `src/lib/` | One implementation shared by browser and Worker; `worker/tsconfig.json` excludes Node globals. |
| Company facts | `src/content/company.ts`, each with a `confirmed` flag | Unconfirmed facts are hidden unless the build sets `VITE_SHOW_UNCONFIRMED=1` (`dev` and `preview:draft` only). |
| Motion | Pure CSS transitions/`@keyframes` + progressive `IntersectionObserver` (`src/components/Reveal.tsx`) | Pre-rendered HTML stays visible (`opacity: 1`), honours `prefers-reduced-motion`, and keeps per-page compressed JS ~115–121 KB (`< 150 KB` budget). |
| Fonts | Self-hosted Inter and Space Grotesk variable fonts; system monospace | Zero third-party font requests. |

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Vite dev server on port 3000 (`VITE_SHOW_UNCONFIRMED=1`); `/api` proxied to `npm run dev:worker` on port 8787 |
| `npm run dev:worker` | Worker and local D1 database on port 8787 (`ADMIN_DEV_BYPASS=1` on localhost) |
| `npm run build` | Production static pre-render + `tools/postbuild.mjs` (`404.html` and `sitemap.xml`) |
| `npm run preview` | Clean production build served locally by Wrangler on port 8787 |
| `npm run preview:draft` | Draft preview build (`VITE_SHOW_UNCONFIRMED=1`) served locally on port 8787 |
| `npm run lint` | Route typegen and strict `tsc --noEmit` across app, Worker, and unit tests |
| `npm test` | Vitest unit and static-render component tests |
| `npm run test:e2e` | Playwright desktop and mobile flows + axe accessibility checks against `npm run preview` |
| `npm run db:migrate:local` | Apply D1 migrations locally |
| `npm run db:migrate:remote` | Apply D1 migrations to the remote Cloudflare D1 database |
| `npm run deploy` | Production build, preview-banner guard check, and `wrangler deploy` |

## Spec Reference

| Area | Spec | Status |
|---|---|---|
| Layout, navigation, contact bar, not-found | [`specs/ui-shell.md`](../specs/ui-shell.md) | implemented (v1.4) |
| Home | [`specs/view-home.md`](../specs/view-home.md) | implemented (v1.7) |
| Services | [`specs/view-services.md`](../specs/view-services.md) | implemented (v1.1) |
| Quote request | [`specs/view-quote.md`](../specs/view-quote.md) | implemented (v1.1) |
| How to pay | [`specs/view-how-to-pay.md`](../specs/view-how-to-pay.md) | implemented (v1.1) |
| Privacy | [`specs/view-privacy.md`](../specs/view-privacy.md) | implemented (v1.1) |
| Staff list | [`specs/view-admin.md`](../specs/view-admin.md) | implemented (v1.1) |
| Quote API and retry | [`specs/api-quotes.md`](../specs/api-quotes.md) | implemented (v1.1) |
| Email | [`specs/integration-email.md`](../specs/integration-email.md) | implemented (v1.1) |
| Spam check | [`specs/integration-turnstile.md`](../specs/integration-turnstile.md) | implemented (v1.1) |
