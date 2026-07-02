import React, { useState, useEffect } from "react";
import { ActiveView } from "../types";
import { Menu, X, ShoppingBag, ShieldAlert, Sparkles, CheckCircle, Phone, Lock, Sliders, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  cartCount: number;
}

export default function Navbar({ activeView, setActiveView, cartCount }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Locked permanently to Floating Glassmorphic Capsule style
  const navbarStyle = "glass-capsule";

  const navItems = [
    { label: "Home", view: ActiveView.Home },
    { label: "Services", view: ActiveView.Services },
    { label: "Shop", view: ActiveView.Shop },
    { label: "Training Academy", view: ActiveView.Academy },
    { label: "Client Portal", view: ActiveView.ClientDashboard },
    { label: "Cleaner Dispatch", view: ActiveView.CleanerPortal },
  ];

  // Render different container layouts depending on style selection
  const isDoubleDecker = false;
  const isGlassCapsule = true;
  const isCyberGrid = false;

  return (
    <div className={`z-50 w-full transition-all duration-300 ${isGlassCapsule ? "sticky top-2 px-4 md:px-8 py-2" : "sticky top-0"}`}>
      
      {/* 2. MAIN NAVBAR BODY */}
      <nav 
        className={`transition-all duration-300 ${
          isDoubleDecker 
            ? "bg-slate-950/85 backdrop-blur-md border-b border-slate-900" 
            : isGlassCapsule
              ? "max-w-7xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-emerald-500/20"
              : "bg-slate-950 border-y-2 border-slate-800 font-mono"
        }`}
        id="clean-world-navbar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${isGlassCapsule ? "h-16" : "h-20"}`}>
            
            {/* Logo Section */}
            <motion.div 
              onClick={() => {
                setActiveView(ActiveView.Home);
                setMobileMenuOpen(false);
              }} 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 cursor-pointer group"
              id="nav-logo-container"
            >
              <div className={`transition-all duration-300 shadow-sm flex items-center justify-center h-8 w-8 ${
                isCyberGrid 
                  ? "bg-slate-900 border border-emerald-500 rounded-none" 
                  : "bg-emerald-500/10 rounded-lg border border-emerald-500/15 group-hover:border-emerald-400/40 group-hover:bg-emerald-500/15"
              }`}>
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8fFJemvF3DwJM9jvAhXJxgDNCEvkdoL_jM3vqHykN6uW-sD3OsnOrhZ1F7fOMukiMLKC4FjZD5WSf7bQ5cvagWxmpGR9E8eauBD3AxH926AkX0NnZ3y-MdIcFZW1_RF6VR8qSGGiMpx4kD1aekulsY1UN0BABgYYW3Hxe65vO8vZavPZixF7azOOXbjkZodQp1TLXJ1Y-sJR7Wh7jQr7f5Aw5KuGtk0488xjUMmOiHC3WG4E721HP9zM6vrmRHI5Z81acGH-WBLE" 
                  alt="Clean World" 
                  width={20}
                  height={20}
                  loading="eager"
                  decoding="async"
                  className="h-5 w-5 object-contain group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center h-8 select-none">
                <span className={`bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent leading-none ${
                  isCyberGrid 
                    ? "font-mono font-extrabold text-base tracking-tighter" 
                    : "font-display font-black text-lg tracking-tight"
                }`}>
                  CLEAN WORLD
                </span>
                <span className={`text-[15px] tracking-wider px-1 py-0.5 font-bold leading-none ml-1 shadow-sm select-none self-center ${
                  isCyberGrid 
                    ? "bg-emerald-400 text-slate-950 border border-emerald-400 rounded-none" 
                    : "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded"
                }`}>
                  INC.
                </span>
              </div>
            </motion.div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1" id="nav-desktop-links">
              {navItems.map((item) => (
                <motion.button
                  key={item.view}
                  id={`nav-link-${item.view}`}
                  onClick={() => setActiveView(item.view)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-3 py-2 transition-all duration-200 relative group/btn ${
                    isCyberGrid 
                      ? `font-mono text-xs uppercase tracking-tight rounded-none border ${
                          activeView === item.view
                            ? "bg-emerald-500 text-slate-950 border-emerald-500 font-extrabold"
                            : "text-slate-400 border-transparent hover:text-white hover:bg-slate-900"
                        }`
                      : `font-sans text-xs font-semibold tracking-wide uppercase rounded-xl ${
                          activeView === item.view
                            ? "bg-slate-900 text-emerald-400 border border-slate-800/80 shadow-md"
                            : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                        }`
                  }`}
                >
                  {item.label}
                  {activeView === item.view && !isCyberGrid && (
                    <motion.span 
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute bottom-1 left-3 right-3 h-[2px] bg-emerald-400 rounded-full" 
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Action & Cart Section */}
            <div className="hidden lg:flex items-center space-x-4 animate-fadeIn" id="nav-actions">
              
              {/* Cart indicator */}
              <button
                id="nav-cart-btn"
                onClick={() => setActiveView(ActiveView.Shop)}
                className={`relative p-2.5 transition-all ${
                  isCyberGrid
                    ? "text-slate-400 hover:text-emerald-400 border border-slate-800 hover:bg-slate-950 bg-slate-900 rounded-none"
                    : "text-slate-400 hover:text-emerald-400 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800"
                }`}
                title="View Your Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className={`absolute -top-1 -right-1 font-mono text-[15px] font-extrabold h-5 w-5 flex items-center justify-center animate-pulse ${
                    isCyberGrid 
                      ? "bg-emerald-400 text-slate-950 border border-emerald-400 rounded-none"
                      : "bg-emerald-500 text-slate-950 rounded-full border border-slate-950"
                  }`}>
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Assessment CTA */}
              <motion.button
                id="nav-cta-assessment"
                onClick={() => setActiveView(ActiveView.QuoteFlow)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 uppercase tracking-wide font-extrabold text-xs py-3 ${
                  isCyberGrid
                    ? "bg-emerald-400 hover:bg-emerald-300 text-slate-950 px-6 rounded-none border border-emerald-400 font-mono"
                    : "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-5 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25"
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                Get a Free Quote
              </motion.button>
            </div>

            {/* Mobile Menu Buttons */}
            <div className="flex lg:hidden items-center space-x-2">
              
              <button
                id="nav-mobile-cart"
                onClick={() => setActiveView(ActiveView.Shop)}
                className={`relative p-2.5 text-slate-400 hover:text-emerald-400 transition-colors border border-slate-800/50 bg-slate-900/50 ${isCyberGrid ? "rounded-none" : "rounded-xl"}`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 font-mono text-[15px] font-extrabold h-4 h-4 min-w-4 rounded-full flex items-center justify-center border border-slate-900 px-1">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                id="nav-mobile-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2.5 text-slate-400 hover:text-white transition-colors border border-slate-800/50 bg-slate-900/50 ${isCyberGrid ? "rounded-none" : "rounded-xl"}`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="lg:hidden border-t border-slate-900 overflow-hidden py-4 px-4 space-y-4 bg-slate-950 rounded-b-2xl" 
              id="nav-mobile-drawer"
            >
              
              <div className="space-y-1.5">
                {navItems.map((item) => (
                  <button
                    key={item.view}
                    onClick={() => {
                      setActiveView(item.view);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide transition-all ${
                      isCyberGrid 
                        ? `rounded-none border-l-2 ${activeView === item.view ? "border-emerald-400 text-emerald-400 bg-slate-900" : "border-slate-800 text-slate-400"}`
                        : `rounded-xl ${activeView === item.view ? "bg-slate-900 text-emerald-400 border border-slate-800" : "text-slate-400 hover:text-white"}`
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="pt-3 border-t border-slate-900 space-y-3">
                {/* Trust Badge for Mobile View */}
                <div className={`text-center p-3 ${isCyberGrid ? "bg-slate-900 border border-slate-800 rounded-none" : "bg-emerald-500/5 border border-emerald-500/10 rounded-xl"}`}>
                  <p className="text-[14px] font-mono text-emerald-400 font-semibold tracking-wider">
                    ★ 24-HOUR HAPPINESS GUARANTEE
                  </p>
                  <p className="text-[15px] font-mono text-slate-400 mt-0.5">
                    LICENSED, BONDED & INSURED
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveView(ActiveView.QuoteFlow);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full font-display font-extrabold text-xs uppercase tracking-wide text-center py-3.5 flex items-center justify-center gap-2 shadow-lg ${
                    isCyberGrid
                      ? "bg-emerald-400 text-slate-950 font-mono rounded-none"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  Get a Free Quote
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}

