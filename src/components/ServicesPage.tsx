import React, { useState, useEffect, useRef } from "react";
import { ActiveView, ServicePillar, Product, RiskClass } from "../types";
import { SERVICES_DETAILS, PRODUCTS, JUBA_LOCATIONS } from "../data";
import {
  ShieldCheck,
  Truck,
  ClipboardList,
  Clock,
  Sparkles,
  Plus,
  Check,
  Shield,
  FlaskConical,
  TreePine,
  Building2,
  ArrowRight,
  Cpu,
  Users,
  Award,
  CheckCircle2,
  CheckCircle,
  ChevronRight,
  Wrench,
  Trash2,
  FileText,
  BarChart3,
  MapPin,
  Zap,
  X,
  Building,
  Phone,
  Mail,
  StickyNote,
  ChevronDown,
  Activity,
  AlertTriangle
} from "lucide-react";
import { motion } from "motion/react";
import FumigationPanel from "./FumigationPanel";

interface ServicesPageProps {
  setActiveView: (view: ActiveView) => void;
  setQuotePillar: (pillar: ServicePillar) => void;
  onAddProductToCart: (product: Product, quantity: number) => void;
  cartProducts: { [key: string]: number };
  setPrefilledSpecs: React.Dispatch<React.SetStateAction<any>>;
}

// ─── Pillar metadata: icons and style tokens for all 4 tabs ───────────────────
const PILLAR_META: Record<
  ServicePillar,
  { icon: React.ReactNode; color: string; glow: string; label: string }
> = {
  [ServicePillar.Consultancy]: {
    icon: <FlaskConical className="w-4 h-4" />,
    color: "text-emerald-400",
    glow: "shadow-emerald-500/20",
    label: "Environmental Consultancy",
  },
  [ServicePillar.Management]: {
    icon: <Building2 className="w-4 h-4" />,
    color: "text-sky-400",
    glow: "shadow-sky-500/20",
    label: "Cleaning & Waste Collection/Disposal",
  },
  [ServicePillar.Fumigation]: {
    icon: <Shield className="w-4 h-4" />,
    color: "text-violet-400",
    glow: "shadow-violet-500/20",
    label: "Fumigation & Pest Control",
  },
  [ServicePillar.Landscaping]: {
    icon: <TreePine className="w-4 h-4" />,
    color: "text-teal-400",
    glow: "shadow-teal-500/20",
    label: "Landscaping & Gardening",
  },
};

const EquipmentTag: React.FC<{ label: string }> = ({ label }) => {
  return (
    <span
      className="
        inline-flex items-center gap-1.5
        text-[14px] font-mono font-medium
        text-teal-300
        bg-teal-500/5 border border-teal-500/25
        px-2 py-0.5 rounded-md
        transition-colors hover:bg-teal-500/10 hover:border-teal-500/35
      "
    >
      <Cpu className="w-3 h-3 shrink-0 opacity-75" />
      {label}
    </span>
  );
}

