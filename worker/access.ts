import type { ErrorCode } from "../src/types";
import type { Env, FetchFn } from "./env";

export type AccessResult = { ok: true } | { ok: false; code: Extract<ErrorCode, "UNAUTHORIZED" | "ADMIN_NOT_CONFIGURED"> };

interface Jwk extends JsonWebKey {
  kid?: string;
}

const KEY_TTL_MS = 60 * 60 * 1000;
const REFRESH_COOLDOWN_MS = 60 * 1000;
const CERTS_TIMEOUT_MS = 5_000;
const keyCache = new Map<string, { keys: Jwk[]; fetchedAt: number }>();
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

export function clearAccessKeyCache(): void {
  keyCache.clear();
}

const normaliseTeamDomain = (raw: string): string =>
  raw.trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "");

const fromBase64Url = (s: string): Uint8Array => {
  const base64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
};

const parseJson = (s: string): Record<string, unknown> =>
  JSON.parse(new TextDecoder().decode(fromBase64Url(s))) as Record<string, unknown>;

async function signingKeys(team: string, fetchFn: FetchFn, now: number, forceRefresh = false): Promise<Jwk[]> {
  const cached = keyCache.get(team);
  if (!forceRefresh && cached && now - cached.fetchedAt < KEY_TTL_MS) return cached.keys;
  if (forceRefresh && cached && now - cached.fetchedAt < REFRESH_COOLDOWN_MS) return cached.keys;

  try {
    const res = await fetchFn(`https://${team}/cdn-cgi/access/certs`, {
      signal: AbortSignal.timeout(CERTS_TIMEOUT_MS),
    });
    if (!res.ok) return cached ? cached.keys : [];
    const { keys } = (await res.json()) as { keys?: unknown };
    if (!Array.isArray(keys) || keys.length === 0) return cached ? cached.keys : [];
    const validKeys = keys as Jwk[];
    keyCache.set(team, { keys: validKeys, fetchedAt: now });
    return validKeys;
  } catch {
    return cached ? cached.keys : [];
  }
}

/** Decides whether a request to the staff area is allowed. See specs/view-admin.md. */
export async function authorise(
  request: Request,
  env: Pick<Env, "ACCESS_TEAM_DOMAIN" | "ACCESS_AUD" | "ADMIN_DEV_BYPASS">,
  fetchFn: FetchFn,
  now: Date,
): Promise<AccessResult> {
  if (env.ADMIN_DEV_BYPASS === "1" && LOCAL_HOSTS.has(new URL(request.url).hostname)) return { ok: true };

  const team = env.ACCESS_TEAM_DOMAIN ? normaliseTeamDomain(env.ACCESS_TEAM_DOMAIN) : "";
  const aud = env.ACCESS_AUD?.trim() ?? "";
  if (!team || !aud) return { ok: false, code: "ADMIN_NOT_CONFIGURED" };

  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) return { ok: false, code: "UNAUTHORIZED" };

  try {
    const parts = token.split(".");
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return { ok: false, code: "UNAUTHORIZED" };
    const [h, p, s] = parts;
    const header = parseJson(h);
    const claims = parseJson(p);
    if (header.alg !== "RS256" || typeof header.kid !== "string" || !header.kid) {
      return { ok: false, code: "UNAUTHORIZED" };
    }

    const nowMs = now.getTime();
    let jwk = (await signingKeys(team, fetchFn, nowMs, false)).find((k) => k.kid === header.kid);
    if (!jwk) {
      jwk = (await signingKeys(team, fetchFn, nowMs, true)).find((k) => k.kid === header.kid);
    }
    if (!jwk) return { ok: false, code: "UNAUTHORIZED" };

    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const signed = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, fromBase64Url(s), new TextEncoder().encode(`${h}.${p}`));

    const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    const notBeforeOk = claims.nbf === undefined || (typeof claims.nbf === "number" && claims.nbf * 1000 <= nowMs);
    const valid =
      signed &&
      audiences.includes(aud) &&
      claims.iss === `https://${team}` &&
      notBeforeOk &&
      typeof claims.exp === "number" &&
      claims.exp * 1000 > nowMs;
    return valid ? { ok: true } : { ok: false, code: "UNAUTHORIZED" };
  } catch {
    return { ok: false, code: "UNAUTHORIZED" };
  }
}
