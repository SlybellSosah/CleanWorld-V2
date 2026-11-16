import { describe, expect, it } from "vitest";
import { prerenderPaths, publicPaths } from "../../src/content/paths";
import { serviceBySlug, services } from "../../src/content/services";
import { SERVICE_SLUGS } from "../../src/types";

describe("spec view-services", () => {
  it("edge case 01: an unknown slug has no service", () => {
    expect(serviceBySlug("unknown")).toBeUndefined();
  });

  it("edge case 02: every service has a pre-rendered page", () => {
    expect(services.map((s) => s.slug).sort()).toEqual([...SERVICE_SLUGS].sort());
    for (const s of services) expect(prerenderPaths).toContain(`/services/${s.slug}`);
    expect(publicPaths).not.toContain("/admin");
  });
});
