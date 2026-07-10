import React, { useState } from "react";
import { UserSession, UserRole } from "../types";
import { X, Mail, Lock, ShieldAlert, CheckCircle2, Phone, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
}

type AuthTab = "client" | "corporate" | "staff";

// Reusable 4-dot PIN circle input
function PinCircleInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex gap-3 justify-center">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
              i < value.length
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-slate-700 bg-slate-950"
            }`}
          >
            {i < value.length && (
              <span className="w-3 h-3 rounded-full bg-emerald-400 block" />
            )}
          </div>
        ))}
      </div>
      <input
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={4}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
        disabled={disabled}
        placeholder="Enter 4-digit PIN"
        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 font-mono tracking-widest text-center transition-all"
        aria-label="4-digit PIN"
      />
      <p className="text-center text-[10px] font-mono text-slate-500 uppercase tracking-wide">
        Set a 4-digit PIN — just like your mobile money
      </p>
    </div>
  );
}

// Staff PIN uses amber accent
function StaffPinCircleInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex gap-3 justify-center">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
              i < value.length
                ? "border-amber-500 bg-amber-500/10"
                : "border-slate-700 bg-slate-950"
            }`}
          >
            {i < value.length && (
              <span className="w-3 h-3 rounded-full bg-amber-400 block" />
            )}
          </div>
        ))}
      </div>
      <input
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={4}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
        disabled={disabled}
        placeholder="Enter 4-digit PIN"
        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/40 font-mono tracking-widest text-center transition-all"
        aria-label="4-digit crew PIN"
      />
      <p className="text-center text-[10px] font-mono text-slate-500 uppercase tracking-wide">
        Your PIN was assigned by your Operations Manager
      </p>
    </div>
  );
}

