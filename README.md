# Clean World Inc.

Website for Clean World Inc., Juba: services, a quote request that reaches staff, and an Access-protected staff list of requests.

- Source of truth: [`project.md`](project.md) (B.L.A.S.T.) and [`specs/`](specs/) (one SDD spec per feature).
- Structure, decisions and commands: [`architecture/blueprint.md`](architecture/blueprint.md).
- Market research and initial rebuild rationale: [`specs/rebuild-design.md`](specs/rebuild-design.md).

## Run locally

Requires Node.js 22+.

```bash
npm install
cp .dev.vars.example .dev.vars
npm run db:migrate:local
npm run preview
```

Open <http://localhost:8787> (staff list: <http://localhost:8787/admin>, unlocked on `localhost` via `ADMIN_DEV_BYPASS=1`). For hot-reload interface editing on port 3000, run `npm run dev:worker` and `npm run dev` in two terminals. To preview unconfirmed company facts locally, run `npm run preview:draft`.

## Checks

```bash
npm run lint
npm test
npm run test:e2e
```

## Before deploying to Cloudflare

1. When mobile-money merchant numbers are ready, add them in [`src/content/company.ts`](src/content/company.ts) and set `confirmed: true` (all other owner facts are already confirmed; unconfirmed facts remain hidden in production).
2. Verify [`wrangler.jsonc`](wrangler.jsonc) `database_id` belongs to the target Cloudflare account (or replace it after `npx wrangler d1 create clean-world`), then apply remote migrations with `npm run db:migrate:remote`.
3. Provision the secrets and build variables listed in [`project.md`](project.md) section 2 (`RESEND_API_KEY`, `NOTIFY_FROM`, `NOTIFY_TO`, `TURNSTILE_SECRET`, `VITE_TURNSTILE_SITE_KEY`, `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`), then deploy with `npm run deploy`.
