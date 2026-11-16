import type { Deps, NotifyResult, QuoteRepo, SpamResult } from "../../worker/deps";
import type { QuoteRequest, QuoteRequestInput } from "../../src/types";

export function memoryRepo(): QuoteRepo & { rows: QuoteRequest[] } {
  const rows: QuoteRequest[] = [];
  return {
    rows,
    async findById(id) {
      return rows.find((r) => r.id === id) ?? null;
    },
    async insert(q) {
      if (rows.some((r) => r.reference === q.reference)) return false;
      rows.push({ ...q });
      return true;
    },
    async recordNotify(id, status, countTry) {
      const row = rows.find((r) => r.id === id)!;
      row.notifyStatus = status;
      if (countTry) row.notifyTries += 1;
    },
    async pendingNotify(limit, maxTries) {
      return rows.filter((r) => r.notifyStatus !== "sent" && r.notifyTries < maxTries).slice(0, limit);
    },
    async list(status, limit) {
      return rows.filter((r) => !status || r.status === status).slice(0, limit);
    },
    async updateStatus(id, status) {
      const row = rows.find((r) => r.id === id);
      if (!row) return null;
      row.status = status;
      return row;
    },
  };
}

export interface TestDeps extends Deps {
  repo: ReturnType<typeof memoryRepo>;
  deferred: Promise<unknown>[];
  notified: QuoteRequest[];
}

export function testDeps(over: { spam?: SpamResult; notify?: NotifyResult } = {}): TestDeps {
  const deferred: Promise<unknown>[] = [];
  const notified: QuoteRequest[] = [];
  let counter = 0;
  return {
    repo: memoryRepo(),
    deferred,
    notified,
    verifySpam: async () => over.spam ?? "ok",
    notify: async (q) => {
      notified.push(q);
      return over.notify ?? "sent";
    },
    now: () => new Date("2026-11-16T09:00:00.000Z"),
    randomBytes: (n) => Uint8Array.from({ length: n }, () => counter++ % 251),
    defer: (work) => void deferred.push(work),
  };
}

export const validInput = (over: Partial<QuoteRequestInput> = {}): QuoteRequestInput => ({
  id: "3f2c1e9a-6b7d-4c8e-9f10-2a3b4c5d6e7f",
  customerType: "household",
  service: "fumigation",
  neighbourhood: "Tongping",
  name: "Test Customer",
  phone: "0912 345 678",
  ...over,
});

export const post = (body: unknown): Request =>
  new Request("https://example.test/api/quotes", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

export const body = async <T = any>(res: Response): Promise<T> => (await res.json()) as T;
