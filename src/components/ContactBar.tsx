import { MessageCircle, Phone } from "lucide-react";
import { Link, useLocation } from "react-router";
import { company, fact } from "../content/company";
import { telLink, whatsappLink } from "../lib/whatsapp";

const HIDDEN_ON = ["/quote", "/admin"];

export function ContactBar({ phone: phoneProp, whatsapp: whatsappProp }: { phone?: string; whatsapp?: string } = {}) {
  const { pathname } = useLocation();
  if (HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;

  const phone = phoneProp !== undefined ? phoneProp : fact(company.phone);
  const whatsapp = whatsappProp !== undefined ? whatsappProp : fact(company.whatsapp);
  const cell =
    "flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-full font-display text-sm font-semibold text-ink transition-colors hover:bg-paper";

  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-3 bottom-3 z-20 flex items-center gap-1 rounded-full border border-line bg-white/95 p-1.5 shadow-[0_12px_32px_rgb(15_23_42/0.16)] backdrop-blur md:hidden"
    >
      {phone && (
        <a href={telLink(phone)} className={cell}>
          <Phone size={17} aria-hidden="true" /> Call
        </a>
      )}
      {whatsapp && (
        <a href={whatsappLink(whatsapp)} target="_blank" rel="noopener" className={cell}>
          <MessageCircle size={17} aria-hidden="true" /> WhatsApp
        </a>
      )}
      <Link
        to="/quote"
        className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-leaf px-3 font-display text-sm font-semibold text-white transition-colors hover:bg-leaf-deep"
      >
        Get a quote
      </Link>
    </nav>
  );
}
