import React, { useState } from "react";
import { ActiveView } from "../types";
import { BookOpen, GraduationCap, Users, Clock, Award, ShieldAlert, CheckCircle, Send, Minus, Plus, ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: "faq-1",
    question: "What safety standards do you follow?",
    answer: "We follow all safety guidelines set by the South Sudan Ministry of Environment and the World Health Organization (WHO). We help businesses and homes comply with all national and international safety rules."
  },
  {
    id: "faq-2",
    question: "How do you conduct environmental and safety audits?",
    answer: "Our experts inspect your property, check waste management systems, look for breeding sites for pests, and identify hazards. We then provide a simple safety report with clear steps on how to improve."
  },
  {
    id: "faq-3",
    question: "Are your training programs certified?",
    answer: "Yes. All our training courses follow guidelines from the World Health Organization (WHO) and local national safety standards. Every participant who completes the course receives a recognized certificate."
  },
  {
    id: "faq-4",
    question: "How do you control mosquitoes and malaria risk?",
    answer: "We follow the World Health Organization (WHO) guidelines for mosquito control. We find breeding pools, use eco-friendly treatments to destroy larvae, and carry out safe misting/fogging to protect you from mosquitoes."
  },
  {
    id: "faq-5",
    question: "How do you help us manage waste properly?",
    answer: "We start with a waste audit, helping you separate organic, plastic, and hazardous waste. We design safe collection points and connect you with local recycling initiatives to reduce landfill waste."
  }
];

interface AcademyPageProps {
  setActiveView: (view: ActiveView) => void;
}

export default function AcademyPage({ setActiveView }: AcademyPageProps) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [employeeCount, setEmployeeCount] = useState<number>(10);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => prev === id ? null : id);
  };

  const courses = [
    {
      id: "course-1",
      title: "Mosquito & Vector Control",
      duration: "4.5 Hours",
      cert: "WHO Vector Control Standard",
      description: "Learn how to find breeding pools, apply safe larvicides, and operate mosquito control equipment safely under local guidelines.",
      modules: ["Mosquito & Pest Lifecycle", "Safe Larvicide Dilution", "Misting Machine Operation"]
    },
    {
      id: "course-2",
      title: "Safe Chemical & Cleaning Product Handling",
      duration: "3.0 Hours",
      cert: "OSHA & Ministry of Environment SS",
      description: "Learn how to read product labels, safely handle cleaning chemicals, avoid toxic spills, and use protective gear correctly.",
      modules: ["Understanding Safety Labels", "Using Protective Wear (PPE)", "Spill Handling & Safety"]
    },
    {
      id: "course-3",
      title: "Modern Waste Management & Recycling",
      duration: "6.0 Hours",
      cert: "ISO 14001:2015 Auditor Prep",
      description: "Learn how to separate waste, store bio-hazard materials safely, and comply with South Sudan environmental laws.",
      modules: ["Waste Separation Systems", "Safe Hazardous Waste Storage", "South Sudan Environmental Laws"]
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
      setSelectedCourse(null);
    }, 2500);
  };

  const estimatedTotalHours = employeeCount * 4;

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-16 px-4" id="academy-root">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-emerald-500 font-mono text-xs font-semibold tracking-widest uppercase">// TRAINING ACADEMY</span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Clean World Compliance Academy
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Learn professional cleaning, advanced sanitization, safe mosquito control, and eco-friendly waste management.
          </p>
        </div>

        {/* Master Row: Left - Modular Courses, Right - Group Estimator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Courses Listing Column */}
          <div className="lg:col-span-8 space-y-6" id="academy-courses-grid">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Certified Training Programs
            </h3>

            <div className="grid grid-cols-1 gap-6">
              {courses.map((course) => (
                <div 
                  key={course.id}
                  className={`bg-slate-950 border rounded-2xl p-6 transition-all space-y-4 cursor-pointer hover:border-slate-700 ${
                    selectedCourse === course.id 
                      ? "border-emerald-500 ring-1 ring-emerald-500/20" 
                      : "border-slate-800"
                  }`}
                  onClick={() => setSelectedCourse(course.id)}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                        {course.cert}
                      </span>
                      <h4 className="font-display text-base sm:text-lg font-bold text-white mt-1.5">{course.title}</h4>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 font-mono shrink-0">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-500" /> {course.duration}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-900/60">
                    <span className="block text-[10px] text-slate-500 font-mono uppercase">Key Modules Covered:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {course.modules.map((m, idx) => (
                        <span key={idx} className="text-[10px] text-slate-300 bg-slate-900 border border-slate-850 px-2.5 py-1 rounded-lg">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group Inquiry Estimator Column */}
          <div className="lg:col-span-4 sticky top-28" id="academy-group-estimator">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              
              <div className="pb-3 border-b border-slate-900">
                <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  Group Training Calculator
                </h4>
                <span className="text-[10px] text-slate-500 mt-1 block">Group training price estimator</span>
              </div>

              {inquirySuccess ? (
                <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-5 text-center space-y-3" id="academy-success">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
                  <span className="block font-display font-bold text-sm text-white">Request Received</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Thank you! We have received your training request and our team will contact you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Number of People to Train:</label>
                    <div className="flex justify-between items-center bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl">
                      <span className="text-xs text-slate-400">Employee Count</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEmployeeCount(Math.max(5, employeeCount - 5))}
                          className="p-1 hover:text-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-sm font-bold text-white px-2">{employeeCount}</span>
                        <button
                          type="button"
                          onClick={() => setEmployeeCount(employeeCount + 5)}
                          className="p-1 hover:text-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-850 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Course Selected</span>
                      <span className="text-white font-medium text-right max-w-[150px] truncate">
                        {selectedCourse ? courses.find(c => c.id === selectedCourse)?.title : "Select a Course Left"}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Projected Training Load</span>
                      <span className="text-white font-mono font-medium">{estimatedTotalHours} Training Hours</span>
                    </div>
                    <div className="flex justify-between text-white font-semibold pt-1 border-t border-slate-900">
                      <span>Certification SLA</span>
                      <span className="text-emerald-400 font-mono">Guaranteed Pass-Assess</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="block text-[10px] text-slate-400 font-mono uppercase">Request Corporate Syllabus Proposal:</span>
                    <input 
                      type="text" 
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Your Corporate Name"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                    />
                    <input 
                      type="email" 
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="Corporate Email Address"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedCourse}
                    className="w-full bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 hover:bg-emerald-400 text-slate-950 font-display font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs shadow-md shadow-emerald-500/5"
                  >
                    Send Request
                    <Send className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-start gap-1.5 text-[9px] text-slate-500 leading-normal">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>All training courses match official safety guidelines. Group packages include certificates of completion.</span>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

        {/* FAQ Section */}
        <div className="pt-12 border-t border-slate-800" id="academy-faq-section">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-8">
              <span className="text-emerald-500 font-mono text-xs font-semibold tracking-widest uppercase">// FAQS</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Frequently asked questions on cleaning, waste management, mosquito control, and training programs.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div 
                    key={faq.id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-slate-700"
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

                    <div 
                      className={`transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-[500px] border-t border-slate-900/40 opacity-100 py-4 px-6" : "max-h-0 opacity-0 pointer-events-none"
                      } overflow-hidden bg-slate-950/60`}
                    >
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
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
