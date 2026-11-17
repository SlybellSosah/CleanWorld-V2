# Tools

Standalone build and asset scripts kept separate from runtime site code (B.L.A.S.T. layout). Referenced in [`architecture/blueprint.md`](../architecture/blueprint.md).

| Script | Run by | Does |
|---|---|---|
| `postbuild.mjs` | `npm run build` / `npm run deploy` | Promotes pre-rendered `/404` to `build/client/404.html`, removes `__spa-fallback.html`, writes `build/client/sitemap.xml`, and verifies production deploys have no unconfirmed preview banner (see [`specs/ui-shell.md`](../specs/ui-shell.md)) |
| `build-hero-image.mjs` | Manual (`node tools/build-hero-image.mjs`) | Generates `public/hero-juba-*` responsive 1x/2x AVIF, WebP, and JPEG hero assets (`< 120 KB` each) from `content-source/generated/hero-juba-skyline.png` using `sharp` |
| `build-card-images.mjs` | Manual (`node tools/build-card-images.mjs`) | Generates `public/cards/*` responsive 1x/2x AVIF, WebP, and JPEG decorative service and customer-type card images (`< 120 KB` each) from `content-source/generated/` using `sharp` |
| `build-favicons.mjs` | Manual (`node tools/build-favicons.mjs`) | Rasterises `public/favicon.svg` into `public/favicon.png`, multi-resolution `public/favicon.ico`, and 180×180 `public/apple-touch-icon.png` using `sharp` |
