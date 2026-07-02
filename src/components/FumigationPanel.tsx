import React, { useState, useEffect, useRef } from "react";
import { ActiveView, ServicePillar } from "../types";
import { JUBA_LOCATIONS } from "../data";
import {
  ShieldCheck,
  ArrowRight,
  Clock,
  Zap,
  MapPin,
  Award,
  ClipboardList,
  CheckCircle,
  X,
  Building,
  ChevronDown,
  StickyNote,
  Check,
  Phone,
  AlertTriangle,
  Shield,
  Bug,
  Droplets,
  Activity,
  Cpu,
} from "lucide-react";
import { motion } from "motion/react";

interface FumigationPanelProps {
  setActiveView: (view: ActiveView) => void;
  setQuotePillar: (pillar: ServicePillar) => void;
  setPrefilledSpecs: React.Dispatch<React.SetStateAction<any>>;
}

// ─── Animated Bio-Threat Radar Visual ────────────────────────────────────────
// Three concentric scanning rings with threat-vector nodes: Mosquito, Termite, Rodent
// Mimics a bio-security threat assessment sweep in real time
// ─────────────────────────────────────────────────────────────────────────────

const THREAT_NODES = [
  { id: "mosquito", label: "Malaria Vector", abbr: "MOS", angleDeg: 45, r: 58, color: "#c9adf3", pulse: true },
  { id: "termite",  label: "Termite Colony", abbr: "TER", angleDeg: 160, r: 42, color: "#a78bfa", pulse: false },
  { id: "rodent",   label: "Rodent Network", abbr: "ROD", angleDeg: 285, r: 64, color: "#818cf8", pulse: true },
  { id: "dengue",   label: "Dengue Vector",  abbr: "DEN", angleDeg: 220, r: 70, color: "#c4b5fd", pulse: false },
];

function polarXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function BioThreatRadar() {
  const [sweep, setSweep] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      setSweep((elapsed / 5000) % 1); // full sweep every 5s
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, []);

  const cx = 120;
  const cy = 120;
  const sweepDeg = sweep * 360;

  return (
    <div className="relative flex items-center justify-center w-full">
      <svg
        viewBox="0 0 240 240"
        className="w-52 h-52 sm:w-60 sm:h-60 drop-shadow-xl"
        aria-label="Bio-threat radar sweep"
        role="img"
      >
        <defs>
          <filter id="glow-violet" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="radar-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#110d24" />
            <stop offset="100%" stopColor="#0a0717" />
          </radialGradient>
          <radialGradient id="sweep-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(201,173,243,0.35)" />
            <stop offset="100%" stopColor="rgba(201,173,243,0)" />
          </radialGradient>
        </defs>

        {/* Base disc */}
        <circle cx={cx} cy={cy} r={88} fill="url(#radar-bg)" />

        {/* Concentric rings */}
        {[88, 66, 44, 22].map((r, i) => (
          <circle
            key={r}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={`rgba(201,173,243,${0.06 + i * 0.02})`}
            strokeWidth="1"
          />
        ))}

        {/* Cross-hair lines */}
        {[0, 90, 180, 270].map(angle => {
          const inner = polarXY(cx, cy, 8, angle);
          const outer = polarXY(cx, cy, 86, angle);
          return (
            <line key={angle}
              x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
              stroke="rgba(201,173,243,0.07)" strokeWidth="0.8"
            />
          );
        })}

        {/* Rotating sweep wedge */}
        <g
          style={{
            transform: `rotate(${sweepDeg}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: "transform 0.08s linear",
          }}
        >
          {/* Sweep line */}
          <line
            x1={cx} y1={cy}
            x2={cx} y2={cy - 84}
            stroke="#c9adf3"
            strokeWidth="1.5"
            opacity="0.8"
            filter="url(#glow-violet)"
          />
          {/* Trailing wedge fill */}
          <path
            d={`M ${cx} ${cy} L ${polarXY(cx, cy, 84, -20).x} ${polarXY(cx, cy, 84, -20).y} A 84 84 0 0 1 ${cx} ${cy - 84} Z`}
            fill="url(#sweep-gradient)"
            opacity="0.5"
          />
        </g>

        {/* Threat nodes */}
        {THREAT_NODES.map(node => {
          const pos = polarXY(cx, cy, node.r, node.angleDeg);
          return (
            <g key={node.id} filter="url(#glow-violet)">
              <circle cx={pos.x} cy={pos.y} r={6} fill={node.color} opacity="0.9" />
              <circle cx={pos.x} cy={pos.y} r={10} fill="none" stroke={node.color} strokeWidth="0.8" opacity="0.4" />
              <text
                x={pos.x}
                y={pos.y + 18}
                textAnchor="middle"
                fill={node.color}
                fontSize="7"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="700"
                letterSpacing="1"
                opacity="0.85"
              >
                {node.abbr}
              </text>
            </g>
          );
        })}

        {/* Center core */}
        <circle cx={cx} cy={cy} r={18} fill="#110d24" stroke="rgba(201,173,243,0.3)" strokeWidth="1" />
        <text
          x={cx} y={cy - 4}
          textAnchor="middle"
          fill="#c9adf3"
          fontSize="7"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="700"
          letterSpacing="1"
        >
          BIO
        </text>
        <text
          x={cx} y={cy + 7}
          textAnchor="middle"
          fill="rgba(255,255,255,0.85)"
          fontSize="9"
          fontFamily="Space Grotesk, sans-serif"
          fontWeight="800"
        >
          SCAN
        </text>
      </svg>

      {/* Floating labels outside SVG */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold text-violet-300/80 tracking-widest uppercase">VECTOR</span>
        <span className="absolute top-1/2 right-0 -translate-y-1/2 text-[8px] font-mono font-bold text-violet-400/70 tracking-widest uppercase">COLONY</span>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold text-indigo-400/60 tracking-widest uppercase">NETWORK</span>
        <span className="absolute top-1/2 left-0 -translate-y-1/2 text-[8px] font-mono font-bold text-violet-300/50 tracking-widest uppercase">DENGUE</span>
      </div>
    </div>
  );
}

// ─── Main FumigationPanel ─────────────────────────────────────────────────────
export default function FumigationPanel({
  setActiveView,
  setQuotePillar,
  setPrefilledSpecs,
}: FumigationPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [facilityName, setFacilityName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [treatmentClass, setTreatmentClass] = useState<"preventative" | "eradication" | "perimeter">("preventative");
  const [selectedVectors, setSelectedVectors] = useState<string[]>(["Mosquito Vector Control (Malaria & Dengue)"]);
  const [areaSize, setAreaSize] = useState<number>(2000);
  const [locationName, setLocationName] = useState<string>("Tongping");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [quoteId, setQuoteId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const VECTOR_SERVICES = [
    { icon: <Droplets className="w-4 h-4" />, label: "Mosquito Vector Control (Malaria & Dengue)" },
    { icon: <Bug className="w-4 h-4" />,     label: "Termite & Crawling Insect Eradication" },
    { icon: <AlertTriangle className="w-4 h-4" />, label: "Rodent & Vermin Containment" },
    { icon: <Shield className="w-4 h-4" />,  label: "Perimeter Bio-Security Barrier" },
  ];

  const PROTOCOL_SPECS = [
    { metric: "COVERAGE",    value: "24 / 7",                        icon: <Clock className="w-3.5 h-3.5" /> },
    { metric: "RESPONSE",    value: "< 4 Hours Rapid Dispatch",      icon: <Zap className="w-3.5 h-3.5" /> },
    { metric: "TERRITORY",   value: "Central Equatoria State",       icon: <MapPin className="w-3.5 h-3.5" /> },
    { metric: "STANDARDS",   value: "ISO 9001 / 14001 Registered",   icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { metric: "CHEMICALS",   value: "100% Non-Toxic Certified",      icon: <Award className="w-3.5 h-3.5" /> },
    { metric: "PPE PROTOCOL",value: "Full OSHA-Grade PPE on Every Job", icon: <ClipboardList className="w-3.5 h-3.5" /> },
    { metric: "RE-ENTRY",    value: "Zero Toxic Re-Entry Delays",    icon: <CheckCircle className="w-3.5 h-3.5" /> },
  ];

  const TREATMENT_TIERS = [
    {
      val: "preventative",
      label: "Preventative",
      desc: "Scheduled perimeter protection before infestations occur. Ideal for high-occupancy corporate sites.",
    },
    {
      val: "eradication",
      label: "Eradication",
      desc: "Full active-infestation elimination using ULV cold fogging and targeted bio-agents.",
    },
    {
      val: "perimeter",
      label: "Diplomatic Perimeter",
      desc: "360° compound protection for embassies, oilfield bases, and high-security UN facilities.",
    },
  ];

  const CREDIBILITY_STATS = [
    { value: "100%", label: "Non-Toxic", sub: "Certified Chemicals" },
    { value: "Zero", label: "Re-Entry", sub: "Toxic Delays" },
    { value: "PPE", label: "OSHA Grade", sub: "Every Treatment" },
  ];

  const handleToggleVector = (label: string) => {
    setSelectedVectors(prev =>
      prev.includes(label) ? prev.filter(v => v !== label) : [...prev, label]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!facilityName.trim()) { setErrorMsg("Please specify the facility, compound, or project site name."); return; }
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      setErrorMsg("Focal point name, email, and phone number are required.");
      return;
    }
    if (selectedVectors.length === 0) { setErrorMsg("Please select at least one treatment vector scope."); return; }
    setIsSubmitting(true);
    setTimeout(() => {
      setQuoteId(`CW-FUMI-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1200);
  };

  const handleResetForm = () => {
    setFacilityName(""); setContactName(""); setContactEmail(""); setContactPhone("");
    setTreatmentClass("preventative");
    setSelectedVectors(["Mosquito Vector Control (Malaria & Dengue)"]);
    setAreaSize(2000); setLocationName("Tongping"); setNotes("");
    setSubmitSuccess(false); setQuoteId(""); setErrorMsg("");
  };

  const activeLocObj = JUBA_LOCATIONS.find(l => l.name === locationName) || JUBA_LOCATIONS[0];

  const activeTier = TREATMENT_TIERS.find(t => t.val === treatmentClass)!;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-fadeIn" id="fumigation-panel">

      {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-8">

        {/* Heading block */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-px w-8" style={{ background: "#c9adf3" }} />
            <span className="text-[10px] font-mono font-semibold tracking-[0.2em] uppercase" style={{ color: "#c9adf3" }}>
              Elite Risk Mitigation
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight">
            Fumigation & Pest Control{" "}
            <span style={{ color: "#c9adf3" }}>for High-Stakes Sectors</span>
          </h2>
          <p className="text-sm text-slate-400 font-sans leading-relaxed max-w-[52ch]">
            More than standard pest removal — a definitive risk mitigation engine
            for aviation, oilfield, diplomatic, and corporate environments using{" "}
            <span style={{ color: "#279d45" }} className="font-semibold">100% non-toxic chemicals</span>{" "}
            and strict OSHA-grade PPE protocols.
          </p>
        </div>

        {/* Credibility stats */}
        <div className="grid grid-cols-3 gap-3">
          {CREDIBILITY_STATS.map(({ value, label, sub }) => (
            <div key={label} className="pl-3 py-1 flex flex-col border-l-2" style={{ borderColor: "rgba(201,173,243,0.4)" }}>
              <span className="font-display text-xl font-bold text-white leading-none">{value}</span>
              <span className="font-display text-xs font-semibold leading-none mt-1" style={{ color: "#c9adf3" }}>{label}</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wide leading-none mt-1.5">{sub}</span>
            </div>
          ))}
        </div>

        {/* Bio-threat radar */}
        <div
          className="relative rounded-2xl overflow-hidden border p-6 flex items-center justify-center gap-8 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(10,7,23,0.97) 0%, rgba(28,14,56,0.12) 100%)",
            borderColor: "rgba(201,173,243,0.15)",
            boxShadow: "0 0 0 1px rgba(201,173,243,0.06) inset, 0 20px 40px -12px rgba(0,0,0,0.6)",
          }}
        >
          <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(201,173,243,0.35), transparent)" }} />
          <BioThreatRadar />
          <div className="flex flex-col gap-3 shrink-0">
            {THREAT_NODES.map(node => (
              <div key={node.id} className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-sm shrink-0" style={{ backgroundColor: node.color }} />
                <span className="text-[10px] font-mono text-slate-400">{node.abbr}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vector service checklist */}
        <div className="space-y-2">
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
            <Bug className="w-3 h-3 text-slate-600" />
            Treatment Vectors
          </span>
          <ul className="space-y-3" role="list">
            {VECTOR_SERVICES.map(({ icon, label }) => (
              <li key={label} className="flex items-center gap-3 group text-slate-300 hover:text-white transition-colors duration-150">
                <span className="group-hover:scale-110 transition-transform shrink-0" style={{ color: "#c9adf3" }}>{icon}</span>
                <span className="text-sm font-semibold leading-snug">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">

        {/* PPE Compliance / Protocol Specs table */}
        <div
          className="relative overflow-hidden rounded-2xl border backdrop-blur-md"
          style={{
            background: "linear-gradient(145deg, rgba(15,23,42,0.94) 0%, rgba(28,14,56,0.10) 100%)",
            borderColor: "rgba(201,173,243,0.18)",
            boxShadow: "0 0 0 1px rgba(201,173,243,0.05) inset, 0 20px 40px -12px rgba(0,0,0,0.5)",
          }}
        >
          <div className="px-6 pt-5 pb-4 border-b flex items-center gap-2" style={{ borderColor: "rgba(201,173,243,0.12)" }}>
            <Shield className="w-4 h-4 shrink-0" style={{ color: "#c9adf3" }} />
            <span className="text-sm font-display font-bold text-white uppercase tracking-wider">
              Protocol & Compliance Specs
            </span>
          </div>
          <table className="w-full">
            <tbody>
              {PROTOCOL_SPECS.map(({ metric, value, icon }) => (
                <tr
                  key={metric}
                  className="group border-b last:border-0 transition-colors"
                  style={{ borderColor: "rgba(201,173,243,0.07)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,173,243,0.03)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}
                >
                  <td className="px-6 py-3.5 w-[40%]">
                    <div className="flex items-center gap-2">
                      <span className="transition-colors shrink-0 text-slate-600 group-hover:text-violet-400/60">{icon}</span>
                      <span className="text-[10px] font-mono font-semibold text-slate-500 tracking-widest uppercase">{metric}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-xs text-white font-medium">
                    {metric === "CHEMICALS"
                      ? <span style={{ color: "#279d45" }} className="font-bold">{value}</span>
                      : value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Treatment Tier Selector */}
        <div className="rounded-xl border p-5 space-y-4" style={{ background: "rgba(15,23,42,0.6)", borderColor: "rgba(201,173,243,0.14)" }}>
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500 block">Treatment Intensity Class</span>
          <div className="space-y-2">
            {TREATMENT_TIERS.map(tier => {
              const isActive = treatmentClass === tier.val;
              return (
                <button
                  key={tier.val}
                  onClick={() => setTreatmentClass(tier.val as any)}
                  className="w-full text-left p-3.5 rounded-xl border transition-all"
                  style={{
                    background: isActive ? "rgba(201,173,243,0.07)" : "rgba(15,23,42,0.5)",
                    borderColor: isActive ? "#c9adf3" : "rgba(201,173,243,0.1)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-xs font-display font-bold"
                      style={{ color: isActive ? "#c9adf3" : "#94a3b8" }}
                    >
                      {tier.label}
                    </span>
                    {isActive && <Check className="w-3.5 h-3.5" style={{ color: "#c9adf3" }} />}
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans leading-snug">{tier.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Equipment tags */}
        <div className="rounded-xl border px-5 py-4 space-y-3 shadow-md" style={{ background: "rgba(15,23,42,0.5)", borderColor: "rgba(201,173,243,0.12)" }}>
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500">Deployed Equipment</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["ULV Thermal Foggers", "Pneumatic Sprayers", "Eco-safe Larvicides"].map((eq, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-[10px] font-mono font-medium px-2.5 py-1 rounded-md border transition-colors"
                style={{ color: "#c9adf3", background: "rgba(201,173,243,0.05)", borderColor: "rgba(201,173,243,0.2)" }}
              >
                <Cpu className="w-3 h-3 shrink-0 opacity-75" />
                {eq}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => setIsModalOpen(true)}
          id="fumigation-cta-secure-btn"
          className="group relative w-full overflow-hidden active:scale-[0.98] font-display font-extrabold py-4 px-6 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-300 text-white"
          style={{
            background: "linear-gradient(135deg, #226099 0%, #1a4e7a 100%)",
            boxShadow: "0 10px 20px rgba(34,96,153,0.25), 0 0 0 1px rgba(201,173,243,0.15)",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 15px 30px rgba(201,173,243,0.20), 0 0 0 1px rgba(201,173,243,0.35)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 10px 20px rgba(34,96,153,0.25), 0 0 0 1px rgba(201,173,243,0.15)"; }}
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700" />
          <Shield className="relative w-4 h-4 shrink-0" style={{ color: "#c9adf3" }} />
          <span className="relative text-xs tracking-widest uppercase font-extrabold">Secure Your Facility</span>
          <ArrowRight className="relative w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
        </button>
      </div>

      {/* ── BOOKING MODAL ────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 backdrop-blur-md"
            style={{ background: "rgba(10,7,23,0.88)" }}
            onClick={() => { setIsModalOpen(false); handleResetForm(); }}
          />
          <div
            className="relative rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6 text-left border"
            style={{ background: "#0f172a", borderColor: "rgba(201,173,243,0.2)" }}
            id="fumigation-booking-modal"
          >
            <button
              onClick={() => { setIsModalOpen(false); handleResetForm(); }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full border transition-all"
              style={{ background: "rgba(15,23,42,0.9)", borderColor: "rgba(201,173,243,0.15)" }}
            >
              <X className="w-4 h-4" />
            </button>

            {!submitSuccess ? (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: "#c9adf3" }} />
                    <span className="font-mono text-[9px] uppercase tracking-widest font-extrabold" style={{ color: "#c9adf3" }}>
                      SECURE FACILITY DISPATCH
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">Fumigation & Risk Mitigation Assessment</h3>
                  <p className="text-xs text-slate-400">Provide facility details for a rapid-response bio-security treatment dispatch.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Left: Site Parameters */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider border-b pb-1 flex items-center gap-1.5" style={{ borderColor: "rgba(201,173,243,0.1)" }}>
                      <Building className="w-3.5 h-3.5 text-slate-600" /> Site & Threat Parameters
                    </h4>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wide block">Facility / Compound Name *</label>
                      <input
                        type="text" required value={facilityName} onChange={e => setFacilityName(e.target.value)}
                        placeholder="e.g. Nilepet Depot, UN Base, Embassy Compound"
                        className="w-full rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none font-sans"
                        style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(201,173,243,0.15)" }}
                        onFocus={e => { e.currentTarget.style.borderColor = "#c9adf3"; }}
                        onBlur={e => { e.currentTarget.style.borderColor = "rgba(201,173,243,0.15)"; }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wide block">Facility Area (sq ft) *</label>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-mono text-[10px]">SIZE</span>
                          <span className="font-mono font-bold text-white text-[11px] px-2 py-0.5 rounded border" style={{ background: "rgba(15,23,42,0.9)", borderColor: "rgba(201,173,243,0.15)" }}>
                            {areaSize.toLocaleString()} SQ FT
                          </span>
                        </div>
                        <input
                          type="range" min={500} max={8000} step={100}
                          value={areaSize} onChange={e => setAreaSize(Number(e.target.value))}
                          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer border"
                          style={{ background: "rgba(15,23,42,0.9)", borderColor: "rgba(201,173,243,0.1)", accentColor: "#c9adf3" }}
                        />
                        <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase">
                          <span>500</span><span>4,000</span><span>8,000 sq ft</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wide block">Treatment Intensity</label>
                      <div className="grid grid-cols-3 gap-1.5 text-[9px] font-mono font-bold">
                        {TREATMENT_TIERS.map(t => (
                          <button
                            type="button" key={t.val}
                            onClick={() => setTreatmentClass(t.val as any)}
                            className="py-2 rounded-xl border text-center transition-all"
                            style={{
                              background: treatmentClass === t.val ? "rgba(201,173,243,0.08)" : "rgba(15,23,42,0.6)",
                              borderColor: treatmentClass === t.val ? "#c9adf3" : "rgba(201,173,243,0.1)",
                              color: treatmentClass === t.val ? "#c9adf3" : "#64748b",
                            }}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wide block">Juba Operating District *</label>
                      <div className="relative">
                        <select
                          value={locationName} onChange={e => setLocationName(e.target.value)}
                          className="w-full rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none font-sans cursor-pointer appearance-none"
                          style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(201,173,243,0.15)" }}
                        >
                          {JUBA_LOCATIONS.map(loc => <option key={loc.name} value={loc.name}>{loc.name}</option>)}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                      <div className="mt-2 p-3 rounded-xl font-mono text-[9px] text-slate-400 space-y-1.5" style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(201,173,243,0.08)" }}>
                        <div className="flex justify-between">
                          <span>COORDINATES:</span>
                          <span className="font-semibold" style={{ color: "#c9adf3" }}>LAT {activeLocObj.lat.toFixed(5)} / LNG {activeLocObj.lng.toFixed(5)}</span>
                        </div>
                        <div className="text-[9px] text-slate-500 leading-normal border-t pt-1" style={{ borderColor: "rgba(201,173,243,0.08)" }}>{activeLocObj.description}</div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Vectors & Contact */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider border-b pb-1 flex items-center gap-1.5" style={{ borderColor: "rgba(201,173,243,0.1)" }}>
                      <ClipboardList className="w-3.5 h-3.5 text-slate-600" /> Threat Vectors & Focal Point
                    </h4>
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wide block">Required Treatment Vectors</label>
                      <div className="space-y-2">
                        {VECTOR_SERVICES.map(srv => {
                          const isChecked = selectedVectors.includes(srv.label);
                          return (
                            <button
                              type="button" key={srv.label}
                              onClick={() => handleToggleVector(srv.label)}
                              className="w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all"
                              style={{
                                background: isChecked ? "rgba(201,173,243,0.06)" : "rgba(15,23,42,0.7)",
                                borderColor: isChecked ? "#c9adf3" : "rgba(201,173,243,0.1)",
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <span style={{ color: isChecked ? "#c9adf3" : "#475569" }}>{srv.icon}</span>
                                <span className="text-[11px] truncate max-w-[200px] sm:max-w-xs" style={{ color: isChecked ? "white" : "#94a3b8" }}>{srv.label}</span>
                              </div>
                              <span
                                className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all"
                                style={{
                                  background: isChecked ? "#c9adf3" : "transparent",
                                  borderColor: isChecked ? "#c9adf3" : "#475569",
                                }}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3] text-slate-950" />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs font-sans">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-mono uppercase block">Focal Point Name *</label>
                          <input
                            type="text" required value={contactName} onChange={e => setContactName(e.target.value)}
                            placeholder="e.g. James Mading"
                            className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none text-slate-200"
                            style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(201,173,243,0.12)" }}
                            onFocus={e => { e.currentTarget.style.borderColor = "#c9adf3"; }}
                            onBlur={e => { e.currentTarget.style.borderColor = "rgba(201,173,243,0.12)"; }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-mono uppercase block">Official Email *</label>
                          <input
                            type="email" required value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                            placeholder="james@nilepet.com"
                            className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none text-slate-200"
                            style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(201,173,243,0.12)" }}
                            onFocus={e => { e.currentTarget.style.borderColor = "#c9adf3"; }}
                            onBlur={e => { e.currentTarget.style.borderColor = "rgba(201,173,243,0.12)"; }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-mono uppercase block">Direct Contact Phone *</label>
                        <input
                          type="text" required value={contactPhone} onChange={e => setContactPhone(e.target.value)}
                          placeholder="+211 920 000 000"
                          className="w-full rounded-lg px-3 py-2 text-xs focus:outline-none text-slate-200 font-mono"
                          style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(201,173,243,0.12)" }}
                          onFocus={e => { e.currentTarget.style.borderColor = "#c9adf3"; }}
                          onBlur={e => { e.currentTarget.style.borderColor = "rgba(201,173,243,0.12)"; }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-mono uppercase block">Threat Assessment Notes</label>
                        <textarea
                          value={notes} onChange={e => setNotes(e.target.value)}
                          placeholder="Describe existing infestation signs, target species, or specific sectors to treat..."
                          className="w-full h-16 rounded-lg px-3 py-2 text-xs focus:outline-none resize-none font-sans text-slate-200"
                          style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(201,173,243,0.12)" }}
                          onFocus={e => { e.currentTarget.style.borderColor = "#c9adf3"; }}
                          onBlur={e => { e.currentTarget.style.borderColor = "rgba(201,173,243,0.12)"; }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {errorMsg && <p className="text-red-400 font-mono text-[10px] text-center animate-pulse">{errorMsg}</p>}

                <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "rgba(201,173,243,0.1)" }}>
                  <div className="flex items-center gap-2">
                    <StickyNote className="w-4 h-4 shrink-0" style={{ color: "#c9adf3" }} />
                    <div className="text-left font-mono">
                      <span className="text-[8px] text-slate-500 uppercase block leading-none">TREATMENT CLASS</span>
                      <span className="text-[10px] font-bold tracking-wide" style={{ color: "#c9adf3" }}>{activeTier.label} — {areaSize.toLocaleString()} sq ft</span>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => { setIsModalOpen(false); handleResetForm(); }}
                      className="flex-1 sm:flex-none px-5 py-3 rounded-xl text-xs font-semibold text-slate-300 transition-colors border"
                      style={{ borderColor: "rgba(201,173,243,0.15)", background: "rgba(15,23,42,0.6)" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-grow sm:flex-grow-0 text-white font-display font-black text-xs px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #226099 0%, #1a4e7a 100%)" }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          DISPATCHING...
                        </>
                      ) : (
                        <>
                          Secure Your Facility
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center space-y-6 max-w-md mx-auto">
                <div
                  className="h-16 w-16 rounded-full flex items-center justify-center mx-auto shadow-lg"
                  style={{ background: "rgba(201,173,243,0.1)", border: "1px solid rgba(201,173,243,0.3)" }}
                >
                  <Shield className="w-10 h-10 animate-bounce" style={{ color: "#c9adf3" }} />
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest font-extrabold block" style={{ color: "#c9adf3" }}>FACILITY SECURED — DISPATCH REGISTERED</span>
                  <h3 className="font-display text-2xl font-black text-white">Treatment Order Confirmed</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">Your fumigation & risk mitigation request has been logged and assigned to a certified technician team in Juba.</p>
                </div>
                <div className="p-5 rounded-2xl text-left font-mono text-[11px] text-slate-300 space-y-3.5" style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(201,173,243,0.15)" }}>
                  <div className="flex justify-between border-b pb-2" style={{ borderColor: "rgba(201,173,243,0.08)" }}>
                    <span className="text-slate-500">DISPATCH REFERENCE</span>
                    <span className="text-white font-bold">{quoteId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">FACILITY / SITE</span>
                    <span className="text-white truncate max-w-[200px]">{facilityName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">AREA SIZE</span>
                    <span className="text-white">{areaSize.toLocaleString()} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">TREATMENT CLASS</span>
                    <span className="font-semibold" style={{ color: "#c9adf3" }}>{activeTier.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">DISTRICT</span>
                    <span className="text-white">{locationName}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold" style={{ borderColor: "rgba(201,173,243,0.08)", color: "#279d45" }}>
                    <span>CHEMICAL STANDARD</span>
                    <span>100% Non-Toxic</span>
                  </div>
                  <div className="flex justify-between font-bold" style={{ color: "#c9adf3" }}>
                    <span>SLA COMMITMENT</span>
                    <span>&lt; 4 Hours Callout</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-sans max-w-sm mx-auto">
                  Our Senior Fumigation Technician will contact <strong className="text-slate-300 font-mono">{contactPhone}</strong> within 4 hours to confirm the dispatch window and pre-treatment site protocol.
                </p>
                <button
                  onClick={() => { setIsModalOpen(false); handleResetForm(); }}
                  className="w-full sm:w-auto font-sans font-semibold text-xs px-8 py-3.5 rounded-xl transition-all text-white border"
                  style={{ background: "rgba(15,23,42,0.9)", borderColor: "rgba(201,173,243,0.2)" }}
                >
                  Return to Fumigation Services
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