export default function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>("client");

  // Client tab state
  const [clientPhone, setClientPhone] = useState("");
  const [clientPin, setClientPin] = useState("");

  // Corporate tab state
  const [corpEmail, setCorpEmail] = useState("");
  const [corpPassword, setCorpPassword] = useState("");

  // Staff tab state
  const [staffPhone, setStaffPhone] = useState("");
  const [staffPin, setStaffPin] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clearErrors = () => setError(null);

  // ─── Client (B2C Phone + PIN) Login ───────────────────────────────────────
  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!clientPhone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    if (clientPin.length < 4) {
      setError("Please enter your complete 4-digit PIN.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg("Welcome back!");
      setTimeout(() => {
        onLoginSuccess({
          email: `${clientPhone.replace(/\s+/g, "")}@client.cleanworld.live`,
          role: UserRole.Client,
          name: "Client",
          phone: clientPhone,
        });
        onClose();
      }, 700);
    }, 600);
  };

  // ─── Corporate (B2B Email + Password) Login ───────────────────────────────
  const handleCorporateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!corpEmail.trim() || !corpPassword) {
      setError("Please enter your corporate email and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const normalizedEmail = corpEmail.trim().toLowerCase();
      setSuccessMsg("Welcome back, Corporate Customer!");
      setTimeout(() => {
        onLoginSuccess({
          email: normalizedEmail,
          role: UserRole.Client,
        });
        onClose();
      }, 700);
    }, 600);
  };

  // ─── Field Staff (Phone + PIN) Login ──────────────────────────────────────
  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!staffPhone.trim()) {
      setError("Please enter your registered crew phone number.");
      return;
    }
    if (staffPin.length < 4) {
      setError("Please enter your complete 4-digit crew PIN.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg("System authorized. Welcome, Field Service Provider!");
      setTimeout(() => {
        onLoginSuccess({
          email: "cleaner@cleanworld.live",
          role: UserRole.Cleaner,
          name: "Crew Member",
          phone: staffPhone,
        });
        onClose();
      }, 700);
    }, 600);
  };

  // ─── Demo Quick Login ─────────────────────────────────────────────────────
  const triggerDemoClient = () => {
    clearErrors();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg("Logged in as Demo Client!");
      setTimeout(() => {
        onLoginSuccess({
          email: "client@cleanworld.live",
          role: UserRole.Client,
          name: "John Garang",
          phone: "+211 928 300 401",
        });
        onClose();
      }, 700);
    }, 400);
  };

  const triggerDemoCleaner = () => {
    clearErrors();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg("Logged in as Demo Cleaner Crew!");
      setTimeout(() => {
        onLoginSuccess({
          email: "cleaner@cleanworld.live",
          role: UserRole.Cleaner,
          name: "Demo Crew",
          phone: "+211 955 000 200",
        });
        onClose();
      }, 700);
    }, 400);
  };

  const tabs: { id: AuthTab; label: string; desc: string }[] = [
    { id: "client", label: "Client", desc: "Residential & B2C" },
    { id: "corporate", label: "Corporate", desc: "B2B & Institutional" },
    { id: "staff", label: "Field Staff", desc: "Crew & Dispatch" },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        id="login-modal"
      >
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 p-1.5 rounded-lg transition-colors cursor-pointer"
          aria-label="Close login modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center px-6 pt-6 pb-4">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-3 border ${
              activeTab === "staff"
                ? "bg-amber-500/10 border-amber-500/20"
                : "bg-emerald-500/10 border-emerald-500/20"
            }`}
          >
            <KeyRound
              className={`w-5 h-5 ${
                activeTab === "staff" ? "text-amber-400" : "text-emerald-400"
              }`}
            />
          </div>
          <h3 className="text-base font-display font-extrabold tracking-tight text-white uppercase">
            {activeTab === "staff" ? "Crew Member Access" : "Workspace Login"}
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            {activeTab === "client" && "Log in with your phone number and PIN"}
            {activeTab === "corporate" && "Access your corporate or institutional portal"}
            {activeTab === "staff" && "Clock in to your field dispatch session"}
          </p>
        </div>

        {/* Tab Bar */}
        <div className="mx-6 mb-5 flex bg-slate-950/60 border border-slate-800 rounded-xl p-1 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                clearErrors();
              }}
              disabled={loading || !!successMsg}
              className={`flex-1 px-2 py-2 rounded-lg text-center transition-all duration-200 ${
                activeTab === tab.id
                  ? tab.id === "staff"
                    ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                    : "bg-slate-800 border border-slate-700 text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <span className="block text-[11px] font-display font-bold">{tab.label}</span>
              <span className="block text-[9px] font-mono text-current opacity-60 mt-0.5 leading-none">
                {tab.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Status Alerts */}
        <div className="px-6">
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mb-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl p-3 text-xs flex items-start gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
            {successMsg && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mb-4 bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 rounded-xl p-3 text-xs flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tab Content */}
        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">

            {/* ── CLIENT TAB ─────────────────────────────────────── */}
            {activeTab === "client" && (
              <motion.form
                key="client"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                onSubmit={handleClientLogin}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      placeholder="+211 9__ ___ ___"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 font-mono transition-all"
                      disabled={loading || !!successMsg}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-3">
                    Your 4-Digit PIN *
                  </label>
                  <PinCircleInput
                    value={clientPin}
                    onChange={setClientPin}
                    disabled={loading || !!successMsg}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-display font-black tracking-wide text-xs py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
                  disabled={loading || !!successMsg}
                >
                  {loading ? "Authenticating..." : "Log In with PIN →"}
                </button>

                {/* Divider + Demo */}
                <div className="relative my-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-[10px] font-mono uppercase">
                    <span className="bg-slate-900 px-3 text-slate-500 tracking-widest">
                      Demo Preset
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={triggerDemoClient}
                  className="w-full bg-slate-950/40 hover:bg-slate-950 border border-slate-800 hover:border-slate-700/60 rounded-xl p-3 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  disabled={loading || !!successMsg}
                  id="demo-client-login-btn"
                >
                  <span className="text-[10px] font-sans font-bold text-slate-200">Demo Client</span>
                  <span className="text-[9px] font-mono text-slate-500">+211 928 300 401 / PIN 1234</span>
                </button>
              </motion.form>
            )}

            {/* ── CORPORATE TAB ──────────────────────────────────── */}
            {activeTab === "corporate" && (
              <motion.form
                key="corporate"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                onSubmit={handleCorporateLogin}
                className="space-y-4"
              >
                <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl px-4 py-3 text-xs text-sky-300 font-sans">
                  For Nilepet, NGO & institutional accounts provisioned by the Clean World B2B team.
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-1.5">
                    Corporate Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      placeholder="e.g. hse@nile-petroleum.com"
                      value={corpEmail}
                      onChange={(e) => setCorpEmail(e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 font-sans transition-all"
                      disabled={loading || !!successMsg}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={corpPassword}
                      onChange={(e) => setCorpPassword(e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 font-sans transition-all"
                      disabled={loading || !!successMsg}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-display font-black tracking-wide text-xs py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
                  disabled={loading || !!successMsg}
                >
                  {loading ? "Authenticating..." : "Log In & Access Portal →"}
                </button>

                <div className="relative my-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-[10px] font-mono uppercase">
                    <span className="bg-slate-900 px-3 text-slate-500 tracking-widest">
                      Demo Preset
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={triggerDemoClient}
                  className="w-full bg-slate-950/40 hover:bg-slate-950 border border-slate-800 hover:border-slate-700/60 rounded-xl p-3 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  disabled={loading || !!successMsg}
                  id="demo-corporate-login-btn"
                >
                  <span className="text-[10px] font-sans font-bold text-slate-200">Demo Corporate</span>
                  <span className="text-[9px] font-mono text-slate-500">client@cleanworld.live</span>
                </button>
              </motion.form>
            )}

            {/* ── FIELD STAFF TAB ────────────────────────────────── */}
            {activeTab === "staff" && (
              <motion.form
                key="staff"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                onSubmit={handleStaffLogin}
                className="space-y-4"
              >
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3 text-xs text-amber-300 font-sans">
                  Crew members: use the phone number registered by your Operations Manager.
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-1.5">
                    Registered Crew Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      placeholder="+211 9__ ___ ___"
                      value={staffPhone}
                      onChange={(e) => setStaffPhone(e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/40 font-mono transition-all"
                      disabled={loading || !!successMsg}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-3">
                    Your 4-Digit Crew PIN *
                  </label>
                  <StaffPinCircleInput
                    value={staffPin}
                    onChange={setStaffPin}
                    disabled={loading || !!successMsg}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-display font-black tracking-wide text-xs py-3 rounded-xl transition-all shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50"
                  disabled={loading || !!successMsg}
                >
                  {loading ? "Clocking In..." : "Clock In to Dispatch →"}
                </button>

                <div className="relative my-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-[10px] font-mono uppercase">
                    <span className="bg-slate-900 px-3 text-slate-500 tracking-widest">
                      Demo Preset
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={triggerDemoCleaner}
                  className="w-full bg-slate-950/40 hover:bg-slate-950 border border-amber-900/40 hover:border-amber-800/60 rounded-xl p-3 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  disabled={loading || !!successMsg}
                  id="demo-cleaner-login-btn"
                >
                  <span className="text-[10px] font-sans font-bold text-amber-200">Demo Cleaner Crew</span>
                  <span className="text-[9px] font-mono text-slate-500">+211 955 000 200 / PIN 5678</span>
                </button>
              </motion.form>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
