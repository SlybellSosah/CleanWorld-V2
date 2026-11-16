import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { type LinksFunction } from "react-router";
import { Link } from "react-router";
import { AudienceSection } from "../components/AudienceSection";
import { ButtonLink } from "../components/Button";
import { CardPhoto, type CardPhotoKey } from "../components/CardPhoto";
import { HeroBento } from "../components/HeroBento";
import { Asterisk, Eyebrow, QuoteBand } from "../components/PageHeader";
import { Reveal } from "../components/Reveal";
import { company, fact } from "../content/company";
import { metaFor } from "../content/meta";
import { services } from "../content/services";

export const links: LinksFunction = () => [
  {
    rel: "preload",
    as: "image",
    type: "image/avif",
    href: "/hero-juba-1x.avif",
    imageSrcSet: "/hero-juba-1x.avif 1x, /hero-juba-2x.avif 2x",
    ...({ fetchPriority: "high" } as Record<string, string>),
  },
];

export const meta = () =>
  metaFor({
    title: "Clean World Inc. — Cleaning, fumigation and waste services in Juba",
    description:
      "Clean World cleans, fumigates and collects waste for organisations and households in Juba, South Sudan. Request a quote and we will call you back.",
    path: "/",
  });

const STEPS = [
  { title: "Send a request", text: "Tell us what you need and where. It takes about two minutes." },
  { title: "We call you back", text: "We confirm the details by phone or WhatsApp and visit the site if the job needs it." },
  { title: "You get a quotation", text: "A written price for the work, with how long it is valid." },
  { title: "We do the work, then you pay", text: "Cash, mobile money or bank transfer. Never on this website." },
];

const REASONS = [
  {
    title: "Mosquitoes breed in standing water",
    text: "Malaria is the most common reason people in South Sudan visit a clinic. Clearing and treating breeding sites around a building protects everyone inside it.",
  },
  {
    title: "Dirty surfaces and water spread disease",
    text: "Cholera and typhoid spread through contaminated water and hands. Regular cleaning and disinfection of kitchens, washrooms and water points cuts that risk.",
  },
  {
    title: "Uncollected waste brings pests and floods",
    text: "Most of Juba's waste is never collected. It feeds rats and flies and blocks drains when the rains come.",
  },
];

