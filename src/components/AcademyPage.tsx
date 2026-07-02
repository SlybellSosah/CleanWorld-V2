import React, { useState } from "react";
import { ActiveView } from "../types";
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Clock, 
  Award, 
  ShieldAlert, 
  CheckCircle, 
  Send, 
  Minus, 
  Plus, 
  ChevronDown, 
  HelpCircle, 
  Laptop, 
  MapPin, 
  Smartphone, 
  FileText, 
  Shield, 
  Activity, 
  UserCheck 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20
    }
  }
};

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: "faq-1",
    question: "What safety standards do you follow?",
    answer: "We follow all safety guidelines set by the South Sudan Ministry of Environment and Forestry and the World Health Organization (WHO). We help businesses, NGOs, and government agencies comply with national and international environmental safety regulations."
  },
  {
    id: "faq-2",
    question: "How do you conduct environmental and safety audits?",
    answer: "Our certified inspectors visit your facility, audit waste management streams, check for pest breeding hazards, and assess safety workflows. We provide a full environmental impact and compliance audit report with clear mitigation steps."
  },
  {
    id: "faq-3",
    question: "Are your training programs certified?",
    answer: "Yes. All our training courses follow standards from the World Health Organization (WHO) and local national safety codes. Trainees who pass both the theoretical quizzes and physical assessments receive formal certifications issued by Clean World Compliance Bureau."
  },
  {
    id: "faq-4",
    question: "How do you support remote areas in South Sudan?",
    answer: "For our On-Site Team Bootcamps, we dispatch certified instructors and training kits (including PPE and larvicide applicators) to key regional hubs such as Wau, Malakal, Yei, as well as capital offices in neighboring East African countries (Kampala, Nairobi)."
  },
  {
    id: "faq-5",
    question: "How does the Low-Data Digital Portal work?",
    answer: "Our digital portal is optimized for low-bandwidth environments. Trainees can download course text and audio summaries as highly compressed offline-ready PDFs. Progress status and certification codes are delivered directly via WhatsApp or SMS to save data costs."
  }
];

interface AcademyPageProps {
  setActiveView: (view: ActiveView) => void;
}

