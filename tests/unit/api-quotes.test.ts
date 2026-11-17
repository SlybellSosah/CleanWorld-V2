import { describe, expect, it } from "vitest";
import { handleAdminList, handleAdminPatch } from "../../worker/admin";
import type { Env } from "../../worker/env";
import { routeRequest } from "../../worker/index";
import { retryPending } from "../../worker/notify";
import { handlePostQuote } from "../../worker/quotes";
import { body, post, testDeps, validInput } from "./helpers";

const mockEnv = (over: Partial<Env> = {}): Env => ({
  DB: {} as D1Database,
  ASSETS: { fetch: async () => new Response("<html>admin</html>", { headers: { "content-type": "text/html" } }) } as unknown as Fetcher,
  ...over,
});

describe("spec api-quotes", () => {
  it("edge case 01: missing required field is rejected per field and nothing is stored", async () => {
    const deps = testDeps();
    const res = await handlePostQuote(post(validInput({ name: "" })), deps);
    expect(res.status).toBe(422);
    const json = await body(res);
    expect(json.code).toBe("VALIDATION_FAILED");
    expect(json.fields.name).toBeTruthy();
    expect(deps.repo.rows).toHaveLength(0);
  });

  it("edge case 02: the same id twice (sequential or concurrent) returns one reference, one row, one email", async () => {
    const deps = testDeps();
    const [r1, r2] = await Promise.all([handlePostQuote(post(validInput()), deps), handlePostQuote(post(validInput()), deps)]);
    expect(r1.status).toBe(200);
    expect(r2.status).toBe(200);
    const first = await body(r1);
    const second = await body(r2);
    const third = await body(await handlePostQuote(post(validInput()), deps));
    await Promise.all(deps.deferred);
    expect(second.data.reference).toBe(first.data.reference);
    expect(third.data.reference).toBe(first.data.reference);
    expect(deps.repo.rows).toHaveLength(1);
    expect(deps.notified).toHaveLength(1);
    expect(deps.repo.rows[0]).toMatchObject({ notifyStatus: "sent", notifyTries: 0 });
  });

  it("edge case 02b: concurrent retry whose single-use Turnstile token fails after initial insert still returns reference", async () => {
    let calls = 0;
    const deps = testDeps();
    deps.verifySpam = async () => {
      calls += 1;
      if (calls === 1) {
        await new Promise((r) => setTimeout(r, 5));
        return "ok";
      }
      await new Promise((r) => setTimeout(r, 15));
      return "rejected";
    };
    const [r1, r2] = await Promise.all([handlePostQuote(post(validInput()), deps), handlePostQuote(post(validInput()), deps)]);
    expect(r1.status).toBe(200);
    expect(r2.status).toBe(200);
    expect((await body(r2)).data.reference).toBe((await body(r1)).data.reference);
  });

  it("edge case 03: organisation without a name is rejected", async () => {
    const res = await handlePostQuote(post(validInput({ customerType: "organisation" })), testDeps());
    expect((await body(res)).fields.organisation).toBeTruthy();
  });

  it("edge case 04: neighbourhood Other without a landmark is rejected", async () => {
    const res = await handlePostQuote(post(validInput({ neighbourhood: "Other" })), testDeps());
    expect((await body(res)).fields.landmark).toBeTruthy();
  });

  it("edge case 05: local and trunk-zero phone numbers are stored in international E.164 form", async () => {
    const deps = testDeps();
    await handlePostQuote(post(validInput({ phone: "0912 345 678" })), deps);
    await handlePostQuote(post(validInput({ id: "4f2c1e9a-6b7d-4c8e-9f10-2a3b4c5d6e7f", phone: "+211 0912 345 678" })), deps);
    expect(deps.repo.rows[0].phone).toBe("+211912345678");
    expect(deps.repo.rows[1].phone).toBe("+211912345678");
  });

  it("edge case 06: a failed spam check stores nothing", async () => {
    const deps = testDeps({ spam: "rejected" });
    const res = await handlePostQuote(post(validInput()), deps);
    expect(res.status).toBe(403);
    expect(deps.repo.rows).toHaveLength(0);
  });

  it("edge case 07: a failed email keeps the row, counts tries up to 10, and never overwrites sent", async () => {
    let nowMs = Date.parse("2026-11-16T09:00:00.000Z");
    const deps = testDeps({ notify: "failed", now: () => new Date(nowMs) });
    await handlePostQuote(post(validInput()), deps);
    await Promise.all(deps.deferred);
    expect(deps.repo.rows[0]).toMatchObject({ notifyStatus: "failed", notifyTries: 1 });

    expect(await retryPending(deps)).toBe(1);
    expect(deps.repo.rows[0].notifyTries).toBe(2);

    deps.repo.rows[0].notifyTries = 10;
    expect(await retryPending(deps)).toBe(0);

    // Monotonic guard: once marked sent, a late failure cannot clobber it back to failed.
    deps.repo.rows[0].notifyStatus = "sent";
    deps.repo.rows[0].notifyTries = 0;
    await deps.repo.recordNotify(deps.repo.rows[0].id, "failed", true);
    expect(deps.repo.rows[0]).toMatchObject({ notifyStatus: "sent", notifyTries: 0 });

    // Freshly inserted pending rows (< 60s old) are skipped by cron while waitUntil may still be running.
    const pendingDeps = testDeps({ notify: "not_configured", now: () => new Date(nowMs) });
    await handlePostQuote(post(validInput()), pendingDeps);
    await Promise.all(pendingDeps.deferred);
    expect(await retryPending(pendingDeps)).toBe(0);
    nowMs += 61_000;
    expect(await retryPending(pendingDeps)).toBe(1);
  });

  it("edge case 08: unconfigured email leaves the row pending without counting a try", async () => {
    const deps = testDeps({ notify: "not_configured" });
    await handlePostQuote(post(validInput()), deps);
    await Promise.all(deps.deferred);
    expect(deps.repo.rows[0]).toMatchObject({ notifyStatus: "pending", notifyTries: 0 });
  });

  it("edge case 10 & size cap: invalid JSON returns 400 and bodies > 10 KB UTF-8 return 413", async () => {
    const res = await handlePostQuote(post("not json"), testDeps());
    expect(res.status).toBe(400);
    expect((await body(res)).code).toBe("INVALID_JSON");

    const huge = post({ ...validInput(), scope: "é".repeat(5_200) }); // > 10,240 UTF-8 bytes
    const tooLarge = await handlePostQuote(huge, testDeps());
    expect(tooLarge.status).toBe(413);
    expect((await body(tooLarge)).code).toBe("PAYLOAD_TOO_LARGE");
  });

  it("edge case 11: unauthenticated /api/admin/* calls return 401/503 and cross-origin PATCH is rejected", async () => {
    const deps = testDeps();
    const unconfigured = await routeRequest(new Request("https://cleanworld.live/api/admin/quotes"), mockEnv(), deps);
    expect(unconfigured.status).toBe(503);
    expect((await body(unconfigured)).code).toBe("ADMIN_NOT_CONFIGURED");

    const unauth = await routeRequest(
      new Request("https://cleanworld.live/api/admin/quotes"),
      mockEnv({ ACCESS_TEAM_DOMAIN: "team.cloudflareaccess.com", ACCESS_AUD: "aud-1" }),
      deps,
    );
    expect(unauth.status).toBe(401);
    expect((await body(unauth)).code).toBe("UNAUTHORIZED");

    const crossOrigin = await routeRequest(
      new Request("http://localhost:8787/api/admin/quotes/3f2c1e9a-6b7d-4c8e-9f10-2a3b4c5d6e7f", {
        method: "PATCH",
        headers: { origin: "https://evil.example", "content-type": "application/json" },
        body: JSON.stringify({ status: "won" }),
      }),
      mockEnv({ ADMIN_DEV_BYPASS: "1" }),
      deps,
    );
    expect(crossOrigin.status).toBe(401);

    const adminHtml = await routeRequest(
      new Request("http://localhost:8787/admin"),
      mockEnv({ ADMIN_DEV_BYPASS: "1" }),
      deps,
    );
    expect(adminHtml.headers.get("cache-control")).toBe("private, no-store");
  });

  it("edge case 12 & routing: unknown status returns 422, missing id returns 404, wrong method returns 405", async () => {
    const deps = testDeps({ notify: "failed" });
    await handlePostQuote(post(validInput()), deps);
    await Promise.all(deps.deferred);
    const id = deps.repo.rows[0].id;
    const patch = new Request(`https://example.test/api/admin/quotes/${id}`, { method: "PATCH", body: JSON.stringify({ status: "paid" }) });
    expect((await handleAdminPatch(patch, id, deps)).status).toBe(422);
    expect(deps.repo.rows[0].status).toBe("new");

    const missing = new Request("https://example.test/api/admin/quotes/00000000-0000-4000-8000-000000000000", {
      method: "PATCH",
      body: JSON.stringify({ status: "won" }),
    });
    expect((await handleAdminPatch(missing, "00000000-0000-4000-8000-000000000000", deps)).status).toBe(404);

    const list = await handleAdminList(new Request("https://example.test/api/admin/quotes?status=paid"), deps);
    expect(list.status).toBe(422);

    const validList = await body(await handleAdminList(new Request("https://example.test/api/admin/quotes"), deps));
    expect(validList.data.unemailedCount).toBe(1);

    expect((await routeRequest(new Request("https://cleanworld.live/api/quotes"), mockEnv(), deps)).status).toBe(405);
    expect((await routeRequest(new Request("https://cleanworld.live/api/unknown"), mockEnv(), deps)).status).toBe(404);
  });

  it("reference collision exhaustion returns 500 after 3 attempts", async () => {
    const deps = testDeps();
    deps.randomBytes = (n) => new Uint8Array(n); // fixed reference every time
    expect((await handlePostQuote(post(validInput()), deps)).status).toBe(200);
    const second = await handlePostQuote(post(validInput({ id: "4f2c1e9a-6b7d-4c8e-9f10-2a3b4c5d6e7f" })), deps);
    expect(second.status).toBe(500);
  });
});
