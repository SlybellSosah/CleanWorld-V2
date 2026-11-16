import type { ErrorCode } from "../src/types";
import type { Env, FetchFn } from "./env";

export type AccessResult = { ok: true } | { ok: false; code: Extract<ErrorCode, "UNAUTHORIZED" | "ADMIN_NOT_CONFIGURED"> };

interface Jwk extends JsonWebKey {
  kid?: string;
}

const KEY_TTL_MS = 60 * 60 * 1000;
const keyCache = new Map<string, { keys: Jwk[]; fetchedAt: number }>();
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

const fromBase64Url = (s: string): Uint8Array =>
  Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

const parseJson = (s: string): Record<string, unknown> =>
  JSON.parse(new TextDecoder().decode(fromBase64Url(s))) as Record<string, unknown>;

async function signingKeys(team: string, fetchFn: FetchFn, now: number): Promise<Jwk[]> {
  const cached = keyCache.get(team);
  if (cached && now - cached.fetchedAt < KEY_TTL_MS) return cached.keys;
  const res = await fetchFn(`https://${team}/cdn-cgi/access/certs`);
  const { keys } = (await res.json()) as { keys: Jwk[] };
  keyCache.set(team, { keys, fetchedAt: now });
  return keys;
}

/** Decides whether a request to the staff area is allowed. See specs/view-admin.md. */
export async function authorise(
  request: Request,
  env: Pick<Env, "ACCESS_TEAM_DOMAIN" | "ACCESS_AUD" | "ADMIN_DEV_BYPASS">,
  fetchFn: FetchFn,
  now: Date,
): Promise<AccessResult> {
  if (env.ADMIN_DEV_BYPASS === "1" && LOCAL_HOSTS.has(new URL(request.url).hostname)) return { ok: true };

  const team = env.ACCESS_TEAM_DOMAIN;
  const aud = env.ACCESS_AUD;
  if (!team || !aud) return { ok: false, code: "ADMIN_NOT_CONFIGURED" };

  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) return { ok: false, code: "UNAUTHORIZED" };

  try {
    const [h, p, s] = token.split(".");
    if (!h || !p || !s) return { ok: false, code: "UNAUTHORIZED" };
    const header = parseJson(h);
    const claims = parseJson(p);

    const jwk = (await signingKeys(team, fetchFn, now.getTime())).find((k) => k.kid === header.kid);
    if (header.alg !== "RS256" || !jwk) return { ok: false, code: "UNAUTHORIZED" };

    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const signed = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, fromBase64Url(s), new TextEncoder().encode(`${h}.${p}`));

    const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    const valid =
      signed &&
      audiences.includes(aud) &&
      claims.iss === `https://${team}` &&
      typeof claims.exp === "number" &&
      claims.exp * 1000 > now.getTime();
    return valid ? { ok: true } : { ok: false, code: "UNAUTHORIZED" };
  } catch {
    return { ok: false, code: "UNAUTHORIZED" };
  }
}
