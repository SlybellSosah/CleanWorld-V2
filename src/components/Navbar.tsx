import React, { useState } from "react";
import { ActiveView } from "../types";
import { Menu, X, ShoppingBag, ShieldAlert, Award, FileText } from "lucide-react";

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  cartCount: number;
}

export default function Navbar({ activeView, setActiveView, cartCount }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", view: ActiveView.Home },
    { label: "Services", view: ActiveView.Services },
    { label: "Shop", view: ActiveView.Shop },
    { label: "Training Academy", view: ActiveView.Academy },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div 
            onClick={() => {
              setActiveView(ActiveView.Home);
              setMobileMenuOpen(false);
            }} 
            className="flex items-center space-x-3 cursor-pointer group"
            id="nav-logo-container"
          >
            <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/30 group-hover:border-emerald-500 transition-colors duration-200">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8fFJemvF3DwJM9jvAhXJxgDNCEvkdoL_jM3vqHykN6uW-sD3OsnOrhZ1F7fOMukiMLKC4FjZD5WSf7bQ5cvagWxmpGR9E8eauBD3AxH926AkX0NnZ3y-MdIcFZW1_RF6VR8qSGGiMpx4kD1aekulsY1UN0BABgYYW3Hxe65vO8vZavPZixF7azOOXbjkZodQp1TLXJ1Y-sJR7Wh7jQr7f5Aw5KuGtk0488xjUMmOiHC3WG4E721HP9zM6vrmRHI5Z81acGH-WBLE" 
                alt="Clean World Inc." 
                className="h-10 w-10 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="font-display text-white font-bold tracking-wider text-lg leading-tight flex items-center gap-1.5">
                CLEAN WORLD <span className="text-emerald-500 font-medium text-sm px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">INC.</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                Professional Cleaning &amp; Eco-Services
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1" id="nav-desktop-links">
            {navItems.map((item) => (
              <button
                key={item.view}
                id={`nav-link-${item.view}`}
                onClick={() => setActiveView(item.view)}
                className={`px-4 py-2 rounded-lg font-sans text-sm font-medium transition-all duration-150 ${
                  activeView === item.view
                    ? "bg-slate-800 text-emerald-400 border border-slate-700/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Action & Cart Section */}
          <div className="hidden md:flex items-center space-x-4" id="nav-actions">
            {/* Cart indicator */}
            <button
              id="nav-cart-btn"
              onClick={() => setActiveView(ActiveView.Shop)}
              className="relative p-2 text-slate-400 hover:text-emerald-400 transition-colors rounded-full hover:bg-slate-800"
              title="View Your Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-900 font-mono text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border border-slate-900 animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Assessment CTA */}
            <button
              id="nav-cta-assessment"
              onClick={() => setActiveView(ActiveView.QuoteFlow)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-display font-semibold text-sm px-5 py-2.5 rounded-lg shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transform hover:-translate-y-0.5 transition-all duration-150 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              Get a Free Quote
            </button>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              id="nav-mobile-cart"
              onClick={() => setActiveView(ActiveView.Shop)}
              className="relative p-2 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-900 font-mono text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-slate-900">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              id="nav-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 py-4 px-4 space-y-3 animate-fadeIn" id="nav-mobile-drawer">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  setActiveView(item.view);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg font-sans text-sm font-medium ${
                  activeView === item.view
                    ? "bg-slate-800 text-emerald-400 border border-slate-700"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setActiveView(ActiveView.QuoteFlow);
                setMobileMenuOpen(false);
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-semibold text-center py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              Get a Free Quote
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
