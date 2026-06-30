import React from "react";
import { ActiveView } from "../types";
import { Phone, Mail, MapPin, ShieldCheck, HeartHandshake, ArrowUpRight, PhoneCall, X, Terminal, Radio, Zap } from "lucide-react";

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
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800" id="app-footer">
      
      {/* 24/7 Emergency HSE Dispatch Banner */}
      <div className="bg-gradient-to-r from-red-950/25 via-slate-950 to-emerald-950/10 border-b border-red-500/10 py-8 px-4 sm:px-6 lg:px-8" id="emergency-banner">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full w-fit mx-auto sm:mx-0 shrink-0">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-extrabold">Emergency Line 24/7</span>
            </div>
            <div>
              <p className="text-sm font-display text-white font-medium leading-tight tracking-tight">
                Clean World emergency response is active now.
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                On-site within 60 minutes for urgent disinfection, deep cleaning, or pest containment.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <a 
              href="https://wa.me/211928300400?text=EMERGENCY%20DISPATCH%3A%20Need%20immediate%20HSE%20or%20cleaning%20response%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/10"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>+211 928 300 400</span>
            </a>
            <button 
              onClick={() => setActiveView(ActiveView.QuoteFlow)}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs px-4 py-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Request Call</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Bio */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900/60" id="main-footer-container">
        <div className="text-center space-y-8">
          <div className="h-1 w-16 bg-emerald-500 mx-auto rounded-full"></div>
          <div className="text-sm sm:text-base md:text-lg font-bold text-white tracking-widest uppercase font-display">
            CLEAN WORLD INC.
          </div>
          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Eco-responsible environmental decontamination, professional deep cleaning, and pest control management solutions in the Republic of South Sudan.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm font-mono text-slate-300">
            <button onClick={() => setActiveView(ActiveView.Services)} className="hover:text-emerald-400 transition-colors py-1 px-2 hover:bg-slate-900 rounded-lg">Services</button>
            <span className="text-slate-800 hidden sm:inline">/</span>
            <button onClick={() => setActiveView(ActiveView.Shop)} className="hover:text-emerald-400 transition-colors py-1 px-2 hover:bg-slate-900 rounded-lg">Eco-Shop</button>
            <span className="text-slate-800 hidden sm:inline">/</span>
            <button onClick={() => setActiveView(ActiveView.Academy)} className="hover:text-emerald-400 transition-colors py-1 px-2 hover:bg-slate-900 rounded-lg">Academy</button>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            {[
              { name: "Facebook", href: "https://facebook.com/cleanworld", icon: <FacebookIcon className="w-5 h-5" />, color: "hover:text-blue-500 hover:border-blue-500/30" },
              { name: "Instagram", href: "https://instagram.com/cleanworld", icon: <InstagramIcon className="w-5 h-5" />, color: "hover:text-pink-500 hover:border-pink-500/30" },
              { name: "TikTok", href: "https://tiktok.com/@cleanworld", icon: <TikTokIcon className="w-5 h-5" />, color: "hover:text-cyan-400 hover:border-cyan-400/30" },
              { name: "YouTube", href: "https://youtube.com/cleanworld", icon: <YoutubeIcon className="w-5 h-5" />, color: "hover:text-red-500 hover:border-red-500/30" },
              { name: "X", href: "https://x.com/cleanworld", icon: <XIcon className="w-5 h-5" />, color: "hover:text-white hover:border-white/30" },
            ].map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className={`h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 transition-all duration-300 hover:scale-105 hover:bg-slate-900/80 ${s.color}`} title={s.name}>
                {s.icon}
              </a>
            ))}
          </div>

          <p className="text-[10px] sm:text-xs text-slate-400 font-mono tracking-wide max-w-2xl mx-auto leading-relaxed">
            Airport Road, Juba, South Sudan • Ministry of Environment Licensed No. SS/ME/2026-928
          </p>
          <p className="text-[10px] sm:text-xs text-slate-500 font-mono pt-2">
            © {new Date().getFullYear()} Clean World Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* Floating Emergency Response Action Button & Popover */}
      <div className="fixed bottom-6 right-6 z-50 font-sans" id="floating-emergency-widget">
        
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
                className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg transition-colors"
                aria-label="Close emergency prompt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Availability message */}
            <div className="space-y-2 text-xs">
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl p-3 leading-relaxed">
                <span className="font-semibold block text-red-400 mb-0.5">⚠️ Juba Dispatch Team Online</span>
                Our certified cleaning, bio-hazard containment, and urgent vector control teams are stationed locally in Juba. On-site response is guaranteed within <strong>60 minutes</strong>.
              </div>
              <p className="text-slate-400 text-[11px] leading-normal">
                Serving all main sectors: Tongping, Airport Road, Munuki, Gudele, Gumbo, and the wider Central Equatoria area.
              </p>
            </div>

            {/* Direct Dial Options */}
            <div className="space-y-2.5">
              <a 
                href="tel:+211928300400"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-red-600/10 hover:shadow-red-600/20"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                Call Urgent Hotline: +211 928 300 400
              </a>
              
              <a 
                href="https://wa.me/211928300400?text=URGENT%3A%20I%20need%20emergency%20cleaning%20%2F%20vector%20control%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-all"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                WhatsApp Operations Dispatch
              </a>

              <button 
                onClick={() => {
                  setActiveView(ActiveView.QuoteFlow);
                  setIsEmergencyOpen(false);
                }}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-display font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                Submit Electronic Dispatch Ticket
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Footer stamp */}
            <div className="text-[10px] text-center text-slate-500 font-mono">
              Licensed by Ministry of Environment No. SS/ME/2026-928
            </div>

          </div>
        )}

        {/* Floating Toggle Button */}
        <button
          onClick={() => setIsEmergencyOpen(!isEmergencyOpen)}
          className={`group flex items-center gap-2.5 px-4 sm:px-5 py-3.5 sm:py-4 rounded-full font-display font-bold text-xs shadow-xl transition-all duration-300 ${
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

    </footer>
  );
}
