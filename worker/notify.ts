import { serviceTitle } from "../src/content/services";
import { buildStaffEmail } from "../src/lib/messages";
import type { QuoteRequest } from "../src/types";
import type { Deps, NotifyResult } from "./deps";
import type { Env, FetchFn } from "./env";

const RESEND_URL = "https://api.resend.com/emails";
export const MAX_NOTIFY_TRIES = 10;

export async function sendStaffEmail(
  quote: QuoteRequest,
  env: Pick<Env, "RESEND_API_KEY" | "NOTIFY_FROM" | "NOTIFY_TO">,
  fetchFn: FetchFn,
): Promise<NotifyResult> {
  const to = (env.NOTIFY_TO ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!env.RESEND_API_KEY || !env.NOTIFY_FROM || to.length === 0) return "not_configured";

  const { subject, text } = buildStaffEmail(quote, serviceTitle(quote.service));
  try {
    const res = await fetchFn(RESEND_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
        "idempotency-key": `quote-${quote.id}`,
      },
      body: JSON.stringify({ from: env.NOTIFY_FROM, to, subject, text }),
    });
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

export async function notifyAndRecord(quote: QuoteRequest, deps: Deps): Promise<NotifyResult> {
  const result = await deps.notify(quote);
  if (result === "sent") await deps.repo.recordNotify(quote.id, "sent", true);
  if (result === "failed") await deps.repo.recordNotify(quote.id, "failed", true);
  return result;
}

export async function retryPending(deps: Deps): Promise<number> {
  const waiting = await deps.repo.pendingNotify(20, MAX_NOTIFY_TRIES);
  for (const quote of waiting) await notifyAndRecord(quote, deps);
  return waiting.length;
}
