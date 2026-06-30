import React, { useState, useEffect } from "react";
import { ActiveView, Booking } from "../types";
import { 
  ShieldCheck, ArrowLeft, ArrowRight, CheckCircle, MapPin, 
  Sparkles, Calendar, Clock, CreditCard, HelpCircle, Heart, User, Building, Phone, Mail, FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QuoteWizardProps {
  setActiveView: (view: ActiveView) => void;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}

export default function QuoteWizard({ setActiveView, bookings, setBookings }: QuoteWizardProps) {
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

  // STEP 2 STATE: Scheduling & Subscription Frequency
  const [frequency, setFrequency] = useState<"one-time" | "weekly" | "bi-weekly" | "monthly">("bi-weekly");
  const [selectedDate, setSelectedDate] = useState<string>("2026-07-01");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("09:00 AM - 12:00 PM");

  // STEP 3 STATE: Personal Registration & Card Details
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [address, setAddress] = useState("");
  const [entryInstructions, setEntryInstructions] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  
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

  const subtotalBeforeAddons = (baseSizePrice * typeMultiplier) + typePriceModifier;
  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + getAddonPrice(addon), 0);
  const totalSubtotal = subtotalBeforeAddons + addonsTotal;

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

    // Card validation regex
    if (!cardNumber || cardNumber.length < 12) {
      setStep3Error("Secure Billing: Please input a valid credit card on file.");
      return;
    }

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
        entryInstructions: entryInstructions,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        sqFtRange: sqFtRange,
        cleanType: cleanType,
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
        createdAt: new Date().toISOString()
      };

      setBookings(prev => [newBooking, ...prev]);
      setNewBookingId(bId);
      setIsSubmitting(false);
      setActiveStep(4); // Receipt View
    }, 1500);
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
              <span className="text-emerald-400 font-mono text-[10px] uppercase tracking-widest font-extrabold">Professional Cleaning Engine</span>
            </div>
            <h1 className="font-display text-3xl font-extrabold text-white">Book Your Eco-Clean</h1>
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
                      : "bg-slate-950 text-slate-500"
                  }`}>
                    {s.step}
                  </span>
                  <span className={`text-xs font-semibold ${activeStep === s.step ? "text-white" : "text-slate-500"}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {activeStep === 4 ? (
          /* STEP 4: CONFIRMATION & RECEIPT SHEET */
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 text-center animate-fadeIn" id="receipt-card">
            <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="text-emerald-400 font-mono text-xs uppercase tracking-wider block font-bold">// SECURE ORDER DISPATCHED</span>
              <h2 className="font-display text-2xl font-extrabold text-white">Booking Confirmed!</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Your reservation has been authenticated and loaded into our scheduling matrix.
              </p>
            </div>

            {/* Receipt Summary Breakdown */}
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6 text-left space-y-4 font-mono text-xs text-slate-300">
              <div className="flex justify-between pb-3 border-b border-slate-850">
                <span className="text-slate-500 uppercase font-mono">Invoice Reference</span>
                <span className="font-bold text-white">{newBookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase">Service Profile</span>
                <span className="text-white capitalize font-semibold">{cleanType} Clean</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Property Layout</span>
                <span>{bedrooms} Bed, {bathrooms} Bath</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Schedule Date</span>
                <span>{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Arrival Window</span>
                <span>{selectedTimeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Territory Area</span>
                <span>{SERVED_TERRITORIES.find(t => t.zip === zipCode)?.name || "Juba Local"} ({zipCode})</span>
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
                    <span className="text-sky-400 font-mono text-[10px] uppercase font-bold tracking-wider">// STEP 1 OF 3: PROPERTY DETAILS</span>
                    <h2 className="font-display text-xl font-bold text-white">Tell us about your home</h2>
                    <p className="text-xs text-slate-400">Specify property size and select clean type for instant scoping.</p>
                  </div>

                  {/* Territory coverage check */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wide block">Juba Neighborhood Service Area *</label>
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
                      <span className="px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 font-semibold font-mono text-[11px] flex items-center justify-center text-slate-400">
                        {SERVED_TERRITORIES.find(t => t.zip === zipCode)?.zip || "OUTSIDE AREA"}
                      </span>
                    </div>
                  </div>

                  {/* Bedroom & Bathroom Counters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Bedrooms */}
                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-500 font-mono uppercase">Bedrooms</span>
                        <div className="font-display font-black text-white text-lg">{bedrooms} Bedrooms</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setBedrooms(b => Math.max(1, b - 1))}
                          className="h-9 w-9 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-full flex items-center justify-center font-bold text-slate-300"
                        >-</button>
                        <button 
                          onClick={() => setBedrooms(b => Math.min(6, b + 1))}
                          className="h-9 w-9 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-full flex items-center justify-center font-bold text-slate-300"
                        >+</button>
                      </div>
                    </div>

                    {/* Bathrooms */}
                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-500 font-mono uppercase">Bathrooms</span>
                        <div className="font-display font-black text-white text-lg">{bathrooms} Bathrooms</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setBathrooms(b => Math.max(1, b - 1))}
                          className="h-9 w-9 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-full flex items-center justify-center font-bold text-slate-300"
                        >-</button>
                        <button 
                          onClick={() => setBathrooms(b => Math.min(4, b + 1))}
                          className="h-9 w-9 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-full flex items-center justify-center font-bold text-slate-300"
                        >+</button>
                      </div>
                    </div>
                  </div>

                  {/* Square footage Range */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wide block">Estimated Area Range</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      {[
                        "< 1,000 sq ft",
                        "1,000 - 1,999 sq ft",
                        "2,000 - 2,999 sq ft",
                        "3,000+ sq ft"
                      ].map((range) => (
                        <button
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
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wide block">Standard, Deep, or Move Clean</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Standard Clean */}
                      <button
                        onClick={() => setCleanType("standard")}
                        className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-4 ${
                          cleanType === "standard"
                            ? "bg-sky-500/5 border-sky-500 text-sky-400"
                            : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="font-display font-bold text-white block text-sm">Standard Clean</span>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            Perfect for regular maintenance. Includes dust, mop, vacuum, and trash empty.
                          </p>
                        </div>
                        <span className="font-mono text-xs font-semibold">Multiplier: 1.0x</span>
                      </button>

                      {/* Deep Clean */}
                      <button
                        onClick={() => setCleanType("deep")}
                        className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-4 ${
                          cleanType === "deep"
                            ? "bg-emerald-500/5 border-emerald-500 text-emerald-400"
                            : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="font-display font-bold text-white block text-sm">Deep Clean</span>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            Intense detailed sanitize. Adds wet wipe baseboards, heavy scrub zones and light fixtures.
                          </p>
                        </div>
                        <span className="font-mono text-xs font-semibold text-emerald-400">Multiplier: 1.5x</span>
                      </button>

                      {/* Move-In/Out Clean */}
                      <button
                        onClick={() => setCleanType("move-in-out")}
                        className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-4 ${
                          cleanType === "move-in-out"
                            ? "bg-purple-500/5 border-purple-500 text-purple-400"
                            : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="font-display font-bold text-white block text-sm">Move-In / Out</span>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            Prepare your property for moving. Includes empty cabinets, stove interior and deep closet vacuum.
                          </p>
                        </div>
                        <span className="font-mono text-xs font-semibold text-purple-400">Multiplier: 1.25x + $50</span>
                      </button>
                    </div>
                  </div>

                  {/* Toggleable Add-on Cards */}
                  <div className="space-y-3">
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wide block">Select Special Add-ons</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-sans">
                      {ADDONS_LIST.map((addon) => {
                        const isSelected = selectedAddons.includes(addon.name);
                        return (
                          <button
                            key={addon.name}
                            onClick={() => handleToggleAddon(addon.name)}
                            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 ${
                              isSelected
                                ? "bg-sky-500/10 border-sky-500 text-sky-400 font-bold"
                                : "bg-slate-950 border-slate-850 text-slate-300 hover:text-white"
                            }`}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span className="text-lg">{addon.icon}</span>
                              <span className="font-mono text-[10px] text-slate-400 font-semibold">+${addon.price}</span>
                            </div>
                            <span className="text-[11px] font-semibold tracking-wide leading-none">{addon.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {step1Error && (
                    <p className="text-red-400 font-mono text-[10px] text-center animate-pulse">{step1Error}</p>
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
                    <span className="text-sky-400 font-mono text-[10px] uppercase font-bold tracking-wider">// STEP 2 OF 3: SCHEDULING & FREQUENCY</span>
                    <h2 className="font-display text-xl font-bold text-white">Choose frequency &amp; date</h2>
                    <p className="text-xs text-slate-400">Lock in a subscription schedule to unlock percentage discounts.</p>
                  </div>

                  {/* Subscription Frequencies */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wide block">Subscription Frequency (Discounts applied instantly)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-sans">
                      {/* One Time */}
                      <button
                        onClick={() => setFrequency("one-time")}
                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[90px] ${
                          frequency === "one-time"
                            ? "bg-sky-500/10 border-sky-500 text-sky-400 font-bold"
                            : "bg-slate-950 border-slate-850 text-slate-300 hover:text-white"
                        }`}
                      >
                        <span className="font-bold text-white block">One-Time</span>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">Base Price</span>
                      </button>

                      {/* Weekly */}
                      <button
                        onClick={() => setFrequency("weekly")}
                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[90px] ${
                          frequency === "weekly"
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold"
                            : "bg-slate-950 border-slate-850 text-slate-300 hover:text-white"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold text-white">Weekly</span>
                          <span className="text-[9px] font-mono font-bold bg-emerald-500 text-slate-950 px-1 py-0.2 rounded">-20%</span>
                        </div>
                        <span className="text-[9px] font-mono text-emerald-400 uppercase block">Best Value</span>
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
                          <span className="text-[9px] font-mono font-bold bg-emerald-500 text-slate-950 px-1 py-0.2 rounded">-15%</span>
                        </div>
                        <span className="text-[9px] font-mono text-emerald-400 uppercase block">Most Popular</span>
                      </button>

                      {/* Monthly */}
                      <button
                        onClick={() => setFrequency("monthly")}
                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[90px] ${
                          frequency === "monthly"
                            ? "bg-sky-500/10 border-sky-500 text-sky-400 font-bold"
                            : "bg-slate-950 border-slate-850 text-slate-300 hover:text-white"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold text-white">Monthly</span>
                          <span className="text-[9px] font-mono font-bold bg-emerald-500 text-slate-950 px-1 py-0.2 rounded">-10%</span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block">Regular Clean</span>
                      </button>
                    </div>
                  </div>

                  {/* Calendar Picker Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* Visual 7-day picker list */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wide block">Select Date Slot</label>
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
                                  : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              <span className="text-[9px] font-mono text-slate-500 uppercase block">
                                {day.toLocaleDateString("en-US", { weekday: 'short' })}
                              </span>
                              <span className="font-display font-bold text-sm block">{day.getDate()}</span>
                              <span className="text-[8px] text-slate-500 uppercase block">
                                {day.toLocaleDateString("en-US", { month: 'short' })}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Preferred Arrival Window */}
                    <div className="space-y-3">
                      <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wide block">Arrival Time Window</label>
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        {[
                          "09:00 AM - 12:00 PM",
                          "01:00 PM - 04:00 PM",
                          "04:00 PM - 07:00 PM"
                        ].map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`py-3 px-4 rounded-xl border text-left font-mono text-[11px] transition-all flex justify-between items-center ${
                              selectedTimeSlot === slot
                                ? "bg-sky-500/10 border-sky-500 text-sky-400 font-bold"
                                : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            <span>{slot}</span>
                            <span className="text-[9px] text-emerald-400 uppercase font-mono font-bold">AVAILABLE</span>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Bottom Navigation CTAs */}
                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setActiveStep(1)}
                      className="px-5 py-3 border border-slate-800 rounded-xl hover:bg-slate-850 text-xs font-semibold text-slate-300 transition-colors"
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
                    <span className="text-sky-400 font-mono text-[10px] uppercase font-bold tracking-wider">// STEP 3 OF 3: REGISTRATION & SECURE BILLING</span>
                    <h2 className="font-display text-xl font-bold text-white">Complete booking checkout</h2>
                    <p className="text-xs text-slate-400">Card details are authorized on file before cleaning dispatch is approved.</p>
                  </div>

                  {/* Delivery Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-mono uppercase">Full Name *</label>
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
                      <label className="text-[10px] text-slate-400 font-mono uppercase">Email Address *</label>
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
                      <label className="text-[10px] text-slate-400 font-mono uppercase">Phone Number *</label>
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
                      <label className="text-[10px] text-slate-400 font-mono uppercase">Street Address *</label>
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

                  {/* Access Key codes instructions */}
                  <div className="space-y-1.5 font-sans">
                    <label className="text-[10px] text-slate-400 font-mono uppercase">Access or Key box entry instructions</label>
                    <textarea 
                      value={entryInstructions}
                      onChange={(e) => setEntryInstructions(e.target.value)}
                      placeholder="Specify if gatekeeper is present, code for lockbox, or any gate entry instructions..."
                      className="w-full h-16 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 resize-none font-sans"
                    ></textarea>
                  </div>

                  {/* Stripe Card Integration Panel */}
                  <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4">
                    <h4 className="text-white font-semibold font-display text-xs flex items-center gap-1.5 uppercase tracking-wide">
                      <CreditCard className="w-4 h-4 text-sky-400" />
                      Secure Credit Card (Authorized on File)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono uppercase">Card Number</label>
                        <input 
                          type="text" 
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4111 2222 3333 4242"
                          maxLength={19}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono uppercase">Card Holder</label>
                        <input 
                          type="text" 
                          required
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="e.g. Rebecca Nyandeng"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:col-span-2">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 font-mono uppercase">Expiry Date</label>
                          <input 
                            type="text" 
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 font-mono uppercase">CVV Code</label>
                          <input 
                            type="password" 
                            required
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            maxLength={3}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {step3Error && (
                    <p className="text-red-400 font-mono text-[10px] text-center animate-pulse">{step3Error}</p>
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

                  {/* Add-ons line */}
                  {selectedAddons.length > 0 && (
                    <div className="space-y-1 pb-1 pt-1">
                      <span className="text-[10px] text-slate-500 font-mono uppercase block">Add-ons detail:</span>
                      {selectedAddons.map((addon) => (
                        <div key={addon} className="flex justify-between text-[11px] text-slate-400 pl-2">
                          <span>• {addon}</span>
                          <span className="font-mono">${getAddonPrice(addon)}</span>
                        </div>
                      ))}
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
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Juba Local Tax (5%)</span>
                    <span className="font-mono">${localTax.toFixed(2)}</span>
                  </div>

                  {/* Estimated Grand Total */}
                  <div className="border-t border-slate-800 pt-3.5 flex justify-between items-end">
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase font-mono leading-none mb-1">Total Clean Price:</span>
                      <span className="text-white font-display text-2xl font-extrabold font-mono tracking-tight">${finalPrice.toFixed(2)}</span>
                    </div>
                    <span className="text-[10px] text-sky-400 font-mono capitalize tracking-wide bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded font-bold">
                      {frequency}
                    </span>
                  </div>

                </div>

                {/* Explicit Trust Integration Section */}
                <div className="pt-4 border-t border-slate-800 space-y-3 font-sans text-[11px] text-slate-400 bg-slate-950/20 p-3 rounded-2xl">
                  <div className="flex gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Licensed, Bonded &amp; Insured:</strong> Fully vetted, background-screened team.</span>
                  </div>
                  <div className="flex gap-2">
                    <Heart className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>24-Hour Happiness Guarantee:</strong> We'll reclean for free if you are unsatisfied.</span>
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
