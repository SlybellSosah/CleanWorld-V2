import { describe, expect, it } from "vitest";
import { neighbourhoodNames } from "../../src/content/neighbourhoods";
import { serviceBySlug } from "../../src/content/services";
import { buildFallbackText } from "../../src/lib/messages";
import { firstStepWithError, validateQuote, validateStep } from "../../src/lib/validate";
import { whatsappLink } from "../../src/lib/whatsapp";
import { validInput } from "./helpers";

describe("spec view-quote", () => {
  it("edge case 03: a step reports only its own empty required fields", () => {
    const draft = { id: validInput().id };
    expect(Object.keys(validateStep(0, draft, neighbourhoodNames))).toEqual(["customerType"]);
    expect(Object.keys(validateStep(3, draft, neighbourhoodNames)).sort()).toEqual(["name", "phone"]);
    expect(firstStepWithError({ phone: "x" })).toBe(3);
  });

  it("edge case 04: the WhatsApp fallback carries the whole request", () => {
    const text = buildFallbackText({ ...validInput({ landmark: "Near the airport gate" }) }, "Fumigation and pest control");
    const link = whatsappLink("+211 928 300 400", text);
    expect(link.startsWith("https://wa.me/211928300400?text=")).toBe(true);
    const decoded = decodeURIComponent(link.split("text=")[1]);
    expect(decoded).toContain("Tongping");
    expect(decoded).toContain("Near the airport gate");
    expect(decoded).toContain("Test Customer");
  });

  it("edge case 05: a household request drops organisation-only fields", () => {
    const result = validateQuote(validInput({ organisation: "Ignored Ltd", poReference: "PO-1" }), neighbourhoodNames);
    expect(result.ok && result.value.organisation).toBeUndefined();
    expect(result.ok && result.value.poReference).toBeUndefined();
  });

  it("edge case 07: an unknown service in the link is not a service", () => {
    expect(serviceBySlug("car-wash")).toBeUndefined();
    expect(serviceBySlug("fumigation")?.slug).toBe("fumigation");
  });
});
