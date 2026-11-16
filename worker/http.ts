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
