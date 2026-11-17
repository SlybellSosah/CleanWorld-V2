import { authorise } from "./access";
import { handleAdminList, handleAdminPatch } from "./admin";
import { d1Repo } from "./d1-repo";
import type { Deps } from "./deps";
import type { Env, FetchFn } from "./env";
import { fail, sameOrigin } from "./http";
import { retryPending, sendStaffEmail } from "./notify";
import { handlePostQuote } from "./quotes";
import { verifyTurnstile } from "./turnstile";

const fetchFn: FetchFn = (input, init) => fetch(input, init);

export function makeDeps(env: Env, defer: (work: Promise<unknown>) => void): Deps {
  return {
    repo: d1Repo(env.DB),
    verifySpam: (token, ip) => verifyTurnstile(token, ip, env.TURNSTILE_SECRET, fetchFn),
    notify: (quote) => sendStaffEmail(quote, env, fetchFn),
    now: () => new Date(),
    randomBytes: (n) => crypto.getRandomValues(new Uint8Array(n)),
    defer,
  };
}

export async function routeRequest(
  request: Request,
  env: Env,
  deps: Deps,
  authFetch: FetchFn = fetchFn,
): Promise<Response> {
  const { pathname } = new URL(request.url);
  const lower = pathname.toLowerCase();

  if (pathname === "/api/quotes") {
    return request.method === "POST" ? handlePostQuote(request, deps) : fail("METHOD_NOT_ALLOWED");
  }

  const isAdminApi = lower.startsWith("/api/admin/") || lower === "/api/admin";
  const isAdminPage = lower === "/admin" || lower.startsWith("/admin/") || lower.startsWith("/admin.");
  if (isAdminApi || isAdminPage) {
    const access = await authorise(request, env, authFetch, deps.now());
    if (!access.ok) {
      if (isAdminApi) return fail(access.code);
      const status = access.code === "UNAUTHORIZED" ? 401 : 503;
      return new Response(
        status === 401 ? "You are not signed in as staff." : "Staff sign-in is not set up yet.",
        { status, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "private, no-store" } },
      );
    }

    if (isAdminPage) {
      const asset = await env.ASSETS.fetch(request);
      const headers = new Headers(asset.headers);
      headers.set("cache-control", "private, no-store");
      return new Response(asset.body, { status: asset.status, statusText: asset.statusText, headers });
    }

    if (request.method !== "GET" && request.method !== "HEAD" && !sameOrigin(request)) {
      return fail("UNAUTHORIZED");
    }

    if (pathname === "/api/admin/quotes") {
      return request.method === "GET" ? handleAdminList(request, deps) : fail("METHOD_NOT_ALLOWED");
    }
    const match = pathname.match(/^\/api\/admin\/quotes\/([0-9a-f-]{36})$/i);
    if (match) {
      return request.method === "PATCH" ? handleAdminPatch(request, match[1], deps) : fail("METHOD_NOT_ALLOWED");
    }
  }

  if (lower.startsWith("/api/")) return fail("NOT_FOUND");
  return env.ASSETS.fetch(request);
}

export default {
  async fetch(request, env, ctx) {
    try {
      const deps = makeDeps(env, (work) => ctx.waitUntil(work));
      return await routeRequest(request, env, deps);
    } catch (err) {
      console.error(err);
      return fail("SERVER_ERROR");
    }
  },

  async scheduled(_event, env, ctx) {
    ctx.waitUntil(retryPending(makeDeps(env, (work) => ctx.waitUntil(work))));
  },
} satisfies ExportedHandler<Env>;
