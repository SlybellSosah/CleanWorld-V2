import { Menu, Phone, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { company, fact } from "../content/company";
import { telLink } from "../lib/whatsapp";
import { ButtonLink } from "./Button";
import { Wordmark } from "./Wordmark";

const LINKS = [
  { to: "/services", label: "Services" },
  { to: "/how-to-pay", label: "How to pay" },
];

export function Header() {
  const dialog = useRef<HTMLDialogElement>(null);
  const { pathname } = useLocation();
  const phone = fact(company.phone);

  const closeMenu = () => dialog.current?.close();
  useEffect(() => closeMenu(), [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-white/95 backdrop-blur">
      <div className="wrap flex h-18 items-center justify-between gap-4">
        <Link to="/" aria-label="Clean World Inc. home">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-2.5 md:flex lg:gap-5">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-display text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
                  isActive ? "bg-paper text-leaf-deep" : "text-ink hover:bg-paper hover:text-leaf-deep"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span aria-hidden="true" className="size-1.5 rounded-full bg-leaf" />}
                  <span>{l.label}</span>
                </>
              )}
            </NavLink>
          ))}
          {phone && (
            <a
              href={telLink(phone)}
              aria-label={`Call ${phone}`}
              className="inline-flex items-center gap-2 rounded-full py-1.5 pr-2.5 pl-1.5 font-display text-sm font-bold text-ink transition-colors hover:bg-paper"
            >
              <span aria-hidden="true" className="inline-flex size-9 items-center justify-center rounded-full bg-sky/12 text-sky">
                <Phone className="size-4" aria-hidden="true" />
              </span>
              <span className="hidden lg:inline">{phone}</span>
            </a>
          )}
          <ButtonLink to="/quote">Request a quote</ButtonLink>
        </nav>

        <button
          type="button"
          className="inline-flex size-12 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors hover:border-ink md:hidden"
          aria-label="Open menu"
          onClick={() => dialog.current?.showModal()}
        >
          <Menu aria-hidden="true" />
        </button>
      </div>

      <dialog
        ref={dialog}
        aria-label="Menu"
        className="m-0 ml-auto h-dvh max-h-none w-[min(22rem,88vw)] max-w-none rounded-l-[var(--radius-bento)] bg-paper p-0 text-ink"
        onClick={(e) => e.target === dialog.current && closeMenu()}
      >
        <div className="p-5">
          <div className="flex items-center justify-between">
            <Wordmark />
            <button
              type="button"
              className="inline-flex size-12 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:border-ink"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Menu" className="mt-8 flex flex-col">
            {[{ to: "/", label: "Home" }, ...LINKS, { to: "/privacy", label: "Privacy" }].map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={closeMenu}
                className="flex items-center justify-between border-b border-line py-4 font-display text-2xl font-semibold tracking-tight hover:text-leaf-deep"
              >
                <span>{l.label}</span>
                <span aria-hidden="true" className="font-display text-xs font-bold tracking-[0.14em] text-muted">
                  0{i + 1}
                </span>
              </Link>
            ))}
            {phone && (
              <a
                href={telLink(phone)}
                onClick={closeMenu}
                className="mt-4 inline-flex items-center gap-2.5 py-2 font-display text-base font-semibold text-ink hover:text-leaf-deep"
              >
                <Phone className="size-4 text-sky" aria-hidden="true" />
                <span>Call {phone}</span>
              </a>
            )}
            <ButtonLink to="/quote" onClick={closeMenu} className="mt-6 w-full justify-between">
              Request a quote
            </ButtonLink>
          </nav>
        </div>
      </dialog>
    </header>
  );
}
