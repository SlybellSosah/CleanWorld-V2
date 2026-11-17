import { Eyebrow } from "../components/PageHeader";
import { company, fact } from "../content/company";
import { metaFor } from "../content/meta";
import { QuoteForm } from "../features/quote/QuoteForm";
import { telLink, whatsappLink } from "../lib/whatsapp";

export const meta = () =>
  metaFor({
    title: "Request a quote — Clean World Inc.",
    description: "Tell Clean World what you need and where in Juba. We call you back with a price. No payment on this website.",
    path: "/quote",
  });

export default function Quote() {
  const whatsapp = fact(company.whatsapp);
  const phone = fact(company.phone);

  return (
    <div className="bento-ambient py-8 md:py-12">
      <div className="wrap grid gap-8 md:grid-cols-[1.5fr_1fr]">
        <div className="bento-card p-6 sm:p-10">
          <Eyebrow>Free quote · Juba</Eyebrow>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">Request a quote</h1>
          <p className="prose-block mt-4 text-lg text-muted">
            Four short steps. We call you back with a clear price. You pay nothing here.
          </p>
          <div className="mt-8 max-w-xl">
            <QuoteForm />
          </div>
        </div>
        <aside className="bento-card self-start p-6 sm:p-7 md:sticky md:top-24">
          <h2 className="text-xl font-bold">Good to know</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
            <li>Your answers are saved on this device until you send them or start over.</li>
            <li>We never ask for payment or a PIN on this website.</li>
            <li>Organisations receive a stamped written quotation; households get a confirmed price by phone or WhatsApp.</li>
          </ul>
          {(whatsapp || phone) && (
            <div className="mt-6 border-t border-line pt-5">
              <p className="text-sm font-semibold text-ink">Prefer to contact us directly?</p>
              <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
                {whatsapp && (
                  <a
                    href={whatsappLink(whatsapp, "Hello Clean World, I would like a quote.")}
                    target="_blank"
                    rel="noopener"
                    className="link"
                  >
                    Message on WhatsApp
                  </a>
                )}
                {phone && (
                  <a href={telLink(phone)} className="link">
                    Call {phone}
                  </a>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
