import type { SpamResult } from "./deps";
import type { FetchFn } from "./env";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const VERIFY_TIMEOUT_MS = 8_000;

export async function verifyTurnstile(
  token: string | undefined,
  remoteIp: string | undefined,
  secret: string | undefined,
  fetchFn: FetchFn,
): Promise<SpamResult> {
  if (!secret) return "ok";
  if (!token) return "rejected";
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);
    const res = await fetchFn(VERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    });
    if (!res.ok) return "rejected";
    const json = (await res.json()) as { success?: boolean };
    return json.success === true ? "ok" : "rejected";
  } catch {
    return "rejected";
  }
}
