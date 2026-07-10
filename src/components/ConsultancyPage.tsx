import React, { useState, useEffect, useRef } from "react";
import { ActiveView, ServicePillar, RiskClass, B2BInquiry } from "../types";
import { SERVICES_DETAILS, JUBA_LOCATIONS } from "../data";
import {
  ShieldCheck,
  Clock,
  FlaskConical,
  ArrowRight,
  Cpu,
  CheckCircle,
  X,
  Building,
  Phone,
  Mail,
  StickyNote,
  ChevronDown,
  Trash2,
  FileText,
  BarChart3,
  MapPin,
  Zap,
  Award,
  Check,
  Wrench,
  HelpCircle,
  FileCheck2
} from "lucide-react";
import { motion } from "motion/react";

interface ConsultancyPageProps {
  setActiveView: (view: ActiveView) => void;
  setQuotePillar: (pillar: ServicePillar) => void;
  b2bInquiries?: B2BInquiry[];
  onAddB2BInquiry?: (inquiry: B2BInquiry) => void;
}


const EquipmentTag: React.FC<{ label: string }> = ({ label }) => {
  return (
    <span
      className="
        inline-flex items-center gap-1.5
        text-xs font-mono font-medium
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
};

// ─── Animated SVG Donut Ring ──────────────────────────────────────────────────
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
        <span className="absolute top-1 left-1/2 -translate-x-1/2 text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase">
          EIA
        </span>
        <span className="absolute top-1/2 right-0 -translate-y-1/2 text-xs font-mono font-bold text-emerald-400/82 tracking-widest uppercase">
          WASTE
        </span>
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs font-mono font-bold text-emerald-400/68 tracking-widest uppercase">
          HSE
        </span>
        <span className="absolute top-1/2 left-0 -translate-y-1/2 text-xs font-mono font-bold text-emerald-400/55 tracking-widest uppercase">
          ESG
        </span>
      </div>
    </div>
  );
}

