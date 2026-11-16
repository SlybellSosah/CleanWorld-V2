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
      <PageHeader title="Services" lead="Five kinds of work, for organisations and households across Juba. Every job starts with a quote request." />
      <ul className="wrap grid gap-x-12 py-12 md:grid-cols-2 md:py-16">
        {services.map((s) => (
          <li key={s.slug} className="border-b border-line py-8">
            <h2 className="text-2xl font-semibold md:text-3xl">
              <Link to={`/services/${s.slug}`} className="hover:text-leaf">
                {s.title}
              </Link>
            </h2>
            <p className="mt-3 text-muted">{s.summary}</p>
            <Link to={`/services/${s.slug}`} className="link mt-3 inline-block py-2 font-medium" aria-label={`${s.title}: what is included`}>
              What is included
            </Link>
          </li>
        ))}
      </ul>
      <QuoteBand heading="Not sure which service you need? Describe the problem and we will advise." />
    </>
  );
}
