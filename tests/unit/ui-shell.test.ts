import { describe, expect, it } from "vitest";
import { anyUnconfirmedShown, visible } from "../../src/lib/facts";

describe("spec ui-shell", () => {
  it("edge case 01: an unconfirmed fact is hidden in production and shown in preview", () => {
    const phone = { value: "+211 900 000 000", confirmed: false };
    expect(visible(phone, false)).toBeUndefined();
    expect(visible(phone, true)).toBe("+211 900 000 000");
    expect(visible({ ...phone, confirmed: true }, false)).toBe("+211 900 000 000");
  });

  it("edge case 02: the preview banner shows only when an unconfirmed fact is on screen", () => {
    expect(anyUnconfirmedShown([{ value: 1, confirmed: false }], true)).toBe(true);
    expect(anyUnconfirmedShown([{ value: 1, confirmed: false }], false)).toBe(false);
    expect(anyUnconfirmedShown([{ value: 1, confirmed: true }], true)).toBe(false);
  });
});
