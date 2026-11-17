import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { ContactBar } from "../../src/components/ContactBar";
import { company } from "../../src/content/company";
import { anyUnconfirmedShown, visible } from "../../src/lib/facts";
import Home from "../../src/routes/home";
import HowToPay from "../../src/routes/how-to-pay";
import Privacy from "../../src/routes/privacy";
import Quote from "../../src/routes/quote";

const snapshot = structuredClone(company);

afterEach(() => {
  Object.assign(company, structuredClone(snapshot));
});

describe("spec ui-shell & production CompanyFact gates", () => {
  it("ui-shell edge case 01: an unconfirmed fact is hidden in production and shown in preview", () => {
    const phone = { value: "+211 900 000 000", confirmed: false };
    expect(visible(phone, false)).toBeUndefined();
    expect(visible(phone, true)).toBe("+211 900 000 000");
    expect(visible({ ...phone, confirmed: true }, false)).toBe("+211 900 000 000");
  });

  it("ui-shell preview banner rule: shows only when an unconfirmed fact is on screen", () => {
    expect(anyUnconfirmedShown([{ value: 1, confirmed: false }], true)).toBe(true);
    expect(anyUnconfirmedShown([{ value: 1, confirmed: false }], false)).toBe(false);
    expect(anyUnconfirmedShown([{ value: 1, confirmed: true }], true)).toBe(false);
  });

  it("ui-shell edge case 02: ContactBar renders only 'Get a quote' when phone and WhatsApp are unconfirmed", () => {
    company.phone.confirmed = false;
    company.whatsapp.confirmed = false;
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/"]}>
        <ContactBar />
      </MemoryRouter>,
    );
    expect(html).toContain("Get a quote");
    expect(html).not.toContain("tel:");
    expect(html).not.toContain("wa.me");

    // Exact segment match: stays visible on /quotes (404) while hidden on /quote
    const onQuotes404 = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/quotes"]}>
        <ContactBar />
      </MemoryRouter>,
    );
    expect(onQuotes404).toContain("Get a quote");
    const onQuote = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/quote"]}>
        <ContactBar />
      </MemoryRouter>,
    );
    expect(onQuote).toBe("");
  });

  it("view-home edge case 01: founder panel is omitted in production when founder facts are unconfirmed", () => {
    const withConfirmed = renderToStaticMarkup(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
    expect(withConfirmed).toContain("From the founder");

    company.founderName.confirmed = false;
    const withUnconfirmed = renderToStaticMarkup(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
    expect(withUnconfirmed).not.toContain("From the founder");
    expect(withUnconfirmed).not.toContain("Kevina Aber");
  });

  it("view-how-to-pay edge case 01: unconfirmed merchant numbers are never rendered in production", () => {
    company.merchantNumbers = {
      value: [{ provider: "m-Gurush", number: "998877", name: "Clean World Inc." }],
      confirmed: false,
    };
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <HowToPay />
      </MemoryRouter>,
    );
    expect(html).not.toContain("998877");
    expect(html).toContain("We send you our merchant number together with your confirmed amount");
  });

  it("view-privacy edge case 01: falls back to quotation contact sentence when no contact fact is confirmed", () => {
    company.email.confirmed = false;
    company.phone.confirmed = false;
    company.whatsapp.confirmed = false;
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <Privacy />
      </MemoryRouter>,
    );
    expect(html).toContain("contact us through the details on your quotation");
  });

  it("view-quote edge case 09: omits WhatsApp links when WhatsApp number is unconfirmed", () => {
    company.whatsapp.confirmed = false;
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/quote"]}>
        <Quote />
      </MemoryRouter>,
    );
    expect(html).not.toContain("wa.me");
  });
});
