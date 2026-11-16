import { useCallback, useEffect, useState } from "react";
import { metaFor } from "../content/meta";
import { serviceTitle } from "../content/services";
import { telLink } from "../lib/whatsapp";
import { QUOTE_STATUSES, type ApiResponse, type QuoteRequest, type QuoteStatus } from "../types";

export const meta = () => metaFor({ title: "Requests — Clean World staff", description: "", path: "/admin", noindex: true });

type Load = { state: "loading" } | { state: "error"; message: string } | { state: "ready"; quotes: QuoteRequest[] };

const LOAD_ERRORS: Record<number, string> = {
  401: "You are not signed in as staff.",
  503: "Staff sign-in is not set up yet.",
};

const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

export default function Admin() {
  const [filter, setFilter] = useState<QuoteStatus | "all">("all");
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    setLoad({ state: "loading" });
    try {
      const res = await fetch(`/api/admin/quotes${filter === "all" ? "" : `?status=${filter}`}`);
      const json = (await res.json()) as ApiResponse<{ quotes: QuoteRequest[] }>;
      if (json.status === "success") setLoad({ state: "ready", quotes: json.data.quotes });
      else setLoad({ state: "error", message: LOAD_ERRORS[res.status] ?? "Could not load requests." });
    } catch {
      setLoad({ state: "error", message: "Could not load requests." });
    }
  }, [filter]);

  useEffect(() => void refresh(), [refresh]);

  const changeStatus = async (quote: QuoteRequest, status: QuoteStatus) => {
    if (load.state !== "ready") return;
    const previous = load.quotes;
    setNotice("");
    setLoad({ state: "ready", quotes: previous.map((q) => (q.id === quote.id ? { ...q, status } : q)) });
    try {
      const res = await fetch(`/api/admin/quotes/${quote.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setLoad({ state: "ready", quotes: previous });
      setNotice(`Could not update ${quote.reference}. It is still "${quote.status}".`);
    }
  };

  const waiting = load.state === "ready" ? load.quotes.filter((q) => q.notifyStatus !== "sent").length : 0;

  return (
    <div className="wrap py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold md:text-4xl">Quote requests</h1>
        <div>
          <label htmlFor="filter" className="mr-2 font-medium">
            Show
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as QuoteStatus | "all")}
            className="min-h-12 rounded-md border border-line bg-white px-3"
          >
            <option value="all">All</option>
            {QUOTE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {waiting > 0 && (
        <p role="status" className="mt-6 rounded-md border-2 border-alert bg-white p-4 font-medium">
          {waiting} {waiting === 1 ? "request has" : "requests have"} not been emailed to staff. Check {waiting === 1 ? "it" : "them"} here.
        </p>
      )}
      {notice && (
        <p role="alert" className="mt-6 rounded-md border-2 border-alert bg-white p-4 font-medium">
          {notice}
        </p>
      )}

      {load.state === "loading" && <p className="mt-8 text-muted">Loading requests…</p>}
      {load.state === "error" && (
        <p role="alert" className="mt-8 text-lg font-medium">
          {load.message}
        </p>
      )}
      {load.state === "ready" && load.quotes.length === 0 && <p className="mt-8 text-muted">No requests yet. New requests appear here as soon as they are sent.</p>}

      {load.state === "ready" && load.quotes.length > 0 && (
        <ul className="mt-8 border-t border-ink">
          {load.quotes.map((q) => (
            <li key={q.id} className="border-b border-line py-4">
              <details>
                <summary className="grid cursor-pointer gap-x-6 gap-y-1 py-2 md:grid-cols-[10rem_1fr_1fr_auto] md:items-baseline">
                  <span className="font-mono font-semibold">{q.reference}</span>
                  <span>
                    {q.organisation ?? q.name}
                    <span className="block text-sm text-muted">{when(q.createdAt)}</span>
                  </span>
                  <span>
                    {serviceTitle(q.service)}
                    <span className="block text-sm text-muted">{q.neighbourhood}</span>
                  </span>
                  <span className="text-sm">
                    {q.status}
                    {q.notifyStatus !== "sent" && <span className="ml-2 font-semibold text-alert">not emailed</span>}
                  </span>
                </summary>
                <dl className="mt-3 grid gap-x-8 gap-y-2 rounded-md bg-white p-4 sm:grid-cols-2">
                  {(
                    [
                      ["Name", q.name],
                      ["Phone", q.phone],
                      ["Organisation", q.organisation],
                      ["Email", q.email],
                      ["PO / tender ref", q.poReference],
                      ["Customer", q.customerType],
                      ["Details", q.scope],
                      ["How often", q.frequency],
                      ["Landmark", q.landmark],
                    ] as const
                  )
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-sm text-muted">{k}</dt>
                        <dd className="whitespace-pre-wrap break-words">
                          {k === "Phone" ? (
                            <a href={telLink(v!)} className="link">
                              {v}
                            </a>
                          ) : (
                            v
                          )}
                        </dd>
                      </div>
                    ))}
                  <div>
                    <dt className="text-sm text-muted">
                      <label htmlFor={`status-${q.id}`}>Status</label>
                    </dt>
                    <dd>
                      <select
                        id={`status-${q.id}`}
                        value={q.status}
                        onChange={(e) => void changeStatus(q, e.target.value as QuoteStatus)}
                        className="mt-1 min-h-12 rounded-md border border-line bg-white px-3"
                      >
                        {QUOTE_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </dd>
                  </div>
                </dl>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
