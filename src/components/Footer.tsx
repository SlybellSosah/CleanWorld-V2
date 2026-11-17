import { Link } from "react-router";
import { company, COPYRIGHT_YEAR, fact } from "../content/company";
import { services } from "../content/services";
import { telLink, whatsappLink } from "../lib/whatsapp";

const MANTRA_WORDS = [
  { text: "Clean.", color: "text-sky-400 hover:drop-shadow-[0_4px_12px_rgba(56,189,248,0.45)]" },
  { text: "Green.", color: "text-lime-400 hover:drop-shadow-[0_4px_12px_rgba(163,230,53,0.45)]" },
  { text: "Sustainable.", color: "text-emerald-300 hover:drop-shadow-[0_4px_12px_rgba(110,231,183,0.45)]" },
] as const;

export function Footer() {
  const companyName = fact(company.name) ?? "Clean World Inc.";
  const phone = fact(company.phone);
  const whatsapp = fact(company.whatsapp);
  const email = fact(company.email);
  const address = fact(company.address);
  const hasContact = phone || whatsapp || email || address;

  return (
    <footer className="on-navy border-t border-white/10 bg-navy pb-28 pt-14 text-slate-200 md:pb-14 md:pt-16">
      <div className="wrap grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col items-center text-center">
          <img
            src="/logo.jpg"
            alt={companyName}
            width={192}
            height={192}
            className="size-44 rounded-2xl object-contain shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:scale-110 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:transform-none sm:size-48"
          />
          <p className="mt-5 flex flex-wrap items-center justify-center gap-x-2.5 font-display text-base font-bold tracking-[0.02em] sm:text-lg">
            {MANTRA_WORDS.map(({ text, color }) => (
              <span
                key={text}
                className={`inline-block cursor-default transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:scale-125 motion-reduce:transition-none motion-reduce:hover:transform-none ${color}`}
              >
                {text}
              </span>
            ))}
          </p>
        </div>

        <nav aria-label="Services">
          <h2 className="font-display text-xs font-bold uppercase tracking-[0.14em] text-mist">Services</h2>
          <ul className="mt-3 space-y-1">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`} className="inline-block py-1.5 hover:text-white hover:underline">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-xs font-bold uppercase tracking-[0.14em] text-mist">
            {hasContact ? "Contact" : "More"}
          </h2>
          <ul className="mt-3 space-y-1">
            {phone && (
              <li>
                <a href={telLink(phone)} className="inline-block py-1.5 hover:text-white hover:underline">
                  Call {phone}
                </a>
              </li>
            )}
            {whatsapp && (
              <li>
                <a href={whatsappLink(whatsapp)} target="_blank" rel="noopener" className="inline-block py-1.5 hover:text-white hover:underline">
                  WhatsApp {whatsapp}
                </a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`} className="inline-block py-1.5 hover:text-white hover:underline">
                  {email}
                </a>
              </li>
            )}
            {address && <li className="py-1.5">{address}</li>}
            <li>
              <Link to="/quote" className="inline-block py-1.5 hover:text-white hover:underline">
                Request a quote
              </Link>
            </li>
            <li>
              <Link to="/how-to-pay" className="inline-block py-1.5 hover:text-white hover:underline">
                How to pay
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="inline-block py-1.5 hover:text-white hover:underline">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="wrap mt-10 border-t border-white/15 pt-6 text-sm text-slate-400">
        © {COPYRIGHT_YEAR} {companyName}
      </p>
    </footer>
  );
}
