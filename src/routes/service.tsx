import { Link, useParams } from "react-router";
import { PageHeader, QuoteBand } from "../components/PageHeader";
import { metaFor } from "../content/meta";
import { serviceBySlug, services } from "../content/services";
import NotFound from "./not-found";

export const meta = ({ params }: { params: { slug?: string } }) => {
  const s = serviceBySlug(params.slug);
  return s
    ? metaFor({ title: `${s.title} in Juba — Clean World Inc.`, description: s.summary, path: `/services/${s.slug}` })
    : metaFor({ title: "Page not found — Clean World Inc.", description: "", path: "/", noindex: true });
};

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="border-l-4 border-leaf pl-4">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ServicePage() {
  const service = serviceBySlug(useParams().slug);
  if (!service) return <NotFound />;
  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHeader title={service.title} lead={service.intro} />
      <div className="wrap grid gap-12 py-12 md:grid-cols-[1.6fr_1fr] md:py-16">
        <div className="space-y-12">
          <List title="What is included" items={service.includes} />
          <List title="How we work" items={service.method} />
          <List title="Safety" items={service.safety} />
        </div>
        <aside className="space-y-8 self-start md:sticky md:top-24">
          <div className="rounded-lg border border-line bg-white p-6">
            <h2 className="text-xl font-semibold">How often</h2>
            <p className="mt-2 text-muted">{service.frequency}</p>
            <h2 className="mt-6 text-xl font-semibold">Good for</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
              {service.goodFor.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
          <nav aria-label="Other services">
            <h2 className="text-xl font-semibold">Other services</h2>
            <ul className="mt-2">
              {others.map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="link inline-block py-2">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
      <QuoteBand
        heading={`Need ${service.short.toLowerCase()}? Tell us about the site.`}
        to={`/quote?service=${service.slug}`}
        label={`Request a quote for ${service.short.toLowerCase()}`}
      />
    </>
  );
}
