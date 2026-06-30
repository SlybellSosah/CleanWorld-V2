import React, { useState } from "react";
import { ActiveView, ServicePillar } from "../types";
import { SERVICES_DETAILS } from "../data";
import kevinaImg from "./Kevina Aber.jpg";
import { 
  ArrowRight, ShieldCheck, Award, Zap, Building, CheckCircle, Send, Star, Leaf, 
  Sparkles, Sprout, Shield, Clock, HelpCircle, Layers, Clipboard, Check, 
  Calendar, MapPin, User, ChevronRight, Sliders, Hash, Eye, RefreshCw, 
  Smartphone, Mail, Home, Trash2, Plus, Minus, UserCheck, Terminal, Heart,
  Volume2, VolumeX
} from "lucide-react";

interface LandingPageProps {
  setActiveView: (view: ActiveView) => void;
  setQuotePillar: (pillar: ServicePillar) => void;
}

export default function LandingPage({ setActiveView, setQuotePillar }: LandingPageProps) {
  // Quick contact form states
  const [formFacility, setFormFacility] = useState("");
  const [formContact, setFormContact] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPillar, setFormPillar] = useState(ServicePillar.Management);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Neighborhood Gatekeeper states
  const [neighborhoodInput, setNeighborhoodInput] = useState("");
  const [neighborhoodCheckResult, setNeighborhoodCheckResult] = useState<"match" | "no-match" | null>(null);
  const [matchedDistrict, setMatchedDistrict] = useState("");
  const [matchedZip, setMatchedZip] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [emailCaptured, setEmailCaptured] = useState(false);

  const SERVED_TERRITORIES = [
    { zip: "61101", name: "Tongping" },
    { zip: "61102", name: "Gudele" },
    { zip: "61103", name: "Munuki" },
    { zip: "61104", name: "Amarat" },
    { zip: "61105", name: "Kololo" },
    { zip: "61106", name: "Kator" },
    { zip: "61107", name: "Juba 3" },
  ];

  const handleCheckNeighborhood = (inputStr: string) => {
    if (!inputStr) return;
    const normalizedInput = inputStr.trim().toLowerCase();
    const match = SERVED_TERRITORIES.find(t => 
      t.name.toLowerCase() === normalizedInput || 
      t.name.toLowerCase().includes(normalizedInput) ||
      t.zip === normalizedInput
    );
    if (match) {
      setNeighborhoodCheckResult("match");
      setMatchedDistrict(match.name);
      setMatchedZip(match.zip);
    } else {
      setNeighborhoodCheckResult("no-match");
      setMatchedDistrict("");
      setMatchedZip("");
    }
  };

  const handleCheckNeighborhoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCheckNeighborhood(neighborhoodInput);
  };

  const handleBookWithNeighborhood = () => {
    sessionStorage.setItem("validatedZipCode", matchedZip || "61101");
    sessionStorage.setItem("validatedNeighborhood", matchedDistrict);
    setActiveView(ActiveView.QuoteFlow);
  };

  const handleCaptureEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notificationEmail) return;
    setEmailCaptured(true);
  };

  React.useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = `Kevina Aber, Chief Executive Officer of Clean World, says: "Our commitment to Juba is clear. We don't just clean spaces; we create healthier, safer environments for our families and local businesses to thrive."`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => voice.lang.startsWith("en"));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFacility || !formContact || !formPhone) {
      alert("Please fill in all required operational fields.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      // Clear form
      setFormFacility("");
      setFormContact("");
      setFormPhone("");
    }, 1200);
  };

  const handleQuickAssessmentDeepLink = (pillar: ServicePillar) => {
    setQuotePillar(pillar);
    setActiveView(ActiveView.QuoteFlow);
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen" id="landing-page-root">
      
      {/* 1. Hero Banner */}
      <section 
        id="hero-banner-section" 
        className="relative min-h-[85vh] flex items-center justify-center py-20 px-4 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBSybK5xkJaq_7e44Gye54Iem9tC642WULxYQxNSGJ0cVhKyNUn3YwPmsifHevSmih4WguUR1MM2CO9nfG61Ky9Z8jGMYhjJUPVOl8okSUk-52ny6zOggHxchWzB1-f3y2JjGG1Y1u77rhunBe4HFUoP1xjKMM-qJPiA5IPQziYn7nZzZl6DCt4ojtHXhKMrDTq5uJdeioU7Utah9OxDAOOgm4v5qlcv0xNu4Xz3LF6lN9MqGkQBTrAkLW-ZaR2vmGLAiD7l6mP1_E')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90"></div>
        
        <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
          
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full text-emerald-400 font-mono text-xs tracking-wider uppercase animate-pulse">
            <Award className="w-4 h-4 text-emerald-400" />
            ISO 9001 & 14001 Standard Compliant
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Clean . Green . <span className="text-emerald-400 bg-emerald-400/10 px-4 rounded-xl border border-emerald-400/20">Sustainable.</span>
          </h1>

          <p className="font-sans text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            South Sudan's premier environmental cleaning and facility ecology firm. Our core business is delivering professional, top-tier deep cleaning services for residential and commercial clients, alongside eco-fumigation, landscaping, and environmental consultancy.
          </p>

          {/* Neighborhood Service Area Gatekeeper Component */}
          <div className="max-w-2xl mx-auto bg-slate-950/80 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-2xl backdrop-blur-md" id="zip-gatekeeper-card">
            <div className="text-center">
              <span className="text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider block mb-1">Check Coverage Area</span>
              <h2 className="text-lg font-display font-extrabold text-white">Do we serve your Juba neighborhood?</h2>
            </div>

            {neighborhoodCheckResult === null ? (
              <div className="space-y-4 max-w-md mx-auto">
                <form onSubmit={handleCheckNeighborhoodSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    placeholder="Search Juba neighborhood (e.g. Tongping, Gudele...)" 
                    value={neighborhoodInput}
                    onChange={(e) => setNeighborhoodInput(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-center font-semibold text-emerald-400 placeholder-slate-500 focus:outline-none focus:border-emerald-500 flex-grow"
                  />
                  <button 
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5"
                  >
                    Verify Area
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : neighborhoodCheckResult === "match" ? (
              <div className="space-y-3 animate-fadeIn text-center">
                <div className="text-emerald-400 font-sans text-sm font-semibold flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  We have active service coverage in {matchedDistrict}! (ZIP: {matchedZip})
                </div>
                <button
                  onClick={handleBookWithNeighborhood}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-display font-bold text-xs px-8 py-3.5 rounded-xl shadow-lg transition-all"
                >
                  Advance to Booking Wizard
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn text-center">
                <p className="text-red-400 font-sans text-xs">
                  We don't serve "{neighborhoodInput}" yet! Tell us where you are to notify you on expansion:
                </p>
                {!emailCaptured ? (
                  <form onSubmit={handleCaptureEmail} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                    <input 
                      type="email" 
                      required
                      placeholder="Enter your email address" 
                      value={notificationEmail}
                      onChange={(e) => setNotificationEmail(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-left text-slate-200 focus:outline-none focus:border-sky-500 flex-grow"
                    />
                    <button 
                      type="submit"
                      className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-sans font-bold text-xs px-5 py-2.5 rounded-xl"
                    >
                      Notify Me
                    </button>
                  </form>
                ) : (
                  <div className="text-emerald-400 font-mono text-xs animate-pulse">
                    Thank you! We will email you at {notificationEmail} as soon as Clean World launches in your area.
                  </div>
                )}
                <button 
                  onClick={() => {
                    setNeighborhoodCheckResult(null);
                    setNeighborhoodInput("");
                    setEmailCaptured(false);
                  }}
                  className="text-[10px] text-slate-500 hover:text-slate-300 underline font-mono"
                >
                  Check another neighborhood
                </button>
              </div>
            )}
          </div>

          {/* Quick Metrics Overlay Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12 border-t border-slate-800/60 text-left">
            <div>
              <div className="font-mono text-xs text-slate-400 tracking-wider uppercase">Regional Presence</div>
              <div className="text-3xl font-display font-bold text-white mt-1">Since 2024</div>
              <div className="text-xs text-emerald-500 mt-1">Established in Juba</div>
            </div>
            <div>
              <div className="font-mono text-xs text-slate-400 tracking-wider uppercase">Properties Cleaned</div>
              <div className="text-3xl font-display font-bold text-white mt-1">250+ Sites</div>
              <div className="text-xs text-emerald-500 mt-1">Homes, Offices &amp; Embassies</div>
            </div>
            <div>
              <div className="font-mono text-xs text-slate-400 tracking-wider uppercase">Products Used</div>
              <div className="text-3xl font-display font-bold text-white mt-1">100%</div>
              <div className="text-xs text-emerald-500 mt-1">Eco-Friendly &amp; Safe</div>
            </div>
            <div>
              <div className="font-mono text-xs text-slate-400 tracking-wider uppercase">Response Window</div>
              <div className="text-3xl font-display font-bold text-white mt-1">&lt; 60 Min</div>
              <div className="text-xs text-red-500 mt-1 animate-pulse">Emergency On-call</div>
            </div>
          </div>

        </div>
      </section>



      {/* 3. 4 Pillars of Excellence Bento Grid */}
      <section className="py-24 px-4 bg-slate-900 border-t border-slate-800" id="pillars-bento">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-emerald-500 font-mono text-xs font-semibold tracking-widest uppercase">// PREMIUM CAPABILITIES</span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Our 4 Pillars of Facility Ecology
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
              Streamlined environmental solutions matching premium HSE protocols. Less complexity, more visual clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* 1. Core Service Hero: Facility & Cleaning Management */}
            <div 
              id="bento-management"
              className="bg-slate-950 border border-slate-800 hover:border-blue-500/30 rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-blue-500/5 md:col-span-2 flex flex-col md:flex-row justify-between"
            >
              <div className="p-8 flex flex-col justify-between flex-1 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      <Sparkles className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] text-blue-400 font-mono uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded">
                      CORE BUSINESS
                    </span>
                  </div>
                  
                  <h3 className="font-display text-2xl lg:text-3xl font-extrabold text-white group-hover:text-blue-400 transition-colors">
                    Integrated Facility &amp; Cleaning Management
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                    Premium professional deep cleaning and sanitization custom-engineered for residential homes, corporate offices, and high-security diplomatic compounds.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="text-[11px] font-mono text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                    100% Eco-Safe Sanitizers
                  </span>
                  <span className="text-[11px] font-mono text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    Flexible Recurring Care
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
                  <button
                    onClick={() => handleQuickAssessmentDeepLink(ServicePillar.Management)}
                    className="bg-blue-500 hover:bg-blue-400 text-slate-950 font-display font-bold text-xs px-5 py-2.5 rounded-lg transition-all flex items-center gap-1.5 group/btn"
                  >
                    Request Facility Assessment
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>

              <div className="w-full md:w-[40%] min-h-[220px] md:min-h-full relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&h=1000&q=80" 
                  alt="Integrated Facility & Cleaning Management" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-slate-950 via-transparent to-transparent"></div>
              </div>
            </div>

            {/* 2. Environmental Consultancy */}
            <div 
              id="bento-consultancy"
              className="bg-slate-950 border border-slate-800 hover:border-emerald-500/30 rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-emerald-500/5 md:col-span-1 flex flex-col justify-between"
            >
              <div>
                <div className="h-44 relative overflow-hidden">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCueMCIIwXziPTmpXtAzQAfem6akCdst69PdqJ8ARlJy3AjAk_9X8OQ4hdvahlz1JKu8jg2HG8p7rXJS21rcA9XXKhnygOSdepw03n4fDGKq1CRJXN8tyR406-b1vcscQZNhuKttaiLypQ7WWhhVFFxJoFlAgz1w1hYsfoIaTDOcxyoU0HtUXMZR7GvtUTjobFHRBFCpYGF-reYhvlm65gnsWpzGL11PpWeBJ796JSIxJipfa17dp3ideQKDZKF_1zSnv57l4LgzNE" 
                    alt="Environmental Consultancy" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  <span className="absolute bottom-4 left-4 p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <Leaf className="w-4 h-4" />
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">REGULATORY AUDITS</div>
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Environmental Consultancy
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    EIA audits, rigorous waste management streams, and official HSE compliance documentation tailored to local frameworks.
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-900">
                <span className="text-[10px] font-mono text-slate-500 uppercase">ISO 9001 Alignment</span>
                <button
                  onClick={() => handleQuickAssessmentDeepLink(ServicePillar.Consultancy)}
                  className="text-xs font-display font-bold text-emerald-400 hover:text-white flex items-center gap-1 group/lnk"
                >
                  Consult
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/lnk:translate-x-1" />
                </button>
              </div>
            </div>

            {/* 3. Professional Fumigation */}
            <div 
              id="bento-fumigation"
              className="bg-slate-950 border border-slate-800 hover:border-amber-500/30 rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-amber-500/5 md:col-span-1 flex flex-col justify-between"
            >
              <div>
                <div className="h-44 relative overflow-hidden">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4Z2YFQdO4NupFjHu7T3Lskw7v38FyQxLhRak0dCIWWYjoVul5rKty8cU_T6-VgovbyMgwWg8qv1vx6phbyaTXAwE41T_KtxwZjQF73PxvlPfE-guEK8rAP0589UZMvSQ61PyeXrp5HFtntbbDQv-ItQfGOT8BLhPibndnNLP-AIF0oz07nAXOB4xMNJJ7QchPAXVt0VqUck8DV4M_jzqiL-yj9tStKGvGfgV_bFbbqqS34Wd-fwaMd5hKi3ERTx7CJdNBGTUzMV4" 
                    alt="Professional Fumigation" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  <span className="absolute bottom-4 left-4 p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                    <Shield className="w-4 h-4" />
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="text-[10px] text-amber-400 font-mono uppercase tracking-wider">VECTOR CONTROL</div>
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    Professional Fumigation
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    High-efficacy, non-toxic vector containment targeting malaria &amp; dengue transmission vectors with zero-residue materials.
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-900">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Child- &amp; Pet-Safe</span>
                <button
                  onClick={() => handleQuickAssessmentDeepLink(ServicePillar.Fumigation)}
                  className="text-xs font-display font-bold text-amber-400 hover:text-white flex items-center gap-1 group/lnk"
                >
                  Schedule
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/lnk:translate-x-1" />
                </button>
              </div>
            </div>

            {/* 4. Landscaping & Botanical Design */}
            <div 
              id="bento-landscaping"
              className="bg-slate-950 border border-slate-800 hover:border-teal-500/30 rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-teal-500/5 md:col-span-2 flex flex-col md:flex-row-reverse justify-between"
            >
              <div className="p-8 flex flex-col justify-between flex-1 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                      <Sprout className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] text-teal-400 font-mono uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded">
                      BOTANICAL DESIGN
                    </span>
                  </div>
                  
                  <h3 className="font-display text-2xl lg:text-3xl font-extrabold text-white group-hover:text-teal-400 transition-colors">
                    Landscaping &amp; Botanical Design
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                    Ecology-sensitive botanical turf architectures, flower beds, and erosion-prevention landscaping custom-tailored using local, low-water flora.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="text-[11px] font-mono text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                    Low-Water Native Flora
                  </span>
                  <span className="text-[11px] font-mono text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-teal-400" />
                    Diplomatic &amp; Estate Gardens
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
                  <button
                    onClick={() => handleQuickAssessmentDeepLink(ServicePillar.Landscaping)}
                    className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-display font-bold text-xs px-5 py-2.5 rounded-lg transition-all flex items-center gap-1.5 group/btn"
                  >
                    Request Garden Design
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>

              <div className="w-full md:w-[40%] min-h-[220px] md:min-h-full relative overflow-hidden">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxqmJo08gXhNRay7xWRarxpXxMzT8r6M3FnD9lnLRBlPjBpKgTR_SEpaP3OfP1Au0hoZkpFkPr3BO3hvC8wCxjAAs4I2XfTczNlxuZZgRW7hA6NvF1PcsCWDccCZuKfPeeOdpz6pi2KcZZ3iZ5iajgq7QYPkpSo81dYvUftdnAKETLjYsf-BK5NNmqHyML34Uny3-4F8D9J9Yi0j90AG3t2WDKGXKUhUIlWkcinIMnXA_VsPI3y8i3Bi-6Ha8wBQQzcDVJnq98Pls" 
                  alt="Landscaping & Botanical Design" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 via-transparent to-transparent"></div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. The Clean World Advantage */}
      <section className="py-24 px-4 bg-slate-950 border-t border-slate-900" id="advantage-section">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-2xl">
            <span className="text-emerald-500 font-mono text-[10px] font-semibold tracking-widest uppercase">// THE CLEAN WORLD ADVANTAGE</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-2">
              Why Choose Us
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed max-w-xl">
              Strict compliance with premium HSE protocols, delivering uncompromised quality with a minimalist, high-impact approach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Leaf, title: "100% Bio-Certified Solutions", desc: "Zero harsh synthetic chemical fumes or hazardous residues." },
              { icon: Shield, title: "Full HSE Audits & Quality Protocols", desc: "Formal quality verification and validation checklists on every visit." },
              { icon: Award, title: "Specialist Teams with First Aid Training", desc: "Elite, fully-trained professionals who respect your corporate or residential space." },
              { icon: Clock, title: "On-Time Operational Execution", desc: "Precision workflow scheduling designed to align seamlessly with your lifestyle." }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between border border-slate-800/60 bg-slate-900/10 p-5 rounded-2xl hover:border-emerald-500/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Indisputable Commitment (Kevina Aber) */}
      <section className="py-24 px-4 bg-slate-900 border-t border-b border-slate-800" id="commitment-ceo">
        <div className="max-w-5xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12">
            
            <div className="md:col-span-5 h-72 md:h-auto relative">
              <img 
                src={kevinaImg} 
                alt="Kevina Aber, CEO & Founder" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 via-transparent to-transparent opacity-60"></div>
            </div>

            <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-emerald-500 font-mono text-xs font-semibold tracking-widest uppercase">// OUR COMMITMENT TO YOU</span>
                <button
                  onClick={handleSpeak}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full border text-xs font-mono tracking-wider transition-all duration-300 self-start sm:self-auto ${
                    isSpeaking
                      ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 shadow-lg shadow-red-500/5"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 shadow-lg shadow-emerald-500/5"
                  }`}
                  title={isSpeaking ? "Stop Statement Audio" : "Listen to CEO Statement"}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4 animate-bounce" />
                      <span className="font-bold">STOP READOUT</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 animate-pulse" />
                      <span className="font-bold">LISTEN STATEMENT</span>
                    </>
                  )}
                </button>
              </div>
              
              <blockquote className="text-white font-display text-lg sm:text-xl font-medium leading-relaxed italic">
                "Our commitment to Juba is clear. We don't just clean spaces; we create healthier, safer environments for our families and local businesses to thrive."
              </blockquote>

              <div>
                <div className="font-display text-base font-bold text-white">Kevina Aber</div>
                <div className="text-xs text-slate-400 font-mono uppercase tracking-wider mt-0.5">Founder &amp; Chief Executive Officer</div>
                <div className="text-xs text-emerald-500 font-medium mt-1">Clean World Inc. South Sudan</div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-900">
                Under Kevina Aber's direct leadership, Clean World Inc. has grown from a local Juba cleaning crew into a trusted national environmental partner, bringing safe, eco-friendly cleaning to communities along the White Nile.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Clean, Approved Booking Section (Iteration 1: Clean Split) */}
      <section className="py-24 px-4 bg-slate-950 border-t border-slate-900" id="contact-form-section">
        <div className="max-w-6xl mx-auto">
          
          {submitSuccess ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-6 max-w-xl mx-auto shadow-2xl animate-fadeIn">
              <div className="h-14 w-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-xl font-extrabold text-white">Inquiry Received Successfully</h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  DISPATCH ID: <span className="text-emerald-400">CW-BOOK-{Math.floor(100000 + Math.random() * 900000)}</span>
                </p>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Our Juba rapid response team has logged your details and will contact you directly within 2 hours.
              </p>
              <button 
                onClick={() => setSubmitSuccess(false)}
                className="px-5 py-2.5 text-xs font-mono bg-slate-950 hover:bg-slate-800 text-emerald-400 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
              >
                Book Another Service
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 animate-fadeIn">
              <div className="p-8 sm:p-12 lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="text-emerald-500 font-mono text-[10px] tracking-widest uppercase font-bold">// INSTANT ONLINE INQUIRY</span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Book Your Clean World Today!
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Enter your details below to lock in Juba's finest certified eco-cleaning specialists.
                  </p>
                </div>

                <form onSubmit={handleQuickSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Home / Business Location</label>
                      <input 
                        type="text" required value={formFacility} onChange={(e) => setFormFacility(e.target.value)}
                        placeholder="e.g. Compound or Office"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Your Full Name</label>
                      <input 
                        type="text" required value={formContact} onChange={(e) => setFormContact(e.target.value)}
                        placeholder="e.g. James Deng"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Phone Number</label>
                      <input 
                        type="tel" required value={formPhone} onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="+211 920 000 000"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Primary Cleaning Service</label>
                      <select 
                        value={formPillar} onChange={(e) => setFormPillar(e.target.value as ServicePillar)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        <option value={ServicePillar.Management}>Integrated Deep Cleaning</option>
                        <option value={ServicePillar.Fumigation}>Fumigation &amp; Pest Control</option>
                        <option value={ServicePillar.Consultancy}>HSE Environmental Consultancy</option>
                        <option value={ServicePillar.Landscaping}>Landscaping &amp; Botanical Design</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" disabled={isSubmitting}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Processing..." : "GET A FREE QUOTE"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              <div className="hidden lg:col-span-5 relative overflow-hidden border-l border-slate-800/80 lg:flex flex-col justify-between p-12">
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80" 
                    alt="Eco-friendly clean indoor space" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/90 to-emerald-950/80"></div>
                </div>
                
                <div className="relative z-10 space-y-4">
                  <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-extrabold text-white text-lg leading-tight">100% Green Disinfection</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Clean World exclusively deploys chemical-free, eco-safe botanical disinfectants certified by international safety boards. Safe for children and pets.
                  </p>
                </div>
                
                <div className="relative z-10 flex items-center gap-3 text-slate-400 text-[10px] font-mono">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ISO 14001 ENVIRONMENTAL PRACTICE</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>


    </div>
  );
}