export default function Home() {
  const reduceMotion = useReducedMotion() === true;
  const founderName = fact(company.founderName);
  const founderQuote = fact(company.founderQuote);
  const founderRole = fact(company.founderRole);

  return (
    <>
      <HeroBento reduceMotion={reduceMotion} />

      <section className="relative overflow-x-clip py-16 md:py-22" aria-labelledby="what-title">
        <div aria-hidden="true" className="pointer-events-none absolute right-6 top-10 hidden text-leaf/10 md:block">
          <Asterisk className="size-36" />
        </div>
        <div className="wrap relative">
          <Reveal>
            <Eyebrow>Services in Juba</Eyebrow>
            <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-8">
              <h2 id="what-title" className="text-3xl font-bold md:text-4xl">
                What we do
              </h2>
              <p className="max-w-md text-muted">
                Five practical services for compounds, offices and homes, each priced by written quotation.
              </p>
            </div>
          </Reveal>
          <ul role="list" className="service-grid mt-10">
            {services.map((s, i) => (
              <m.li
                key={s.slug}
                className="service-card-item"
                initial={{ opacity: 0, y: 16 }}
                animate={reduceMotion ? { opacity: 1, y: 0 } : undefined}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: "easeOut", delay: i * 0.07 }}
                whileTap={reduceMotion ? undefined : { scale: 0.99 }}
              >
                <Link to={`/services/${s.slug}`} className="service-card group" data-service={s.slug}>
                  <div className="service-card-stage relative m-2.5 aspect-[16/10] overflow-hidden rounded-[calc(var(--radius-bento)-0.5rem)]">
                    <CardPhoto
                      photo={`service-${s.slug}` as CardPhotoKey}
                      sizes="(min-width: 1024px) 520px, (min-width: 768px) 46vw, 92vw"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/35 via-transparent to-navy/25"
                    />
                    <div className="absolute inset-x-3.5 top-3.5 z-10 flex items-center justify-between gap-2">
                      <span
                        aria-hidden="true"
                        className="inline-flex items-center rounded-full border border-ink/10 bg-white/95 px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.1em] text-ink shadow-xs"
                      >
                        0{i + 1} · {s.short}
                      </span>
                      <span aria-hidden="true" className="service-card-arrow shadow-xs">
                        <ArrowUpRight className="btn-arrow-a size-4" aria-hidden="true" />
                        <ArrowUpRight className="btn-arrow-b size-4" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                  <h3 className="px-6 pt-3 text-xl font-bold text-ink transition-colors group-hover:text-leaf md:text-2xl">
                    {s.title}
                  </h3>
                  <p className="px-6 pt-2.5 text-muted">{s.summary}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-line/70 px-6 py-4 text-sm">
                    <span className="font-display text-xs font-bold uppercase tracking-[0.12em] text-sky group-hover:text-leaf-deep">
                      Details
                    </span>
                    <span aria-hidden="true" className="font-display text-xs font-medium text-muted">
                      {s.goodFor[0]}
                    </span>
                  </div>
                </Link>
              </m.li>
            ))}
          </ul>
        </div>
      </section>

      <AudienceSection reduceMotion={reduceMotion} />

      <section className="wrap py-16 md:py-22" aria-labelledby="how-title">
        <Reveal>
          <Eyebrow>Four-step process</Eyebrow>
          <h2 id="how-title" className="mt-3 text-3xl font-bold md:text-4xl">
            How it works
          </h2>
        </Reveal>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="bento-card bento-lift p-6">
              <Reveal delay={i * 0.08}>
                <div className="flex items-center justify-between">
                  <span
                    aria-hidden="true"
                    className="inline-flex items-center rounded-full border border-line bg-paper px-3 py-1 font-display text-xs font-bold tracking-[0.14em] text-leaf-deep"
                  >
                    0{i + 1}
                  </span>
                  <Asterisk className="size-4 text-leaf" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-muted">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <ButtonLink to="/how-to-pay" tone="outline">
            How payment works
          </ButtonLink>
        </div>
      </section>

      <section className="on-navy relative overflow-hidden bg-navy text-white" aria-labelledby="why-title">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_18%,rgb(4_120_87_/_0.22),transparent_48%)]"
        />
        <div className="wrap relative py-16 md:py-24">
          <Reveal>
            <Eyebrow tone="dark">Public health in Juba</Eyebrow>
            <h2 id="why-title" className="mt-3 max-w-2xl text-3xl font-bold md:text-4xl">
              Why this work matters in Juba
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {REASONS.map((r, i) => (
              <div
                key={r.title}
                className="rounded-[var(--radius-panel)] border border-white/12 bg-navy-soft p-6 transition-colors hover:border-sun/50"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex rounded-full border border-sun/35 bg-navy px-3 py-1 font-display text-xs font-bold tracking-[0.14em] text-sun"
                >
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-xl font-semibold">{r.title}</h3>
                <p className="mt-3 text-slate-300">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {founderName && founderQuote && (
        <section className="wrap py-14 md:py-20" aria-label="From the founder">
          <figure className="bento-card relative overflow-hidden p-7 sm:p-10 md:p-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Eyebrow>From the founder</Eyebrow>
              <span
                aria-hidden="true"
                className="inline-flex size-11 items-center justify-center rounded-full bg-sun text-navy"
              >
                <Asterisk className="size-5" />
              </span>
            </div>
            <blockquote className="mt-5 max-w-3xl font-display text-2xl font-semibold leading-snug tracking-[-0.025em] md:text-3xl">
              “{founderQuote}”
            </blockquote>
            <figcaption className="mt-5 font-display text-sm font-semibold text-muted">
              {founderName}
              {founderRole ? ` · ${founderRole}` : ""}
            </figcaption>
          </figure>
        </section>
      )}

      <QuoteBand heading="Tell us what you need. We will call you back." />
    </>
  );
}
