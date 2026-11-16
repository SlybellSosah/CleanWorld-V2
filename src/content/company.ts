import { anyUnconfirmedShown, visible } from "../lib/facts";
import type { CompanyFact, MerchantNumber } from "../types";

// Confirmed by the owner on 2026-11-16, except mobile-money merchant numbers, which have not been supplied.
export const company = {
  name: { value: "Clean World Inc.", confirmed: true } as CompanyFact<string>,
  phone: { value: "+211 928 300 400", confirmed: true } as CompanyFact<string>,
  whatsapp: { value: "+211 928 300 400", confirmed: true } as CompanyFact<string>,
  email: { value: "dispatch@cleanworld.live", confirmed: true } as CompanyFact<string>,
  address: { value: "Hai Kuwait, Juba, South Sudan", confirmed: true } as CompanyFact<string>,
  siteUrl: { value: "https://cleanworld.live", confirmed: true } as CompanyFact<string>,
  founderName: { value: "Kevina Aber", confirmed: true } as CompanyFact<string>,
  founderRole: { value: "Chief Executive Officer and Founder", confirmed: true } as CompanyFact<string>,
  founderQuote: {
    value:
      "Our commitment to Juba is clear. We don't just clean spaces; we create healthier, safer environments for our families and local businesses to thrive.",
    confirmed: true,
  } as CompanyFact<string>,
  merchantNumbers: { value: [], confirmed: false } as CompanyFact<MerchantNumber[]>,
};

export const SHOW_UNCONFIRMED = import.meta.env.VITE_SHOW_UNCONFIRMED === "1";

export const fact = <T,>(f: CompanyFact<T>): T | undefined => visible(f, SHOW_UNCONFIRMED);

export const showingUnconfirmed = anyUnconfirmedShown(Object.values(company), SHOW_UNCONFIRMED);
