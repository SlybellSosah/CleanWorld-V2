import React, { useState, useEffect } from "react";
import { ActiveView, Booking, RiskClass, UserSession, UserRole } from "../types";
import { 
  ShieldCheck, ArrowLeft, ArrowRight, CheckCircle, MapPin, 
  Sparkles, Calendar, Clock, CreditCard, HelpCircle, Heart, User, Building, Phone, Mail, FileText,
  X, RefreshCw, CheckCircle2, SmartphoneNfc
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import MapComponent from "./MapComponent";


// ─── Progressive Registration Nudge ──────────────────────────────────────────
interface ProgressiveNudgeProps {
  currentUser?: UserSession | null;
  onRegisterSuccess?: (session: UserSession) => void;
}

function ProgressiveRegistrationNudge({ currentUser, onRegisterSuccess }: ProgressiveNudgeProps) {
  const [dismissed, setDismissed] = useState(false);
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPin, setRegPin] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState("");

  // Don't render if already logged in or dismissed
  if (currentUser || dismissed) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    if (!regName.trim()) { setRegError("Please enter your name."); return; }
    if (!regPhone.trim()) { setRegError("Please enter your phone number."); return; }
    if (regPin.length < 4) { setRegError("Please set a complete 4-digit PIN."); return; }

    setRegLoading(true);
    setTimeout(() => {
      setRegLoading(false);
      setRegSuccess(true);
      if (onRegisterSuccess) {
        setTimeout(() => {
          onRegisterSuccess({
            email: `${regPhone.replace(/\s+/g, "")}@client.cleanworld.live`,
            role: UserRole.Client,
            name: regName,
            phone: regPhone,
          });
        }, 900);
      }
    }, 800);
  };

  return (
    <div
      className="bg-slate-900 border border-emerald-500/25 rounded-3xl p-6 space-y-5"
      id="progressive-registration-nudge"
    >
      {/* Glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      {regSuccess ? (
        <div className="text-center space-y-3 py-4">
          <div className="h-12 w-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-white text-sm">Account Created!</h3>
          <p className="text-xs text-slate-400">Welcome, {regName}. You can now track your booking and re-book in one tap.</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                <SmartphoneNfc className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-sm">Track your cleaner live</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Save your booking to your free account</p>
              </div>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-slate-600 hover:text-slate-400 transition-colors shrink-0 ml-2"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Value bullets */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { icon: "📍", label: "Track cleaner live" },
              { icon: "⚡", label: "Re-book in 1 tap" },
              { icon: "📄", label: "View receipts" },
            ].map(({ icon, label }) => (
              <div key={label} className="bg-slate-950/60 border border-slate-800 rounded-xl px-2 py-3 space-y-1">
                <span className="text-lg block">{icon}</span>
                <span className="text-[10px] text-slate-400 font-sans leading-tight block">{label}</span>
              </div>
            ))}
          </div>

          {/* Registration form */}
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Your Name *</label>
                <input
                  type="text"
                  placeholder="e.g. John Garang"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  disabled={regLoading}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 font-sans transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="tel"
                    placeholder="+211 9__"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    disabled={regLoading}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-8 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 font-mono transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Set a 4-Digit PIN * (like your mobile money)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={regPin}
                  onChange={(e) => setRegPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  disabled={regLoading}
                  placeholder="••••"
                  className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 font-mono tracking-widest text-center transition-all"
                  aria-label="4-digit PIN"
                />
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        i < regPin.length ? "border-emerald-500 bg-emerald-500/15" : "border-slate-700"
                      }`}
                    >
                      {i < regPin.length && <span className="w-2 h-2 rounded-full bg-emerald-400 block" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {regError && (
              <p className="text-red-400 font-mono text-[11px] text-center">{regError}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="submit"
                disabled={regLoading}
                className="flex-grow bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold text-xs py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50"
              >
                {regLoading ? "Saving..." : "Save My Booking →"}
              </button>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="sm:flex-none bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-sans text-xs py-3 px-4 rounded-xl border border-slate-700 transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}


interface QuoteWizardProps {
  setActiveView: (view: ActiveView) => void;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  initialSpecs?: any;
  currentUser?: UserSession | null;
  onRegisterSuccess?: (session: UserSession) => void;
}

export default function QuoteWizard({ setActiveView, bookings, setBookings, initialSpecs, currentUser, onRegisterSuccess }: QuoteWizardProps) {
  const [activeStep, setActiveStep] = useState(1); // Step 1: Scoping, Step 2: Frequency & Schedule, Step 3: Checkout
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBookingId, setNewBookingId] = useState<string | null>(null);

  // STEP 1 STATE: Scoping
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [sqFtRange, setSqFtRange] = useState<string>("1,000 - 1,999 sq ft");
  const [cleanType, setCleanType] = useState<"standard" | "deep" | "move-in-out">("standard");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [zipCode, setZipCode] = useState<string>("61101"); // prefilled if validated
  const [zipError, setZipError] = useState<string>("");

  // WASTE SERVICE STATE
  const [isWasteService, setIsWasteService] = useState<boolean>(false);
  const [wasteVolume, setWasteVolume] = useState<number>(20);
  const [wasteRisk, setWasteRisk] = useState<RiskClass>(RiskClass.Low);

  // STEP 2 STATE: Scheduling & Subscription Frequency
  const [frequency, setFrequency] = useState<"one-time" | "weekly" | "bi-weekly" | "monthly">("bi-weekly");
  const [selectedDate, setSelectedDate] = useState<string>("2026-07-01");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("09:00 AM - 12:00 PM");

  // STEP 3 STATE: Personal Registration & Local Payment Details
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [address, setAddress] = useState("");
  const [entryInstructions, setEntryInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"m-GURUSH" | "MTN MoMo" | "Zain Cash" | "Cash">("MTN MoMo");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [paymentHolder, setPaymentHolder] = useState("");
  const [ussdPin, setUssdPin] = useState("");
  const [isUSSDPromptOpen, setIsUSSDPromptOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const [selectedLat, setSelectedLat] = useState<number>(4.86010);
  const [selectedLng, setSelectedLng] = useState<number>(31.59100);

  const handleCoordinatesChange = (newLat: number, newLng: number) => {
    setSelectedLat(newLat);
    setSelectedLng(newLng);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLat(position.coords.latitude);
          setSelectedLng(position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation warning: ", error.message);
        }
      );
    }
  };
  
  // Validation Errors
  const [step1Error, setStep1Error] = useState("");
  const [step3Error, setStep3Error] = useState("");

  // ZIP territories served in Juba
  const SERVED_TERRITORIES = [
    { zip: "61101", name: "Tongping" },
    { zip: "61102", name: "Gudele" },
    { zip: "61103", name: "Munuki" },
    { zip: "61104", name: "Amarat" },
    { zip: "61105", name: "Kololo" },
    { zip: "61106", name: "Kator" },
    { zip: "61107", name: "Juba 3" },
  ];

  // Load validated zip code from sessionStorage on mount (if user came from Landing Page Gatekeeper)
  useEffect(() => {
    const savedZip = sessionStorage.getItem("validatedZipCode");
    if (savedZip) {
      setZipCode(savedZip);
    }
  }, []);

  // Prefill hook from Services page deep-link
  useEffect(() => {
    if (initialSpecs) {
      if (initialSpecs.isWaste) {
        setIsWasteService(true);
        if (initialSpecs.wasteVolume) setWasteVolume(initialSpecs.wasteVolume);
        if (initialSpecs.riskClass) setWasteRisk(initialSpecs.riskClass);
        if (initialSpecs.addons) setSelectedAddons(initialSpecs.addons);
        if (initialSpecs.frequency) setFrequency(initialSpecs.frequency);
      } else {
        setIsWasteService(false);
        if (initialSpecs.cleanType) setCleanType(initialSpecs.cleanType);
        if (initialSpecs.addons) setSelectedAddons(initialSpecs.addons);
        if (initialSpecs.frequency) setFrequency(initialSpecs.frequency);
        if (initialSpecs.areaSize) {
          const area = initialSpecs.areaSize;
          if (area < 1000) {
            setSqFtRange("< 1,000 sq ft");
            setBedrooms(1);
            setBathrooms(1);
          } else if (area < 2000) {
            setSqFtRange("1,000 - 1,999 sq ft");
            setBedrooms(3);
            setBathrooms(2);
          } else if (area < 3000) {
            setSqFtRange("2,000 - 2,999 sq ft");
            setBedrooms(4);
            setBathrooms(3);
          } else {
            setSqFtRange("3,000+ sq ft");
            setBedrooms(5);
            setBathrooms(4);
          }
        }
      }
    }
  }, [initialSpecs]);

  // Pricing constants for dynamic scoping engine
  const BASE_PRICE = 80;
  const PRICE_PER_BEDROOM = 25;
  const PRICE_PER_BATHROOM = 20;

  // Addon configurations
  const ADDONS_LIST = [
    { name: "Inside Fridge", price: 35, icon: "❄️" },
    { name: "Inside Oven", price: 35, icon: "🔥" },
    { name: "Cabinets", price: 30, icon: "🚪" },
    { name: "Interior Windows", price: 40, icon: "🪟" },
    { name: "Pet Hair Treatment", price: 25, icon: "🐾" },
    { name: "Wet Wiping Baseboards", price: 25, icon: "🧹" }
  ];

  const getAddonPrice = (name: string) => {
    return ADDONS_LIST.find(a => a.name === name)?.price || 0;
  };

  // Pricing formula calculations
  const baseSizePrice = BASE_PRICE + (bedrooms * PRICE_PER_BEDROOM) + (bathrooms * PRICE_PER_BATHROOM);
  
  // Clean type multipliers / flat fees
  let typePriceModifier = 0;
  let typeMultiplier = 1.0;
  if (cleanType === "deep") {
    typeMultiplier = 1.5;
  } else if (cleanType === "move-in-out") {
    typePriceModifier = 50;
    typeMultiplier = 1.25;
  }

  // Dynamic pricing calculation based on service type
  let totalSubtotal = 0;
  if (isWasteService) {
    const ratePerM3 = 15;
    let riskMultiplier = 1.0;
    if (wasteRisk === RiskClass.Medium) riskMultiplier = 1.3;
    if (wasteRisk === RiskClass.High) riskMultiplier = 1.8;
    
    const baseCost = wasteVolume * ratePerM3 * riskMultiplier;
    const addonsCost = selectedAddons.reduce((sum, addon) => {
      if (addon === "HSE Waste Binning") return sum + 50;
      if (addon === "Bio-Safe Solutions") return sum + 75;
      if (addon === "Secure Disposal Certification") return sum + 40;
      return sum;
    }, 0);
    totalSubtotal = baseCost + addonsCost;
  } else {
    const subtotalBeforeAddons = (baseSizePrice * typeMultiplier) + typePriceModifier;
    const addonsTotal = selectedAddons.reduce((sum, addon) => sum + getAddonPrice(addon), 0);
    totalSubtotal = subtotalBeforeAddons + addonsTotal;
  }

  // Frequency discounts
  let discountPercentage = 0;
  if (frequency === "weekly") discountPercentage = 0.20;
  else if (frequency === "bi-weekly") discountPercentage = 0.15;
  else if (frequency === "monthly") discountPercentage = 0.10;

  const discountAmount = totalSubtotal * discountPercentage;
  const taxedSubtotal = totalSubtotal - discountAmount;
  
  // Tax
  const localTax = taxedSubtotal * 0.05; // 5% Juba local sales tax
  const finalPrice = taxedSubtotal + localTax;

  // Helper to toggle add-ons
  const handleToggleAddon = (addonName: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonName) ? prev.filter(a => a !== addonName) : [...prev, addonName]
    );
  };

  // Validate ZIP area
  const validateZipCode = (zip: string): boolean => {
    return SERVED_TERRITORIES.some(t => t.zip === zip);
  };

  // ADVANCE TO STEP 2
  const handleGoToStep2 = () => {
    setStep1Error("");
    if (!zipCode) {
      setStep1Error("Please specify your Juba ZIP code to verify coverage.");
      return;
    }
    
    if (!validateZipCode(zipCode)) {
      setStep1Error("Coverage Area Error: Clean World does not serve this territory yet.");
      return;
    }

    setActiveStep(2);
  };

  // ADVANCE TO STEP 3
  const handleGoToStep3 = () => {
    if (!selectedDate) {
      alert("Please select your clean schedule date.");
      return;
    }
    setActiveStep(3);
  };

  // SUBMIT TOTAL RESERVATION (Step 3 Checkout)
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setStep3Error("");

    if (!clientName || !clientEmail || !clientPhone || !address) {
      setStep3Error("Please complete all fields in your service delivery profile.");
      return;
    }

    if (paymentMethod !== "Cash") {
      if (!paymentPhone) {
        setStep3Error("Please enter your Mobile Money phone number.");
        return;
      }
      // Open simulated USSD popup
      setUssdPin("");
      setIsUSSDPromptOpen(true);
    } else {
      // Cash payment proceeds instantly
      executeBookingCreation();
    }
  };

  const handleSimulateUSSDPayment = () => {
    if (!ussdPin || ussdPin.length < 4) {
      alert("Please enter your 4-digit USSD PIN.");
      return;
    }
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsUSSDPromptOpen(false);
      executeBookingCreation();
    }, 1500);
  };

  const executeBookingCreation = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const bId = `CW-${Math.floor(1000 + Math.random() * 9000)}`;
      const newBooking: Booking = {
        id: bId,
        clientName: clientName,
        clientEmail: clientEmail,
        clientPhone: clientPhone,
        address: address,
        zipCode: zipCode,
        entryInstructions: isWasteService 
          ? `[WASTE DISPATCH - RISK: ${wasteRisk}] ${entryInstructions}`
          : entryInstructions,
        bedrooms: isWasteService ? 0 : bedrooms,
        bathrooms: isWasteService ? 0 : bathrooms,
        sqFtRange: isWasteService ? `${wasteVolume} m³ Volume` : sqFtRange,
        cleanType: isWasteService ? "deep" : cleanType,
        addons: selectedAddons,
        frequency: frequency,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        price: parseFloat(finalPrice.toFixed(2)),
        status: "pending",
        tipAmount: 0,
        beforePhoto: null,
        afterPhoto: null,
        checkedTasks: [],
        createdAt: new Date().toISOString(),
        lat: selectedLat,
        lng: selectedLng,
        paymentMethod: paymentMethod,
        paymentPhone: paymentMethod === "Cash" ? "" : paymentPhone,
        transactionRef: paymentMethod === "Cash" ? "" : `${paymentMethod === "m-GURUSH" ? "MG" : paymentMethod === "MTN MoMo" ? "MT" : "ZC"}-${Math.floor(1000 + Math.random() * 9000)}-JUB`
      };

      setBookings(prev => [newBooking, ...prev]);
      setNewBookingId(bId);
      setIsSubmitting(false);
      setActiveStep(4); // Receipt View
    }, 1200);
  };

  // Generate 7-day calendar array starting today
  const getNextDays = () => {
    const days = [];
    const baseDate = new Date();
    for (let i = 0; i < 14; i++) {
      const nextDay = new Date(baseDate);
      nextDay.setDate(baseDate.getDate() + i);
      days.push(nextDay);
    }
    return days;
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans" id="booking-wizard-root">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Wizard Header Status Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-extrabold">Professional Cleaning Engine</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">Book Your Eco-Clean</h1>
          </div>

          {/* Stepper Wizard Indicator */}
          {activeStep <= 3 && (
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2 rounded-2xl shrink-0" id="wizard-steps-indicator">
              {[
                { step: 1, label: "Your Clean" },
                { step: 2, label: "Schedule" },
                { step: 3, label: "Checkout" }
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg">
                  <span className={`h-6 w-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                    activeStep === s.step 
                      ? "bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/20" 
                      : activeStep > s.step
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-slate-950 text-slate-400"
                  }`}>
                    {s.step}
                  </span>
                  <span className={`text-xs font-semibold ${activeStep === s.step ? "text-white" : "text-slate-400"}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {activeStep === 4 ? (
          /* STEP 4: CONFIRMATION & RECEIPT SHEET */
          <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            {/* Receipt Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 text-center" id="receipt-card">
              <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <CheckCircle className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-2">
                <span className="text-emerald-400 font-mono text-xs uppercase tracking-wider block font-bold">SECURE ORDER DISPATCHED</span>
                <h2 className="font-display text-2xl font-extrabold text-white">Booking Confirmed!</h2>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Your reservation has been authenticated and loaded into our scheduling matrix.
                </p>
              </div>

              {/* Receipt Summary Breakdown */}
              <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6 text-left space-y-4 font-mono text-xs text-slate-300">
                <div className="flex justify-between pb-3 border-b border-slate-850">
                  <span className="text-slate-400 uppercase font-mono">Invoice Reference</span>
                  <span className="font-bold text-white">{newBookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase">Service Profile</span>
                  <span className="text-white capitalize font-semibold">
                    {isWasteService ? "Waste Collection & Disposal Dispatch" : `${cleanType} Clean`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isWasteService ? "Refuse Parameters" : "Property Layout"}</span>
                  <span>
                    {isWasteService 
                      ? `${wasteVolume} m³ (${wasteRisk})` 
                      : `${bedrooms} Bed, ${bathrooms} Bath`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Schedule Date</span>
                  <span>{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Arrival Window</span>
                  <span>{selectedTimeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Territory Area</span>
                  <span>{SERVED_TERRITORIES.find(t => t.zip === zipCode)?.name || "Juba Local"} ({zipCode})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GPS Pinned Location</span>
                  <span>{selectedLat.toFixed(5)}, {selectedLng.toFixed(5)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-850 text-sm font-bold text-white">
                  <span>ESTIMATED BILLING</span>
                  <span>${finalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* CTA action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <button
                  onClick={() => setActiveView(ActiveView.ClientDashboard)}
                  className="w-full sm:w-auto bg-sky-500 hover:bg-sky-400 text-slate-950 font-display font-extrabold text-xs px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-sky-500/10 flex items-center justify-center gap-1.5"
                >
                  Go to Client Dashboard
                </button>
                <button
                  onClick={() => {
                    setActiveStep(1);
                    setNewBookingId(null);
                    setSelectedAddons([]);
                  }}
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-sans font-semibold text-xs px-8 py-3.5 rounded-xl border border-slate-750 transition-colors"
                >
                  Book Another Service
                </button>
              </div>
            </div>

            {/* ── Progressive Registration Nudge (guests only) ──────────── */}
            <ProgressiveRegistrationNudge
              currentUser={currentUser}
              onRegisterSuccess={onRegisterSuccess}
            />
          </div>
        ) : (
          /* WORKFLOW CONTENT & SIDEBAR GRID */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Step form selector view (Left Column) */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 min-h-[500px]" id="wizard-form-body">
              
              {activeStep === 1 && (
                /* STEP 1: SCOPING FORM */
                <div className="space-y-6 animate-fadeIn" id="step1-scoping">
                  
                  {/* Step Title */}
                  <div className="space-y-1">
                    <span className="text-sky-400 font-mono text-xs uppercase font-bold tracking-wider">
                      {isWasteService ? "STEP 1 OF 3: WASTE LOGISTICS PARAMETERS" : "STEP 1 OF 3: PROPERTY DETAILS"}
                    </span>
                    <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                      {isWasteService ? "Tell us about your waste requirements" : "Tell us about your home"}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {isWasteService 
                        ? "Specify refuse volume and risk tier for dynamic compliance scoping." 
                        : "Specify property size and select clean type for instant scoping."}
                    </p>
                  </div>

                  {/* Territory coverage check */}
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-mono uppercase tracking-wide block">Juba Neighborhood Service Area *</label>
                    <div className="flex gap-3 max-w-md">
                      <select 
                        value={zipCode}
                        onChange={(e) => {
                          setZipCode(e.target.value);
                          setStep1Error("");
                        }}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-sky-500 font-sans flex-1 font-semibold text-sky-400 cursor-pointer"
                      >
                        <option value="" disabled className="text-slate-500">Select Juba neighborhood...</option>
                        {SERVED_TERRITORIES.map(t => (
                          <option key={t.zip} value={t.zip} className="bg-slate-950 text-slate-300">
                            {t.name} (ZIP: {t.zip})
                          </option>
                        ))}
                      </select>
                      <span className="px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 font-semibold font-mono text-xs flex items-center justify-center text-slate-400">
                        {SERVED_TERRITORIES.find(t => t.zip === zipCode)?.zip || "OUTSIDE AREA"}
                      </span>
                    </div>
                  </div>

                  {isWasteService ? (
                    /* WASTE SERVICE SCOPING INTERFACE */
                    <div className="space-y-6">
                      {/* Volume Slider / Selector */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-mono uppercase">Refuse Volume (Weekly)</span>
                          <span className="text-sky-400 font-mono font-bold bg-slate-950 px-2.5 py-1 rounded border border-slate-850">
                            {wasteVolume} m³ (cubic meters)
                          </span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={100}
                          value={wasteVolume}
                          onChange={(e) => setWasteVolume(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-500 border border-slate-800"
                        />
                        <div className="flex justify-between text-xs font-mono text-slate-400 uppercase">
                          <span>1 m³</span>
                          <span>50 m³</span>
                          <span>100 m³</span>
                        </div>
                      </div>

                      {/* Risk Classification selector */}
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-mono uppercase tracking-wide block">Material Risk Tier</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: "Class I (Low)", val: RiskClass.Low, desc: "Standard commercial paper/refuse", color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" },
                            { label: "Class II (Med)", val: RiskClass.Medium, desc: "Industrial and organic waste", color: "border-sky-500/30 text-sky-400 bg-sky-500/5" },
                            { label: "Class III (High)", val: RiskClass.High, desc: "Hazardous and medical waste", color: "border-amber-500/30 text-amber-400 bg-amber-500/5" }
                          ].map((item) => (
                            <button
                              type="button"
                              key={item.val}
                              onClick={() => setWasteRisk(item.val)}
                              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                                wasteRisk === item.val
                                  ? `${item.color} font-bold border-2`
                                  : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              <span className="font-display font-bold text-white text-xs">{item.label}</span>
                              <span className="text-xs text-slate-400 leading-normal">{item.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Waste Addon Selectors */}
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-mono uppercase tracking-wide block">Select HSE Compliance Add-ons</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          {[
                            { name: "HSE Waste Binning", price: 50, desc: "Provide high-grade sealed bins", icon: "🗑️" },
                            { name: "Bio-Safe Solutions", price: 75, desc: "Chemical disinfection wash", icon: "🧪" },
                            { name: "Secure Disposal Certification", price: 40, desc: "Certified disposal receipt matching HSE standards", icon: "📜" }
                          ].map((addon) => {
                            const isSelected = selectedAddons.includes(addon.name);
                            return (
                              <button
                                type="button"
                                key={addon.name}
                                onClick={() => handleToggleAddon(addon.name)}
                                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 ${
                                  isSelected
                                    ? "bg-sky-500/10 border-sky-500 text-sky-400 font-bold"
                                    : "bg-slate-950 border-slate-850 text-slate-300 hover:text-white"
                                }`}
                              >
                                <div className="flex justify-between items-center w-full">
                                  <span className="text-lg">{addon.icon}</span>
                                  <span className="font-mono text-xs text-slate-400 font-semibold">+${addon.price}</span>
                                </div>
                                <div>
                                  <span className="text-xs font-semibold tracking-wide block">{addon.name}</span>
                                  <span className="text-xs text-slate-400 leading-normal font-normal mt-0.5 block">{addon.desc}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Standard Cleaning Scoping Counter Layout */
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Bedrooms */}
                        <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-xs text-slate-400 font-mono uppercase">Bedrooms</span>
                            <div className="font-display font-black text-white text-lg">{bedrooms} Bedrooms</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              type="button"
                              onClick={() => setBedrooms(b => Math.max(1, b - 1))}
                              className="h-9 w-9 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-full flex items-center justify-center font-bold text-slate-300"
                            >-</button>
                            <button 
                              type="button"
                              onClick={() => setBedrooms(b => Math.min(6, b + 1))}
                              className="h-9 w-9 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-full flex items-center justify-center font-bold text-slate-300"
                            >+</button>
                          </div>
                        </div>
                        {/* Bathrooms */}
                        <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-xs text-slate-400 font-mono uppercase">Bathrooms</span>
                            <div className="font-display font-black text-white text-lg">{bathrooms} Bathrooms</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              type="button"
                              onClick={() => setBathrooms(b => Math.max(1, b - 1))}
                              className="h-9 w-9 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-full flex items-center justify-center font-bold text-slate-300"
                            >-</button>
                            <button 
                              type="button"
                              onClick={() => setBathrooms(b => Math.min(4, b + 1))}
                              className="h-9 w-9 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-full flex items-center justify-center font-bold text-slate-300"
                            >+</button>
                          </div>
                        </div>
                      </div>

                      {/* Square footage Range */}
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-mono uppercase tracking-wide block">Estimated Area Range</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          {[
                            "< 1,000 sq ft",
                            "1,000 - 1,999 sq ft",
                            "2,000 - 2,999 sq ft",
                            "3,000+ sq ft"
                          ].map((range) => (
                            <button
                              type="button"
                              key={range}
                              onClick={() => setSqFtRange(range)}
                              className={`py-3.5 rounded-xl border text-center transition-all ${
                                sqFtRange === range
                                  ? "bg-sky-500/10 border-sky-500 text-sky-400 font-bold"
                                  : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                              }`}
                            >
                                {range}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Base Clean Selector */}
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-mono uppercase tracking-wide block">Standard, Deep, or Move Clean</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Standard Clean */}
                          <button
                            type="button"
                            onClick={() => setCleanType("standard")}
                            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-4 ${
                              cleanType === "standard"
                                ? "bg-sky-500/5 border-sky-500 text-sky-400"
                                : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            <div className="space-y-1">
                              <span className="font-display font-bold text-white block text-sm">Standard Clean</span>
                              <p className="text-xs text-slate-400 leading-normal">
                                Regular maintenance. Includes dust, mop, vacuum, and trash empty.
                              </p>
                            </div>
                            <span className="font-mono text-xs font-semibold">1.0x</span>
                          </button>

                          {/* Deep Clean */}
                          <button
                            type="button"
                            onClick={() => setCleanType("deep")}
                            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-4 ${
                              cleanType === "deep"
                                ? "bg-emerald-500/5 border-emerald-500 text-emerald-400"
                                : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            <div className="space-y-1">
                              <span className="font-display font-bold text-white block text-sm">Deep Clean</span>
                              <p className="text-xs text-slate-400 leading-normal">
                                Intense sanitize. Adds baseboards and heavy scrub zones.
                              </p>
                            </div>
                            <span className="font-mono text-xs font-semibold text-emerald-400">1.5x</span>
                          </button>

                          {/* Move-In/Out Clean */}
                          <button
                            type="button"
                            onClick={() => setCleanType("move-in-out")}
                            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-4 ${
                              cleanType === "move-in-out"
                                ? "bg-purple-500/5 border-purple-500 text-purple-400"
                                : "bg-slate-950 border-slate-855 text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            <div className="space-y-1">
                              <span className="font-display font-bold text-white block text-sm">Move-In / Out</span>
                              <p className="text-xs text-slate-400 leading-normal">
                                Moving cleans. Empty cabinets, stove interior and deep vacuums.
                              </p>
                            </div>
                            <span className="font-mono text-xs font-semibold text-purple-400">1.25x + $50</span>
                          </button>
                        </div>
                      </div>

                      {/* Toggleable Add-on Cards */}
                      <div className="space-y-3">
                        <label className="text-xs text-slate-400 font-mono uppercase tracking-wide block">Select Special Add-ons</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-sans">
                          {ADDONS_LIST.map((addon) => {
                            const isSelected = selectedAddons.includes(addon.name);
                            return (
                              <button
                                type="button"
                                key={addon.name}
                                onClick={() => handleToggleAddon(addon.name)}
                                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 ${
                                  isSelected
                                    ? "bg-sky-500/10 border-sky-500 text-sky-400 font-bold"
                                    : "bg-slate-950 border-slate-855 text-slate-300 hover:text-white"
                                }`}
                              >
                                <div className="flex justify-between items-center w-full">
                                  <span className="text-lg">{addon.icon}</span>
                                  <span className="font-mono text-xs text-slate-400 font-semibold">+${addon.price}</span>
                                </div>
                                <span className="text-xs font-semibold tracking-wide leading-none">{addon.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {step1Error && (
                    <p className="text-red-400 font-mono text-xs text-center animate-pulse">{step1Error}</p>
                  )}

                  {/* Bottom Navigation CTAs */}
                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setActiveView(ActiveView.Home)}
                      className="px-5 py-3 border border-slate-800 rounded-xl hover:bg-slate-850 text-xs font-semibold text-slate-300 transition-colors"
                    >
                      Back to Home
                    </button>
                    <button
                      onClick={handleGoToStep2}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold text-xs px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-500/10 flex items-center gap-1.5"
                    >
                      Select Schedule
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

              {activeStep === 2 && (
                /* STEP 2: FREQUENCY & SCHEDULING FORM */
                <div className="space-y-6 animate-fadeIn" id="step2-scheduling">
                  
                  {/* Step Title */}
                  <div className="space-y-1">
                    <span className="text-sky-400 font-mono text-xs uppercase font-bold tracking-wider">STEP 2 OF 3: SCHEDULING & FREQUENCY</span>
                    <h2 className="font-display text-xl font-bold text-white">Choose frequency &amp; date</h2>
                    <p className="text-xs text-slate-400">Lock in a subscription schedule to unlock percentage discounts.</p>
                  </div>

                  {/* Subscription Frequencies */}
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-mono uppercase tracking-wide block">Subscription Frequency (Discounts applied instantly)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-sans">
                      {/* One Time */}
                      <button
                        onClick={() => setFrequency("one-time")}
                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[90px] ${
                          frequency === "one-time"
                            ? "bg-sky-500/10 border-sky-500 text-sky-400 font-bold"
                            : "bg-slate-950 border-slate-855 text-slate-300 hover:text-white"
                        }`}
                      >
                        <span className="font-bold text-white block">One-Time</span>
                        <span className="text-xs font-mono text-slate-400 uppercase block">Base Price</span>
                      </button>

                      {/* Weekly */}
                      <button
                        onClick={() => setFrequency("weekly")}
                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[90px] ${
                          frequency === "weekly"
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold"
                            : "bg-slate-950 border-slate-855 text-slate-300 hover:text-white"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold text-white">Weekly</span>
                          <span className="text-xs font-mono font-bold bg-emerald-500 text-slate-950 px-1 py-0.2 rounded">-20%</span>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 uppercase block">Best Value</span>
                      </button>

                      {/* Bi-Weekly */}
                      <button
                        onClick={() => setFrequency("bi-weekly")}
                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[90px] ${
                          frequency === "bi-weekly"
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold"
                            : "bg-slate-950 border-slate-300/40 text-slate-300 hover:text-white"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold text-white">Bi-Weekly</span>
                          <span className="text-xs font-mono font-bold bg-emerald-500 text-slate-955 px-1 py-0.2 rounded">-15%</span>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 uppercase block">Most Popular</span>
                      </button>

                      {/* Monthly */}
                      <button
                        onClick={() => setFrequency("monthly")}
                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[90px] ${
                          frequency === "monthly"
                            ? "bg-sky-500/10 border-sky-500 text-sky-400 font-bold"
                            : "bg-slate-950 border-slate-855 text-slate-300 hover:text-white"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold text-white">Monthly</span>
                          <span className="text-xs font-mono font-bold bg-emerald-500 text-slate-955 px-1 py-0.2 rounded">-10%</span>
                        </div>
                        <span className="text-xs font-mono text-slate-400 uppercase block">Regular Clean</span>
                      </button>
                    </div>
                  </div>

                  {/* Calendar Picker Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* Visual 7-day picker list */}
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-mono uppercase tracking-wide block">Select Date Slot</label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {getNextDays().map((day) => {
                          const dateStr = day.toISOString().split("T")[0];
                          const isSelected = selectedDate === dateStr;
                          return (
                            <button
                              key={dateStr}
                              onClick={() => setSelectedDate(dateStr)}
                              className={`p-2.5 rounded-xl border text-center flex flex-col gap-1 transition-all ${
                                isSelected
                                  ? "bg-sky-500/10 border-sky-500 text-sky-400 font-bold"
                                  : "bg-slate-950 border-slate-855 text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              <span className="text-xs font-mono text-slate-400 uppercase block">
                                {day.toLocaleDateString("en-US", { weekday: 'short' })}
                              </span>
                              <span className="font-display font-bold text-sm block">{day.getDate()}</span>
                              <span className="text-xs text-slate-400 uppercase block">
                                {day.toLocaleDateString("en-US", { month: 'short' })}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Preferred Arrival Window */}
                    <div className="space-y-3">
                      <label className="text-xs text-slate-400 font-mono uppercase tracking-wide block">Arrival Time Window</label>
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        {[
                          "09:00 AM - 12:00 PM",
                          "01:00 PM - 04:00 PM",
                          "04:00 PM - 07:00 PM"
                        ].map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`py-3 px-4 rounded-xl border text-left font-mono text-xs transition-all flex justify-between items-center ${
                              selectedTimeSlot === slot
                                ? "bg-sky-500/10 border-sky-500 text-sky-400 font-bold"
                                : "bg-slate-950 border-slate-855 text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            <span>{slot}</span>
                            <span className="text-xs text-emerald-400 uppercase font-mono font-bold">AVAILABLE</span>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Bottom Navigation CTAs */}
                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setActiveStep(1)}
                      className="px-5 py-3 border border-slate-800 rounded-xl hover:bg-slate-855 text-xs font-semibold text-slate-300 transition-colors"
                    >
                      Back to Scoping
                    </button>
                    <button
                      onClick={handleGoToStep3}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold text-xs px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-500/10 flex items-center gap-1.5"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

              {activeStep === 3 && (
                /* STEP 3: CONTACT & CHECKOUT FORM */
                <form onSubmit={handleSubmitBooking} className="space-y-6 animate-fadeIn" id="step3-checkout">
                  
                  {/* Step Title */}
                  <div className="space-y-1">
                    <span className="text-sky-400 font-mono text-xs uppercase font-bold tracking-wider">STEP 3 OF 3: REGISTRATION & SECURE BILLING</span>
                    <h2 className="font-display text-xl font-bold text-white">Complete booking checkout</h2>
                    <p className="text-xs text-slate-400">Card details are authorized on file before cleaning dispatch is approved.</p>
                  </div>

                  {/* Delivery Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-mono uppercase">Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Rebecca Nyandeng"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-mono uppercase">Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="e.g. rebecca@juba.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-mono uppercase">Phone Number *</label>
                      <input 
                        type="text" 
                        required 
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="e.g. +211 912 400 300"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-mono uppercase">Street Address *</label>
                      <input 
                        type="text" 
                        required 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Plot 42, Airport Road, Tongping"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  {/* Geolocation coordinates pinning */}
                  <div className="space-y-2 font-sans">
                    <label className="text-xs text-slate-400 font-mono uppercase block">Pin Location coordinates (Drag marker to exact gates) *</label>
                    <div className="h-64 rounded-2xl border border-slate-850 overflow-hidden relative">
                      <MapComponent 
                        mode="pinning" 
                        lat={selectedLat} 
                        lng={selectedLng} 
                        onCoordinatesChange={handleCoordinatesChange} 
                      />
                    </div>
                    <div className="flex gap-4 text-xs font-mono text-slate-400 justify-between px-1">
                      <span>Latitude: <strong className="text-emerald-400">{selectedLat.toFixed(5)}</strong></span>
                      <span>Longitude: <strong className="text-emerald-400">{selectedLng.toFixed(5)}</strong></span>
                      <button 
                        type="button"
                        onClick={handleGetCurrentLocation}
                        className="text-sky-400 hover:text-sky-300 font-bold underline cursor-pointer"
                      >
                        Use Current GPS
                      </button>
                    </div>
                  </div>
                  
                  {/* Access Key codes instructions */}
                  <div className="space-y-1.5 font-sans">
                    <label className="text-xs text-slate-400 font-mono uppercase">Access or Key box entry instructions</label>
                    <textarea 
                      value={entryInstructions}
                      onChange={(e) => setEntryInstructions(e.target.value)}
                      placeholder="Specify if gatekeeper is present, code for lockbox, or any gate entry instructions..."
                      className="w-full h-16 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 resize-none font-sans"
                    ></textarea>
                  </div>

                  {/* Local Payment Selection Panel */}
                  <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4 text-left">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-905">
                      <h4 className="text-white font-semibold font-display text-xs flex items-center gap-1.5 uppercase tracking-wide">
                        <CreditCard className="w-4 h-4 text-sky-400" />
                        South Sudan Payment Gateway
                      </h4>
                      <div className="flex gap-2">
                        {["MTN MoMo", "Zain Cash", "m-GURUSH", "Cash"].map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => {
                              setPaymentMethod(method as any);
                              setStep3Error("");
                            }}
                            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all ${
                              paymentMethod === method
                                ? "bg-sky-500/10 border-sky-500 text-sky-400"
                                : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            {method === "Cash" ? "Cash" : method}
                          </button>
                        ))}
                      </div>
                    </div>

                    {paymentMethod !== "Cash" ? (
                      <div className="space-y-4 animate-fadeIn">
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">
                          Payment will be processed via local South Sudanese mobile money USSD push request. Standard rates apply.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                          <div className="space-y-1">
                            <label className="text-xs text-slate-400 font-mono uppercase">Selected Carrier</label>
                            <div className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-white">
                              {paymentMethod} Gateway
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-slate-400 font-mono uppercase">Mobile Money Number *</label>
                            <input 
                              type="text" 
                              required
                              value={paymentPhone}
                              onChange={(e) => setPaymentPhone(e.target.value)}
                              placeholder="e.g. +211 928 300 401"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 font-mono text-white"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl space-y-2 text-xs font-sans animate-fadeIn">
                        <span className="font-bold text-slate-200 block">Cash Payment (Pay on Arrival)</span>
                        <p className="text-slate-400 leading-normal text-xs">
                          Book now without credit cards or networks. Hand cash (USD or SSP equivalents) directly to the dispatch crew leader upon clean completion.
                        </p>
                      </div>
                    )}
                  </div>

                  {step3Error && (
                    <p className="text-red-400 font-mono text-xs text-center animate-pulse">{step3Error}</p>
                  )}

                  {/* Bottom Navigation CTAs */}
                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="px-5 py-3 border border-slate-800 rounded-xl hover:bg-slate-850 text-xs font-semibold text-slate-300 transition-colors"
                    >
                      Back to Schedule
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-xs px-10 py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-500/10 flex items-center gap-1.5 uppercase tracking-wider"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          Authorize &amp; Book
                          <ShieldCheck className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>

            {/* Persistent Sidebar (Sticky Dynamic Invoice) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 sticky top-24 shadow-xl" id="invoice-sidebar">
                
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider pb-2.5 border-b border-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  Estimated Invoice
                </h3>

                {/* Scoping details items list */}
                <div className="space-y-3 font-sans text-xs">
                  
                  {isWasteService ? (
                    <>
                      {/* Waste Details line */}
                      <div className="flex justify-between text-slate-400">
                        <span>Refuse Volume ({wasteVolume} m³)</span>
                        <span className="font-mono text-white">${wasteVolume * 15}</span>
                      </div>
                      
                      {/* Risk multiplier line */}
                      {wasteRisk !== RiskClass.Low && (
                        <div className="flex justify-between text-slate-400">
                          <span>Risk Modifier ({wasteRisk})</span>
                          <span className="font-mono text-sky-400">
                            {wasteRisk === RiskClass.Medium ? "+30% rate multiplier" : "+80% rate multiplier"}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Area Details line */}
                      <div className="flex justify-between text-slate-400">
                        <span>Property Size ({bedrooms} Bed, {bathrooms} Bath)</span>
                        <span className="font-mono text-white">${baseSizePrice}</span>
                      </div>

                      {/* Clean Type modifier line */}
                      {cleanType !== "standard" && (
                        <div className="flex justify-between text-slate-400">
                          <span className="capitalize">Modifier ({cleanType} Clean)</span>
                          <span className="font-mono text-emerald-400">
                            {cleanType === "deep" ? "+50% rate multiplier" : "+$50 Flat Fee"}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Add-ons line */}
                  {selectedAddons.length > 0 && (
                    <div className="space-y-1 pb-1 pt-1">
                      <span className="text-xs text-slate-400 font-mono uppercase block">Add-ons detail:</span>
                      {selectedAddons.map((addon) => {
                        const addonPrice = isWasteService
                          ? (addon === "HSE Waste Binning" ? 50 : addon === "Bio-Safe Solutions" ? 75 : addon === "Secure Disposal Certification" ? 40 : 0)
                          : getAddonPrice(addon);
                        return (
                          <div key={addon} className="flex justify-between text-xs text-slate-400 pl-2">
                            <span>• {addon}</span>
                            <span className="font-mono">${addonPrice}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="border-t border-slate-800/80 pt-3 flex justify-between font-bold text-slate-300">
                    <span>Subtotal</span>
                    <span className="font-mono">${totalSubtotal.toFixed(2)}</span>
                  </div>

                  {/* Subscription discount line */}
                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-emerald-400 text-xs font-semibold">
                      <span className="capitalize">Sub Discount ({frequency})</span>
                      <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Local Tax line */}
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Juba Local Tax (5%)</span>
                    <span className="font-mono">${localTax.toFixed(2)}</span>
                  </div>

                  {/* Estimated Grand Total */}
                  <div className="border-t border-slate-800 pt-3.5 flex justify-between items-end">
                    <div>
                      <span className="block text-xs text-slate-400 uppercase font-mono leading-none mb-1">
                        {isWasteService ? "Total Waste Price:" : "Total Clean Price:"}
                      </span>
                      <span className="text-white font-display text-xl font-extrabold font-mono tracking-tight block">${finalPrice.toFixed(2)}</span>
                      <span className="text-emerald-400 font-display text-xs font-bold font-mono block">SSP {(finalPrice * 1300).toLocaleString()}</span>
                    </div>
                    <span className="text-xs text-sky-400 font-mono capitalize tracking-wide bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded font-bold">
                      {frequency}
                    </span>
                  </div>

                </div>

                {/* Explicit Trust Integration Section */}
                <div className="pt-4 border-t border-slate-800 space-y-3 font-sans text-xs text-slate-400 bg-slate-950/20 p-3 rounded-2xl">
                  <div className="flex gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Ministry Registered:</strong> Ministry of Environment &amp; Forestry Licensed.</span>
                  </div>
                  <div className="flex gap-2">
                    <Heart className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Happiness Guarantee:</strong> Free reclean within 24 hours if unsatisfied.</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span><strong>NCA Approved Portal:</strong> Safe mobile billing for Juba carriers.</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* South Sudan Mobile Money USSD Verification Mock Modal */}
      <AnimatePresence>
        {isUSSDPromptOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => {
                if (!isProcessingPayment) setIsUSSDPromptOpen(false);
              }}
            ></motion.div>
            
            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl z-10 space-y-6 text-left"
            >
              {!isProcessingPayment && (
                <button 
                  onClick={() => setIsUSSDPromptOpen(false)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-950 border border-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-4.5 h-4.5 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-mono uppercase tracking-widest font-bold">
                    South Sudan Local Checkout
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  {!isProcessingPayment ? `${paymentMethod} Verification` : "Sending Transit Push..."}
                </h3>
              </div>

              {!isProcessingPayment ? (
                <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 space-y-4 animate-fadeIn font-sans text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                    <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">{paymentMethod} USSD GATE</span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>

                  <div className="space-y-1 text-center py-2">
                    <p className="text-xs text-slate-400 font-sans">Merchant: Clean World Inc.</p>
                    <p className="text-base font-black text-white font-mono">${finalPrice.toFixed(2)} / SSP {(finalPrice * 1300).toLocaleString()}</p>
                    <p className="text-xs text-slate-400 font-mono">Carrier Target: {paymentPhone}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 uppercase font-mono tracking-widest block text-center">ENTER YOUR PIN TO CONFIRM</label>
                    <input 
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      value={ussdPin}
                      onChange={(e) => setUssdPin(e.target.value.replace(/\D/g, ""))}
                      className="w-24 mx-auto text-center block bg-slate-950 border border-slate-800 rounded-lg py-1.5 text-base tracking-widest font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    onClick={handleSimulateUSSDPayment}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-955 font-mono font-bold text-xs py-2.5 rounded-lg transition-colors"
                  >
                    Confirm &amp; Authorize
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center space-y-4 animate-pulse font-sans text-xs">
                  <RefreshCw className="w-10 h-10 text-emerald-400 mx-auto animate-spin" />
                  <div className="space-y-1">
                    <p className="font-bold text-white text-xs">Simulating Juba Network Transit...</p>
                    <p className="text-xs text-slate-400 font-mono">Carrier: {paymentMethod} Gateway</p>
                  </div>
                </div>
              )}

              <div className="text-center font-sans text-xs text-slate-455 leading-normal">
                *Notice: This is a safe sandboxed payment environment. No actual funds are charged. 
                Input any 4 digit code to verify order telemetry.
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
