import { QUOTE_STATUSES, type QuoteStatus } from "../src/types";
import type { Deps } from "./deps";
import { fail, ok } from "./http";

const isStatus = (v: unknown): v is QuoteStatus => QUOTE_STATUSES.includes(v as QuoteStatus);

export async function handleAdminList(request: Request, deps: Deps): Promise<Response> {
  const status = new URL(request.url).searchParams.get("status");
  if (status !== null && !isStatus(status)) return fail("VALIDATION_FAILED", { status: "Unknown status." });
  return ok({ quotes: await deps.repo.list(status ?? undefined, 200) });
}

export async function handleAdminPatch(request: Request, id: string, deps: Deps): Promise<Response> {
  let body: { status?: unknown };
  try {
    body = (await request.json()) as { status?: unknown };
  } catch {
    return fail("INVALID_JSON");
  }
  if (!isStatus(body?.status)) return fail("VALIDATION_FAILED", { status: "Unknown status." });
  const updated = await deps.repo.updateStatus(id, body.status);
  return updated ? ok({ quote: updated }) : fail("NOT_FOUND");
}
