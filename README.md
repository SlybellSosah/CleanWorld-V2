# Clean World Inc.

Website for Clean World Inc., Juba: services, a quote request that reaches staff, and a staff list of requests.

- Source of truth: `project.md` (B.L.A.S.T.) and `specs/` (one SDD spec per feature).
- Structure, decisions and commands: `architecture/blueprint.md`.
- Design rationale and research: `specs/rebuild-design.md`.

## Run locally

```bash
npm install
cp .dev.vars.example .dev.vars
npm run db:migrate:local
npm run preview
```

Then open http://localhost:8787. Staff list: http://localhost:8787/admin.

## Checks

```bash
npm run lint
npm test
npm run test:e2e
```

## Before the first deploy

1. Confirm the facts in `src/content/company.ts` and set `confirmed: true` on each.
2. Create the database (`wrangler d1 create clean-world`), put its id in `wrangler.jsonc`, and apply migrations with `--remote`.
3. Provision the integrations listed in `project.md` section 2.
