import type { NotifyStatus, QuoteRequest, QuoteStatus } from "../src/types";

export type NotifyResult = "sent" | "failed" | "not_configured";
export type SpamResult = "ok" | "rejected";
export type InsertResult = "inserted" | "duplicate_id" | "duplicate_reference";

export interface QuoteRepo {
  findById(id: string): Promise<QuoteRequest | null>;
  insert(quote: QuoteRequest): Promise<InsertResult>;
  recordNotify(id: string, status: NotifyStatus, countTry: boolean): Promise<void>;
  pendingNotify(limit: number, maxTries: number, pendingBeforeIso: string): Promise<QuoteRequest[]>;
  list(status: QuoteStatus | undefined, limit: number): Promise<QuoteRequest[]>;
  countUnemailed(): Promise<number>;
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
