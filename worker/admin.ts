import { QUOTE_STATUSES, type QuoteStatus } from "../src/types";
import type { Deps } from "./deps";
import { fail, ok, readJsonBounded } from "./http";

const MAX_PATCH_BYTES = 1_024;
const isStatus = (v: unknown): v is QuoteStatus => QUOTE_STATUSES.includes(v as QuoteStatus);

export async function handleAdminList(request: Request, deps: Deps): Promise<Response> {
  const status = new URL(request.url).searchParams.get("status");
  if (status !== null && !isStatus(status)) return fail("VALIDATION_FAILED", { status: "Unknown status." });
  const [quotes, unemailedCount] = await Promise.all([deps.repo.list(status ?? undefined, 200), deps.repo.countUnemailed()]);
  return ok({ quotes, unemailedCount });
}

export async function handleAdminPatch(request: Request, id: string, deps: Deps): Promise<Response> {
  const parsed = await readJsonBounded(request, MAX_PATCH_BYTES);
  if (!parsed.ok) return fail(parsed.code);
  const body = (parsed.value && typeof parsed.value === "object" ? parsed.value : {}) as { status?: unknown };
  if (!isStatus(body.status)) return fail("VALIDATION_FAILED", { status: "Unknown status." });
  const updated = await deps.repo.updateStatus(id, body.status);
  return updated ? ok({ quote: updated }) : fail("NOT_FOUND");
}