export default function AcademyPage({ setActiveView }: AcademyPageProps) {
  const [deliveryMode, setDeliveryMode] = useState<"on-site" | "digital">("on-site");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [employeeCount, setEmployeeCount] = useState<number>(10);
  const [dispatchTerritory, setDispatchTerritory] = useState<string>("Juba");
  const [includeStarterKit, setIncludeStarterKit] = useState<boolean>(true);
  
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const [certInput, setCertInput] = useState("");
  const [certResult, setCertResult] = useState<any | null>(null);
  const [certSearched, setCertSearched] = useState(false);

  const mockCertificates = [
    { 
      id: "CW-CERT-8921", 
      name: "John Garang", 
      course: "Mosquito & Vector Control", 
      date: "2026-06-29", 
      status: "Active", 
      theoryScore: "98%", 
      practicalScore: "99% (High Proficiency)",
      expiration: "2028-06-29",
      agency: "Clean World Compliance Bureau Juba" 
    },
    { 
      id: "CW-CERT-4201", 
      name: "Rebecca Nyandeng", 
      course: "Safe Chemical & Cleaning Product Handling", 
      date: "2026-06-27", 
      status: "Active", 
      theoryScore: "95%", 
      practicalScore: "96% (High Proficiency)",
      expiration: "2028-06-27",
      agency: "Clean World Compliance Bureau Juba"
    },
    { 
      id: "CW-CERT-1002", 
      name: "Emmanuel Deng", 
      course: "Modern Waste Collection & Disposal", 
      date: "2026-06-15", 
      status: "Active", 
      theoryScore: "92%", 
      practicalScore: "90% (Pass)",
      expiration: "2028-06-15",
      agency: "Clean World Compliance Bureau Juba"
    }
  ];

  const handleVerifyCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certInput) return;
    const match = mockCertificates.find(c => c.id.toLowerCase() === certInput.trim().toLowerCase());
    setCertResult(match || null);
    setCertSearched(true);
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => prev === id ? null : id);
  };

  const courses = [
    {
      id: "course-1",
      title: "Mosquito & Vector Control",
      durationOnSite: "4.5 Hours (1 Day)",
      durationDigital: "2.5 Hours Self-Paced",
      certOnSite: "WHO & Ministry of Environment Standard",
      certDigital: "WHO Vector Control Theory Standard",
      descriptionOnSite: "Hands-on calibration and operation of ULV fogging machines, chemical safety, and larvicide application in Juba breeding pools.",
      descriptionDigital: "Interactive, low-bandwidth video & audio modules covering vector lifecycles, WHO protocols, and theoretical safety metrics.",
      modulesOnSite: ["Misting & ULV Machine Operation", "Larvicide Sourcing & Dilution", "Vector Breeding Site Audits"],
      modulesDigital: ["Mosquito Lifecycle & Biology", "Vector-Borne Disease Pathogens", "WHO Compliance Documentation"],
      basePriceOnSitePerPerson: 45,
      basePriceDigitalPerPerson: 15
    },
    {
      id: "course-2",
      title: "Safe Chemical & Cleaning Product Handling",
      durationOnSite: "3.0 Hours (Half Day)",
      durationDigital: "1.5 Hours Self-Paced",
      certOnSite: "OSHA & RSS EHS Approved Certificate",
      certDigital: "OSHA Chemical Safety Basics",
      descriptionOnSite: "Practical spill containment training, PPE fit-testing, and real-time safe chemical dilution drills at your facility.",
      descriptionDigital: "Low-data, image-driven safety guide. Learn toxic label reading, PPE checklists, and basic spill response protocols.",
      modulesOnSite: ["Spill Containment Practice", "PPE Fit-Testing & Donning", "Chemical Surcharge Dilution"],
      modulesDigital: ["Understanding Safety Sheets (SDS)", "PPE Standards Checklist", "Spill Response & Contact Tree"],
      basePriceOnSitePerPerson: 35,
      basePriceDigitalPerPerson: 10
    },
    {
      id: "course-3",
      title: "Modern Waste Collection & Disposal",
      durationOnSite: "6.0 Hours (1 Day)",
      durationDigital: "3.5 Hours Self-Paced",
      certOnSite: "ISO 14001:2015 Compliance Stamp",
      certDigital: "ISO 14001 Waste Frameworks",
      descriptionOnSite: "Logistics audit, safe handling of medical/bio-hazard waste, and transport security compliance under Juba City Council laws.",
      descriptionDigital: "Self-paced study of South Sudan disposal laws, waste segregation protocols, and low-waste commercial operations.",
      modulesOnSite: ["Bio-Hazard Transport Security", "Segregation Site Logistics", "Incineration Protocol Audit"],
      modulesDigital: ["Waste Segregation Guidelines", "South Sudan Disposal Laws", "E-Waste & Recycling Standard"],
      basePriceOnSitePerPerson: 55,
      basePriceDigitalPerPerson: 20
    }
  ];

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) {
      alert("Please fill in all requested fields to finalize training registration.");
      return;
    }
    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setFormName("");
      setFormEmail("");
      setFormPhone("");
      setSelectedCourse(null);
    }, 3000);
  };

  const getTravelFee = (territory: string) => {
    switch(territory) {
      case "Wau": return 150;
      case "Malakal": return 200;
      case "Yei": return 80;
      case "Kampala": return 250;
      case "Nairobi": return 350;
      default: return 0; // Juba is local
    }
  };

  const activeCourseObj = courses.find(c => c.id === selectedCourse);
  const basePricePerPerson = activeCourseObj 
    ? (deliveryMode === "on-site" ? activeCourseObj.basePriceOnSitePerPerson : activeCourseObj.basePriceDigitalPerPerson) 
    : 0;

  const travelFee = deliveryMode === "on-site" ? getTravelFee(dispatchTerritory) : 0;
  const kitFee = (deliveryMode === "on-site" && includeStarterKit) ? (employeeCount * 15) : 0;
  const baseSubtotal = (basePricePerPerson * employeeCount) + kitFee;
  const digitalSurcharge = deliveryMode === "digital" ? 19 : 0;
  const subtotal = baseSubtotal + travelFee + digitalSurcharge;
  const localTax = deliveryMode === "on-site" ? (subtotal * 0.05) : 0; // 5% Juba Training & Auditing Levy
  const estimatedTotalUSD = subtotal + localTax;

  const projectedHours = activeCourseObj 
    ? employeeCount * (deliveryMode === "on-site" ? 4 : 2)
    : 0;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16 px-4" id="academy-root">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-emerald-500 font-mono text-xs font-semibold tracking-widest uppercase">TRAINING ACADEMY</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Clean World Compliance Academy
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Professional environmental compliance training tailored for businesses and NGOs in South Sudan and East Africa.
          </p>
        </div>

        {/* Centralized Toggle Tabs */}
        <div className="flex justify-center">
          <div className="bg-slate-900 border border-white/10 p-1.5 rounded-2xl flex gap-1 shadow-lg shadow-black/50">
            <button
              onClick={() => {
                setDeliveryMode("on-site");
                setSelectedCourse(null);
              }}
              className={`px-5 py-2.5 rounded-xl font-display text-xs font-bold transition-all flex items-center gap-2 ${
                deliveryMode === "on-site"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              On-Site Team Bootcamps
            </button>
            <button
              onClick={() => {
                setDeliveryMode("digital");
                setSelectedCourse(null);
              }}
              className={`px-5 py-2.5 rounded-xl font-display text-xs font-bold transition-all flex items-center gap-2 ${
                deliveryMode === "digital"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Laptop className="w-4 h-4" />
              Low-Data Digital Portal
            </button>
          </div>
        </div>

        {/* Master Row: Left - Bento Grid, Right - Group Estimator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Bento Grid Column */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                {deliveryMode === "on-site" ? "On-Site Practical Bootcamps" : "Low-Data Digital Modules"}
              </h3>
            </div>

            <motion.div 
              layout
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {courses.map((course) => (
                <motion.div 
                  key={course.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.99 }}
                  className={`bg-slate-900/30 backdrop-blur border rounded-[2rem] p-6 transition-all flex flex-col justify-between cursor-pointer shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] ${
                    selectedCourse === course.id 
                      ? "border-emerald-500 ring-1 ring-emerald-500/20" 
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                  onClick={() => setSelectedCourse(course.id)}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-mono text-[15px] font-bold px-2 py-0.5 rounded uppercase">
                        {deliveryMode === "on-site" ? course.certOnSite : course.certDigital}
                      </span>
                      <span className="flex items-center gap-1 text-[14px] text-slate-400 font-mono shrink-0">
                        <Clock className="w-3 h-3 text-emerald-400" /> 
                        {deliveryMode === "on-site" ? course.durationOnSite : course.durationDigital}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-display text-base font-bold text-white mt-1">{course.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-2">
                        {deliveryMode === "on-site" ? course.descriptionOnSite : course.descriptionDigital}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-900">
                      <span className="block text-[14px] text-slate-400 font-mono uppercase tracking-wider">
                        {deliveryMode === "on-site" ? "Practical Drills Covered:" : "Low-Bandwidth Modules:"}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(deliveryMode === "on-site" ? course.modulesOnSite : course.modulesDigital).map((m, idx) => (
                          <span key={idx} className="text-[15px] text-slate-300 bg-slate-950 border border-slate-800/80 px-2 py-1 rounded-lg">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-900/60 flex justify-between items-center">
                    <span className="text-[14px] text-slate-400 font-mono">BASE PRICE</span>
                    <span className="text-sm font-mono font-bold text-emerald-400">
                      ${deliveryMode === "on-site" ? course.basePriceOnSitePerPerson : course.basePriceDigitalPerPerson} <span className="text-[15px] text-slate-450 font-normal">/ trainee</span>
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Bento Card #4: Dynamic Regional Info */}
              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[2rem] p-6 flex flex-col justify-between shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]"
              >
                {deliveryMode === "on-site" ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <MapPin className="w-5 h-5" />
                      <span className="font-display text-xs font-bold uppercase tracking-wider">Regional Dispatch</span>
                    </div>
                    <h4 className="font-display text-sm font-bold text-white">East Africa Outreach</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Clean World deploys instructors directly to major hubs and facilities. We cover Central Equatoria and remote states (Wau, Malakal, Yei) as well as Uganda &amp; Kenya base offices.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      <span className="text-[15px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">Juba HQ</span>
                      <span className="text-[15px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">UN/NGO Audited</span>
                      <span className="text-[15px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">EAC Certified</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Smartphone className="w-5 h-5" />
                      <span className="font-display text-xs font-bold uppercase tracking-wider">Low-Data Delivery</span>
                    </div>
                    <h4 className="font-display text-sm font-bold text-white">Data Sieve Optimization</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Tailored for low-bandwidth cellular environments. Receive manuals as small PDF downloads, complete text-quizzes, and get immediate certificate verification updates on WhatsApp.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      <span className="text-[15px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">Offline PDFs</span>
                      <span className="text-[15px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">WhatsApp Alerts</span>
                      <span className="text-[15px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">SMS Verification</span>
                    </div>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-900 text-[14px] text-slate-400 font-mono">
                  Clean World Compliance Bureau
                </div>
              </motion.div>
            </motion.div>

            {/* B2B Manager Compliance Dashboard Mockup (Shown in Digital Mode) */}
            <AnimatePresence>
              {deliveryMode === "digital" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-slate-900/40 backdrop-blur border border-slate-800 rounded-[2.5rem] p-6 sm:p-8 space-y-6 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Activity className="w-4 h-4" />
                        <span className="font-display text-xs font-bold uppercase tracking-wider">B2B Feature Preview</span>
                      </div>
                      <h4 className="font-display text-lg font-bold text-white mt-1">Manager Compliance Dashboard</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Real-time low-data overview of your team's compliance metrics and credentials.</p>
                    </div>
                    <span className="bg-slate-800/80 text-emerald-400 font-mono text-[15px] px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase font-bold shrink-0">
                      Juba Portal Active
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Mock employees */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="bg-slate-955 border border-slate-800/50 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-white">John Garang</span>
                            <span className="block text-[14px] text-slate-400 font-mono">Vector Control • Field Op</span>
                          </div>
                          <span className="bg-emerald-500/10 text-emerald-400 text-[15px] font-mono px-2 py-0.5 rounded border border-emerald-500/25">
                            Certified
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[14px] text-slate-400">
                            <span>Quiz Progress</span>
                            <span>100%</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-full" />
                          </div>
                        </div>
                        <span className="text-[14px] font-mono text-slate-400">CREDENTIAL: CW-CERT-8921</span>
                      </div>

                      <div className="bg-slate-955 border border-slate-800/50 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-white">Rebecca Nyandeng</span>
                            <span className="block text-[14px] text-slate-400 font-mono">Chemical Safety • Sanitation Lead</span>
                          </div>
                          <span className="bg-emerald-500/10 text-emerald-400 text-[15px] font-mono px-2 py-0.5 rounded border border-emerald-500/25">
                            Certified
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[14px] text-slate-400">
                            <span>Quiz Progress</span>
                            <span>100%</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-full" />
                          </div>
                        </div>
                        <span className="text-[14px] font-mono text-slate-400">CREDENTIAL: CW-CERT-4201</span>
                      </div>

                      <div className="bg-slate-955 border border-slate-800/50 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-white">Emmanuel Deng</span>
                            <span className="block text-[14px] text-slate-400 font-mono">Waste Logistics • Dispatcher</span>
                          </div>
                          <span className="bg-emerald-500/10 text-emerald-400 text-[15px] font-mono px-2 py-0.5 rounded border border-emerald-500/25">
                            Certified
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[14px] text-slate-400">
                            <span>Quiz Progress</span>
                            <span>100%</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-full" />
                          </div>
                        </div>
                        <span className="text-[14px] font-mono text-slate-400">CREDENTIAL: CW-CERT-1002</span>
                      </div>

                      <div className="bg-slate-955 border border-slate-800/50 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-white">Kevin Aber Jr.</span>
                            <span className="block text-[14px] text-slate-400 font-mono">Chemical Safety • Field Op</span>
                          </div>
                          <span className="bg-amber-500/10 text-amber-400 text-[15px] font-mono px-2 py-0.5 rounded border border-amber-500/25">
                            In Progress
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[14px] text-slate-400">
                            <span>Quiz Progress</span>
                            <span>60%</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full w-[60%]" />
                          </div>
                        </div>
                        <span className="text-[14px] font-mono text-slate-400">2/3 Modules Completed (SMS Reminders Sent)</span>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Group Inquiry Estimator Column */}
          <div className="lg:col-span-4 sticky top-28" id="academy-group-estimator">
            <div className="bg-slate-900 border border-slate-800/80 rounded-[2.5rem] p-6 space-y-6 shadow-xl shadow-black/30">
              
              <div className="pb-3 border-b border-slate-950">
                <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  B2B Group Estimator
                </h4>
                <span className="text-[15px] text-slate-400 mt-1 block">
                  {deliveryMode === "on-site" ? "On-Site Team Bootcamp Sizer" : "Low-Data Digital Seats Estimator"}
                </span>
              </div>

              {inquirySuccess ? (
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 text-center space-y-3" id="academy-success">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
                  <span className="block font-display font-bold text-sm text-white">Proposal Logged Successfully</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Our Juba team has received your details. We will email a customized syllabus and regulatory dispatch breakdown within 12 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  
                  {/* Trainee Counter */}
                  <div className="space-y-2">
                    <label className="text-[15px] text-slate-400 font-mono uppercase tracking-wider block">
                      {deliveryMode === "on-site" ? "Trainees for Bootcamp:" : "Digital Seat Licenses:"}
                    </label>
                    <div className="flex justify-between items-center bg-slate-950 border border-slate-800/60 px-4 py-2.5 rounded-2xl">
                      <span className="text-xs text-slate-400">Trainee Count</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEmployeeCount(Math.max(5, employeeCount - 5))}
                          className="p-1.5 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-sm font-bold text-white px-2 w-8 text-center">{employeeCount}</span>
                        <button
                          type="button"
                          onClick={() => setEmployeeCount(employeeCount + 5)}
                          className="p-1.5 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* On-Site Territory Surcharge Selection */}
                  {deliveryMode === "on-site" && (
                    <div className="space-y-2">
                      <label className="text-[15px] text-slate-400 font-mono uppercase tracking-wider block">Dispatch Location / State:</label>
                      <select 
                        value={dispatchTerritory}
                        onChange={(e) => setDispatchTerritory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800/80 rounded-2xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Juba">Juba (Central Equatoria - Local)</option>
                        <option value="Wau">Wau (Western Bahr el Ghazal)</option>
                        <option value="Malakal">Malakal (Upper Nile)</option>
                        <option value="Yei">Yei (Central Equatoria State)</option>
                        <option value="Kampala">Kampala Hub (Uganda)</option>
                        <option value="Nairobi">Nairobi Hub (Kenya)</option>
                      </select>
                    </div>
                  )}

                  {/* On-Site PPE kit toggle */}
                  {deliveryMode === "on-site" && (
                    <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800/50 rounded-2xl">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white">Include Physical EHS Kits</span>
                        <span className="text-[15px] text-slate-400 font-mono">PPE &amp; Spill containment starter kits</span>
                      </div>
                      <input 
                        type="checkbox"
                        checked={includeStarterKit}
                        onChange={(e) => setIncludeStarterKit(e.target.checked)}
                        className="accent-emerald-500 w-4 h-4"
                      />
                    </div>
                  )}

                  {/* Summary & Price Panel */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/60 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Selected Standard</span>
                      <span className="text-white font-medium text-right max-w-[150px] truncate">
                        {selectedCourse ? courses.find(c => c.id === selectedCourse)?.title : "Select Course Card"}
                      </span>
                    </div>
                    
                    {selectedCourse && (
                      <>
                        <div className="flex justify-between text-slate-400 border-t border-slate-900 pt-2">
                          <span>Base rate ({employeeCount} x ${basePricePerPerson})</span>
                          <span className="text-white font-mono">${basePricePerPerson * employeeCount}</span>
                        </div>

                        {deliveryMode === "on-site" && includeStarterKit && (
                          <div className="flex justify-between text-slate-400">
                            <span>EHS Starter Kits ({employeeCount} x $15)</span>
                            <span className="text-white font-mono">${kitFee}</span>
                          </div>
                        )}

                        {deliveryMode === "on-site" && travelFee > 0 && (
                          <div className="flex justify-between text-slate-400">
                            <span>Regional Travel Surcharge</span>
                            <span className="text-white font-mono">${travelFee}</span>
                          </div>
                        )}

                        {deliveryMode === "digital" && (
                          <div className="flex justify-between text-slate-400">
                            <span>Portal Host Surcharge</span>
                            <span className="text-white font-mono">$19</span>
                          </div>
                        )}

                        {deliveryMode === "on-site" && (
                          <div className="flex justify-between text-slate-400">
                            <span>Training Levy (5%)</span>
                            <span className="text-white font-mono">${localTax.toFixed(2)}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-white font-bold pt-2 border-t border-slate-900">
                          <span>Projected Audits</span>
                          <span className="text-slate-300 font-mono">{projectedHours} Class Hours</span>
                        </div>

                        <div className="flex justify-between items-center text-white font-bold pt-2 border-t border-slate-900">
                          <span>ESTIMATED TOTAL</span>
                          <span className="text-emerald-400 font-mono text-base font-extrabold">
                            ${estimatedTotalUSD.toFixed(2)} <span className="text-[15px] text-slate-400 font-normal">/ trainee</span>
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Form fields */}
                  <div className="space-y-3">
                    <span className="block text-[15px] text-slate-400 font-mono uppercase tracking-wider">Corporate Dispatch Details:</span>
                    <div>
                      <label className="text-[14px] text-slate-400 block mb-1">Company / Organization Name *</label>
                      <input 
                        type="text" 
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. UN Mission Juba"
                        className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-700 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[14px] text-slate-400 block mb-1">Official Email Address *</label>
                      <input 
                        type="email" 
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="e.g. logistics@unmiss.org"
                        className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-700 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[14px] text-slate-400 block mb-1">Contact Phone Number *</label>
                      <input 
                        type="tel" 
                        required
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="e.g. +211 920 000 000"
                        className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-700 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedCourse}
                    className="w-full bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 hover:bg-emerald-400 text-slate-950 font-display font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 text-xs shadow-md shadow-emerald-500/5 hover:-translate-y-[1px]"
                  >
                    {deliveryMode === "on-site" ? "Request On-Site Bootcamp" : "Request Digital Licenses"}
                    <Send className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-start gap-2 text-[14px] text-slate-400 leading-normal pt-1">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-slate-450 mt-0.5" />
                    <span>
                      {deliveryMode === "on-site" 
                        ? "Training schedules align with South Sudan environmental codes. Physical evaluations are required for certified completion stamps."
                        : "Includes automatic SMS notifications, WhatsApp status hooks, and B2B manager monitoring dashboards."}
                    </span>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

        {/* Registry Verification Lookup Section */}
        <div className="pt-12 border-t border-slate-800" id="certificate-registry">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-6">
              <span className="text-emerald-500 font-mono text-xs font-semibold tracking-widest uppercase">SECURE CERTIFICATE REGISTRY</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Verify HSE Credentials
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Authenticate certificate credentials issued by Clean World Compliance Academy Juba.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800/80 rounded-[2rem] p-6 sm:p-8 space-y-6 shadow-xl shadow-black/20">
              <form onSubmit={handleVerifyCert} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  required
                  placeholder="Enter Certificate ID (e.g. CW-CERT-4201)" 
                  value={certInput}
                  onChange={(e) => {
                    setCertInput(e.target.value);
                    setCertSearched(false);
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 flex-grow font-mono uppercase placeholder-slate-600"
                />
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold text-xs px-8 py-3.5 rounded-xl transition-all shadow-md shadow-emerald-500/5 flex items-center justify-center gap-1.5"
                >
                  Verify Certificate
                </motion.button>
              </form>

              <AnimatePresence mode="wait">
                {certSearched && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    {certResult ? (
                      <div className="bg-slate-950 border border-emerald-500/20 p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6 items-start md:items-center shadow-[0_15px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]">
                        <div className="space-y-3 text-left w-full">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-emerald-400 font-mono text-[15px] uppercase font-bold tracking-wider">VALID CERTIFICATE LEDGER</span>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4">
                            <div>
                              <h4 className="font-display font-extrabold text-white text-lg">{certResult.name}</h4>
                              <p className="text-xs text-slate-300 font-sans mt-0.5">Course: <strong className="text-white">{certResult.course}</strong></p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-xl text-left shrink-0">
                              <div className="text-[14px] text-slate-400 font-mono uppercase">CERTIFICATE ID</div>
                              <div className="text-xs font-mono font-bold text-white tracking-wider">{certResult.id}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-slate-900 text-left">
                            <div>
                              <span className="block text-[14px] text-slate-400 font-mono uppercase">Theory Exam</span>
                              <span className="text-xs font-mono font-semibold text-white">{certResult.theoryScore}</span>
                            </div>
                            <div>
                              <span className="block text-[14px] text-slate-400 font-mono uppercase">Physical Drills</span>
                              <span className="text-xs font-mono font-semibold text-white">{certResult.practicalScore}</span>
                            </div>
                            <div>
                              <span className="block text-[14px] text-slate-400 font-mono uppercase">Registration Date</span>
                              <span className="text-xs font-mono font-semibold text-white">{certResult.date}</span>
                            </div>
                            <div>
                              <span className="block text-[14px] text-slate-400 font-mono uppercase">Expiration</span>
                              <span className="text-xs font-mono font-semibold text-white">{certResult.expiration}</span>
                            </div>
                          </div>

                          <div className="text-[14px] font-mono text-slate-400 pt-2 border-t border-slate-900 flex items-center gap-1.5">
                            <Shield className="w-3 h-3 text-emerald-500" />
                            AUDITING BUREAU: {certResult.agency}
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-4 py-3 rounded-2xl text-emerald-400 font-mono text-[14px] font-bold shrink-0 self-stretch md:self-auto justify-center">
                          <Award className="w-5 h-5 text-emerald-400" />
                          <span>RSS MOE &amp; WHO</span>
                          <span>APPROVED STAMP</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-950 border border-red-500/20 p-5 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-sans text-left shadow-[0_15px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]">
                        <ShieldAlert className="w-5 h-5 shrink-0 text-red-400" />
                        <div>
                          <strong>Credential Search Error:</strong> No certificate matching "{certInput}" was located in our Juba ledger registry. Verify ID formatting.
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-12 border-t border-slate-800" id="academy-faq-section">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-8">
              <span className="text-emerald-500 font-mono text-xs font-semibold tracking-widest uppercase">FAQS</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                General compliance, certification, and training dispatch inquiries.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div 
                    key={faq.id}
                    className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-slate-700"
                    id={`faq-item-${faq.id}`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-display text-xs sm:text-sm font-semibold text-white">
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown 
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                          isOpen ? "transform rotate-180 text-emerald-400" : ""
                        }`} 
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="border-t border-slate-900 overflow-hidden bg-slate-950/40 py-4 px-6"
                        >
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
