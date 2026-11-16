import { Eyebrow } from "../components/PageHeader";
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
    <div className="bento-ambient py-8 md:py-12">
      <div className="wrap grid gap-8 md:grid-cols-[1.5fr_1fr]">
        <div className="bento-card p-6 sm:p-10">
          <Eyebrow>Free quotation · Juba</Eyebrow>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">Request a quote</h1>
          <p className="prose-block mt-4 text-lg text-muted">
            Four short steps. We call you back with a price. You pay nothing here.
          </p>
          <div className="mt-8 max-w-xl">
            <QuoteForm />
          </div>
        </div>
        <aside className="bento-card self-start p-6 sm:p-7 md:sticky md:top-24">
          <h2 className="text-xl font-bold">Good to know</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
            <li>Your answers are saved on this device until you send them.</li>
            <li>We never ask for payment or a PIN on this website.</li>
            <li>Organisations receive a written quotation.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
