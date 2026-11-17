import { afterEach, describe, expect, it } from "vitest";
import { neighbourhoods } from "../../src/content/neighbourhoods";
import { serviceBySlug } from "../../src/content/services";
import { loadDraft } from "../../src/features/quote/draft";
import { buildFallbackText } from "../../src/lib/messages";
import { normalisePhone } from "../../src/lib/phone";
import { makeReference } from "../../src/lib/reference";
import { firstStepWithError, isUuid, validateQuote, validateStep } from "../../src/lib/validate";
import { whatsappLink } from "../../src/lib/whatsapp";
import { validInput } from "./helpers";

describe("spec view-quote", () => {
  afterEach(() => {
    delete (globalThis as Record<string, unknown>).localStorage;
  });

  it("edge case 03: a step reports only its own empty required fields", () => {
    const draft = { id: validInput().id };
    expect(Object.keys(validateStep(0, draft, neighbourhoods))).toEqual(["customerType"]);
    expect(Object.keys(validateStep(3, draft, neighbourhoods)).sort()).toEqual(["name", "phone"]);
    expect(firstStepWithError({ phone: "x" })).toBe(3);
  });

  it("edge case 04: the WhatsApp fallback carries the whole request without leaking hidden org fields on household", () => {
    const text = buildFallbackText(
      { ...validInput({ landmark: "Near the airport gate", organisation: "Stale Org", poReference: "PO-99" }) },
      "Fumigation and pest control",
    );
    const link = whatsappLink("+211 928 300 400", text);
    expect(link.startsWith("https://wa.me/211928300400?text=")).toBe(true);
    const decoded = decodeURIComponent(link.split("text=")[1]);
    expect(decoded).toContain("Tongping");
    expect(decoded).toContain("Near the airport gate");
    expect(decoded).toContain("Test Customer");
    expect(decoded).not.toContain("Stale Org");
    expect(decoded).not.toContain("PO-99");
  });

  it("edge case 05: a household request ignores hidden organisation, email and PO fields even if invalid", () => {
    const result = validateQuote(
      validInput({ organisation: "Ignored Ltd", email: "not-an-email", poReference: "x".repeat(150) }),
      neighbourhoods,
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.organisation).toBeUndefined();
      expect(result.value.email).toBeUndefined();
      expect(result.value.poReference).toBeUndefined();
    }
  });

  it("edge case 07: an unknown service in the link is not a service", () => {
    expect(serviceBySlug("car-wash")).toBeUndefined();
    expect(serviceBySlug("fumigation")?.slug).toBe("fumigation");
  });

  it("heals corrupted draft ids and clamps out-of-bounds draft steps", () => {
    const store = new Map<string, string>([
      ["cw.quote.draft.v1", JSON.stringify({ step: 99, fields: { id: "bad-id", name: "Ada" } })],
    ]);
    (globalThis as Record<string, unknown>).localStorage = {
      getItem: (k: string) => store.get(k) ?? null,
    };
    const loaded = loadDraft();
    expect(loaded).not.toBeNull();
    expect(loaded!.step).toBe(3);
    expect(isUuid(loaded!.fields.id)).toBe(true);
    expect(loaded!.fields.name).toBe("Ada");
  });

  it("normalises South Sudan local, trunk-zero, and international phone numbers accurately", () => {
    expect(normalisePhone("0912 345 678")).toBe("+211912345678");
    expect(normalisePhone("+211 0912 345 678")).toBe("+211912345678");
    expect(normalisePhone("00211 0912 345 678")).toBe("+211912345678");
    expect(normalisePhone("912345678")).toBe("+211912345678");
    expect(normalisePhone("0123456789")).toBe("+211123456789");
    expect(normalisePhone("+254712345678")).toBe("+254712345678");
    expect(normalisePhone("+21191234")).toBeNull();
  });

  it("builds unambiguous reference codes with rejection sampling", () => {
    const ref = makeReference(new Uint8Array([250, 251, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
    expect(ref).toBe("CW-2345-6789");
  });
});
