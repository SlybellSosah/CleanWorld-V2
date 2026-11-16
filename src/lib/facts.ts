import type { CompanyFact } from "../types";

/** A fact's value if it may be shown, otherwise undefined. */
export function visible<T>(fact: CompanyFact<T>, showUnconfirmed: boolean): T | undefined {
  return fact.confirmed || showUnconfirmed ? fact.value : undefined;
}

export function anyUnconfirmedShown(facts: CompanyFact<unknown>[], showUnconfirmed: boolean): boolean {
  return showUnconfirmed && facts.some((f) => !f.confirmed);
}
