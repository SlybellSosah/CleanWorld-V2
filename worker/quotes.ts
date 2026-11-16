import { neighbourhoodNames } from "../src/content/neighbourhoods";
import { makeReference } from "../src/lib/reference";
import { validateQuote } from "../src/lib/validate";
import type { QuoteRequest } from "../src/types";
import type { Deps } from "./deps";
import { fail, ok } from "./http";
import { notifyAndRecord } from "./notify";

const MAX_BODY = 10_000;
const REFERENCE_ATTEMPTS = 3;

export async function handlePostQuote(request: Request, deps: Deps): Promise<Response> {
  const bodyText = await request.text();
  if (bodyText.length > MAX_BODY) return fail("PAYLOAD_TOO_LARGE");

  let raw: unknown;
  try {
    raw = JSON.parse(bodyText);
  } catch {
    return fail("INVALID_JSON");
  }

  const checked = validateQuote(raw, neighbourhoodNames);
  if (!checked.ok) return fail("VALIDATION_FAILED", checked.fields);
  const { turnstileToken, ...input } = checked.value;

  const existing = await deps.repo.findById(input.id);
  if (existing) return ok({ reference: existing.reference });

  const spam = await deps.verifySpam(turnstileToken, request.headers.get("cf-connecting-ip") ?? undefined);
  if (spam !== "ok") return fail("SPAM_CHECK_FAILED");

  const quote = await insertWithReference(
    { ...input, reference: "", createdAt: deps.now().toISOString(), status: "new", notifyStatus: "pending", notifyTries: 0 },
    deps,
  );
  if (!quote) return fail("SERVER_ERROR");

  deps.defer(notifyAndRecord(quote, deps));
  return ok({ reference: quote.reference });
}

async function insertWithReference(quote: QuoteRequest, deps: Deps): Promise<QuoteRequest | null> {
  for (let attempt = 0; attempt < REFERENCE_ATTEMPTS; attempt++) {
    const candidate = { ...quote, reference: makeReference(deps.randomBytes(8)) };
    if (await deps.repo.insert(candidate)) return candidate;
  }
  return null;
}
