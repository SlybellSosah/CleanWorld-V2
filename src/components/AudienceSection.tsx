import { ArrowUpRight } from "lucide-react";
import * as m from "motion/react-m";
import type { PointerEvent } from "react";
import { Link } from "react-router";
import { CardPhoto } from "./CardPhoto";
import { Eyebrow } from "./PageHeader";
import { Reveal } from "./Reveal";

interface AudienceGroup {
  kind: "organisation" | "household";
  title: string;
  body: string;
  steps: string[];
  cta: string;
}

const AUDIENCES: AudienceGroup[] = [
  {
    kind: "organisation",
    title: "Organisations",
    body: "NGOs, UN agencies, embassies, hotels, clinics and companies. You get a written quotation, we work to your purchase order, and you pay by bank transfer against an invoice.",
    steps: ["Written quotation", "Purchase order", "Work & invoice", "Bank transfer"],
    cta: "Request a quote for an organisation",
  },
  {
    kind: "household",
    title: "Households",
    body: "Homes and family compounds. Send a request, we confirm the price by phone or WhatsApp, and you pay in cash or by mobile money when the work is done.",
    steps: ["Send a request", "Phone or WhatsApp price", "Work completed", "Cash or mobile money"],
    cta: "Request a quote for your home",
  },
];

/** Buyer-segment diptych contrasting institutional procurement and household booking flows with realistic photo stages. */
export function AudienceSection({ reduceMotion }: { reduceMotion: boolean }) {
  const handleStagePointer = (e: PointerEvent<HTMLElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mouse-x", `${x.toFixed(1)}%`);
    e.currentTarget.style.setProperty("--mouse-y", `${y.toFixed(1)}%`);
  };

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
            <m.article
              key={item.kind}
              className="audience-card"
              data-audience={item.kind}
              onPointerMove={handleStagePointer}
              initial={{ opacity: 0, y: 16 }}
              animate={reduceMotion ? { opacity: 1, y: 0 } : undefined}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: "easeOut", delay: idx * 0.1 }}
            >
              <div className="audience-stage relative m-2.5 aspect-[16/10] overflow-hidden rounded-[calc(var(--radius-bento)-0.5rem)]">
                <CardPhoto
                  photo={`audience-${item.kind}`}
                  sizes="(min-width: 1024px) 540px, 92vw"
                />
                <div aria-hidden="true" className="audience-spotlight pointer-events-none absolute inset-0" />
              </div>

              <div className="flex flex-1 flex-col p-6 pt-4 sm:p-7 sm:pt-5">
                <h3 className="text-2xl font-bold text-ink md:text-3xl">{item.title}</h3>
                <p className="mt-3 text-muted">{item.body}</p>

                <div className="relative mt-6">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 right-4 top-5 z-0 hidden h-0.5 bg-line sm:block"
                  >
                    <m.div
                      className="audience-rail-fill h-full origin-left"
                      initial={{ scaleX: 0 }}
                      animate={reduceMotion ? { scaleX: 1 } : undefined}
                      whileInView={reduceMotion ? undefined : { scaleX: 1 }}
                      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                      transition={
                        reduceMotion ? { duration: 0 } : { duration: 0.6, ease: "easeOut", delay: 0.15 + idx * 0.1 }
                      }
                    />
                  </div>
                  <ol role="list" className="relative z-10 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {item.steps.map((step, stepIdx) => (
                      <li
                        key={step}
                        className="audience-step rounded-[var(--radius-control)] border border-line bg-white p-3"
                        data-step={stepIdx}
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
                  <Link
                    to="/quote"
                    className="audience-cta inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-full py-1.5 pr-1.5 pl-6 font-display text-[0.9375rem] font-semibold tracking-[-0.01em] text-white"
                  >
                    <span className="btn-label">{item.cta}</span>
                    <span
                      aria-hidden="true"
                      className="audience-cta-disc size-9 shrink-0 rounded-full bg-white text-navy"
                    >
                      <ArrowUpRight className="audience-cta-arrow btn-arrow-a size-4" aria-hidden="true" />
                      <ArrowUpRight className="btn-arrow-b size-4" aria-hidden="true" />
                    </span>
                  </Link>
                </div>
              </div>
            </m.article>
          ))}
        </div>
      </div>
    </section>
  );
}
