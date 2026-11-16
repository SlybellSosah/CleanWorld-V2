import { ButtonLink } from "./Button";

export function Asterisk({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
    </svg>
  );
}

export function Eyebrow({
  tone = "light",
  className = "",
  children,
}: {
  tone?: "light" | "dark";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={`eyebrow ${tone === "dark" ? "text-mist" : "text-leaf-deep"} ${className}`.trim()}>
      <Asterisk className={`asterisk-spin size-3.5 shrink-0 ${tone === "dark" ? "text-sun" : "text-leaf"}`} />
      <span className="eyebrow-label">{children}</span>
    </p>
  );
}

export function PageHeader({
  title,
  lead,
  eyebrow = "Clean World · Juba",
}: {
  title: string;
  lead?: string;
  eyebrow?: string;
}) {
  return (
    <div className="bento-ambient pt-4 pb-8 md:pt-6 md:pb-10">
      <div className="wrap">
        <div className="bento-card group relative overflow-hidden p-7 sm:p-10 md:p-12">
          <Asterisk className="asterisk-spin pointer-events-none absolute -right-6 -top-6 hidden size-36 text-leaf/10 sm:block" />
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="relative mt-4 max-w-3xl text-4xl font-bold md:text-5xl">{title}</h1>
          {lead && <p className="prose-block relative mt-4 text-lg text-muted">{lead}</p>}
        </div>
      </div>
    </div>
  );
}

export function QuoteBand({ heading, to = "/quote", label = "Request a quote" }: { heading: string; to?: string; label?: string }) {
  return (
    <section className="wrap py-8 md:py-12">
      <div className="on-navy group relative overflow-hidden rounded-[var(--radius-bento)] bg-navy px-7 py-10 text-white sm:px-10 md:flex md:items-center md:justify-between md:gap-10 md:px-14 md:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgb(4_120_87_/_0.28),transparent_55%)]"
        />
        <div className="relative max-w-xl">
          <Eyebrow tone="dark">Written quotation · Juba</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">{heading}</h2>
        </div>
        <ButtonLink to={to} tone="sun" className="relative mt-6 shrink-0 md:mt-0">
          {label}
        </ButtonLink>
      </div>
    </section>
  );
}
