import { describe, expect, it } from "vitest";
import { sendStaffEmail } from "../../worker/notify";
import type { QuoteRequest } from "../../src/types";
import { validInput } from "./helpers";

const quote = (over: Partial<QuoteRequest> = {}): QuoteRequest => ({
  ...validInput(),
  phone: "+211912345678",
  reference: "CW-2345-6789",
  createdAt: "2026-11-16T09:00:00.000Z",
  status: "new",
  notifyStatus: "pending",
  notifyTries: 0,
  ...over,
});
const env = { RESEND_API_KEY: "test-key", NOTIFY_FROM: "requests@example.test", NOTIFY_TO: "a@example.test, b@example.test" };

function recorder(response: () => Promise<Response>) {
  const calls: { url: string; init: RequestInit }[] = [];
  const fetchFn = async (url: string, init?: RequestInit) => {
    calls.push({ url, init: init! });
    return response();
  };
  return { calls, fetchFn };
}

describe("spec integration-email", () => {
  it("edge case 01: missing variables means not configured and no request", async () => {
    const { calls, fetchFn } = recorder(async () => new Response("{}"));
    expect(await sendStaffEmail(quote(), { ...env, RESEND_API_KEY: "" }, fetchFn)).toBe("not_configured");
    expect(calls).toHaveLength(0);
  });

  it("edge case 02: an error status is a failure", async () => {
    const { fetchFn } = recorder(async () => new Response("{}", { status: 500 }));
    expect(await sendStaffEmail(quote(), env, fetchFn)).toBe("failed");
  });

  it("edge case 03: a network error is a failure", async () => {
    const { fetchFn } = recorder(async () => { throw new Error("offline"); });
    expect(await sendStaffEmail(quote(), env, fetchFn)).toBe("failed");
  });

  it("edge case 04: empty optional fields leave no blank or undefined lines", async () => {
    const { calls, fetchFn } = recorder(async () => new Response("{}"));
    expect(await sendStaffEmail(quote(), env, fetchFn)).toBe("sent");
    const sent = JSON.parse(calls[0].init.body as string);
    expect(sent.to).toEqual(["a@example.test", "b@example.test"]);
    expect(sent.text).not.toMatch(/undefined|Email:|Organisation:|Landmark:/);
    expect(sent.subject).toContain("CW-2345-6789");
  });

  it("edge case 05: the idempotency key is derived from the request id", async () => {
    const { calls, fetchFn } = recorder(async () => new Response("{}"));
    await sendStaffEmail(quote(), env, fetchFn);
    expect((calls[0].init.headers as Record<string, string>)["idempotency-key"]).toBe(`quote-${quote().id}`);
  });

  it("edge case 06: customer markup is sent as plain text only", async () => {
    const { calls, fetchFn } = recorder(async () => new Response("{}"));
    await sendStaffEmail(quote({ scope: "<script>alert(1)</script>" }), env, fetchFn);
    const sent = JSON.parse(calls[0].init.body as string);
    expect(sent.html).toBeUndefined();
    expect(sent.text).toContain("<script>alert(1)</script>");
  });
});
