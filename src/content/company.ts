import { anyUnconfirmedShown, visible } from "../lib/facts";
import type { CompanyFact, MerchantNumber } from "../types";

// Every value here came from the previous site or planning documents and has not been
// confirmed by the owner. Set `confirmed: true` only after the owner's fact sheet arrives.
export const company = {
  name: { value: "Clean World Inc.", confirmed: true } as CompanyFact<string>,
  phone: { value: "+211 928 300 400", confirmed: false } as CompanyFact<string>,
  whatsapp: { value: "+211 928 300 400", confirmed: false } as CompanyFact<string>,
  email: { value: "dispatch@cleanworld.live", confirmed: false } as CompanyFact<string>,
  address: { value: "Hai Kuwait, Juba, South Sudan", confirmed: false } as CompanyFact<string>,
  siteUrl: { value: "https://cleanworld.live", confirmed: false } as CompanyFact<string>,
  founderName: { value: "Kevina Aber", confirmed: false } as CompanyFact<string>,
  founderRole: { value: "Chief Executive Officer and Founder", confirmed: false } as CompanyFact<string>,
  founderQuote: {
    value:
      "Our commitment to Juba is clear. We don't just clean spaces; we create healthier, safer environments for our families and local businesses to thrive.",
    confirmed: false,
  } as CompanyFact<string>,
  merchantNumbers: { value: [], confirmed: false } as CompanyFact<MerchantNumber[]>,
};

export const SHOW_UNCONFIRMED = import.meta.env.VITE_SHOW_UNCONFIRMED === "1";

export const fact = <T,>(f: CompanyFact<T>): T | undefined => visible(f, SHOW_UNCONFIRMED);

export const showingUnconfirmed = anyUnconfirmedShown(Object.values(company), SHOW_UNCONFIRMED);
