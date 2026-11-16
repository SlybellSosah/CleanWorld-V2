import { metaFor } from "../content/meta";
import { QuoteForm } from "../features/quote/QuoteForm";

export const meta = () =>
  metaFor({
    title: "Request a quote — Clean World Inc.",
    description: "Tell Clean World what you need and where in Juba. We call you back with a quotation. No payment on this website.",
    path: "/quote",
  });

export default function Quote() {
  return (
    <div className="wrap grid gap-12 py-12 md:grid-cols-[1.5fr_1fr] md:py-16">
      <div>
        <h1 className="text-4xl font-bold md:text-5xl">Request a quote</h1>
        <p className="prose-block mt-4 text-lg text-muted">Four short steps. We call you back with a price. You pay nothing here.</p>
        <div className="mt-10 max-w-xl">
          <QuoteForm />
        </div>
      </div>
      <aside className="self-start rounded-lg border border-line bg-white p-6 md:sticky md:top-24">
        <h2 className="text-xl font-semibold">Good to know</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
          <li>Your answers are saved on this device until you send them.</li>
          <li>We never ask for payment or a PIN on this website.</li>
          <li>Organisations receive a written quotation.</li>
        </ul>
      </aside>
    </div>
  );
}
