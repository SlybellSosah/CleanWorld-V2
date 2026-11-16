import {
  CUSTOMER_TYPES,
  FREQUENCIES,
  SERVICE_SLUGS,
  type FieldErrors,
  type QuoteRequestInput,
} from "../types";
import { normalisePhone } from "./phone";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ValidationResult =
  | { ok: true; value: QuoteRequestInput }
  | { ok: false; fields: FieldErrors };

const text = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

/** Fields checked on each form step, in step order. */
export const STEP_FIELDS: (keyof QuoteRequestInput)[][] = [
  ["customerType"],
  ["service", "scope", "frequency"],
  ["neighbourhood", "landmark"],
  ["name", "phone", "organisation", "email", "poReference"],
];

export function validateQuote(raw: unknown, neighbourhoods: readonly string[]): ValidationResult {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const fields: FieldErrors = {};

  const id = text(r.id);
  if (!UUID.test(id)) fields.id = "This request is missing its identifier. Reload the page and try again.";

  const customerType = text(r.customerType) as QuoteRequestInput["customerType"];
  if (!CUSTOMER_TYPES.includes(customerType)) fields.customerType = "Choose organisation or household.";

  const service = text(r.service) as QuoteRequestInput["service"];
  if (!SERVICE_SLUGS.includes(service)) fields.service = "Choose a service.";

  const scope = text(r.scope);
  if (scope.length > 500) fields.scope = "Keep this under 500 characters.";

  const frequency = text(r.frequency) as NonNullable<QuoteRequestInput["frequency"]>;
  if (frequency && !FREQUENCIES.includes(frequency)) fields.frequency = "Choose how often from the list.";

  const neighbourhood = text(r.neighbourhood);
  if (neighbourhood !== "Other" && !neighbourhoods.includes(neighbourhood)) {
    fields.neighbourhood = "Choose your neighbourhood, or Other.";
  }

  const landmark = text(r.landmark);
  if (landmark.length > 200) fields.landmark = "Keep this under 200 characters.";
  else if (neighbourhood === "Other" && !landmark) fields.landmark = "Tell us the area and a nearby landmark.";

  const name = text(r.name);
  if (name.length < 2 || name.length > 100) fields.name = "Enter your name.";

  const phone = normalisePhone(text(r.phone));
  if (!phone) fields.phone = "Enter a phone number we can call, for example 0912 345 678.";

  const organisation = text(r.organisation);
  if (customerType === "organisation" && (organisation.length < 2 || organisation.length > 150)) {
    fields.organisation = "Enter your organisation's name.";
  }

  const email = text(r.email);
  if (email && (!EMAIL.test(email) || email.length > 200)) fields.email = "Check this email address.";

  const poReference = text(r.poReference);
  if (poReference.length > 100) fields.poReference = "Keep this under 100 characters.";

  if (Object.keys(fields).length > 0) return { ok: false, fields };

  const isOrg = customerType === "organisation";
  const value: QuoteRequestInput = { id, customerType, service, neighbourhood, name, phone: phone! };
  if (scope) value.scope = scope;
  if (frequency) value.frequency = frequency;
  if (landmark) value.landmark = landmark;
  if (email) value.email = email;
  if (isOrg) value.organisation = organisation;
  if (isOrg && poReference) value.poReference = poReference;
  const token = text(r.turnstileToken);
  if (token) value.turnstileToken = token;
  return { ok: true, value };
}

/** Errors for one form step only (0-based). */
export function validateStep(step: number, raw: unknown, neighbourhoods: readonly string[]): FieldErrors {
  const result = validateQuote(raw, neighbourhoods);
  if (result.ok) return {};
  const wanted = STEP_FIELDS[step] ?? [];
  return Object.fromEntries(Object.entries(result.fields).filter(([k]) => wanted.includes(k as keyof QuoteRequestInput)));
}

/** The first step (0-based) that has an error, or -1. */
export function firstStepWithError(fields: FieldErrors): number {
  return STEP_FIELDS.findIndex((names) => names.some((n) => n in fields));
}
