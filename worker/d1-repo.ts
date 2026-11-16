import type { NotifyStatus, QuoteRequest, QuoteStatus } from "../src/types";
import type { QuoteRepo } from "./deps";

interface Row {
  id: string;
  reference: string;
  created_at: string;
  customer_type: QuoteRequest["customerType"];
  service: QuoteRequest["service"];
  scope: string | null;
  frequency: QuoteRequest["frequency"] | null;
  neighbourhood: string;
  landmark: string | null;
  name: string;
  phone: string;
  organisation: string | null;
  email: string | null;
  po_reference: string | null;
  status: QuoteStatus;
  notify_status: NotifyStatus;
  notify_tries: number;
}

const toQuote = (r: Row): QuoteRequest => ({
  id: r.id,
  reference: r.reference,
  createdAt: r.created_at,
  customerType: r.customer_type,
  service: r.service,
  ...(r.scope ? { scope: r.scope } : {}),
  ...(r.frequency ? { frequency: r.frequency } : {}),
  neighbourhood: r.neighbourhood,
  ...(r.landmark ? { landmark: r.landmark } : {}),
  name: r.name,
  phone: r.phone,
  ...(r.organisation ? { organisation: r.organisation } : {}),
  ...(r.email ? { email: r.email } : {}),
  ...(r.po_reference ? { poReference: r.po_reference } : {}),
  status: r.status,
  notifyStatus: r.notify_status,
  notifyTries: r.notify_tries,
});

export function d1Repo(db: D1Database): QuoteRepo {
  const findById = async (id: string) => {
    const row = await db.prepare("SELECT * FROM quote_requests WHERE id = ?").bind(id).first<Row>();
    return row ? toQuote(row) : null;
  };

  return {
    findById,

    async insert(q) {
      try {
        await db
          .prepare(
            `INSERT INTO quote_requests
             (id, reference, created_at, customer_type, service, scope, frequency, neighbourhood, landmark,
              name, phone, organisation, email, po_reference, status, notify_status, notify_tries)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          )
          .bind(
            q.id, q.reference, q.createdAt, q.customerType, q.service, q.scope ?? null, q.frequency ?? null,
            q.neighbourhood, q.landmark ?? null, q.name, q.phone, q.organisation ?? null, q.email ?? null,
            q.poReference ?? null, q.status, q.notifyStatus, q.notifyTries,
          )
          .run();
        return true;
      } catch (err) {
        if (String(err).includes("quote_requests.reference")) return false;
        throw err;
      }
    },

    async recordNotify(id, status, countTry) {
      await db
        .prepare("UPDATE quote_requests SET notify_status = ?, notify_tries = notify_tries + ? WHERE id = ?")
        .bind(status, countTry ? 1 : 0, id)
        .run();
    },

    async pendingNotify(limit, maxTries) {
      const { results } = await db
        .prepare(
          "SELECT * FROM quote_requests WHERE notify_status IN ('pending','failed') AND notify_tries < ? ORDER BY created_at ASC LIMIT ?",
        )
        .bind(maxTries, limit)
        .all<Row>();
      return results.map(toQuote);
    },

    async list(status, limit) {
      const stmt = status
        ? db.prepare("SELECT * FROM quote_requests WHERE status = ? ORDER BY created_at DESC LIMIT ?").bind(status, limit)
        : db.prepare("SELECT * FROM quote_requests ORDER BY created_at DESC LIMIT ?").bind(limit);
      const { results } = await stmt.all<Row>();
      return results.map(toQuote);
    },

    async updateStatus(id, status) {
      const res = await db.prepare("UPDATE quote_requests SET status = ? WHERE id = ?").bind(status, id).run();
      return res.meta.changes > 0 ? findById(id) : null;
    },
  };
}
