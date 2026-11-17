import type { Frequency, QuoteRequest, QuoteRequestInput } from "../types";

type Describable = Omit<QuoteRequestInput, "id" | "turnstileToken">;

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  "one-time": "One time",
  weekly: "Weekly",
  fortnightly: "Every two weeks",
  monthly: "Monthly",
  contract: "Ongoing contract",
};

function lines(q: Describable, serviceTitle: string): string[] {
  const isOrg = q.customerType === "organisation";
  const rows: [string, string | undefined][] = [
    ["Customer", isOrg ? "Organisation" : "Household"],
    ["Organisation", isOrg ? q.organisation : undefined],
    ["Service", serviceTitle],
    ["Details", q.scope],
    ["How often", q.frequency ? FREQUENCY_LABELS[q.frequency] : undefined],
    ["Neighbourhood", q.neighbourhood],
    ["Landmark", q.landmark],
    ["Name", q.name],
    ["Phone", q.phone],
    ["Email", isOrg ? q.email : undefined],
    ["PO / tender ref", isOrg ? q.poReference : undefined],
  ];
  return rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);
}

/** Plain-text staff notification. Customer text is never treated as markup. */
export function buildStaffEmail(q: QuoteRequest, serviceTitle: string): { subject: string; text: string } {
  return {
    subject: `New quote request ${q.reference} — ${serviceTitle} — ${q.neighbourhood}`,
    text: [`Reference: ${q.reference}`, `Received: ${q.createdAt}`, ...lines(q, serviceTitle)].join("\n"),
  };
}

/** WhatsApp text after a successful request. */
export function buildFollowUpText(reference: string): string {
  return `Hello Clean World, I have just sent quote request ${reference}.`;
}

/** WhatsApp text carrying the whole request, used when the form cannot be sent. */
export function buildFallbackText(q: Describable, serviceTitle: string): string {
  return ["Hello Clean World, I would like a quote.", ...lines(q, serviceTitle)].join("\n");
}
