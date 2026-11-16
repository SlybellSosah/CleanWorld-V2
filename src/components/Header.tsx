import { Menu, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { ButtonLink } from "./Button";
import { Wordmark } from "./Wordmark";

const LINKS = [
  { to: "/services", label: "Services" },
  { to: "/how-to-pay", label: "How to pay" },
];

export function Header() {
  const dialog = useRef<HTMLDialogElement>(null);
  const { pathname } = useLocation();

  useEffect(() => dialog.current?.close(), [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label="Clean World Inc. home">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `py-3 font-medium underline-offset-8 hover:underline ${isActive ? "text-leaf underline" : "text-ink"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <ButtonLink to="/quote">Request a quote</ButtonLink>
        </nav>

        <button
          type="button"
          className="inline-flex size-12 items-center justify-center rounded-md border border-line md:hidden"
          aria-label="Open menu"
          onClick={() => dialog.current?.showModal()}
        >
          <Menu aria-hidden="true" />
        </button>
      </div>

      <dialog
        ref={dialog}
        aria-label="Menu"
        className="m-0 ml-auto h-dvh max-h-none w-[min(22rem,88vw)] max-w-none bg-paper p-5 text-ink"
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      >
        <div className="flex items-center justify-between">
          <Wordmark />
          <button
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-md border border-line"
            aria-label="Close menu"
            onClick={() => dialog.current?.close()}
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Menu" className="mt-8 flex flex-col">
          {[{ to: "/", label: "Home" }, ...LINKS, { to: "/privacy", label: "Privacy" }].map((l) => (
            <Link key={l.to} to={l.to} className="border-b border-line py-4 font-display text-2xl font-semibold">
              {l.label}
            </Link>
          ))}
          <ButtonLink to="/quote" className="mt-8">
            Request a quote
          </ButtonLink>
        </nav>
      </dialog>
    </header>
  );
}
