import { describe, expect, it } from "vitest";
import { handleAdminList, handleAdminPatch } from "../../worker/admin";
import { retryPending } from "../../worker/notify";
import { handlePostQuote } from "../../worker/quotes";
import { body, post, testDeps, validInput } from "./helpers";

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

  it("edge case 02: the same id twice returns one reference, one row, one email", async () => {
    const deps = testDeps();
    const first = await body(await handlePostQuote(post(validInput()), deps));
    const second = await body(await handlePostQuote(post(validInput()), deps));
    await Promise.all(deps.deferred);
    expect(second.data.reference).toBe(first.data.reference);
    expect(deps.repo.rows).toHaveLength(1);
    expect(deps.notified).toHaveLength(1);
  });

  it("edge case 03: organisation without a name is rejected", async () => {
    const res = await handlePostQuote(post(validInput({ customerType: "organisation" })), testDeps());
    expect((await body(res)).fields.organisation).toBeTruthy();
  });

  it("edge case 04: neighbourhood Other without a landmark is rejected", async () => {
    const res = await handlePostQuote(post(validInput({ neighbourhood: "Other" })), testDeps());
    expect((await body(res)).fields.landmark).toBeTruthy();
  });

  it("edge case 05: a local phone number is stored in international form", async () => {
    const deps = testDeps();
    await handlePostQuote(post(validInput({ phone: "0912 345 678" })), deps);
    expect(deps.repo.rows[0].phone).toBe("+211912345678");
  });

  it("edge case 06: a failed spam check stores nothing", async () => {
    const deps = testDeps({ spam: "rejected" });
    const res = await handlePostQuote(post(validInput()), deps);
    expect(res.status).toBe(403);
    expect(deps.repo.rows).toHaveLength(0);
  });

  it("edge case 07: a failed email keeps the row, counts the try, and is retried", async () => {
    const deps = testDeps({ notify: "failed" });
    await handlePostQuote(post(validInput()), deps);
    await Promise.all(deps.deferred);
    expect(deps.repo.rows[0]).toMatchObject({ notifyStatus: "failed", notifyTries: 1 });
    expect(await retryPending(deps)).toBe(1);
    expect(deps.repo.rows[0].notifyTries).toBe(2);
  });

  it("edge case 08: unconfigured email leaves the row pending without counting a try", async () => {
    const deps = testDeps({ notify: "not_configured" });
    await handlePostQuote(post(validInput()), deps);
    await Promise.all(deps.deferred);
    expect(deps.repo.rows[0]).toMatchObject({ notifyStatus: "pending", notifyTries: 0 });
  });

  it("edge case 10: a body that is not JSON is rejected", async () => {
    const res = await handlePostQuote(post("not json"), testDeps());
    expect(res.status).toBe(400);
    expect((await body(res)).code).toBe("INVALID_JSON");
  });

  it("edge case 12: an unknown status leaves the row unchanged", async () => {
    const deps = testDeps();
    await handlePostQuote(post(validInput()), deps);
    const id = deps.repo.rows[0].id;
    const patch = new Request(`https://example.test/api/admin/quotes/${id}`, { method: "PATCH", body: JSON.stringify({ status: "paid" }) });
    expect((await handleAdminPatch(patch, id, deps)).status).toBe(422);
    expect(deps.repo.rows[0].status).toBe("new");
    const list = await handleAdminList(new Request("https://example.test/api/admin/quotes?status=paid"), deps);
    expect(list.status).toBe(422);
  });
});
