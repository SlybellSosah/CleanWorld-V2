# Tools

Standalone scripts, kept apart from site code (B.L.A.S.T. layout). Every tool has a spec or is referenced from `architecture/blueprint.md`.

| Script | Run by | Does |
|---|---|---|
| `postbuild.mjs` | `npm run build` | Copies the SPA fallback to `404.html` so the host returns it with a 404 status (see `specs/ui-shell.md`, edge case 5) |
| `build-hero-image.mjs` | Manual (`node tools/build-hero-image.mjs`) | Generates `public/hero-juba-*` responsive 1x/2x AVIF, WebP, and JPEG hero assets (each < 120 KB) from `content-source/generated/hero-juba-skyline.png` |
| `build-card-images.mjs` | Manual (`node tools/build-card-images.mjs`) | Generates `public/cards/*` responsive 1x/2x AVIF, WebP, and JPEG service and buyer-segment card photos (each < 120 KB) from `content-source/generated/` |
| `build-favicons.mjs` | Manual (`node tools/build-favicons.mjs`) | Rasterizes `public/favicon.svg` into `public/favicon.png`, multi-resolution `public/favicon.ico`, and 180×180 `public/apple-touch-icon.png` |
