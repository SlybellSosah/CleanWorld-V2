import React, { useState, useRef, useEffect } from "react";
import { ServicePillar, RiskClass, QuoteState, Product, CartItem, ActiveView } from "../types";
import { PRODUCTS, JUBA_LOCATIONS } from "../data";
import { 
  ShieldCheck, ArrowLeft, ArrowRight, MapPin, Layers, Users, ShieldAlert,
  Plus, Minus, Clipboard, CheckCircle, Download, FileText, Compass, Check
} from "lucide-react";

interface QuoteWizardProps {
  setActiveView: (view: ActiveView) => void;
  quoteState: QuoteState;
  setQuoteState: React.Dispatch<React.SetStateAction<QuoteState>>;
  cartProducts: { [key: string]: number };
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
}

export default function QuoteWizard({
  setActiveView,
  quoteState,
  setQuoteState,
  cartProducts,
  onUpdateCartQuantity
}: QuoteWizardProps) {
  const [activeStep, setActiveStep] = useState(1); // 1: Service, 2: Inventory, 3: Location, 4: Review
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptState, setReceiptState] = useState<any>(null);

  // Map click interaction refs & helper
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapPinPos, setMapPinPos] = useState({ x: 50, y: 50 }); // percentage

  // Pre-configured district coordinate matching
  const handleDistrictSelect = (locationName: string) => {
    const loc = JUBA_LOCATIONS.find(l => l.name === locationName);
    if (loc) {
      setQuoteState(prev => ({
        ...prev,
        locationName: loc.name,
        lat: loc.lat,
        lng: loc.lng
      }));

      // Approximate coordinates to pixel percentage on the static Juba Map image
      let pxX = 50;
      let pxY = 50;
      switch (loc.name) {
        case "Tongping": pxX = 68; pxY = 40; break;
        case "Amarat": pxX = 58; pxY = 48; break;
        case "Kololo": pxX = 55; pxY = 32; break;
        case "Juba 3": pxX = 35; pxY = 65; break;
        case "Munuki": pxX = 28; pxY = 22; break;
        case "Gudele": pxX = 15; pxY = 45; break;
        case "Kator": pxX = 72; pxY = 70; break;
      }
      setMapPinPos({ x: pxX, y: pxY });
    }
  };

  // Click on map container to set custom coordinate pin
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;

    setMapPinPos({ x: pctX, y: pctY });

    // Calculate a dynamic lat/lng based on Juba's central coordinates: 4.8517 N, 31.5822 E
    // Center of map is roughly 50%, 50%
    const latOffset = ((50 - pctY) * 0.0012); // moving up decreases pctY, increases latitude
    const lngOffset = ((pctX - 50) * 0.0015); // moving right increases pctX, increases longitude

    const rawLat = 4.8517 + latOffset;
    const rawLng = 31.5822 + lngOffset;

    // Keep to 4 decimal places
    const targetLat = Math.round(rawLat * 10000) / 10000;
    const targetLng = Math.round(rawLng * 10000) / 10000;

    // Detect closest district name
    let closestLoc = JUBA_LOCATIONS[0];
    let minDist = Infinity;
    JUBA_LOCATIONS.forEach(loc => {
      const dist = Math.sqrt(Math.pow(loc.lat - targetLat, 2) + Math.pow(loc.lng - targetLng, 2));
      if (dist < minDist) {
        minDist = dist;
        closestLoc = loc;
      }
    });

    setQuoteState(prev => ({
      ...prev,
      locationName: `Facility Gate (Near ${closestLoc.name})`,
      lat: targetLat,
      lng: targetLng
    }));
  };

  // Sync initial map pin on mount based on initial location
  useEffect(() => {
    if (quoteState.locationName) {
      const match = JUBA_LOCATIONS.find(l => l.name === quoteState.locationName);
      if (match) {
        handleDistrictSelect(match.name);
      }
    }
  }, []);

  // Compute live operational indicators
  const suggestedPersonnel = Math.max(2, Math.ceil(quoteState.areaSize / 400));
  
  // Cost multiplier based on Risk Class
  const getRiskMultiplier = () => {
    switch (quoteState.riskClass) {
      case RiskClass.High: return 1.5;
      case RiskClass.Medium: return 1.2;
      default: return 1.0;
    }
  };

  // Cost multiplier based on Service Pillar
  const getPillarBaseRate = () => {
    switch (quoteState.servicePillar) {
      case ServicePillar.Consultancy: return 0.85; // $ per sqm
      case ServicePillar.Management: return 0.65;
      case ServicePillar.Fumigation: return 0.45;
      case ServicePillar.Landscaping: return 0.75;
      default: return 0.50;
    }
  };

  const serviceBaseCost = quoteState.areaSize * getPillarBaseRate() * getRiskMultiplier();

  // Supplies in procurement
  const cartItems: CartItem[] = PRODUCTS.map(p => ({
    product: p,
    quantity: cartProducts[p.id] || 0
  })).filter(item => item.quantity > 0);

  const suppliesCost = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const estimatedScopeTotal = serviceBaseCost + suppliesCost;

  // Next / Previous step controls
  const handleNextStep = () => {
    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteState.contactName || !quoteState.facilityName || !quoteState.contactPhone || !quoteState.contactEmail) {
      alert("Please fill in all contact fields to complete your quote request.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const uniqueInspectionId = `HSE-${928}-${Math.floor(10000 + Math.random() * 90000)}`;
      setReceiptState({
        id: uniqueInspectionId,
        date: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
        facility: quoteState.facilityName,
        contact: quoteState.contactName,
        phone: quoteState.contactPhone,
        email: quoteState.contactEmail,
        pillar: quoteState.servicePillar,
        area: quoteState.areaSize,
        risk: quoteState.riskClass,
        lat: quoteState.lat,
        lng: quoteState.lng,
        location: quoteState.locationName,
        supplies: [...cartItems],
        totalCost: estimatedScopeTotal,
        notes: quoteState.notes || "None logged. Standard inspection protocol assigned."
      });
    }, 1500);
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-16 px-4" id="wizard-root">
      <div className="max-w-7xl mx-auto">
        
        {receiptState ? (
          /* High-Stakes Digital Inspection Success SLA Receipt */
          <div className="max-w-3xl mx-auto bg-slate-950 border-2 border-emerald-500 rounded-3xl p-6 sm:p-12 space-y-8 shadow-2xl animate-fadeIn" id="inspection-receipt">
            
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <Check className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-emerald-400 font-bold text-xs uppercase tracking-widest">// REQUEST RECEIVED</span>
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white">Quote Request Received</h2>
              </div>
              <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                Your request has been sent to our team in Juba. A Clean World Inc. representative will contact you shortly to confirm your booking and details.
              </p>
            </div>

            {/* Receipt Details Sheet */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-sm font-sans" id="receipt-details">
              
              <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="block text-[10px] text-slate-400 font-mono uppercase">Quote Request ID</span>
                  <span className="block font-mono font-bold text-emerald-400 text-base">{receiptState.id}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-mono uppercase">Request Date</span>
                  <span className="block font-medium text-white">{receiptState.date}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-mono uppercase">Status</span>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    RECEIVED
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-2">// Your Contact Information</h4>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div><span className="text-slate-500">Business / Home Name:</span> {receiptState.facility}</div>
                    <div><span className="text-slate-500">Contact Person:</span> {receiptState.contact}</div>
                    <div><span className="text-slate-500">Phone Number:</span> {receiptState.phone}</div>
                    <div><span className="text-slate-500">Email Address:</span> {receiptState.email}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-2">// Selected Location</h4>
                  <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                    <div><span className="text-slate-500">Location Name:</span> {receiptState.location}</div>
                    <div><span className="text-slate-500">GPS Coordinates:</span> {receiptState.lat}° N, {receiptState.lng}° E</div>
                    <div><span className="text-slate-500">Risk Category:</span> {receiptState.risk}</div>
                    <div><span className="text-slate-500">Estimated Size:</span> {receiptState.area.toLocaleString()} sqm</div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border-t border-slate-800 pt-6 space-y-3">
                <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">// Selected Service &amp; Products</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs bg-slate-950 p-3 rounded-lg border border-slate-850">
                    <span className="text-white font-medium">{receiptState.pillar} Service Program ({receiptState.area.toLocaleString()} sqm)</span>
                    <span className="font-mono text-slate-300">${(receiptState.totalCost - receiptState.supplies.reduce((acc: any, i: any) => acc + (i.product.price * i.quantity), 0)).toFixed(2)}</span>
                  </div>
                  {receiptState.supplies.map((item: any) => (
                    <div key={item.product.id} className="flex justify-between items-center text-xs bg-slate-950 p-3 rounded-lg border border-slate-850">
                      <span className="text-slate-300">{item.product.name} (x{item.quantity})</span>
                      <span className="font-mono text-slate-400">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex justify-between items-center text-base">
                <span className="font-display font-bold text-white">Total Estimated Price</span>
                <span className="font-mono font-bold text-emerald-400 text-lg">${receiptState.totalCost.toFixed(2)}</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
                <span className="block font-semibold text-white mb-1">Special Notes &amp; Instructions:</span>
                "{receiptState.notes}"
              </div>

            </div>

            {/* Actions for printable document */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-100 font-sans font-semibold px-6 py-3 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                Print Quote Summary
              </button>
              <button
                onClick={() => {
                  setReceiptState(null);
                  setActiveStep(1);
                  setQuoteState(prev => ({
                    ...prev,
                    notes: ""
                  }));
                }}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-1"
              >
                Start New Quote
              </button>
            </div>

          </div>
        ) : (
          /* Multi-Step Interactive Quote Flow */
          <div className="space-y-10" id="quote-flow-wizard">
            
            {/* Form Title */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="text-emerald-500 font-mono text-xs font-semibold tracking-widest uppercase">// FREE SERVICE QUOTE</span>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                Request a Free Service Quote
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Choose your services, enter your property size, select your location, and request a free quote today.
              </p>
            </div>

            {/* Progress indicator */}
            <div className="max-w-4xl mx-auto bg-slate-950 border border-slate-800 p-4 rounded-2xl flex justify-between items-center gap-2 text-xs sm:text-sm font-display font-medium">
              {[
                { step: 1, label: "1. Service & Scale" },
                { step: 2, label: "2. Supplies Integration" },
                { step: 3, label: "3. Location Selector" },
                { step: 4, label: "4. Review & Dispatch" }
              ].map((item) => (
                <button
                  key={item.step}
                  onClick={() => {
                    if (item.step < activeStep || activeStep === 4) {
                      setActiveStep(item.step);
                    }
                  }}
                  className={`flex-1 text-center py-2 px-1 rounded-lg transition-all ${
                    activeStep === item.step
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : activeStep > item.step
                      ? "text-emerald-500 cursor-pointer hover:underline"
                      : "text-slate-500 cursor-not-allowed"
                  }`}
                  disabled={item.step > activeStep}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Main Interactive Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Wizard Body (Left Column) */}
              <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 min-h-[500px] flex flex-col justify-between">
                
                {/* STEP 1: SERVICE & SCALE */}
                {activeStep === 1 && (
                  <div className="space-y-8 animate-fadeIn" id="step-1-content">
                    <div className="space-y-2">
                      <h3 className="font-display text-lg font-bold text-white">Select a Service</h3>
                      <p className="text-xs text-slate-400">
                        Choose the primary service program you need for your property.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { val: ServicePillar.Consultancy, label: "Environmental Consultancy", desc: "Technical audits, waste-mapping & ESG scoring." },
                        { val: ServicePillar.Management, label: "Integrated Facility & Cleaning Management", desc: "Corporate deep sanitization & custodial program." },
                        { val: ServicePillar.Fumigation, label: "Professional Fumigation", desc: "Malaria vector control & pathogen misting." },
                        { val: ServicePillar.Landscaping, label: "Landscaping & Botanical Design", desc: "Botanical gardens, residential lawns & community green spaces." }
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setQuoteState(prev => ({ ...prev, servicePillar: item.val }))}
                          className={`p-5 rounded-2xl text-left border transition-all flex flex-col justify-between h-36 ${
                            quoteState.servicePillar === item.val
                              ? "bg-emerald-500/5 border-emerald-500 text-emerald-400"
                              : "bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300"
                          }`}
                        >
                          <span className="font-display font-bold text-sm text-white">{item.label}</span>
                          <span className="text-xs text-slate-400 leading-normal mt-2">{item.desc}</span>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label htmlFor="area-range-input" className="font-display text-sm font-bold text-white">Estimated Size</label>
                        <span className="font-mono text-emerald-400 font-bold text-sm bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10">
                          {quoteState.areaSize.toLocaleString()} sqm
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Enter the estimated size of your building or land area in square meters.
                      </p>
                      <input 
                        type="range" 
                        id="area-range-input"
                        min={50} 
                        max={10000} 
                        step={50}
                        value={quoteState.areaSize}
                        onChange={(e) => setQuoteState(prev => ({ ...prev, areaSize: parseInt(e.target.value) }))}
                        className="w-full accent-emerald-500 h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>50 sqm</span>
                        <span>5,000 sqm</span>
                        <span>10,000 sqm+</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-display text-sm font-bold text-white">Risk Category</h3>
                      <p className="text-xs text-slate-400">
                        Select the risk level of your facility. This helps us prepare the right safety equipment and products.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { val: RiskClass.Low, label: "Low Risk", desc: "Standard office spaces, homes, and common walkways." },
                          { val: RiskClass.Medium, label: "Medium Risk", desc: "Kitchens, restaurants, warehouses, and compounds." },
                          { val: RiskClass.High, label: "High Risk", desc: "Hospitals, medical clinics, and chemical storage areas." }
                        ].map((item) => (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => setQuoteState(prev => ({ ...prev, riskClass: item.val as RiskClass }))}
                            className={`p-4 rounded-xl text-left border transition-all space-y-2 ${
                              quoteState.riskClass === item.val
                                ? "bg-emerald-500/5 border-emerald-500"
                                : "bg-slate-900/50 border-slate-800 text-slate-300"
                            }`}
                          >
                            <span className="block font-semibold text-xs text-white">{item.label}</span>
                            <span className="block text-[10px] text-slate-500 leading-normal">{item.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: SUPPLIES INTEGRATION */}
                {activeStep === 2 && (
                  <div className="space-y-6 animate-fadeIn" id="step-2-content">
                    <div className="space-y-2">
                      <h3 className="font-display text-lg font-bold text-white">Add Eco-Friendly Products</h3>
                      <p className="text-xs text-slate-400">
                        Add any recommended safe cleaning products or disinfectants you would like to include in your quote.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {PRODUCTS.map((prod) => {
                        const currentQty = cartProducts[prod.id] || 0;
                        return (
                          <div key={prod.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-3 items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img 
                                src={prod.image} 
                                alt={prod.name} 
                                className="w-14 h-14 rounded-lg object-cover bg-slate-950 border border-slate-800"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <span className="block text-xs font-bold text-white">{prod.name}</span>
                                <span className="block text-[10px] text-emerald-400 font-mono mt-0.5">${prod.price.toFixed(2)} / {prod.unit.split(" ")[0]}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 bg-slate-950 border border-slate-850 px-2 py-1 rounded-lg">
                              <button
                                type="button"
                                onClick={() => onUpdateCartQuantity(prod.id, Math.max(0, currentQty - 1))}
                                className="text-slate-400 hover:text-white p-1"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono text-xs font-semibold text-white px-1">{currentQty}</span>
                              <button
                                type="button"
                                onClick={() => onUpdateCartQuantity(prod.id, currentQty + 1)}
                                className="text-slate-400 hover:text-white p-1"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                      <div className="text-slate-400">
                        Total Supplies Added: <span className="text-white font-semibold font-mono">{cartItems.reduce((acc, i) => acc + i.quantity, 0)} units</span>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold">${suppliesCost.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* STEP 3: LOCATION SELECTOR */}
                {activeStep === 3 && (
                  <div className="space-y-6 animate-fadeIn" id="step-3-content">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Compass className="w-5 h-5 text-emerald-400" />
                        <h3 className="font-display text-lg font-bold text-white">Select Your Location on the Map</h3>
                      </div>
                      <p className="text-xs text-slate-400">
                        Click on the Juba map or select a district below to set your location pin. This helps us find your home or business easily.
                      </p>
                    </div>

                    {/* District selector shortcut */}
                    <div className="space-y-2">
                      <span className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider">Juba Districts:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {JUBA_LOCATIONS.map((loc) => (
                          <button
                            key={loc.name}
                            type="button"
                            onClick={() => handleDistrictSelect(loc.name)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                              quoteState.locationName === loc.name || quoteState.locationName.includes(loc.name)
                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold"
                                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            {loc.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interactive map box */}
                    <div className="relative border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl bg-slate-950">
                      
                      {/* Bounding box containing map image */}
                      <div 
                        ref={mapContainerRef}
                        onClick={handleMapClick}
                        className="h-80 w-full cursor-crosshair relative bg-slate-900 select-none overflow-hidden"
                        id="interactive-map-canvas"
                      >
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxVrMYT8wpL3aRCLWoO_pusUPYws7ExTbjZ9Wm6_Cw0A3AT1w0s1mDW8lr_8hGRzpvA2ccLuwO0M5O0UGAi0JJbiVxMbUpCCycM6iIXH9FAE-sjszDwYpM_hfDoURIhIuyYGEh71ESzemtqcDhYnPkAxev-pxAYZczuQ-KFtN_VU52Lx4Fcaok5n44AqJu5sd3DYvPZ95JM9qG-0jFKxLwtD0lz7uLzUrZIwHp0FJWO4ComTXw104LYu3JNzKVO9qKhdHFMgZ449A" 
                          alt="Juba Facility Map Grid" 
                          className="w-full h-full object-cover opacity-80 pointer-events-none"
                          referrerPolicy="no-referrer"
                        />

                        {/* Interactive overlay grid */}
                        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-5 pointer-events-none border border-white">
                          {[...Array(24)].map((_, i) => (
                            <div key={i} className="border border-white/40"></div>
                          ))}
                        </div>

                        {/* Interactive floating neon pin */}
                        <div 
                          className="absolute h-8 w-8 -ml-4 -mt-8 flex items-center justify-center transition-all duration-300 pointer-events-none"
                          style={{ left: `${mapPinPos.x}%`, top: `${mapPinPos.y}%` }}
                        >
                          <div className="absolute h-3 w-3 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                          <MapPin className="w-8 h-8 text-emerald-400 drop-shadow-[0_2px_8px_rgba(52,211,153,0.5)]" />
                        </div>

                        {/* Real-time coordinates HUD inside map */}
                        <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-[10px] text-emerald-400 space-y-0.5">
                          <div>GPS Lat: {quoteState.lat}° N</div>
                          <div>GPS Lng: {quoteState.lng}° E</div>
                          <div>Zone: Juba Sector AX-9</div>
                        </div>

                      </div>

                    </div>

                    {/* Protocol notice box */}
                    <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-2xl flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                      <div className="space-y-1">
                        <span className="block font-semibold text-xs text-white uppercase tracking-wider">Note on Location Selection</span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Providing your location helps us coordinate with you and ensures our cleaning team arrives at your property on time.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: REVIEW & DISPATCH */}
                {activeStep === 4 && (
                  <form onSubmit={handleFormSubmission} className="space-y-6 animate-fadeIn" id="step-4-form">
                    <div className="space-y-2">
                      <h3 className="font-display text-lg font-bold text-white">Enter Your Details to Complete Your Quote Request</h3>
                      <p className="text-xs text-slate-400">
                        Please enter your contact information below so we can contact you to finalize your quote.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="quote-facility" className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Your Business / Home Name *</label>
                        <input 
                          type="text" 
                          id="quote-facility"
                          required
                          value={quoteState.facilityName}
                          onChange={(e) => setQuoteState(prev => ({ ...prev, facilityName: e.target.value }))}
                          placeholder="e.g. My Home / My Business Juba"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="quote-contact" className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Contact Person *</label>
                        <input 
                          type="text" 
                          id="quote-contact"
                          required
                          value={quoteState.contactName}
                          onChange={(e) => setQuoteState(prev => ({ ...prev, contactName: e.target.value }))}
                          placeholder="e.g. Kevina Aber"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="quote-phone" className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Phone Number *</label>
                        <input 
                          type="tel" 
                          id="quote-phone"
                          required
                          value={quoteState.contactPhone}
                          onChange={(e) => setQuoteState(prev => ({ ...prev, contactPhone: e.target.value }))}
                          placeholder="e.g. +211 928 300 400"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="quote-email" className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Email Address *</label>
                        <input 
                          type="email" 
                          id="quote-email"
                          required
                          value={quoteState.contactEmail}
                          onChange={(e) => setQuoteState(prev => ({ ...prev, contactEmail: e.target.value }))}
                          placeholder="e.g. example@gmail.com"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="quote-notes" className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Special Requests &amp; Instructions (Optional)</label>
                      <textarea 
                        id="quote-notes"
                        rows={3}
                        value={quoteState.notes}
                        onChange={(e) => setQuoteState(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Tell us about any specific details, preferred visit times, or cleaning requests..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                      <span className="text-[10px] text-slate-500 max-w-sm text-left">
                        By submitting, you request a free assessment by Clean World Inc. to prepare your service plan.
                      </span>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10"
                      >
                        {isSubmitting ? "Sending..." : "Submit Request"}
                      </button>
                    </div>

                  </form>
                )}

                {/* Wizard navigation bar at bottom */}
                {activeStep < 4 && (
                  <div className="flex items-center justify-between pt-8 border-t border-slate-900/60 mt-8" id="wizard-nav-buttons">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      disabled={activeStep === 1}
                      className={`text-xs font-bold font-display flex items-center gap-1 transition-all ${
                        activeStep === 1 ? "text-slate-700 cursor-not-allowed" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center gap-1 shadow-md shadow-emerald-500/5"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

              </div>

              {/* Real-time Draft sidebar (Right Column) */}
              <div className="lg:col-span-4 space-y-6 sticky top-28" id="wizard-sidebar-summary">
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
                  
                  <div className="pb-3 border-b border-slate-900">
                    <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Clipboard className="w-4 h-4 text-emerald-400" />
                      Your Quote Details
                    </h4>
                    <span className="text-[10px] text-slate-500 mt-1 block">Estimated price details</span>
                  </div>

                  <div className="space-y-4 text-xs font-sans">
                    
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Selected Service:</span>
                      <span className="text-white font-semibold mt-1 block">{quoteState.servicePillar} Program</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-slate-900">
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Estimated Size:</span>
                        <span className="text-white font-semibold mt-0.5 block">{quoteState.areaSize.toLocaleString()} sqm</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Risk Category:</span>
                        <span className="text-white font-semibold mt-0.5 block">{quoteState.riskClass.split(" ")[2] || "Low"} Risk</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Recommended Team:</span>
                      <span className="text-white font-semibold font-mono flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-emerald-400" />
                        {suggestedPersonnel} Specialists
                      </span>
                    </div>

                    {/* Geolocation Coordinate Readout */}
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 space-y-1">
                      <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">Location Coordinates:</span>
                      <span className="text-emerald-400 font-mono text-[10px] font-semibold block truncate">
                        {quoteState.locationName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {quoteState.lat}° N , {quoteState.lng}° E
                      </span>
                    </div>

                    {/* Procurement supplies cart summary inside sidebar */}
                    {cartItems.length > 0 && (
                      <div className="space-y-2 border-t border-slate-900 pt-3">
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Selected Products:</span>
                        <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                          {cartItems.map((item) => (
                            <div key={item.product.id} className="flex justify-between text-[10px] text-slate-300">
                              <span>{item.product.name} (x{item.quantity})</span>
                              <span className="font-mono">${(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price computation */}
                    <div className="space-y-2 border-t border-slate-900 pt-4">
                      <div className="flex justify-between text-slate-400">
                        <span>Estimated Service Price</span>
                        <span className="font-mono">${serviceBaseCost.toFixed(2)}</span>
                      </div>
                      {suppliesCost > 0 && (
                        <div className="flex justify-between text-slate-400">
                          <span>Products Added</span>
                          <span className="font-mono">${suppliesCost.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-white font-bold text-sm pt-2 border-t border-slate-900">
                        <span>Total Estimated Price</span>
                        <span className="font-mono text-emerald-400 text-base">${estimatedScopeTotal.toFixed(2)}</span>
                      </div>
                    </div>

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
