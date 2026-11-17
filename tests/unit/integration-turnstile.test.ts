import { describe, expect, it } from "vitest";
import { verifyTurnstile } from "../../worker/turnstile";

const answering = (json: unknown) => async () => new Response(JSON.stringify(json));

describe("spec integration-turnstile", () => {
  it("edge case 01: no secret means the check is disabled", async () => {
    expect(await verifyTurnstile(undefined, undefined, undefined, answering({ success: false }))).toBe("ok");
  });

  it("edge case 02: secret set and token missing is rejected", async () => {
    expect(await verifyTurnstile(undefined, undefined, "secret", answering({ success: true }))).toBe("rejected");
  });

  it("edge case 03: an invalid token is rejected", async () => {
    expect(await verifyTurnstile("token", "1.2.3.4", "secret", answering({ success: false }))).toBe("rejected");
    expect(await verifyTurnstile("token", "1.2.3.4", "secret", answering({ success: true }))).toBe("ok");
  });

  it("edge case 04: an unreachable verifier is rejected", async () => {
    const failing = async () => { throw new Error("offline"); };
    expect(await verifyTurnstile("token", undefined, "secret", failing)).toBe("rejected");
  });
});
