import { ShieldAlert } from "lucide-react";
import { PageHeader, QuoteBand } from "../components/PageHeader";
import { company, fact } from "../content/company";
import { metaFor } from "../content/meta";

export const meta = () =>
  metaFor({
    title: "How to pay — Clean World Inc.",
    description: "Pay Clean World by cash, mobile money or bank transfer after we confirm your job. We never take payment on this website.",
    path: "/how-to-pay",
  });

export default function HowToPay() {
  const merchants = fact(company.merchantNumbers) ?? [];

  return (
    <>
      <PageHeader
        title="How to pay"
        lead="We never take payment on this website. You pay after we have confirmed the job and the amount with you."
      />
      <div className="wrap max-w-3xl space-y-12 py-12 md:py-16">
        <div role="note" className="flex gap-4 rounded-lg border-2 border-alert bg-white p-5">
          <ShieldAlert className="mt-1 shrink-0 text-alert" aria-hidden="true" />
          <p>
            <strong>Never type your mobile-money PIN into a website.</strong> Never share it with anyone, including our
            staff. You only ever enter your PIN on your own phone, in your mobile-money menu.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold">Cash</h2>
          <p className="mt-3 text-muted">Pay the team leader when the job is complete. You receive a receipt.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Mobile money</h2>
          {merchants.length > 0 ? (
            <>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {merchants.map((mn) => (
                  <li key={mn.provider} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                    <span className="font-semibold">{mn.provider}</span>
                    <span className="font-mono text-lg">{mn.number}</span>
                    <span className="w-full text-sm text-muted">Registered name: {mn.name}</span>
                  </li>
                ))}
              </ul>
              <ol className="mt-5 list-decimal space-y-2 pl-5 text-muted">
                <li>Wait for our message confirming the amount.</li>
                <li>Pay to the number above from your own phone.</li>
                <li>Send us the confirmation message on WhatsApp.</li>
              </ol>
            </>
          ) : (
            <p className="mt-3 text-muted">
              We accept mobile money. We send you our merchant number together with your confirmed amount, and you pay
              from your own phone.
            </p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Bank transfer, for organisations</h2>
          <p className="mt-3 text-muted">
            We issue a stamped quotation that carries our bank details. You pay against our invoice. We do not publish
            bank details on this website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Receipts and currency</h2>
          <p className="mt-3 text-muted">
            Every payment gets a receipt. Each quotation states its currency and how long the price is valid.
          </p>
        </section>
      </div>
      <QuoteBand heading="Start with a quote request. It is free." />
    </>
  );
}
