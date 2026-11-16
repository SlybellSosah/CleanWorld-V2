import type { ApiResponse, FieldErrors, QuoteRequestInput } from "../../types";

export type SubmitResult =
  | { kind: "sent"; reference: string }
  | { kind: "invalid"; fields: FieldErrors }
  | { kind: "failed" };

const TIMEOUT_MS = 15_000;

export async function submitQuote(input: QuoteRequestInput): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const json = (await res.json()) as ApiResponse<{ reference: string }>;
    if (json.status === "success") return { kind: "sent", reference: json.data.reference };
    if (json.code === "VALIDATION_FAILED" && json.fields) return { kind: "invalid", fields: json.fields };
    return { kind: "failed" };
  } catch {
    return { kind: "failed" };
  }
}
