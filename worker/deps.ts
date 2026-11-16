import type { NotifyStatus, QuoteRequest, QuoteStatus } from "../src/types";

export type NotifyResult = "sent" | "failed" | "not_configured";
export type SpamResult = "ok" | "rejected";

export interface QuoteRepo {
  findById(id: string): Promise<QuoteRequest | null>;
  /** Returns false when the reference is already taken. */
  insert(quote: QuoteRequest): Promise<boolean>;
  recordNotify(id: string, status: NotifyStatus, countTry: boolean): Promise<void>;
  pendingNotify(limit: number, maxTries: number): Promise<QuoteRequest[]>;
  list(status: QuoteStatus | undefined, limit: number): Promise<QuoteRequest[]>;
  updateStatus(id: string, status: QuoteStatus): Promise<QuoteRequest | null>;
}

export interface Deps {
  repo: QuoteRepo;
  verifySpam(token: string | undefined, remoteIp: string | undefined): Promise<SpamResult>;
  notify(quote: QuoteRequest): Promise<NotifyResult>;
  now(): Date;
  randomBytes(n: number): Uint8Array;
  /** Runs work after the response has been sent. */
  defer(work: Promise<unknown>): void;
}
