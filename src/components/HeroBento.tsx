import { Link } from "react-router";
import { company, fact } from "../content/company";
import { services } from "../content/services";
import { Button, ButtonLink } from "./Button";
import { Asterisk } from "./PageHeader";

/** Full-bleed viewport-height hero bar matching the menu bar width and wrapping container alignment. */
export function HeroBento() {
  const address = fact(company.address);

  return (
    <section className="hero-visual-tile on-navy group relative flex overflow-hidden bg-navy text-white md:min-h-[calc(100svh-4.5rem)] md:items-center">
      <div aria-hidden="true" className="hero-backdrop pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="hero-scrim pointer-events-none absolute inset-0" />

      <div className="wrap relative z-10 grid gap-10 py-16 md:grid-cols-[1.25fr_1fr] md:items-end md:py-20 lg:gap-12">
        <div>
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-navy/90 px-3.5 py-1.5 font-display text-xs font-bold uppercase tracking-[0.12em] text-white">
            <span aria-hidden="true" className="size-2 rounded-full bg-sun" />
            <span>{address ?? "Juba, South Sudan"}</span>
          </p>

          <div className="mt-5 flex items-center gap-3.5">
            <Asterisk className="asterisk-spin size-8 shrink-0 text-sun" />
            <p className="max-w-xs text-sm leading-snug text-slate-200">
              Compounds, offices, clinics and family homes across Juba
            </p>
          </div>

          <h1 className="hero-rise hero-rise-1 mt-6 text-[2.45rem] font-bold leading-[1.0] tracking-[-0.035em] sm:text-5xl lg:text-[3.65rem]">
            Cleaner compounds. Fewer mosquitoes. Waste gone on schedule.
          </h1>

          <p className="hero-rise hero-rise-2 mt-5 max-w-xl text-base text-slate-200 sm:text-lg">
            Clean World is a Juba company that cleans, fumigates and collects waste for organisations and
            households. Tell us what you need and we will call you back with a quotation.
          </p>

          <div className="hero-rise hero-rise-3 mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink to="/quote" tone="sun">
              Request a quote
            </ButtonLink>
            <ButtonLink to="/services" tone="outline-light" withArrow={false}>
              See services
            </ButtonLink>
          </div>
        </div>

        <form
          action="/quote"
          method="get"
          className="hero-rise hero-rise-3 hidden rounded-[var(--radius-panel)] border border-line/80 bg-paper p-6 text-ink shadow-2xl md:block"
          aria-labelledby="slip-title"
        >
          <h2 id="slip-title" className="text-2xl font-bold">
            Start a quote request
          </h2>
          <label htmlFor="slip-service" className="mt-4 block font-medium">
            What do you need?
          </label>
          <select
            id="slip-service"
            name="service"
            defaultValue={services[0].slug}
            className="mt-2 min-h-12 w-full rounded-[var(--radius-control)] border border-line bg-white px-3.5 text-base"
          >
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
          <Button type="submit" tone="leaf" withArrow className="mt-5 w-full justify-between">
            Continue
          </Button>
          <p className="mt-4 text-sm text-muted">
            No payment on this website. See{" "}
            <Link to="/services" className="font-medium text-sky underline underline-offset-4 hover:decoration-2">
              all services
            </Link>
            .
          </p>
        </form>
      </div>
    </section>
  );
}
