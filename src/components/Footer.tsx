import { Link } from "react-router";
import { company, COPYRIGHT_YEAR, fact } from "../content/company";
import { services } from "../content/services";
import { telLink, whatsappLink } from "../lib/whatsapp";
import { Asterisk } from "./PageHeader";
import { Wordmark } from "./Wordmark";

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
        <div>
          <div className="flex items-center gap-3">
            <Wordmark light />
            <Asterisk className="size-5 text-sun" />
          </div>
          <p className="mt-4 max-w-sm text-slate-300">
            Cleaning, fumigation and waste collection in Juba, South Sudan.
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
