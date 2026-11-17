// Post-build step: promotes pre-rendered /404 to 404.html, removes __spa-fallback.html,
// writes sitemap.xml for public routes, and verifies production builds contain no preview banner.
import { copyFileSync, existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, posix } from "node:path";

const CLIENT_DIR = "build/client";
const SITE_URL = "https://cleanworld.live";
const EXCLUDED_DIRS = new Set(["assets", "cards", "admin", "404"]);

if (process.argv.includes("--verify-production")) {
  const indexHtml = readFileSync(join(CLIENT_DIR, "index.html"), "utf8");
  if (indexHtml.includes("Preview — showing details not yet confirmed by the owner")) {
    throw new Error("Refusing to deploy: build/client contains unconfirmed preview banner.");
  }
  console.log("postbuild: verified production build has no unconfirmed preview banner");
  process.exit(0);
}

const prerendered404 = join(CLIENT_DIR, "404", "index.html");
if (existsSync(prerendered404)) {
  copyFileSync(prerendered404, join(CLIENT_DIR, "404.html"));
  rmSync(join(CLIENT_DIR, "404"), { recursive: true, force: true });
} else if (existsSync(join(CLIENT_DIR, "__spa-fallback.html"))) {
  copyFileSync(join(CLIENT_DIR, "__spa-fallback.html"), join(CLIENT_DIR, "404.html"));
}

rmSync(join(CLIENT_DIR, "__spa-fallback.html"), { force: true });

function discoverPublicRoutes(dir, prefix = "") {
  const routes = [];
  if (prefix === "" && existsSync(join(dir, "index.html"))) {
    routes.push("/");
  }
  for (const entry of readdirSync(dir)) {
    if (prefix === "" && EXCLUDED_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;
    const urlPath = posix.join("/", prefix, entry);
    if (existsSync(join(full, "index.html"))) {
      routes.push(urlPath);
    }
    routes.push(...discoverPublicRoutes(full, posix.join(prefix, entry)));
  }
  return routes;
}

const routes = discoverPublicRoutes(CLIENT_DIR).sort((a, b) => (a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b)));
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map((r) => `  <url><loc>${SITE_URL}${r === "/" ? "/" : r}</loc></url>`),
  "</urlset>",
  "",
].join("\n");

writeFileSync(join(CLIENT_DIR, "sitemap.xml"), sitemap, "utf8");
console.log(`postbuild: wrote build/client/404.html and build/client/sitemap.xml (${routes.length} routes)`);
