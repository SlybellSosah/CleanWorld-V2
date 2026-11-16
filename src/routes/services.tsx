import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { PageHeader, QuoteBand } from "../components/PageHeader";
import { metaFor } from "../content/meta";
import { services } from "../content/services";

export const meta = () =>
  metaFor({
    title: "Services in Juba — Clean World Inc.",
    description: "Fumigation and pest control, cleaning, waste collection, landscaping and environmental consultancy in Juba.",
    path: "/services",
  });

export default function Services() {
  return (
    <>
      <PageHeader
        eyebrow="Services · Juba"
        title="Services"
        lead="Five kinds of work, for organisations and households across Juba. Every job starts with a quote request."
      />
      <ul role="list" className="wrap grid gap-5 py-8 md:grid-cols-2 md:py-12">
        {services.map((s, i) => (
          <li key={s.slug} className="bento-card bento-lift group flex flex-col justify-between p-7">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span
                  aria-hidden="true"
                  className="inline-flex items-center rounded-full border border-line bg-paper px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.12em] text-leaf-deep"
                >
                  0{i + 1} · {s.short}
                </span>
                <span aria-hidden="true" className="service-card-arrow">
                  <ArrowUpRight className="btn-arrow-a size-4" aria-hidden="true" />
                  <ArrowUpRight className="btn-arrow-b size-4" aria-hidden="true" />
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-bold md:text-3xl">
                <Link to={`/services/${s.slug}`} className="transition-colors hover:text-leaf">
                  {s.title}
                </Link>
              </h2>
              <p className="mt-3 text-muted">{s.summary}</p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-line/70 pt-4">
              <Link
                to={`/services/${s.slug}`}
                className="link py-1 font-display text-xs font-bold uppercase tracking-[0.12em]"
                aria-label={`${s.title}: what is included`}
              >
                What is included
              </Link>
              <span aria-hidden="true" className="font-display text-xs font-medium text-muted">
                {s.goodFor[0]}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <QuoteBand heading="Not sure which service you need? Describe the problem and we will advise." />
    </>
  );
}
