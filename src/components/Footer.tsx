import React from "react";
import { ActiveView } from "../types";
import { 
  ArrowUpRight, 
  PhoneCall, 
  X, 
  MessageCircle, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck,
  MapPin
} from "lucide-react";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface FooterProps {
  setActiveView: (view: ActiveView) => void;
}

export default function Footer({ setActiveView }: FooterProps) {
  const [isEmergencyOpen, setIsEmergencyOpen] = React.useState(false);

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900" id="app-footer">
      
      {/* 24/7 Emergency HSE Dispatch Card Banner */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-900" id="emergency-banner">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-red-950/15 via-slate-900/40 to-slate-900/10 border border-red-500/10 p-6 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full w-fit mx-auto sm:mx-0 shrink-0">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-extrabold">Emergency Line 24/7</span>
            </div>
            <div>
              <p className="text-sm font-display text-white font-medium leading-tight tracking-tight">
                Emergency response is active now.
              </p>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Emergency response dispatched in 60 minutes across Juba districts.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <a 
              href="https://wa.me/211928300400?text=EMERGENCY%20DISPATCH%3A%20Need%20immediate%20HSE%20or%20cleaning%20response%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/10 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>+211 928 300 400</span>
            </a>
            <button 
              onClick={() => setActiveView(ActiveView.QuoteFlow)}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-850 text-slate-300 font-mono text-xs px-4 py-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Request Call</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Bio in Asymmetric Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="main-footer-container">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 lg:gap-12">
          
          {/* Column 1: Brand & Licensing (spans 2) */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center gap-2 select-none">
              <div className="bg-emerald-500/10 rounded-lg border border-emerald-500/15 flex items-center justify-center h-8 w-8">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8fFJemvF3DwJM9jvAhXJxgDNCEvkdoL_jM3vqHykN6uW-sD3OsnOrhZ1F7fOMukiMLKC4FjZD5WSf7bQ5cvagWxmpGR9E8eauBD3AxH926AkX0NnZ3y-MdIcFZW1_RF6VR8qSGGiMpx4kD1aekulsY1UN0BABgYYW3Hxe65vO8vZavPZixF7azOOXbjkZodQp1TLXJ1Y-sJR7Wh7jQr7f5Aw5KuGtk0488xjUMmOiHC3WG4E721HP9zM6vrmRHI5Z81acGH-WBLE" 
                  alt="Clean World Logo" 
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain"
                />
              </div>
              <div className="flex items-center h-8">
                <span className="font-display font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent leading-none">
                  CLEAN WORLD
                </span>
                <span className="text-xs tracking-wider px-1 py-0.5 font-bold leading-none ml-1 shadow-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded">
                  INC.
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm">
              South Sudan's premier eco-responsible hygiene and sanitization service provider, delivering medical-grade decontamination, vector control, and professional custodial care.
            </p>

            <div className="space-y-2 text-xs text-slate-500 font-sans">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                <span>Airport Road, Juba, South Sudan</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                <span className="font-mono text-xs">Ministry of Environment Licensed No. SS/ME/2026-928</span>
              </div>
            </div>
          </div>

          {/* Column 2: Service Navigation (spans 1) */}
          <div className="space-y-4">
            <h4 className="text-xs font-display font-bold text-slate-200 tracking-wider uppercase">Services</h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <button 
                  onClick={() => setActiveView(ActiveView.Consultancy)} 
                  className="text-slate-400 hover:text-emerald-400 hover:translate-x-1 transition-all cursor-pointer flex items-center justify-start text-left w-full gap-1 group"
                >
                  Environmental Consultancy
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveView(ActiveView.Services)} 
                  className="text-slate-400 hover:text-emerald-400 hover:translate-x-1 transition-all cursor-pointer flex items-center justify-start text-left w-full gap-1 group"
                >
                  Operational Services
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveView(ActiveView.Shop)} 
                  className="text-slate-400 hover:text-emerald-400 hover:translate-x-1 transition-all cursor-pointer flex items-center justify-start text-left w-full gap-1 group"
                >
                  Cleaning Supplies
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              </li>

              <li>
                <button 
                  onClick={() => setActiveView(ActiveView.QuoteFlow)} 
                  className="text-slate-400 hover:text-emerald-400 hover:translate-x-1 transition-all cursor-pointer flex items-center justify-start text-left w-full gap-1 group"
                >
                  Get a Free Quote
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Portals (spans 1) */}
          <div className="space-y-4">
            <h4 className="text-xs font-display font-bold text-slate-200 tracking-wider uppercase">Portals</h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <button 
                  onClick={() => setActiveView(ActiveView.ClientDashboard)} 
                  className="text-slate-400 hover:text-emerald-400 hover:translate-x-1 transition-all cursor-pointer flex items-center justify-start text-left w-full gap-1 group"
                >
                  Client Dashboard
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveView(ActiveView.CleanerPortal)} 
                  className="text-slate-400 hover:text-emerald-400 hover:translate-x-1 transition-all cursor-pointer flex items-center justify-start text-left w-full gap-1 group"
                >
                  Operations Portal (ops.cleanworld.live)
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Operations Center & Socials (spans 2) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-display font-bold text-slate-200 tracking-wider uppercase">Operations Hub</h4>
            
            <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  All Systems Operational
                </span>
              </div>
              <div className="space-y-2 text-xs font-sans text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Juba Hub (GMT+3) • 08:00 AM - 06:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono text-xs">+211 928 300 400</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono text-xs">dispatch@cleanworld.live</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              {[
                { name: "Facebook", href: "https://facebook.com/cleanworld", icon: <FacebookIcon className="w-4 h-4" />, color: "hover:text-blue-500 hover:border-blue-500/30" },
                { name: "Instagram", href: "https://instagram.com/cleanworld", icon: <InstagramIcon className="w-4 h-4" />, color: "hover:text-pink-500 hover:border-pink-500/30" },
                { name: "TikTok", href: "https://tiktok.com/@cleanworld", icon: <TikTokIcon className="w-4 h-4" />, color: "hover:text-cyan-400 hover:border-cyan-400/30" },
                { name: "YouTube", href: "https://youtube.com/cleanworld", icon: <YoutubeIcon className="w-4 h-4" />, color: "hover:text-red-500 hover:border-red-500/30" },
                { name: "X", href: "https://x.com/cleanworld", icon: <XIcon className="w-4 h-4" />, color: "hover:text-white hover:border-white/30" },
              ].map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className={`h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 transition-all duration-300 hover:scale-105 hover:bg-slate-900/80 ${s.color}`} title={s.name}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Copyright and Legal footer bar */}
        <div className="border-t border-slate-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div>
            © {new Date().getFullYear()} Clean World Inc. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Floating Emergency Response Action Button & Popover */}
      <div className="fixed bottom-6 right-6 z-[100] font-sans" id="floating-emergency-widget">
        
        {/* Popover Panel */}
        {isEmergencyOpen && (
          <div 
            className="absolute bottom-16 right-0 mb-2 w-80 sm:w-96 bg-slate-900 border border-red-500/30 rounded-2xl shadow-2xl shadow-red-950/40 p-5 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200"
            id="emergency-dial-prompt"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">
                  24/7 Rapid HSE Dispatch
                </h4>
              </div>
              <button 
                onClick={() => setIsEmergencyOpen(false)}
                className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg transition-colors cursor-pointer"
                aria-label="Close emergency prompt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Availability message */}
            <div className="space-y-2 text-xs">
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl p-3 leading-relaxed flex gap-2.5">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-red-400 mb-0.5">Juba Dispatch Team Online</span>
                  Emergency response team dispatched within 60 minutes across Juba.
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-normal font-sans">
                Serving Tongping, Airport Road, Munuki, Gudele, Gumbo, and wider Central Equatoria.
              </p>
            </div>

            {/* Direct Dial Options */}
            <div className="space-y-2.5">
              <a 
                href="tel:+211928300400"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-red-600/10 hover:shadow-red-600/20 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                Call Hotline: +211 928 300 400
              </a>
              
              <a 
                href="https://wa.me/211928300400?text=URGENT%3A%20I%20need%20emergency%20cleaning%20%2F%20vector%20control%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                WhatsApp Operations Dispatch
              </a>

              <button 
                onClick={() => {
                  setActiveView(ActiveView.QuoteFlow);
                  setIsEmergencyOpen(false);
                }}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-display font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Submit Dispatch Ticket
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Footer stamp */}
            <div className="text-xs text-center text-slate-500 font-mono">
              Licensed by Ministry of Environment No. SS/ME/2026-928
            </div>

          </div>
        )}

        {/* Unified Floating Action Row */}
        <div className="flex items-center gap-3 justify-end">
          {/* WhatsApp Floating Button */}
          <a
            href="https://wa.me/211928300400?text=Hello%20Clean%20World%2C%20I%20would%20like%20to%20request%20an%20HSE%20consultation%20or%20service%20quote."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 p-3.5 sm:p-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] hover:bg-emerald-500 hover:text-slate-955 hover:border-emerald-400 transition-all duration-300 group flex items-center justify-center cursor-pointer"
            aria-label="Contact on WhatsApp"
            id="whatsapp-floating-cta"
          >
            <MessageCircle className="w-5.5 h-5.5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 font-display text-xs font-extrabold tracking-wider uppercase transition-all duration-300 ease-in-out whitespace-nowrap">
              WhatsApp 24/7
            </span>
          </a>

          {/* Floating Toggle Button */}
          <button
            onClick={() => setIsEmergencyOpen(!isEmergencyOpen)}
            className={`group flex items-center gap-2.5 px-4 sm:px-5 py-3.5 sm:py-4 rounded-full font-display font-bold text-xs shadow-xl transition-all duration-300 cursor-pointer ${
              isEmergencyOpen 
                ? "bg-slate-800 text-white border border-slate-700 ring-2 ring-slate-800/20" 
                : "bg-red-600 hover:bg-red-500 text-white hover:scale-105 shadow-red-600/20 hover:shadow-red-600/30"
            }`}
            id="toggle-emergency-fab"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isEmergencyOpen ? "bg-slate-400" : "bg-white"}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isEmergencyOpen ? "bg-slate-400" : "bg-white"}`}></span>
            </span>
            <PhoneCall className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
            <span className="hidden sm:inline tracking-wider uppercase">
              {isEmergencyOpen ? "Close Panel" : "Emergency Response"}
            </span>
            <span className="sm:hidden tracking-wider uppercase">
              {isEmergencyOpen ? "Close" : "Emergency"}
            </span>
          </button>
        </div>

      </div>

    </footer>
  );
}
