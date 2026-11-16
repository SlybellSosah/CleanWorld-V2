// Cloudflare serves the nearest 404.html with a 404 status; the SPA fallback hydrates the not-found route.
import { copyFileSync } from "node:fs";

copyFileSync("build/client/__spa-fallback.html", "build/client/404.html");
console.log("postbuild: wrote build/client/404.html");