// ─── Animated SVG Donut Ring for Consultancy ──────────────────────────────────
const SERVICE_ARCS = [
  { label: "EIA", abbr: "EIA", angle: 0, sweep: 82, color: "#00c896", opacity: 1 },
  { label: "Waste Mapping", abbr: "WASTE", angle: 92, sweep: 78, color: "#00b882", opacity: 0.82 },
  { label: "HSE Docs", abbr: "HSE", angle: 180, sweep: 74, color: "#00a06e", opacity: 0.68 },
  { label: "ESG Scoring", abbr: "ESG", angle: 264, sweep: 78, color: "#007d55", opacity: 0.55 },
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, sweepAngle: number): string {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, startAngle + sweepAngle);
  const largeArc = sweepAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function ConsultancyDonut() {
  const [phase, setPhase] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      setPhase((elapsed / 6000) % 1); // one slow full rotation per 6 s
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const cx = 120;
  const cy = 120;
  const outerR = 88;
  const innerR = 56;
  const tickR = 96;

  const rotationDeg = phase * 8; // subtle 8-degree drift

  return (
    <div className="relative flex items-center justify-center w-full">
      <svg
        viewBox="0 0 240 240"
        className="w-48 h-48 sm:w-56 sm:h-56 drop-shadow-lg"
        aria-label="Environmental Consultancy service distribution"
        role="img"
      >
        <defs>
          <filter id="glow-emerald" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="inner-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0a1628" />
            <stop offset="100%" stopColor="#0d1f38" />
          </radialGradient>
        </defs>

        <circle
          cx={cx}
          cy={cy}
          r={(outerR + innerR) / 2}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={outerR - innerR}
        />

        <g
          style={{
            transform: `rotate(${rotationDeg}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: "transform 0.1s linear",
          }}
        >
          {SERVICE_ARCS.map((arc) => (
            <path
              key={arc.abbr}
              d={arcPath(cx, cy, (outerR + innerR) / 2, arc.angle, arc.sweep)}
              fill="none"
              stroke={arc.color}
              strokeWidth={outerR - innerR - 4}
              strokeLinecap="round"
              opacity={arc.opacity}
              filter="url(#glow-emerald)"
              style={{ transition: "opacity 0.3s ease" }}
            />
          ))}

          {SERVICE_ARCS.map((arc) => {
            const tipAngle = arc.angle + arc.sweep + 5;
            const inner = polarToCartesian(cx, cy, innerR + 2, tipAngle);
            const outer = polarToCartesian(cx, cy, outerR - 2, tipAngle);
            return (
              <line
                key={`tick-${arc.abbr}`}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="1"
              />
            );
          })}
        </g>

        <circle cx={cx} cy={cy} r={innerR - 2} fill="url(#inner-gradient)" />

        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fill="#00c896"
          fontSize="10"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="600"
          letterSpacing="2"
        >
          CONSULT
        </text>
        <text
          x={cx}
          y={cy + 6}
          textAnchor="middle"
          fill="rgba(255,255,255,0.85)"
          fontSize="18"
          fontFamily="Space Grotesk, sans-serif"
          fontWeight="700"
        >
          4
        </text>
        <text
          x={cx}
          y={cy + 22}
          textAnchor="middle"
          fill="rgba(148,163,184,0.7)"
          fontSize="8.5"
          fontFamily="JetBrains Mono, monospace"
          letterSpacing="1"
        >
          SERVICES
        </text>

        {Array.from({ length: 36 }).map((_, i) => {
          const angle = i * 10;
          const outer2 = polarToCartesian(cx, cy, tickR, angle);
          const inner2 = polarToCartesian(cx, cy, tickR - (i % 3 === 0 ? 5 : 3), angle);
          return (
            <line
              key={`otick-${i}`}
              x1={inner2.x}
              y1={inner2.y}
              x2={outer2.x}
              y2={outer2.y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={i % 3 === 0 ? 1.5 : 0.8}
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[15px] font-mono font-bold text-emerald-400 tracking-widest uppercase">
          EIA
        </span>
        <span className="absolute top-1/2 right-0 -translate-y-1/2 text-[15px] font-mono font-bold text-emerald-400/82 tracking-widest uppercase">
          WASTE
        </span>
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[15px] font-mono font-bold text-emerald-400/68 tracking-widest uppercase">
          HSE
        </span>
        <span className="absolute top-1/2 left-0 -translate-y-1/2 text-[15px] font-mono font-bold text-emerald-400/55 tracking-widest uppercase">
          ESG
        </span>
      </div>
    </div>
  );
}

// ─── Restore: ConsultancyPanel (original layout) ──────────────────────────────
function ConsultancyPanel() {
  const consultancy = SERVICES_DETAILS.find((s) => s.id === ServicePillar.Consultancy)!;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [facilityName, setFacilityName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    "Environmental Impact Assessment (EIA)"
  ]);
  const [areaSize, setAreaSize] = useState<number>(2500);
  const [riskClass, setRiskClass] = useState<RiskClass>(RiskClass.Low);
  const [locationName, setLocationName] = useState<string>("Tongping");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [quoteId, setQuoteId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const CORE_SERVICES = [
    { icon: <FlaskConical className="w-4 h-4" />, label: "Environmental Impact Assessment (EIA)" },
    { icon: <Trash2 className="w-4 h-4" />, label: "Waste Stream Mapping & Optimization" },
    { icon: <FileText className="w-4 h-4" />, label: "HSE Documentation & Regulatory Compliance" },
    { icon: <BarChart3 className="w-4 h-4" />, label: "Corporate ESG Compliance Scoring" },
  ];

  const CREDIBILITY_STATS = [
    { value: "12+", label: "Years", sub: "Industry Experience" },
    { value: "200+", label: "Clients", sub: "Served" },
    { value: "ISO", label: "9001/14001", sub: "Certified" },
  ];

  const OPERATIONAL_SPECS = [
    { metric: "COVERAGE", value: "24 / 7", icon: <Clock className="w-3.5 h-3.5" /> },
    { metric: "RESPONSE", value: "< 4 Hours", icon: <Zap className="w-3.5 h-3.5" /> },
    { metric: "TERRITORY", value: "Central Equatoria State", icon: <MapPin className="w-3.5 h-3.5" /> },
    { metric: "STANDARDS", value: "ISO 9001 / ISO 14001", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { metric: "REPORTING", value: "SDS Sheets · GPS Geo-Tag", icon: <ClipboardList className="w-3.5 h-3.5" /> },
    { metric: "AUDIT CYCLE", value: "Site audit in 48 hrs", icon: <Award className="w-3.5 h-3.5" /> },
  ];

  const handleToggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!facilityName.trim()) {
      setErrorMsg("Please specify the organization, ministry, or project site name.");
      return;
    }
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      setErrorMsg("Representative focal point name, official email, and phone number are required.");
      return;
    }
    if (selectedScopes.length === 0) {
      setErrorMsg("Please select at least one core service scope for assessment.");
      return;
    }
    if (areaSize <= 0) {
      setErrorMsg("Please enter a valid facility area size.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const randomId = `RSS-MOE-EC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setQuoteId(randomId);
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1200);
  };

  const handleResetForm = () => {
    setFacilityName("");
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    setSelectedScopes(["Environmental Impact Assessment (EIA)"]);
    setAreaSize(2500);
    setRiskClass(RiskClass.Low);
    setLocationName("Tongping");
    setNotes("");
    setSubmitSuccess(false);
    setQuoteId("");
    setErrorMsg("");
  };

  const activeLocObj = JUBA_LOCATIONS.find((l) => l.name === locationName) || JUBA_LOCATIONS[0];
  const isHighStakes = areaSize > 5000 || riskClass === RiskClass.High;
  const isMediumStakes = (areaSize > 2000 && areaSize <= 5000) || riskClass === RiskClass.Medium;

  const complexityLabel = isHighStakes
    ? "Class III High-Impact Scoping Audit (RSS Environmental Law compliance)"
    : isMediumStakes
    ? "Class II Moderate Site Review"
    : "Class I Baseline Compliance Assessment";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-fadeIn" id="consultancy-panel">
      {/* LEFT COLUMN: Donut Ring & Stats */}
      <div className="flex flex-col gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-emerald-500/60" />
            <span className="text-[14px] text-emerald-400 font-mono font-semibold tracking-[0.2em] uppercase">
              Environmental Consultancy
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight text-wrap-balance">
            High-Stakes Technical Audits &amp; <span className="text-emerald-400">ESG Frameworks</span>
          </h2>
          <p className="text-sm text-slate-400 font-sans leading-relaxed max-w-[52ch]">
            Regulatory-grade environmental audits for industrial facilities, government projects, and multinational ESG programs.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {CREDIBILITY_STATS.map(({ value, label, sub }) => (
            <div key={label} className="border-l-2 border-emerald-500/30 pl-3 py-1 flex flex-col">
              <span className="font-display text-xl font-bold text-white leading-none">{value}</span>
              <span className="font-display text-xs font-semibold text-emerald-400 leading-none mt-1">{label}</span>
              <span className="text-[14px] font-mono text-slate-400 uppercase tracking-wide leading-none mt-1.5">{sub}</span>
            </div>
          ))}
        </div>

        {/* Donut Container */}
        <div
          className="relative rounded-2xl overflow-hidden bg-slate-950/65 border border-slate-800/50 p-6 flex items-center justify-center gap-8 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(10,22,40,0.95) 0%, rgba(0,60,40,0.08) 100%)",
          }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
          <ConsultancyDonut />
          <div className="flex flex-col gap-3 shrink-0">
            {SERVICE_ARCS.map((arc) => (
              <div key={arc.abbr} className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-sm shrink-0" style={{ backgroundColor: arc.color, opacity: arc.opacity }} />
                <span className="text-[14px] font-mono text-slate-400">{arc.abbr}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bullet points */}
        <div className="space-y-2">
          <span className="text-[14px] font-mono uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
            <Wrench className="w-3 h-3 text-slate-500" />
            Core Services
          </span>
          <ul className="space-y-3" role="list">
            {CORE_SERVICES.map(({ icon, label }) => (
              <li key={label} className="flex items-center gap-3 group text-slate-300 hover:text-white transition-colors duration-150">
                <span className="text-emerald-400 group-hover:scale-110 transition-transform shrink-0">{icon}</span>
                <span className="text-sm font-semibold leading-snug">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT COLUMN: Operational Specs Table & CTA */}
      <div className="flex flex-col gap-6">
        <div
          className="relative overflow-hidden rounded-2xl border border-slate-700/40 backdrop-blur-md"
          style={{
            background: "linear-gradient(145deg, rgba(15,23,42,0.92) 0%, rgba(0,50,35,0.12) 100%)",
            boxShadow: "0 0 0 1px rgba(0,200,150,0.06) inset, 0 20px 40px -12px rgba(0,0,0,0.5)",
          }}
        >
          <div className="px-6 pt-5 pb-4 border-b border-slate-800/50 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-sm font-display font-bold text-white uppercase tracking-wider">
              Operational Specifications
            </span>
          </div>

          <table className="w-full">
            <tbody>
              {OPERATIONAL_SPECS.map(({ metric, value, icon }) => (
                <tr key={metric} className="group border-b last:border-0 border-slate-800/40 hover:bg-emerald-500/4 transition-colors">
                  <td className="px-6 py-3.5 w-[35%]">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 group-hover:text-emerald-500/60 transition-colors shrink-0">{icon}</span>
                      <span className="text-[14px] font-mono font-semibold text-slate-400 tracking-widest uppercase">{metric}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-xs text-white font-medium text-wrap-balance">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Machinery Tags */}
        <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 backdrop-blur-sm px-5 py-4 space-y-3 shadow-md">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[14px] font-mono uppercase tracking-[0.2em] text-slate-400">
              Professional Equipment
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {consultancy.equipment.map((eq, i) => (
              <EquipmentTag key={i} label={eq} />
            ))}
          </div>
        </div>

        {/* Primary CTA (Tactical Yellow, Hover Zoom and Shimmer) */}
        <button
          onClick={() => setIsModalOpen(true)}
          id="consultancy-cta-quote-btn"
          className="group relative w-full overflow-hidden bg-[#F9F54B] hover:bg-[#fffa63] active:scale-[0.98] text-[#0F172A] font-display font-extrabold py-4 px-6 rounded-xl flex items-center justify-center gap-2.5 shadow-[0_10px_20px_rgba(249,245,75,0.15)] hover:shadow-[0_15px_30px_rgba(249,245,75,0.3)] transition-all duration-300"
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700" />
          <span className="relative text-xs tracking-widest uppercase font-extrabold">Request Technical Scoping Audit</span>
          <ArrowRight className="relative w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
        </button>
      </div>

      {/* SCOPING ASSESSMENT MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" onClick={() => { setIsModalOpen(false); handleResetForm(); }} />
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6 text-left" id="scoping-assessment-modal">
            <button onClick={() => { setIsModalOpen(false); handleResetForm(); }} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-950 border border-slate-850 transition-all">
              <X className="w-4 h-4" />
            </button>

            {!submitSuccess ? (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-emerald-400 font-mono text-[15px] uppercase tracking-widest font-extrabold">
                      NATIONAL COMPLIANCE AUDIT DISPATCH
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">Technical Assessment &amp; Compliance Audit Scoping</h3>
                  <p className="text-xs text-slate-400">Provide facility and project details to request a technical environmental impact scoping docket.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-650" /> Site &amp; Project Parameters
                    </h4>
                    <div className="space-y-1">
                      <label className="text-[14px] text-slate-400 font-mono uppercase tracking-wide block">Organization / Ministry / Project Site Name *</label>
                      <input type="text" required value={facilityName} onChange={(e) => setFacilityName(e.target.value)} placeholder="e.g. Nilepet Depot, Dar Petroleum Compound, or UN/NGO Base" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-sans" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[14px] text-slate-400 font-mono uppercase tracking-wide block">Facility Area (m²) *</label>
                        <input type="number" required value={areaSize} onChange={(e) => setAreaSize(parseInt(e.target.value) || 0)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono font-semibold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[14px] text-slate-400 font-mono uppercase tracking-wide block">Risk Classification</label>
                        <div className="relative">
                          <select value={riskClass} onChange={(e) => setRiskClass(e.target.value as RiskClass)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono font-semibold cursor-pointer appearance-none">
                            <option value={RiskClass.Low}>Class I (Low)</option>
                            <option value={RiskClass.Medium}>Class II (Med)</option>
                            <option value={RiskClass.High}>Class III (High)</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[14px] text-slate-400 font-mono uppercase tracking-wide block">Juba Operating District *</label>
                      <div className="relative">
                        <select value={locationName} onChange={(e) => setLocationName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-sans cursor-pointer appearance-none">
                          {JUBA_LOCATIONS.map((loc) => (
                            <option key={loc.name} value={loc.name}>{loc.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                      <div className="mt-2 bg-slate-950/60 border border-slate-850 p-3 rounded-xl font-mono text-[15px] text-slate-400 space-y-1.5">
                        <div className="flex justify-between">
                          <span>COORDINATES:</span>
                          <span className="text-emerald-400 font-semibold">LAT {activeLocObj.lat.toFixed(5)} / LNG {activeLocObj.lng.toFixed(5)}</span>
                        </div>
                        <div className="text-[15px] text-slate-400 leading-normal border-t border-slate-800/60 pt-1">{activeLocObj.description}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5 text-slate-650" /> Scoping &amp; Focal Point Details
                    </h4>
                    <div className="space-y-2">
                      <label className="text-[14px] text-slate-400 font-mono uppercase tracking-wide block">Required Audit Scopes</label>
                      <div className="space-y-2">
                        {CORE_SERVICES.map((srv) => {
                          const isChecked = selectedScopes.includes(srv.label);
                          return (
                            <button type="button" key={srv.label} onClick={() => handleToggleScope(srv.label)} className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${isChecked ? "bg-emerald-500/8 border-emerald-500/50 text-white font-medium" : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"}`}>
                              <div className="flex items-center gap-2">
                                <span className={isChecked ? "text-emerald-400" : "text-slate-600"}>{srv.icon}</span>
                                <span className="text-[15px] truncate max-w-[200px] sm:max-w-xs">{srv.label}</span>
                              </div>
                              <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? "bg-emerald-500 border-emerald-500 text-slate-950" : "border-slate-700"}`}>
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs font-sans">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[14px] text-slate-400 font-mono uppercase block">Project Focal Point Name *</label>
                          <input type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="e.g. Rebecca Nyandeng" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-200" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[14px] text-slate-400 font-mono uppercase block">Official Email Address *</label>
                          <input type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="e.g. nyandeng@nile-petroleum.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-200" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[14px] text-slate-400 font-mono uppercase block">Official Contact Phone *</label>
                        <input type="text" required value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="e.g. +211 912 400 300" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-200 font-mono" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[14px] text-slate-400 font-mono uppercase block">Project Brief / Scope Directives</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Outline specific regulatory requirements, targeted dates, or site details..." className="w-full h-16 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 resize-none font-sans text-slate-200" />
                      </div>
                    </div>
                  </div>
                </div>

                {errorMsg && <p className="text-red-400 font-mono text-[14px] text-center animate-pulse">{errorMsg}</p>}

                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <StickyNote className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="text-left font-mono">
                      <span className="text-[14px] text-slate-400 uppercase block leading-none">DOCKET PROFILE</span>
                      <span className="text-[14px] text-emerald-400 font-bold tracking-wide">{complexityLabel}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button type="button" onClick={() => { setIsModalOpen(false); handleResetForm(); }} className="flex-1 sm:flex-none px-5 py-3 border border-slate-850 rounded-xl hover:bg-slate-850 text-xs font-semibold text-slate-300 transition-colors">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="flex-grow sm:flex-grow-0 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 disabled:text-slate-650 text-slate-955 font-display font-black text-xs px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5 uppercase tracking-wider">
                      {isSubmitting ? (
                        <>
                          <span className="h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                          SCOPING AUDIT...
                        </>
                      ) : (
                        <>
                          Request Technical Audit Scoping
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center space-y-6 max-w-md mx-auto">
                <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg">
                  <CheckCircle className="w-10 h-10 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <span className="text-emerald-400 font-mono text-[15px] uppercase tracking-widest font-extrabold block">TECHNICAL AUDIT REGISTERED</span>
                  <h3 className="font-display text-2xl font-black text-white">Assessment Case Registered</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">Your environmental compliance scoping request has been officially logged and assigned to our Central Equatoria State engineering team in Juba.</p>
                </div>
                <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl text-left font-mono text-[15px] text-slate-300 space-y-3.5">
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">RSS AUDIT REFERENCE</span>
                    <span className="text-white font-bold">{quoteId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ORGANIZATION / SITE</span>
                    <span className="text-white truncate max-w-[200px]">{facilityName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">AREA SIZE</span>
                    <span className="text-white">{areaSize.toLocaleString()} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">RISK CLASSIFICATION</span>
                    <span className="text-emerald-400 font-semibold">{riskClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">SECTOR / DISTRICT</span>
                    <span className="text-white">{locationName}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800/80 pt-2 font-bold text-emerald-400">
                    <span>SLA COMMITMENT</span>
                    <span>&lt; 4 Hours Callout</span>
                  </div>
                </div>
                <p className="text-[14px] text-slate-400 leading-relaxed font-sans max-w-sm mx-auto">
                  Our Senior Environmental Inspector will contact the designated focal point at <strong className="text-slate-300 font-mono">{contactPhone}</strong> within 4 hours to coordinate compliance documentation and schedule the initial site audit. A copy of this case receipt has been dispatched to <strong className="text-slate-300 font-mono">{contactEmail}</strong>.
                </p>
                <div className="pt-2">
                  <button onClick={() => { setIsModalOpen(false); handleResetForm(); }} className="w-full sm:w-auto bg-slate-950 border border-slate-850 hover:border-slate-700 text-white font-sans font-semibold text-xs px-8 py-3.5 rounded-xl transition-all">Return to Consultancy Page</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function ServicesPage({
  setActiveView,
  setQuotePillar,
  onAddProductToCart,
  cartProducts,
  setPrefilledSpecs
}: ServicesPageProps) {
  const [selectedPillar, setSelectedPillar] = useState<ServicePillar>(
    ServicePillar.Consultancy
  );

  // ─── Cleaning Services Sub-tab State (Cleaning vs. Waste) ───
  const [cleaningSubTab, setCleaningSubTab] = useState<"cleaning" | "waste">("cleaning");

  // ─── Theme styling token lookup based on selected tab ───
  const themeMap = {
    [ServicePillar.Consultancy]: {
      accentClass: "accent-emerald-500",
      text: "text-emerald-400",
      border: "border-emerald-500",
      bg: "bg-emerald-500/5",
      bgSelected: "bg-emerald-500/10",
      bgSolid: "bg-emerald-500",
      glow: "shadow-emerald-500/20"
    },
    [ServicePillar.Management]: {
      accentClass: "accent-sky-500",
      text: "text-sky-400",
      border: "border-sky-500",
      bg: "bg-sky-500/5",
      bgSelected: "bg-sky-500/10",
      bgSolid: "bg-sky-500",
      glow: "shadow-sky-500/20"
    },
    [ServicePillar.Fumigation]: {
      accentClass: "accent-violet-500",
      text: "text-violet-400",
      border: "border-violet-500",
      bg: "bg-violet-500/5",
      bgSelected: "bg-violet-500/10",
      bgSolid: "bg-violet-500",
      glow: "shadow-violet-500/20"
    },
    [ServicePillar.Landscaping]: {
      accentClass: "accent-teal-500",
      text: "text-teal-400",
      border: "border-teal-500",
      bg: "bg-teal-500/5",
      bgSelected: "bg-teal-500/10",
      bgSolid: "bg-teal-500",
      glow: "shadow-teal-500/20"
    }
  };

  const theme = selectedPillar === ServicePillar.Management && cleaningSubTab === "waste"
    ? themeMap[ServicePillar.Consultancy]
    : themeMap[selectedPillar];

  // ─── Waste Management sub-tab interactive state ───
  const [wasteVolume, setWasteVolume] = useState<number>(10); // m³
  const [wasteRisk, setWasteRisk] = useState<RiskClass>(RiskClass.Low);
  const [wasteAddons, setWasteAddons] = useState<string[]>([]);

  // Dynamic activeService depending on both the main pillar and the subTab
  let activeService = SERVICES_DETAILS.find((s) => s.id === selectedPillar) || SERVICES_DETAILS[0];
  if (selectedPillar === ServicePillar.Management && cleaningSubTab === "waste") {
    activeService = {
      id: ServicePillar.Management,
      title: "Waste Collection & Disposal Services",
      subtitle: "Commercial Refuse Pickup, Certified Incineration & Secure Disposal",
      image: "/waste_hero.png",
      bulletPoints: [
        "Bulk Commercial Collection: Scheduled waste pickup and transport dispatches for corporate and retail facilities.",
        "Medical & Biological Disposal: Safety-audited containment, secure transport, and certified high-heat incineration disposal.",
        "Secure Industrial Collection: Heavy-duty container dispatches and certified disposal for municipal and retail sites.",
        "Oilfield & Chemical Transport: Specialized transport and safe disposal logistics for heavy industrial waste materials."
      ],
      equipment: ["Industrial Dumpers", "Bio-Hazardous Containers", "High-Heat Incinerators"],
      description: "South Sudan's leading eco-compliant waste collection and disposal portal."
    } as any;
  }

  // ─── Cleaning Services Interactive State ───
  const [cleaningArea, setCleaningArea] = useState<number>(2500); // sq ft
  const [cleanDepth, setCleanDepth] = useState<"standard" | "deep">("standard");
  const [cleaningFrequency, setCleaningFrequency] = useState<"one-time" | "weekly" | "bi-weekly" | "monthly">("bi-weekly");
  const [cleaningAddons, setCleaningAddons] = useState<string[]>([]);

  // ─── Fumigation Services Interactive State ───
  const [fumigationArea, setFumigationArea] = useState<number>(2000); // sq ft
  const [fumigationDepth, setFumigationDepth] = useState<"preventative" | "eradication" | "diplomatic">("preventative");
  const [fumigationFrequency, setFumigationFrequency] = useState<"one-time" | "weekly" | "bi-weekly" | "monthly">("one-time");
  const [fumigationAddons, setFumigationAddons] = useState<string[]>([]);

  // ─── Landscaping Services Interactive State ───
  const [landscapingArea, setLandscapingArea] = useState<number>(1000); // sq m
  const [landscapingDepth, setLandscapingDepth] = useState<"mowing" | "turf" | "restoration">("mowing");
  const [landscapingFrequency, setLandscapingFrequency] = useState<"one-time" | "weekly" | "bi-weekly" | "monthly">("monthly");
  const [landscapingAddons, setLandscapingAddons] = useState<string[]>([]);

  // ─── Pricing Formulas for Sidebar Calculator ───
  const getCleaningPrice = () => {
    let basePrice = 80;
    if (cleaningArea < 1000) basePrice = 80;
    else if (cleaningArea < 2000) basePrice = 130;
    else if (cleaningArea < 3000) basePrice = 180;
    else if (cleaningArea < 5000) basePrice = 230;
    else basePrice = 320;

    const multiplier = cleanDepth === "deep" ? 1.5 : 1.0;
    const subtotal = basePrice * multiplier;

    const addonsCost = cleaningAddons.reduce((sum, addon) => {
      if (addon === "Inside Fridge") return sum + 35;
      if (addon === "Inside Oven") return sum + 35;
      if (addon === "Cabinets") return sum + 30;
      if (addon === "Interior Windows") return sum + 40;
      if (addon === "Wet Wiping Baseboards") return sum + 25;
      return sum;
    }, 0);

    const totalBeforeDiscount = subtotal + addonsCost;
    let discount = 0;
    if (cleaningFrequency === "weekly") discount = 0.20;
    else if (cleaningFrequency === "bi-weekly") discount = 0.15;
    else if (cleaningFrequency === "monthly") discount = 0.10;

    const discounted = totalBeforeDiscount * (1 - discount);
    return discounted * 1.05; // 5% Juba Tax
  };

  const getWastePrice = () => {
    const basePrice = wasteVolume * 15;
    
    let riskMultiplier = 1.0;
    if (wasteRisk === RiskClass.Medium) riskMultiplier = 1.3;
    if (wasteRisk === RiskClass.High) riskMultiplier = 1.8;

    const subtotal = basePrice * riskMultiplier;

    const addonsCost = wasteAddons.reduce((sum, addon) => {
      if (addon === "HSE Waste Binning") return sum + 50;
      if (addon === "Bio-Safe Solutions") return sum + 75;
      if (addon === "Secure Disposal Certification") return sum + 40;
      return sum;
    }, 0);

    const totalBeforeDiscount = subtotal + addonsCost;
    let discount = 0;
    if (cleaningFrequency === "weekly") discount = 0.20;
    else if (cleaningFrequency === "bi-weekly") discount = 0.15;
    else if (cleaningFrequency === "monthly") discount = 0.10;

    const discounted = totalBeforeDiscount * (1 - discount);
    return discounted * 1.05; // 5% Tax
  };

  const getFumigationPrice = () => {
    let basePrice = 95;
    if (fumigationArea < 1000) basePrice = 95;
    else if (fumigationArea < 2000) basePrice = 145;
    else if (fumigationArea < 3000) basePrice = 195;
    else basePrice = 255;

    let multiplier = 1.0;
    if (fumigationDepth === "eradication") multiplier = 1.4;
    if (fumigationDepth === "diplomatic") multiplier = 1.8;

    const subtotal = basePrice * multiplier;

    const addonsCost = fumigationAddons.reduce((sum, addon) => {
      if (addon === "Malaria Vector Containment") return sum + 45;
      if (addon === "Larvicide Treatment") return sum + 30;
      if (addon === "Rodent Baiting") return sum + 35;
      return sum;
    }, 0);

    const totalBeforeDiscount = subtotal + addonsCost;
    let discount = 0;
    if (fumigationFrequency === "weekly") discount = 0.20;
    else if (fumigationFrequency === "bi-weekly") discount = 0.15;
    else if (fumigationFrequency === "monthly") discount = 0.10;

    const discounted = totalBeforeDiscount * (1 - discount);
    return discounted * 1.05;
  };

  const getLandscapingPrice = () => {
    let basePrice = 110;
    if (landscapingArea < 500) basePrice = 110;
    else if (landscapingArea < 1500) basePrice = 180;
    else if (landscapingArea < 3000) basePrice = 260;
    else basePrice = 350;

    let multiplier = 1.0;
    if (landscapingDepth === "turf") multiplier = 1.5;
    if (landscapingDepth === "restoration") multiplier = 2.0;

    const subtotal = basePrice * multiplier;

    const addonsCost = landscapingAddons.reduce((sum, addon) => {
      if (addon === "Irrigation Regulation") return sum + 60;
      if (addon === "Flower Bed Design") return sum + 45;
      if (addon === "Native Grass Planting") return sum + 30;
      return sum;
    }, 0);

    const totalBeforeDiscount = subtotal + addonsCost;
    let discount = 0;
    if (landscapingFrequency === "weekly") discount = 0.20;
    else if (landscapingFrequency === "bi-weekly") discount = 0.15;
    else if (landscapingFrequency === "monthly") discount = 0.10;

    const discounted = totalBeforeDiscount * (1 - discount);
    return discounted * 1.05;
  };

  // ─── CTA scheduling handler ───
  const handleLaunchQuote = () => {
    if (selectedPillar === ServicePillar.Management) {
      if (cleaningSubTab === "waste") {
        setPrefilledSpecs({
          pillar: ServicePillar.Management,
          isWaste: true,
          wasteVolume: wasteVolume,
          riskClass: wasteRisk,
          addons: wasteAddons,
          frequency: cleaningFrequency
        });
        setQuotePillar(ServicePillar.Management);
      } else {
        let sqRange = "1,000 - 1,999 sq ft";
        if (cleaningArea < 1000) sqRange = "< 1,000 sq ft";
        else if (cleaningArea < 2000) sqRange = "1,000 - 1,999 sq ft";
        else if (cleaningArea < 3000) sqRange = "2,000 - 2,999 sq ft";
        else sqRange = "3,000+ sq ft";

        setPrefilledSpecs({
          pillar: ServicePillar.Management,
          cleanType: cleanDepth,
          sqFtRange: sqRange,
          areaSize: cleaningArea,
          addons: cleaningAddons,
          frequency: cleaningFrequency,
          isWaste: false
        });
        setQuotePillar(ServicePillar.Management);
      }
    } else if (selectedPillar === ServicePillar.Fumigation) {
      let sqRange = "1,000 - 1,999 sq ft";
      if (fumigationArea < 1000) sqRange = "< 1,000 sq ft";
      else if (fumigationArea < 2000) sqRange = "1,000 - 1,999 sq ft";
      else if (fumigationArea < 3000) sqRange = "2,000 - 2,999 sq ft";
      else sqRange = "3,000+ sq ft";

      // Map preventative/eradication/diplomatic to Standard or Deep
      const mappedType = fumigationDepth === "preventative" ? "standard" : "deep";

      setPrefilledSpecs({
        pillar: ServicePillar.Fumigation,
        cleanType: mappedType,
        sqFtRange: sqRange,
        areaSize: fumigationArea,
        addons: fumigationAddons,
        frequency: fumigationFrequency,
        isWaste: false
      });
      setQuotePillar(ServicePillar.Fumigation);
    } else if (selectedPillar === ServicePillar.Landscaping) {
      // Map landscaping Area in sq m to approx sq ft equivalent for QuoteWizard
      const approxSqFt = landscapingArea * 10.76;
      let sqRange = "1,000 - 1,999 sq ft";
      if (approxSqFt < 1000) sqRange = "< 1,000 sq ft";
      else if (approxSqFt < 2000) sqRange = "1,000 - 1,999 sq ft";
      else if (approxSqFt < 3000) sqRange = "2,000 - 2,999 sq ft";
      else sqRange = "3,000+ sq ft";

      const mappedType = landscapingDepth === "mowing" ? "standard" : "deep";

      setPrefilledSpecs({
        pillar: ServicePillar.Landscaping,
        cleanType: mappedType,
        sqFtRange: sqRange,
        areaSize: Math.round(approxSqFt),
        addons: landscapingAddons,
        frequency: landscapingFrequency,
        isWaste: false
      });
      setQuotePillar(ServicePillar.Landscaping);
    }
    setActiveView(ActiveView.QuoteFlow);
  };

  // Addons toggle helpers
  const handleToggleAddon = (addon: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(prev => prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]);
  };

  const getRecommendedProducts = (pillar: ServicePillar): Product[] => {
    if (pillar === ServicePillar.Management && cleaningSubTab === "waste") {
      return [PRODUCTS[2], PRODUCTS[3]]; // environmental/waste products
    }
    switch (pillar) {
      case ServicePillar.Consultancy: return [PRODUCTS[3]];
      case ServicePillar.Management: return [PRODUCTS[0], PRODUCTS[1]];
      case ServicePillar.Fumigation: return [PRODUCTS[2], PRODUCTS[3]];
      case ServicePillar.Landscaping: return [PRODUCTS[4], PRODUCTS[3]];
      default: return [];
    }
  };

  const pm = PILLAR_META[selectedPillar];

  return (
    <div
      className="bg-[#0F172A] text-slate-100 min-h-screen py-16 px-4 md:px-8 selection:bg-emerald-500 selection:text-[#0F172A]"
      id="services-page-root"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* ── 1. Page Title & Header ── */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-emerald-400 font-mono text-xs font-semibold tracking-[0.2em] uppercase">
            CLEAN WORLD INTEGRATED ECOSYSTEM
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight text-wrap-balance">
            Our Key Services &amp;{" "}
            <span className="text-emerald-400">Quality Standards</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto font-sans">
            Delivered to the highest professional standards using safety-audited materials, background-checked personnel, and non-toxic bio-compounds compliant with South Sudanese HSE frameworks.
          </p>
        </div>

        {/* ── 2. Pill Selector Tab Bar (4 tabs with horizontal slider indicator) ── */}
        <div className="flex justify-center" id="services-selector-tabs">
          <div className="relative bg-[#1E293B] border border-slate-800 p-1.5 rounded-full flex w-full max-w-6xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] overflow-hidden">
            {/* Smooth active indicator slider */}
            <div
              className="absolute top-1.5 bottom-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-sky-500/20 border border-emerald-500/30 shadow-md transition-all duration-300 ease-out"
              style={{
                width: "calc(25% - 6px)",
                transform: `translateX(${
                  selectedPillar === ServicePillar.Consultancy ? "0%" :
                  selectedPillar === ServicePillar.Management ? "100%" :
                  selectedPillar === ServicePillar.Fumigation ? "200%" : "300%"
                })`,
              }}
            />

            {SERVICES_DETAILS.map((service) => {
              const isActive = selectedPillar === service.id;
              const meta = PILLAR_META[service.id];
              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedPillar(service.id)}
                  role="tab"
                  aria-selected={isActive}
                  className={`relative flex-1 py-3.5 text-[14px] md:text-[15px] lg:text-[14px] xl:text-[15px] font-display font-bold uppercase tracking-tighter md:tracking-tight lg:tracking-normal xl:tracking-wider rounded-full transition-all duration-200 focus:outline-none flex items-center justify-center gap-1.5 ${
                    isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className={`shrink-0 transition-colors ${isActive ? meta.color : "text-slate-400"}`}>
                    {meta.icon}
                  </span>
                  <span className="hidden md:inline whitespace-nowrap">{meta.label}</span>
                  <span className="inline md:hidden">{service.title.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 3. Render Panel Grid ── */}
        {selectedPillar === ServicePillar.Consultancy ? (
          <ConsultancyPanel />
        ) : selectedPillar === ServicePillar.Fumigation ? (
          <FumigationPanel
            setActiveView={setActiveView}
            setQuotePillar={setQuotePillar}
            setPrefilledSpecs={setPrefilledSpecs}
          />
        ) : (
          /* Premium Interactive Panel for Management & Landscaping */
          <div className="space-y-8">
            {selectedPillar === ServicePillar.Management && (
              <div className="flex justify-center md:justify-start" id="cleaning-sub-tabs">
                <div className="relative bg-[#1E293B] border border-slate-800 p-1.5 rounded-full flex w-full max-w-md shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                  {/* Slider background highlight */}
                  <div
                    className="absolute top-1.5 bottom-1.5 rounded-full bg-slate-900 border border-slate-800/80 shadow transition-all duration-200"
                    style={{
                      width: "calc(50% - 3px)",
                      transform: `translateX(${cleaningSubTab === "cleaning" ? "0%" : "100%"})`
                    }}
                  />
                  <button
                    onClick={() => setCleaningSubTab("cleaning")}
                    className={`relative flex-1 py-2 text-[14px] sm:text-xs font-display font-bold uppercase tracking-wider rounded-full transition-all duration-200 ${
                      cleaningSubTab === "cleaning"
                        ? "text-sky-400 font-extrabold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Cleaning Services
                  </button>
                  <button
                    onClick={() => setCleaningSubTab("waste")}
                    className={`relative flex-1 py-2 text-[14px] sm:text-xs font-display font-bold uppercase tracking-wider rounded-full transition-all duration-200 ${
                      cleaningSubTab === "waste"
                        ? "text-emerald-400 font-extrabold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Waste Collection & Disposal
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start animate-fadeIn">
              {/* LHS Content Section (Col Span 7) */}
              <div className="lg:col-span-7 space-y-8">
                {/* Hero Visual Section with Glassmorphic Overlay */}
                <div className="relative h-64 sm:h-96 rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl">
                  <img
                    src={activeService.image}
                  alt={activeService.title}
                  className="w-full h-full object-cover scale-[1.02] transition-transform duration-500 hover:scale-[1.04]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-md bg-[#1E293B]/60 shadow-[0_15px_30px_rgba(0,0,0,0.3)] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${pm.color.replace("text", "bg")} animate-pulse`} />
                    <span className="text-[14px] font-mono font-bold tracking-widest text-slate-300 uppercase">
                      How We Work &amp; Dispatch
                    </span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-tight">
                    {activeService.subtitle}
                  </h3>
                </div>
              </div>

              {/* Commitments Cards */}
              <div className="space-y-4">
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  Service Breakdown &amp; Sub-Categories
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeService.bulletPoints.map((bullet, idx) => {
                    const [title, desc] = bullet.includes(":") ? bullet.split(":") : [bullet, ""];
                    return (
                      <div
                        key={idx}
                        className="bg-[#1E293B] border border-slate-800/60 rounded-2xl p-5 hover:border-slate-700 hover:scale-[1.02] transition-all duration-300 shadow-md"
                      >
                        <h4 className="text-white font-display font-bold text-sm mb-1.5 flex items-center gap-2">
                          <ChevronRight className={`w-4 h-4 ${pm.color}`} />
                          {title}
                        </h4>
                        {desc && <p className="text-xs text-slate-400 font-sans leading-relaxed">{desc.trim()}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Products Catalog */}
              <div className="bg-[#1E293B] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    Recommended Safe Products
                  </h3>
                  <button
                    onClick={() => setActiveView(ActiveView.Shop)}
                    className="text-[14px] font-mono text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
                  >
                    View Catalog
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Eco-friendly products for maintaining a clean environment after our service.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {getRecommendedProducts(selectedPillar).map((prod: Product) => {
                    const isInCart = (cartProducts[prod.id] || 0) > 0;
                    return (
                      <div key={prod.id} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between gap-3 hover:border-slate-750 transition-colors">
                        <div className="flex items-center gap-3">
                          <img src={prod.image} alt={prod.name} width={48} height={48} loading="lazy" className="w-12 h-12 rounded-lg object-cover bg-slate-950 shrink-0 border border-slate-800" referrerPolicy="no-referrer" />
                          <div>
                            <div className="text-xs font-semibold text-white truncate max-w-[140px]">{prod.name}</div>
                            <div className="text-[14px] text-slate-400 font-mono mt-0.5">${prod.price.toFixed(2)} / {prod.unit}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => onAddProductToCart(prod, 1)}
                          className={`p-2 rounded-lg transition-all shrink-0 ${isInCart ? `${theme.bgSolid} text-slate-955 shadow-md ${theme.glow}` : "bg-[#1E293B] text-slate-300 hover:bg-slate-800"}`}
                        >
                          {isInCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RHS Sidebar Section (Col Span 5) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <div
                className="relative overflow-hidden bg-[#1E293B]/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-md"
                style={{
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#38BDF8]/40 to-transparent" />

                <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/70">
                  <div className="flex items-center gap-2">
                    <Activity className={`w-4 h-4 ${pm.color} shrink-0`} />
                    <span className="text-xs font-display font-bold text-white uppercase tracking-wider">
                      Site Estimate Scoping
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#0F172A] px-2.5 py-1 rounded-md border border-slate-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[15px] font-mono text-emerald-400 font-extrabold uppercase">Live Pulse</span>
                  </div>
                </div>

                {/* Interactive Controls */}
                <div className="space-y-5">
                  {/* Slider sizing */}
                  {selectedPillar === ServicePillar.Management && (
                    cleaningSubTab === "waste" ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-mono uppercase tracking-wider">Refuse Volume</span>
                          <span className="text-white font-mono font-bold bg-[#0F172A] px-2 py-0.5 rounded border border-slate-800">
                            {wasteVolume} m³ (cubic meters)
                          </span>
                        </div>
                        <input type="range" min={1} max={100} value={wasteVolume} onChange={(e) => setWasteVolume(Number(e.target.value))} className={`w-full h-1.5 bg-[#0F172A] rounded-lg appearance-none cursor-pointer border border-slate-800 ${theme.accentClass}`} />
                        <div className="flex justify-between text-[14px] font-mono text-slate-400 uppercase">
                          <span>1 m³</span>
                          <span>50 m³</span>
                          <span>100 m³</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-mono uppercase tracking-wider">Property Size</span>
                          <span className="text-white font-mono font-bold bg-[#0F172A] px-2 py-0.5 rounded border border-slate-800">
                            {cleaningArea.toLocaleString()} SQ FT
                          </span>
                        </div>
                        <input type="range" min={500} max={10000} step={100} value={cleaningArea} onChange={(e) => setCleaningArea(Number(e.target.value))} className={`w-full h-1.5 bg-[#0F172A] rounded-lg appearance-none cursor-pointer border border-slate-800 ${theme.accentClass}`} />
                        <div className="flex justify-between text-[14px] font-mono text-slate-400 uppercase">
                          <span>500 sq ft</span>
                          <span>5,000 sq ft</span>
                          <span>10,000 sq ft</span>
                        </div>
                      </div>
                    )
                  )}

                  {selectedPillar === ServicePillar.Fumigation && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-mono uppercase tracking-wider">Scoping Area</span>
                        <span className="text-white font-mono font-bold bg-[#0F172A] px-2 py-0.5 rounded border border-slate-800">
                          {fumigationArea.toLocaleString()} SQ FT
                        </span>
                      </div>
                      <input type="range" min={500} max={8000} step={100} value={fumigationArea} onChange={(e) => setFumigationArea(Number(e.target.value))} className={`w-full h-1.5 bg-[#0F172A] rounded-lg appearance-none cursor-pointer border border-slate-800 ${theme.accentClass}`} />
                      <div className="flex justify-between text-[14px] font-mono text-slate-400 uppercase">
                        <span>500 sq ft</span>
                        <span>4,000 sq ft</span>
                        <span>8,000 sq ft</span>
                      </div>
                    </div>
                  )}

                  {selectedPillar === ServicePillar.Landscaping && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-mono uppercase tracking-wider">Lawn/Garden Area</span>
                        <span className="text-white font-mono font-bold bg-[#0F172A] px-2 py-0.5 rounded border border-slate-800">
                          {landscapingArea.toLocaleString()} SQ METERS
                        </span>
                      </div>
                      <input type="range" min={100} max={5000} step={50} value={landscapingArea} onChange={(e) => setLandscapingArea(Number(e.target.value))} className={`w-full h-1.5 bg-[#0F172A] rounded-lg appearance-none cursor-pointer border border-slate-800 ${theme.accentClass}`} />
                      <div className="flex justify-between text-[14px] font-mono text-slate-400 uppercase">
                        <span>100 m²</span>
                        <span>2,500 m²</span>
                        <span>5,000 m²</span>
                      </div>
                    </div>
                  )}

                  {/* Service Depth selectors */}
                  {selectedPillar === ServicePillar.Management && (
                    cleaningSubTab === "waste" ? (
                      <div className="space-y-2">
                        <span className="text-[14px] text-slate-400 font-mono uppercase tracking-wider block">Material Risk Tier</span>
                        <div className="grid grid-cols-3 gap-1.5 text-[15px] font-mono font-bold">
                          {[
                            { label: "Class I (Low)", val: RiskClass.Low },
                            { label: "Class II (Med)", val: RiskClass.Medium },
                            { label: "Class III (High)", val: RiskClass.High }
                          ].map((t) => (
                            <button key={t.val} onClick={() => setWasteRisk(t.val)} className={`py-2 rounded-xl border text-center transition-all ${wasteRisk === t.val ? `${theme.bgSelected} ${theme.border} ${theme.text} font-bold` : "bg-[#0F172A] border-slate-800 text-slate-400"}`}>
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <span className="text-[14px] text-slate-400 font-mono uppercase tracking-wider block">Service Depth Level</span>
                        <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                          {["standard", "deep"].map((t) => (
                            <button key={t} onClick={() => setCleanDepth(t as any)} className={`py-2 px-3 rounded-xl border text-center transition-all capitalize ${cleanDepth === t ? `${theme.bgSelected} ${theme.border} ${theme.text} font-bold` : "bg-[#0F172A] border-slate-800 text-slate-400"}`}>
                              {t} Clean
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  )}

                  {selectedPillar === ServicePillar.Fumigation && (
                    <div className="space-y-2">
                      <span className="text-[14px] text-slate-400 font-mono uppercase tracking-wider block">Treatment Intensity</span>
                      <div className="grid grid-cols-3 gap-1.5 text-[15px] font-mono font-bold">
                        {[
                          { label: "Preventative", val: "preventative" },
                          { label: "Eradication", val: "eradication" },
                          { label: "Perimeter", val: "diplomatic" }
                        ].map((t) => (
                          <button key={t.val} onClick={() => setFumigationDepth(t.val as any)} className={`py-2 rounded-xl border text-center transition-all ${fumigationDepth === t.val ? `${theme.bgSelected} ${theme.border} ${theme.text} font-bold` : "bg-[#0F172A] border-slate-800 text-slate-400"}`}>
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPillar === ServicePillar.Landscaping && (
                    <div className="space-y-2">
                      <span className="text-[14px] text-slate-400 font-mono uppercase tracking-wider block">Eco-Design Tier</span>
                      <div className="grid grid-cols-3 gap-1.5 text-[15px] font-mono font-bold">
                        {[
                          { label: "Mowing & Trim", val: "mowing" },
                          { label: "Turf Design", val: "turf" },
                          { label: "Restoration", val: "restoration" }
                        ].map((t) => (
                          <button key={t.val} onClick={() => setLandscapingDepth(t.val as any)} className={`py-2 rounded-xl border text-center transition-all ${landscapingDepth === t.val ? `${theme.bgSelected} ${theme.border} ${theme.text} font-bold` : "bg-[#0F172A] border-slate-800 text-slate-400"}`}>
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Frequency selection */}
                  <div className="space-y-2">
                    <span className="text-[14px] text-slate-400 font-mono uppercase tracking-wider block">Frequency Discount</span>
                    <div className="grid grid-cols-4 gap-1.5 text-[15px] font-mono font-bold">
                      {[
                        { label: "Single", val: "one-time", disc: "0%" },
                        { label: "Weekly", val: "weekly", disc: "-20%" },
                        { label: "Bi-Wkly", val: "bi-weekly", disc: "-15%" },
                        { label: "Monthly", val: "monthly", disc: "-10%" }
                      ].map((f) => {
                        const isSelected =
                          selectedPillar === ServicePillar.Management ? cleaningFrequency === f.val :
                          selectedPillar === ServicePillar.Fumigation ? fumigationFrequency === f.val :
                          landscapingFrequency === f.val;
                        const selectFn = () =>
                          selectedPillar === ServicePillar.Management ? setCleaningFrequency(f.val as any) :
                          selectedPillar === ServicePillar.Fumigation ? setFumigationFrequency(f.val as any) :
                          setLandscapingFrequency(f.val as any);
                        return (
                          <button key={f.val} onClick={selectFn} className={`py-2 rounded-lg border text-center transition-all flex flex-col justify-between items-center ${isSelected ? `bg-slate-900 ${theme.border} ${theme.text} font-bold` : "bg-[#0F172A] border-slate-800 text-slate-400"}`}>
                            <span>{f.label}</span>
                            <span className={`text-[14px] mt-0.5 opacity-80 ${isSelected ? "text-white" : "text-slate-500"}`}>{f.disc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add-ons checkboxes */}
                  <div className="space-y-2">
                    <span className="text-[14px] text-slate-400 font-mono uppercase tracking-wider block">HSE Add-on Protocols</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedPillar === ServicePillar.Management && (
                        cleaningSubTab === "waste" ? (
                          [
                            "HSE Waste Binning", "Bio-Safe Solutions", "Secure Disposal Certification"
                          ].map((addon) => {
                            const isSelected = wasteAddons.includes(addon);
                            return (
                              <button key={addon} onClick={() => handleToggleAddon(addon, wasteAddons, setWasteAddons)} className={`px-2.5 py-1.5 rounded-full border text-left text-[15px] font-semibold transition-all ${isSelected ? `${theme.bgSelected} ${theme.border} ${theme.text} font-bold` : "bg-[#0F172A] border-slate-800 text-slate-355"}`}>
                                {addon}
                              </button>
                            );
                          })
                        ) : (
                          [
                            "Inside Fridge", "Inside Oven", "Cabinets", "Interior Windows", "Wet Wiping Baseboards"
                          ].map((addon) => {
                            const isSelected = cleaningAddons.includes(addon);
                            return (
                              <button key={addon} onClick={() => handleToggleAddon(addon, cleaningAddons, setCleaningAddons)} className={`px-2.5 py-1.5 rounded-full border text-left text-[15px] font-semibold transition-all ${isSelected ? `${theme.bgSelected} ${theme.border} ${theme.text} font-bold` : "bg-[#0F172A] border-slate-800 text-slate-350"}`}>
                                {addon}
                              </button>
                            );
                          })
                        )
                      )}
                      {selectedPillar === ServicePillar.Fumigation &&
                        [
                          "Malaria Vector Containment", "Larvicide Treatment", "Rodent Baiting"
                        ].map((addon) => {
                          const isSelected = fumigationAddons.includes(addon);
                          return (
                            <button key={addon} onClick={() => handleToggleAddon(addon, fumigationAddons, setFumigationAddons)} className={`px-2.5 py-1.5 rounded-full border text-left text-[15px] font-semibold transition-all ${isSelected ? `${theme.bgSelected} ${theme.border} ${theme.text} font-bold` : "bg-[#0F172A] border-slate-800 text-slate-350"}`}>
                              {addon}
                            </button>
                          );
                        })
                      }
                      {selectedPillar === ServicePillar.Landscaping &&
                        [
                          "Irrigation Regulation", "Flower Bed Design", "Native Grass Planting"
                        ].map((addon) => {
                          const isSelected = landscapingAddons.includes(addon);
                          return (
                            <button key={addon} onClick={() => handleToggleAddon(addon, landscapingAddons, setLandscapingAddons)} className={`px-2.5 py-1.5 rounded-full border text-left text-[15px] font-semibold transition-all ${isSelected ? `${theme.bgSelected} ${theme.border} ${theme.text} font-bold` : "bg-[#0F172A] border-slate-800 text-slate-350"}`}>
                              {addon}
                            </button>
                          );
                        })
                      }
                    </div>
                  </div>
                </div>

                {/* Estimate display */}
                <div className="bg-[#0F172A] border border-slate-800/80 rounded-2xl p-4.5 space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[14px] font-mono text-slate-400 uppercase tracking-widest">Estimated Subtotal</span>
                    <span className="text-2xl font-display font-black text-white">
                      ${
                        selectedPillar === ServicePillar.Management ? (
                          cleaningSubTab === "waste" ? getWastePrice().toFixed(2) : getCleaningPrice().toFixed(2)
                        ) :
                        selectedPillar === ServicePillar.Fumigation ? getFumigationPrice().toFixed(2) :
                        getLandscapingPrice().toFixed(2)
                      }
                    </span>
                  </div>
                  <div className="border-t border-slate-800/60 pt-3 space-y-2 text-[14px] font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>SLA Callout Commitment:</span>
                      <span className="text-white font-bold">&lt; 4 Hours Fast Dispatch</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Operation Territory:</span>
                      <span className="text-white font-bold">Central Equatoria State</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quality Standards:</span>
                      <span className="text-emerald-400 font-bold">ISO 9001/14001 Registered</span>
                    </div>
                  </div>
                </div>

                {/* Machinery / equipment tags in sidebar */}
                <div className="space-y-2">
                  <span className="text-[14px] font-mono uppercase tracking-[0.2em] text-slate-400 block">
                    Dedicated Dispatch Gear
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeService.equipment.map((tag, idx) => (
                      <span key={idx} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[15px] font-mono font-semibold ${theme.text} ${theme.bg} border ${theme.border}/20`}>
                        <Cpu className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Primary CTA (Tactical Yellow, Hover Zoom and Shimmer) */}
                <button
                  onClick={handleLaunchQuote}
                  id="services-cta-quote-btn"
                  className="group relative w-full overflow-hidden bg-[#F9F54B] hover:bg-[#fffa63] active:scale-[0.98] text-[#0F172A] font-display font-extrabold py-4 px-6 rounded-xl flex items-center justify-center gap-2.5 shadow-[0_10px_20px_rgba(249,245,75,0.15)] hover:shadow-[0_15px_30px_rgba(249,245,75,0.3)] transition-all duration-300"
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700" />
                  <span className="relative text-xs tracking-widest uppercase font-extrabold">Get a Free Service Quote</span>
                  <ArrowRight className="relative w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                </button>
              </div>

              {/* Emergency standby priorities */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden">
                <div className="absolute right-0 top-0 h-8 w-8 bg-emerald-500/5 border-l border-b border-emerald-500/10 rounded-bl-2xl flex items-center justify-center">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <div className="text-left font-sans">
                  <span className="text-[14px] font-mono text-slate-400 block uppercase">24/7 Priority Emergency Line</span>
                  <span className="text-xs font-semibold text-white block">+211 924 444 044</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
