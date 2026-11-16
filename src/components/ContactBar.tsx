import { MessageCircle, Phone } from "lucide-react";
import { Link, useLocation } from "react-router";
import { company, fact } from "../content/company";
import { telLink, whatsappLink } from "../lib/whatsapp";

const HIDDEN_ON = ["/quote", "/admin"];

export function ContactBar() {
  const { pathname } = useLocation();
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  const phone = fact(company.phone);
  const whatsapp = fact(company.whatsapp);
  const cell = "flex min-h-14 flex-1 items-center justify-center gap-2 font-display font-semibold";

  return (
    <nav aria-label="Quick contact" className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-paper shadow-[0_-4px_16px_rgb(15_23_42/0.08)] md:hidden">
      {phone && (
        <a href={telLink(phone)} className={`${cell} border-r border-line`}>
          <Phone size={18} aria-hidden="true" /> Call
        </a>
      )}
      {whatsapp && (
        <a href={whatsappLink(whatsapp)} target="_blank" rel="noopener" className={`${cell} border-r border-line`}>
          <MessageCircle size={18} aria-hidden="true" /> WhatsApp
        </a>
      )}
      <Link to="/quote" className={`${cell} bg-leaf text-white`}>
        Get a quote
      </Link>
    </nav>
  );
}
