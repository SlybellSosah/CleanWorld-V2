import { authorise } from "./access";
import { handleAdminList, handleAdminPatch } from "./admin";
import { d1Repo } from "./d1-repo";
import type { Deps } from "./deps";
import type { Env, FetchFn } from "./env";
import { fail } from "./http";
import { retryPending, sendStaffEmail } from "./notify";
import { handlePostQuote } from "./quotes";
import { verifyTurnstile } from "./turnstile";

const fetchFn: FetchFn = (input, init) => fetch(input, init);

function makeDeps(env: Env, defer: (work: Promise<unknown>) => void): Deps {
  return {
    repo: d1Repo(env.DB),
    verifySpam: (token, ip) => verifyTurnstile(token, ip, env.TURNSTILE_SECRET, fetchFn),
    notify: (quote) => sendStaffEmail(quote, env, fetchFn),
    now: () => new Date(),
    randomBytes: (n) => crypto.getRandomValues(new Uint8Array(n)),
    defer,
  };
}

async function route(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const { pathname } = new URL(request.url);
  const deps = makeDeps(env, (work) => ctx.waitUntil(work));

  if (pathname === "/api/quotes") {
    return request.method === "POST" ? handlePostQuote(request, deps) : fail("METHOD_NOT_ALLOWED");
  }

  const isAdminApi = pathname.startsWith("/api/admin/");
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  if (isAdminApi || isAdminPage) {
    const access = await authorise(request, env, fetchFn, new Date());
    if (!access.ok) {
      if (isAdminApi) return fail(access.code);
      const status = access.code === "UNAUTHORIZED" ? 401 : 503;
      return new Response(status === 401 ? "Staff sign-in required." : "Staff sign-in is not set up yet.", { status });
    }
    if (isAdminPage) return env.ASSETS.fetch(request);

    if (pathname === "/api/admin/quotes") {
      return request.method === "GET" ? handleAdminList(request, deps) : fail("METHOD_NOT_ALLOWED");
    }
    const match = pathname.match(/^\/api\/admin\/quotes\/([0-9a-f-]{36})$/i);
    if (match) {
      return request.method === "PATCH" ? handleAdminPatch(request, match[1], deps) : fail("METHOD_NOT_ALLOWED");
    }
  }

  if (pathname.startsWith("/api/")) return fail("NOT_FOUND");
  return env.ASSETS.fetch(request);
}

export default {
  async fetch(request, env, ctx) {
    try {
      return await route(request, env, ctx);
    } catch (err) {
      console.error(err);
      return fail("SERVER_ERROR");
    }
  },

  async scheduled(_event, env, ctx) {
    ctx.waitUntil(retryPending(makeDeps(env, (work) => ctx.waitUntil(work))));
  },
} satisfies ExportedHandler<Env>;
