import { neighbourhoods } from "../src/content/neighbourhoods";
import { makeReference } from "../src/lib/reference";
import { validateQuote } from "../src/lib/validate";
import type { QuoteRequest } from "../src/types";
import type { Deps } from "./deps";
import { fail, ok, readJsonBounded } from "./http";
import { notifyAndRecord } from "./notify";

const MAX_BODY_BYTES = 10_240; // 10 KB
const REFERENCE_ATTEMPTS = 3;

export async function handlePostQuote(request: Request, deps: Deps): Promise<Response> {
  const parsed = await readJsonBounded(request, MAX_BODY_BYTES);
  if (!parsed.ok) return fail(parsed.code);

  const checked = validateQuote(parsed.value, neighbourhoods);
  if (!checked.ok) return fail("VALIDATION_FAILED", checked.fields);
  const { turnstileToken, ...input } = checked.value;

  const existing = await deps.repo.findById(input.id);
  if (existing) return ok({ reference: existing.reference });

  const spam = await deps.verifySpam(turnstileToken, request.headers.get("cf-connecting-ip") ?? undefined);
  if (spam !== "ok") {
    const raced = await deps.repo.findById(input.id);
    if (raced) return ok({ reference: raced.reference });
    return fail("SPAM_CHECK_FAILED");
  }

  const inserted = await insertWithReference(
    { ...input, reference: "", createdAt: deps.now().toISOString(), status: "new", notifyStatus: "pending", notifyTries: 0 },
    deps,
  );
  if (inserted.kind === "duplicate_id") {
    const raced = await deps.repo.findById(input.id);
    return raced ? ok({ reference: raced.reference }) : fail("SERVER_ERROR");
  }
  if (inserted.kind === "exhausted") return fail("SERVER_ERROR");

  deps.defer(notifyAndRecord(inserted.quote, deps));
  return ok({ reference: inserted.quote.reference });
}

type InsertOutcome =
  | { kind: "inserted"; quote: QuoteRequest }
  | { kind: "duplicate_id" }
  | { kind: "exhausted" };

async function insertWithReference(quote: QuoteRequest, deps: Deps): Promise<InsertOutcome> {
  for (let attempt = 0; attempt < REFERENCE_ATTEMPTS; attempt++) {
    const candidate = { ...quote, reference: makeReference(deps.randomBytes(16)) };
    const outcome = await deps.repo.insert(candidate);
    if (outcome === "inserted") return { kind: "inserted", quote: candidate };
    if (outcome === "duplicate_id") return { kind: "duplicate_id" };
  }
  return { kind: "exhausted" };
}
