import { isUuid } from "../../lib/validate";
import type { QuoteDraft } from "../../types";

const KEY = "cw.quote.draft.v1";
const MAX_STEP = 3;

export function newId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  // randomUUID needs a secure context; this covers plain-http LAN previews.
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export const emptyDraft = (): QuoteDraft => ({ step: 0, fields: { id: newId() } });

export function loadDraft(): QuoteDraft | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<QuoteDraft> | null;
    if (!parsed || typeof parsed !== "object" || !parsed.fields || typeof parsed.fields !== "object") {
      return null;
    }
    const id = typeof parsed.fields.id === "string" && isUuid(parsed.fields.id) ? parsed.fields.id : newId();
    const rawStep = typeof parsed.step === "number" && Number.isInteger(parsed.step) ? parsed.step : 0;
    const step = Math.min(Math.max(rawStep, 0), MAX_STEP);
    return { step, fields: { ...parsed.fields, id } };
  } catch {
    return null;
  }
}

export function saveDraft(draft: QuoteDraft): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // Storage can be unavailable (private mode); the form still works.
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
}
