import * as m from "motion/react-m";
import { Link } from "react-router";
import { ButtonLink, buttonClass } from "../components/Button";
import { QuoteBand } from "../components/PageHeader";
import { Reveal } from "../components/Reveal";
import { company, fact } from "../content/company";
import { metaFor } from "../content/meta";
import { services } from "../content/services";

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

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

export default function Home() {
  const founderName = fact(company.founderName);
  const founderQuote = fact(company.founderQuote);
  const founderRole = fact(company.founderRole);

  return (
    <>
      <section className="on-navy relative overflow-hidden bg-navy text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full border-[3rem] border-leaf/25" />
        <div className="wrap relative grid gap-12 py-16 md:grid-cols-[1.25fr_1fr] md:items-end md:py-24">
          <div>
            <m.h1 {...rise(0)} className="text-[2.6rem] font-bold leading-[1.02] sm:text-6xl lg:text-7xl">
              Cleaner compounds. Fewer mosquitoes. Waste gone on schedule.
            </m.h1>
            <m.p {...rise(0.12)} className="mt-6 max-w-xl text-lg text-slate-300">
              Clean World is a Juba company that cleans, fumigates and collects waste for organisations and households.
              Tell us what you need and we will call you back with a quotation.
            </m.p>
            <m.div {...rise(0.22)} className="mt-8 flex flex-wrap gap-3 md:hidden">
              <ButtonLink to="/quote" tone="sun">
                Request a quote
              </ButtonLink>
              <ButtonLink to="/services" tone="outline-light">
                See services
              </ButtonLink>
            </m.div>
          </div>

          <m.form
            {...rise(0.22)}
            action="/quote"
            method="get"
            className="hidden rounded-lg bg-paper p-6 text-ink shadow-2xl md:block"
            aria-labelledby="slip-title"
          >
            <h2 id="slip-title" className="text-2xl font-bold">
              Start a quote request
            </h2>
            <label htmlFor="slip-service" className="mt-5 block font-medium">
              What do you need?
            </label>
            <select
              id="slip-service"
              name="service"
              defaultValue={services[0].slug}
              className="mt-2 min-h-12 w-full rounded-md border border-line bg-white px-3 text-base"
            >
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </select>
            <button type="submit" className={buttonClass("leaf", "mt-5 w-full")}>
              Continue
            </button>
            <p className="mt-4 text-sm text-muted">
              No payment on this website. See <Link to="/services" className="text-sky underline underline-offset-4">all services</Link>.
            </p>
          </m.form>
        </div>
      </section>

      <section className="wrap py-16 md:py-24" aria-labelledby="what-title">
        <Reveal>
          <h2 id="what-title" className="text-3xl font-bold md:text-4xl">
            What we do
          </h2>
        </Reveal>
        <ul className="mt-8 border-t border-ink">
          {services.map((s) => (
            <li key={s.slug} className="border-b border-line">
              <Link
                to={`/services/${s.slug}`}
                className="group grid gap-2 py-6 md:grid-cols-[1fr_1.4fr_auto] md:items-baseline md:gap-8"
              >
                <h3 className="text-2xl font-semibold group-hover:text-leaf md:text-3xl">{s.title}</h3>
                <p className="text-muted">{s.summary}</p>
                <span className="font-medium text-sky underline underline-offset-4">Details</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-line bg-white" aria-labelledby="who-title">
        <div className="wrap py-16 md:py-24">
          <Reveal>
            <h2 id="who-title" className="text-3xl font-bold md:text-4xl">
              Who we work with
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <h3 className="text-2xl font-semibold">Organisations</h3>
              <p className="mt-3 text-muted">
                NGOs, UN agencies, embassies, hotels, clinics and companies. You get a written quotation, we work to
                your purchase order, and you pay by bank transfer against an invoice.
              </p>
              <Link to="/quote" className="link mt-4 inline-block py-2 font-medium">
                Request a quote for an organisation
              </Link>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Households</h3>
              <p className="mt-3 text-muted">
                Homes and family compounds. Send a request, we confirm the price by phone or WhatsApp, and you pay in
                cash or by mobile money when the work is done.
              </p>
              <Link to="/quote" className="link mt-4 inline-block py-2 font-medium">
                Request a quote for your home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap py-16 md:py-24" aria-labelledby="how-title">
        <Reveal>
          <h2 id="how-title" className="text-3xl font-bold md:text-4xl">
            How it works
          </h2>
        </Reveal>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 0.08}>
                <span className="font-display text-5xl font-bold text-leaf">{i + 1}</span>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-muted">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        <p className="mt-10">
          <Link to="/how-to-pay" className="link font-medium">
            How payment works
          </Link>
        </p>
      </section>

      <section className="on-navy bg-navy-soft text-white" aria-labelledby="why-title">
        <div className="wrap py-16 md:py-24">
          <Reveal>
            <h2 id="why-title" className="max-w-2xl text-3xl font-bold md:text-4xl">
              Why this work matters in Juba
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {REASONS.map((r) => (
              <div key={r.title} className="border-t-4 border-leaf pt-5">
                <h3 className="text-xl font-semibold">{r.title}</h3>
                <p className="mt-3 text-slate-300">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {founderName && founderQuote && (
        <section className="wrap py-16 md:py-24" aria-label="From the founder">
          <figure className="max-w-3xl">
            <blockquote className="font-display text-2xl font-medium leading-snug md:text-3xl">“{founderQuote}”</blockquote>
            <figcaption className="mt-5 text-muted">
              {founderName}
              {founderRole ? `, ${founderRole}` : ""}
            </figcaption>
          </figure>
        </section>
      )}

      <QuoteBand heading="Tell us what you need. We will call you back." />
    </>
  );
}
