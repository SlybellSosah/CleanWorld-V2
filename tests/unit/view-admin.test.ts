import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { authorise, clearAccessKeyCache } from "../../worker/access";

const TEAM = "team.cloudflareaccess.example";
const AUD = "aud-123";
const NOW = new Date("2026-11-16T09:00:00.000Z");

const b64url = (data: ArrayBuffer | string): string => {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

let keys: CryptoKeyPair;
let jwks: { keys: object[] };

async function token(claims: Record<string, unknown>, signer = keys.privateKey, kid = "k1"): Promise<string> {
  const head = b64url(JSON.stringify({ alg: "RS256", kid }));
  const payload = b64url(JSON.stringify(claims));
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", signer, new TextEncoder().encode(`${head}.${payload}`));
  return `${head}.${payload}.${b64url(sig)}`;
}

const good = () => ({ aud: [AUD], iss: `https://${TEAM}`, exp: NOW.getTime() / 1000 + 600 });
const env = { ACCESS_TEAM_DOMAIN: TEAM, ACCESS_AUD: AUD };
const certs = async () => new Response(JSON.stringify(jwks));
const request = (host: string, jwt?: string) =>
  new Request(`https://${host}/api/admin/quotes`, { headers: jwt ? { "cf-access-jwt-assertion": jwt } : {} });

const generate = () =>
  crypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["sign", "verify"],
  ) as Promise<CryptoKeyPair>;

beforeAll(async () => {
  keys = await generate();
  jwks = { keys: [{ ...(await crypto.subtle.exportKey("jwk", keys.publicKey)), kid: "k1" }] };
});

beforeEach(() => {
  clearAccessKeyCache();
});

describe("spec view-admin", () => {
  it("edge case 01: no token is unauthorised", async () => {
    expect(await authorise(request("site.example"), env, certs, NOW)).toEqual({ ok: false, code: "UNAUTHORIZED" });
  });

  it("edge case 02: wrong audience, issuer, signature, nbf, 4-part token or expired token is unauthorised", async () => {
    const other = await generate();
    const validJwt = await token(good());
    const bad = [
      await token({ ...good(), aud: ["someone-else"] }),
      await token({ ...good(), iss: "https://evil.example" }),
      await token(good(), other.privateKey),
      await token({ ...good(), exp: NOW.getTime() / 1000 - 1 }),
      await token({ ...good(), nbf: NOW.getTime() / 1000 + 60 }),
      `${validJwt}.extra`,
    ];
    for (const jwt of bad) {
      expect(await authorise(request("site.example", jwt), env, certs, NOW)).toEqual({ ok: false, code: "UNAUTHORIZED" });
    }
    expect(await authorise(request("site.example", validJwt), env, certs, NOW)).toEqual({ ok: true });
  });

  it("normalises ACCESS_TEAM_DOMAIN with https:// prefix or trailing slash", async () => {
    const validJwt = await token(good());
    expect(
      await authorise(request("site.example", validJwt), { ACCESS_TEAM_DOMAIN: `https://${TEAM}/`, ACCESS_AUD: AUD }, certs, NOW),
    ).toEqual({ ok: true });
  });

  it("does not poison JWKS cache on upstream error and refreshes on rotated kid after cooldown", async () => {
    const validJwt = await token(good());
    const failingCerts = async () => new Response("{}", { status: 500 });
    expect(await authorise(request("site.example", validJwt), env, failingCerts, NOW)).toEqual({
      ok: false,
      code: "UNAUTHORIZED",
    });
    // Subsequent request with healthy certs endpoint succeeds immediately (cache was not poisoned).
    expect(await authorise(request("site.example", validJwt), env, certs, NOW)).toEqual({ ok: true });

    // Key rotation after 60s cooldown fetches new kid automatically.
    const rotated = await generate();
    const rotatedJwks = { keys: [{ ...(await crypto.subtle.exportKey("jwk", rotated.publicKey)), kid: "k2" }] };
    const rotatedJwt = await token(good(), rotated.privateKey, "k2");
    const later = new Date(NOW.getTime() + 65_000);
    expect(
      await authorise(request("site.example", rotatedJwt), env, async () => new Response(JSON.stringify(rotatedJwks)), later),
    ).toEqual({ ok: true });
  });

  it("edge case 03: missing Access settings never opens the staff area", async () => {
    expect(await authorise(request("site.example", await token(good())), {}, certs, NOW)).toEqual({
      ok: false,
      code: "ADMIN_NOT_CONFIGURED",
    });
  });

  it("edge case 04: the development bypass works only on a local host", async () => {
    const bypass = { ADMIN_DEV_BYPASS: "1" };
    expect(await authorise(request("localhost:8787"), bypass, certs, NOW)).toEqual({ ok: true });
    expect((await authorise(request("site.example"), bypass, certs, NOW)).ok).toBe(false);
  });
});
