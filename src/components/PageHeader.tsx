import { Link } from "react-router";

export function PageHeader({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="border-b border-line bg-white">
      <div className="wrap py-12 md:py-16">
        <h1 className="max-w-3xl text-4xl font-bold md:text-5xl">{title}</h1>
        {lead && <p className="prose-block mt-5 text-lg text-muted">{lead}</p>}
      </div>
    </div>
  );
}

export function QuoteBand({ heading, to = "/quote", label = "Request a quote" }: { heading: string; to?: string; label?: string }) {
  return (
    <section className="on-navy bg-navy text-white">
      <div className="wrap flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between">
        <h2 className="max-w-xl text-3xl font-bold">{heading}</h2>
        <Link to={to} className="inline-flex min-h-12 items-center rounded-md bg-sun px-6 font-display font-semibold text-navy transition-colors hover:bg-white">
          {label}
        </Link>
      </div>
    </section>
  );
}
