import type { ApiError, ApiSuccess, ErrorCode, FieldErrors } from "../src/types";

const STATUS: Record<ErrorCode, number> = {
  INVALID_JSON: 400,
  UNAUTHORIZED: 401,
  SPAM_CHECK_FAILED: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  PAYLOAD_TOO_LARGE: 413,
  VALIDATION_FAILED: 422,
  SERVER_ERROR: 500,
  ADMIN_NOT_CONFIGURED: 503,
};

const MESSAGE: Record<ErrorCode, string> = {
  INVALID_JSON: "The request could not be read.",
  UNAUTHORIZED: "You are not signed in as staff.",
  SPAM_CHECK_FAILED: "We could not confirm this request came from a person.",
  NOT_FOUND: "Not found.",
  METHOD_NOT_ALLOWED: "Method not allowed.",
  PAYLOAD_TOO_LARGE: "The request is too large.",
  VALIDATION_FAILED: "Some details need correcting.",
  SERVER_ERROR: "Something went wrong on our side.",
  ADMIN_NOT_CONFIGURED: "Staff sign-in is not set up yet.",
};

const headers = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };

export function ok<T>(data: T): Response {
  return new Response(JSON.stringify({ status: "success", data } satisfies ApiSuccess<T>), { headers });
}

export function fail(code: ErrorCode, fields?: FieldErrors): Response {
  const body: ApiError = { status: "error", code, message: MESSAGE[code], ...(fields ? { fields } : {}) };
  return new Response(JSON.stringify(body), { status: STATUS[code], headers });
}

export type BoundedJson =
  | { ok: true; value: unknown }
  | { ok: false; code: "PAYLOAD_TOO_LARGE" | "INVALID_JSON" };

/** Reads and parses a JSON request body while enforcing a strict UTF-8 byte ceiling. */
export async function readJsonBounded(request: Request, maxBytes: number): Promise<BoundedJson> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) {
    return { ok: false, code: "PAYLOAD_TOO_LARGE" };
  }
  if (!request.body) return { ok: false, code: "INVALID_JSON" };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        return { ok: false, code: "PAYLOAD_TOO_LARGE" };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, code: "INVALID_JSON" };
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { ok: true, value: JSON.parse(new TextDecoder().decode(merged)) };
  } catch {
    return { ok: false, code: "INVALID_JSON" };
  }
}

/** Rejects cross-origin browser state-changing requests while permitting non-browser callers without Origin/Sec-Fetch-Site. */
export function sameOrigin(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") return false;
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return false;
  return true;
}
