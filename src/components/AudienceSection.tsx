import { ButtonLink } from "./Button";
import { CardPhoto } from "./CardPhoto";
import { Eyebrow } from "./PageHeader";
import { Reveal } from "./Reveal";

interface AudienceGroup {
  kind: "organisation" | "household";
  title: string;
  body: string;
  steps: string[];
  cta: string;
  tone: "sky" | "leaf";
}

const AUDIENCES: AudienceGroup[] = [
  {
    kind: "organisation",
    title: "Organisations",
    body: "NGOs, UN agencies, embassies, hotels, clinics and companies. You get a written quotation, we work to your purchase order, and you pay by bank transfer against an invoice.",
    steps: ["Written quotation", "Purchase order", "Work & invoice", "Bank transfer"],
    cta: "Request a quote for an organisation",
    tone: "sky",
  },
  {
    kind: "household",
    title: "Households",
    body: "Homes and family compounds. Send a request, we confirm the price by phone or WhatsApp, and you pay in cash or by mobile money when the work is done.",
    steps: ["Send a request", "Phone or WhatsApp price", "Work completed", "Cash or mobile money"],
    cta: "Request a quote for your home",
    tone: "leaf",
  },
];

/** Two-column customer-type cards contrasting institutional procurement and household booking flows. */
export function AudienceSection() {
  return (
    <section className="border-y border-line bg-white" aria-labelledby="who-title">
      <div className="wrap py-16 md:py-24">
        <Reveal>
          <Eyebrow>Two ways we work</Eyebrow>
          <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-8">
            <h2 id="who-title" className="text-3xl font-bold md:text-4xl">
              Who we work with
            </h2>
            <p className="max-w-md text-muted">
              Whether you need formal procurement paperwork or a quick price by phone, the process fits how you pay.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {AUDIENCES.map((item, idx) => (
            <Reveal key={item.kind} delay={idx * 0.1} className="flex">
              <article className="audience-card flex-1" data-audience={item.kind}>
                <div className="audience-stage relative m-2.5 aspect-[16/10] overflow-hidden rounded-[calc(var(--radius-bento)-0.5rem)]">
                  <CardPhoto photo={`audience-${item.kind}`} sizes="(min-width: 1024px) 540px, 92vw" />
                </div>

                <div className="flex flex-1 flex-col p-6 pt-4 sm:p-7 sm:pt-5">
                  <h3 className="text-2xl font-bold text-ink md:text-3xl">{item.title}</h3>
                  <p className="mt-3 text-muted">{item.body}</p>

                  <div className="relative mt-6">
                    <div
                      aria-hidden="true"
                      className="audience-rail-fill pointer-events-none absolute left-4 right-4 top-5 z-0 hidden h-0.5 sm:block"
                    />
                    <ol role="list" className="relative z-10 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      {item.steps.map((step, stepIdx) => (
                        <li
                          key={step}
                          className="audience-step rounded-[var(--radius-control)] border border-line bg-white p-3"
                        >
                          <span aria-hidden="true" className="audience-step-num block font-display text-xs font-bold tracking-[0.1em]">
                            0{stepIdx + 1}
                          </span>
                          <span className="mt-1 block text-xs font-semibold leading-snug text-ink">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="mt-auto pt-6">
                    <ButtonLink to="/quote" tone={item.tone} className="w-full justify-between">
                      {item.cta}
                    </ButtonLink>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