export default function ConsultancyPage({ setActiveView, setQuotePillar, b2bInquiries, onAddB2BInquiry }: ConsultancyPageProps) {
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

  // Inline B2B Scoping Inquiry form state
  const [inlineFacilityName, setInlineFacilityName] = useState("");
  const [inlineContactName, setInlineContactName] = useState("");
  const [inlineContactPhone, setInlineContactPhone] = useState("");
  const [inlineContactEmail, setInlineContactEmail] = useState("");
  const [inlineFacilityType, setInlineFacilityType] = useState("Oil & Gas");
  const [inlineScopes, setInlineScopes] = useState<string[]>(["Environmental Impact Assessment (EIA)"]);
  const [inlineAreaSize, setInlineAreaSize] = useState<number>(2500);
  const [inlineRiskClass, setInlineRiskClass] = useState<RiskClass>(RiskClass.Low);
  const [inlineNotes, setInlineNotes] = useState("");
  const [inlineSubmitting, setInlineSubmitting] = useState(false);
  const [inlineSuccess, setInlineSuccess] = useState(false);
  const [inlineQuoteId, setInlineQuoteId] = useState("");
  const [inlineError, setInlineError] = useState("");


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
    { metric: "REPORTING", value: "SDS Sheets · GPS Geo-Tag", icon: <FileText className="w-3.5 h-3.5" /> },
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
      if (onAddB2BInquiry) {
        onAddB2BInquiry({
          id: randomId,
          companyName: facilityName,
          contactName,
          contactPhone,
          contactEmail,
          facilityType: "Corporate Facility Scoping",
          complianceSectors: selectedScopes,
          siteArea: areaSize,
          notes,
          createdAt: new Date().toISOString(),
          status: "received"
        });
      }
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

  const handleToggleInlineScope = (scope: string) => {
    setInlineScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const handleInlineFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError("");

    if (!inlineFacilityName.trim()) {
      setInlineError("Organization / Project site name is required.");
      return;
    }
    if (!inlineContactName.trim() || !inlineContactPhone.trim()) {
      setInlineError("Focal point name and contact phone are required.");
      return;
    }
    if (inlineScopes.length === 0) {
      setInlineError("Please select at least one compliance sector.");
      return;
    }
    if (inlineAreaSize <= 0) {
      setInlineError("Please enter a valid site area size.");
      return;
    }

    setInlineSubmitting(true);

    setTimeout(() => {
      const randomId = `RSS-MOE-EC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setInlineQuoteId(randomId);
      setInlineSubmitting(false);
      setInlineSuccess(true);

      if (onAddB2BInquiry) {
        onAddB2BInquiry({
          id: randomId,
          companyName: inlineFacilityName,
          contactName: inlineContactName,
          contactPhone: inlineContactPhone,
          contactEmail: inlineContactEmail,
          facilityType: inlineFacilityType,
          complianceSectors: inlineScopes,
          siteArea: inlineAreaSize,
          notes: inlineNotes,
          createdAt: new Date().toISOString(),
          status: "received"
        });
      }
    }, 1200);
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
    <div className="bg-slate-900 text-slate-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8" id="consultancy-page-root">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-16 text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
          <FlaskConical className="w-3.5 h-3.5 animate-pulse" />
          B2B Advisory Portal
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
          Environmental Consultancy
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Certified Health, Safety, and Environment (HSE) regulatory audits, EIA compliance mapping, and zero-leakage waste logistics for high-level corporations and institutions in Juba.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-fadeIn" id="consultancy-panel">
          {/* LEFT COLUMN: Donut Ring & Stats */}
          <div className="flex flex-col gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-px w-8 bg-emerald-500/60" />
                <span className="text-xs text-emerald-400 font-mono font-semibold tracking-[0.2em] uppercase">
                  Audits &amp; ESG Frameworks
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight text-wrap-balance">
                High-Stakes Technical Compliance &amp; <span className="text-emerald-400">Risk Assessment</span>
              </h2>
              <p className="text-sm text-slate-450 font-sans leading-relaxed max-w-[52ch]">
                Regulatory-grade environmental audits for industrial facilities, government projects, and multinational ESG programs. Our systems fully align with South Sudanese environmental laws and ISO standards.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {CREDIBILITY_STATS.map(({ value, label, sub }) => (
                <div key={label} className="border-l-2 border-emerald-500/30 pl-3 py-1 flex flex-col">
                  <span className="font-display text-xl font-bold text-white leading-none">{value}</span>
                  <span className="font-display text-xs font-semibold text-emerald-400 leading-none mt-1">{label}</span>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide leading-none mt-1.5">{sub}</span>
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
                    <span className="text-xs font-mono text-slate-400">{arc.abbr}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bullet points */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-450 flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-slate-500" />
                Core Scope Competencies
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
                          <span className="text-slate-550 group-hover:text-emerald-500/60 transition-colors shrink-0">{icon}</span>
                          <span className="text-xs font-mono font-semibold text-slate-400 tracking-widest uppercase">{metric}</span>
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
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-450">
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
        </div>

        {/* INLINE B2B SCOPING ASSESSMENT FORM */}
        <div className="max-w-4xl mx-auto mt-16 scroll-mt-24" id="b2b-inquiry-section">
          {!inlineSuccess ? (
            <form onSubmit={handleInlineFormSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
              {/* Glow line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-extrabold">
                    Request a Corporate Compliance Audit
                  </span>
                </div>
                <h3 className="font-display text-2xl font-extrabold text-white">
                  Technical Environmental Scoping Inquiry
                </h3>
                <p className="text-xs text-slate-400">
                  No account registration required. Complete the specifications below, and our HSE inspection team will compile a regulatory compliance docket for your facility.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Site parameters */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-500" /> Organization &amp; Project Site Details
                  </h4>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-450 font-mono uppercase tracking-wide block">Organization Name *</label>
                    <input
                      type="text"
                      required
                      value={inlineFacilityName}
                      onChange={(e) => setInlineFacilityName(e.target.value)}
                      placeholder="e.g. Nilepet Refinery, UN House Juba, NGO Compound"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-450 font-mono uppercase tracking-wide block">Facility Area (m²)</label>
                      <input
                        type="number"
                        required
                        min={100}
                        max={100000}
                        value={inlineAreaSize}
                        onChange={(e) => setInlineAreaSize(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-450 font-mono uppercase tracking-wide block">Facility Type</label>
                      <div className="relative">
                        <select
                          value={inlineFacilityType}
                          onChange={(e) => setInlineFacilityType(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-sans cursor-pointer appearance-none"
                        >
                          <option value="Oil &amp; Gas">Oil &amp; Gas / Refinery</option>
                          <option value="Government Facility">Government Facility</option>
                          <option value="NGO / Embassy">NGO / Embassy Base</option>
                          <option value="Manufacturing">Manufacturing Plant</option>
                          <option value="Healthcare">Healthcare Facility</option>
                          <option value="Other">Other Corporate Site</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-450 absolute right-3.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-455 font-mono uppercase tracking-wide block">Estimated Site Area Range</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={100}
                        max={50000}
                        step={500}
                        value={inlineAreaSize}
                        onChange={(e) => setInlineAreaSize(parseInt(e.target.value))}
                        className="flex-1 accent-emerald-500 h-1 bg-slate-950 rounded-lg cursor-pointer"
                      />
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-2 py-1 rounded">
                        {inlineAreaSize.toLocaleString()} m²
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-455 font-mono uppercase tracking-wide block">Risk Classification</label>
                    <div className="relative">
                      <select
                        value={inlineRiskClass}
                        onChange={(e) => setInlineRiskClass(e.target.value as RiskClass)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono font-semibold cursor-pointer appearance-none"
                      >
                        <option value={RiskClass.Low}>Class I (Low Risk)</option>
                        <option value={RiskClass.Medium}>Class II (Medium Risk)</option>
                        <option value={RiskClass.High}>Class III (High Risk)</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Scoping details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> Compliance Requirements &amp; Focal Point
                  </h4>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-455 font-mono uppercase tracking-wide block">Required Scopes</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CORE_SERVICES.map((srv) => {
                        const isChecked = inlineScopes.includes(srv.label);
                        return (
                          <button
                            type="button"
                            key={srv.label}
                            onClick={() => handleToggleInlineScope(srv.label)}
                            className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                              isChecked
                                ? "bg-emerald-500/8 border-emerald-500/40 text-white font-semibold"
                                : "bg-slate-950 border-slate-850 text-slate-450 hover:text-slate-200"
                            }`}
                          >
                            <span className="truncate max-w-[120px]">{srv.label}</span>
                            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ml-1.5 ${
                              isChecked ? "bg-emerald-500 border-emerald-500 text-slate-950" : "border-slate-700"
                            }`}>
                              {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-450 font-mono uppercase block">Focal Point Name *</label>
                      <input
                        type="text"
                        required
                        value={inlineContactName}
                        onChange={(e) => setInlineContactName(e.target.value)}
                        placeholder="Rebecca Nyandeng"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-450 font-mono uppercase block">Focal Point Email</label>
                      <input
                        type="email"
                        value={inlineContactEmail}
                        onChange={(e) => setInlineContactEmail(e.target.value)}
                        placeholder="e.g. hse@nilepet.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-450 font-mono uppercase block">Direct Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      value={inlineContactPhone}
                      onChange={(e) => setInlineContactPhone(e.target.value)}
                      placeholder="e.g. +211 912 400 300"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-200 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-450 font-mono uppercase block">Project directives &amp; Notes</label>
                    <textarea
                      value={inlineNotes}
                      onChange={(e) => setInlineNotes(e.target.value)}
                      placeholder="Optional details, targeted audit dates, specific ISO guidelines..."
                      className="w-full h-12 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 resize-none font-sans text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {inlineError && (
                <p className="text-red-400 font-mono text-xs text-center animate-pulse">{inlineError}</p>
              )}

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={inlineSubmitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-display font-black text-xs px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer"
                >
                  {inlineSubmitting ? (
                    <>
                      <span className="h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Registering Request...
                    </>
                  ) : (
                    <>
                      Submit Scoping Inquiry
                      <FileCheck2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 text-center animate-fadeIn relative overflow-hidden">
              {/* Glow line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
              
              <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg">
                <CheckCircle className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-1">
                <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-extrabold block">
                  TECHNICAL AUDIT INQUIRY REGISTERED
                </span>
                <h3 className="font-display text-2xl font-black text-white">Scoping Docket Generated</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Thank you. Your corporate environmental compliance assessment case has been registered. No login is required. An inspector will contact you directly.
                </p>
              </div>

              <div className="max-w-md mx-auto bg-slate-950 border border-slate-850 p-5 rounded-2xl text-left font-mono text-xs text-slate-300 space-y-3.5">
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-455 font-mono font-bold">CASE REFERENCE ID</span>
                  <span className="text-white font-bold">{inlineQuoteId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-455">ORGANIZATION / SITE</span>
                  <span className="text-white truncate max-w-[200px]">{inlineFacilityName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-455">FACILITY PROFILE</span>
                  <span className="text-white">{inlineFacilityType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450">SITE AREA SIZE</span>
                  <span className="text-white">{inlineAreaSize.toLocaleString()} m²</span>
                </div>
                <div className="flex justify-between border-t border-slate-800/85 pt-2 font-bold text-emerald-400">
                  <span>INSPECTION CONTACT</span>
                  <span>{inlineContactPhone}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setInlineSuccess(false);
                    setInlineFacilityName("");
                    setInlineContactName("");
                    setInlineContactPhone("");
                    setInlineContactEmail("");
                    setInlineNotes("");
                    setInlineQuoteId("");
                  }}
                  className="bg-slate-950 border border-slate-855 hover:border-slate-700 text-white font-sans font-semibold text-xs px-8 py-3 rounded-xl transition-all cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          )}
        </div>
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
                    <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-extrabold">
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
                      <label className="text-xs text-slate-450 font-mono uppercase tracking-wide block">Organization / Ministry / Project Site Name *</label>
                      <input type="text" required value={facilityName} onChange={(e) => setFacilityName(e.target.value)} placeholder="e.g. Nilepet Depot, Dar Petroleum Compound, or UN/NGO Base" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-sans" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-450 font-mono uppercase tracking-wide block">Facility Area (m²) *</label>
                        <input type="number" required value={areaSize} onChange={(e) => setAreaSize(parseInt(e.target.value) || 0)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono font-semibold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-450 font-mono uppercase tracking-wide block">Risk Classification</label>
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
                      <label className="text-xs text-slate-450 font-mono uppercase tracking-wide block">Juba Operating District *</label>
                      <div className="relative">
                        <select value={locationName} onChange={(e) => setLocationName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-sans cursor-pointer appearance-none">
                          {JUBA_LOCATIONS.map((loc) => (
                            <option key={loc.name} value={loc.name}>{loc.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                      <div className="mt-2 bg-slate-950/60 border border-slate-850 p-3 rounded-xl font-mono text-xs text-slate-400 space-y-1.5">
                        <div className="flex justify-between">
                          <span>COORDINATES:</span>
                          <span className="text-emerald-400 font-semibold">LAT {activeLocObj.lat.toFixed(5)} / LNG {activeLocObj.lng.toFixed(5)}</span>
                        </div>
                        <div className="text-xs text-slate-400 leading-normal border-t border-slate-800/60 pt-1">{activeLocObj.description}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-650" /> Scoping &amp; Focal Point Details
                    </h4>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-455 font-mono uppercase tracking-wide block">Required Audit Scopes</label>
                      <div className="space-y-2">
                        {CORE_SERVICES.map((srv) => {
                          const isChecked = selectedScopes.includes(srv.label);
                          return (
                            <button type="button" key={srv.label} onClick={() => handleToggleScope(srv.label)} className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${isChecked ? "bg-emerald-500/8 border-emerald-500/50 text-white font-medium" : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"}`}>
                              <div className="flex items-center gap-2">
                                <span className={isChecked ? "text-emerald-400" : "text-slate-600"}>{srv.icon}</span>
                                <span className="text-xs truncate max-w-[200px] sm:max-w-xs">{srv.label}</span>
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
                          <label className="text-xs text-slate-450 font-mono uppercase block">Project Focal Point Name *</label>
                          <input type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="e.g. Rebecca Nyandeng" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-200" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-slate-455 font-mono uppercase block">Official Email Address *</label>
                          <input type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="e.g. nyandeng@nile-petroleum.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-200" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-455 font-mono uppercase block">Official Contact Phone *</label>
                        <input type="text" required value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="e.g. +211 912 400 300" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-200 font-mono" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-455 font-mono uppercase block">Project Brief / Scope Directives</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Outline specific regulatory requirements, targeted dates, or site details..." className="w-full h-16 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 resize-none font-sans text-slate-200" />
                      </div>
                    </div>
                  </div>
                </div>

                {errorMsg && <p className="text-red-400 font-mono text-xs text-center animate-pulse">{errorMsg}</p>}

                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <StickyNote className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="text-left font-mono">
                      <span className="text-xs text-slate-450 uppercase block leading-none">DOCKET PROFILE</span>
                      <span className="text-xs text-emerald-400 font-bold tracking-wide">{complexityLabel}</span>
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
                  <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-extrabold block">TECHNICAL AUDIT REGISTERED</span>
                  <h3 className="font-display text-2xl font-black text-white">Assessment Case Registered</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">Your environmental compliance scoping request has been officially logged and assigned to our Central Equatoria State engineering team in Juba.</p>
                </div>
                <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl text-left font-mono text-xs text-slate-300 space-y-3.5">
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-450">RSS AUDIT REFERENCE</span>
                    <span className="text-white font-bold">{quoteId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-450">ORGANIZATION / SITE</span>
                    <span className="text-white truncate max-w-[200px]">{facilityName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-450">AREA SIZE</span>
                    <span className="text-white">{areaSize.toLocaleString()} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-455">RISK CLASSIFICATION</span>
                    <span className="text-emerald-400 font-semibold">{riskClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-450">SECTOR / DISTRICT</span>
                    <span className="text-white">{locationName}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800/80 pt-2 font-bold text-emerald-400">
                    <span>SLA COMMITMENT</span>
                    <span>&lt; 4 Hours Callout</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm mx-auto">
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
