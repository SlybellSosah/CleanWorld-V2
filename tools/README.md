# Tools

Standalone scripts, kept apart from site code (B.L.A.S.T. layout). Every tool has a spec or is referenced from `architecture/blueprint.md`.

| Script | Run by | Does |
|---|---|---|
| `postbuild.mjs` | `npm run build` | Copies the SPA fallback to `404.html` so the host returns it with a 404 status (see `specs/ui-shell.md`, edge case 5) |
