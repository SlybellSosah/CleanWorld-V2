import React, { useState } from "react";
import { Booking, ActiveView } from "../types";
import { 
  Calendar, Clock, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, CreditCard, 
  Sparkles, ShieldCheck, Heart, User, MapPin, DollarSign, RotateCcw, ThumbsUp, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ClientDashboardProps {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  setActiveView: (view: ActiveView) => void;
}

export default function ClientDashboard({ bookings, setSetBookings, setBookings, setActiveView }: any) {
  // Fix arguments for the component safely
  const actualSetBookings = setBookings;
  
  const [selectedBookingForReschedule, setSelectedBookingForReschedule] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState("09:00 AM - 12:00 PM");
  const [rescheduleError, setRescheduleError] = useState("");
  
  const [selectedBookingForTip, setSelectedBookingForTip] = useState<Booking | null>(null);
  const [tipAmount, setTipAmount] = useState<number>(15);
  const [tipSuccess, setTipSuccess] = useState(false);

  const [cardDetails, setCardDetails] = useState({
    number: "•••• •••• •••• 4242",
    holder: "Sly Bell Sosah",
    expiry: "12/28",
    cvv: "•••",
    brand: "visa"
  });
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [cardEditForm, setCardEditForm] = useState({
    number: "",
    holder: "",
    expiry: "",
    cvv: ""
  });
  const [cardUpdateSuccess, setCardUpdateSuccess] = useState(false);

  // Time-slot availability
  const timeSlots = [
    "09:00 AM - 12:00 PM",
    "01:00 PM - 04:00 PM",
    "04:00 PM - 07:00 PM"
  ];

  // Helper to determine if rescheduling is allowed (>= 24 hours prior)
  const isRescheduleAllowed = (bookingDateStr: string) => {
    try {
      const today = new Date();
      const bookingDate = new Date(`${bookingDateStr}T09:00:00`); // Assuming morning start
      const diffMs = bookingDate.getTime() - today.getTime();
      const diffHrs = diffMs / (1000 * 60 * 60);
      return diffHrs >= 24;
    } catch {
      return false;
    }
  };

  const handleOpenReschedule = (booking: Booking) => {
    setSelectedBookingForReschedule(booking);
    setNewDate(booking.date);
    setNewTimeSlot(booking.timeSlot);
    setRescheduleError("");
  };

  const submitReschedule = () => {
    if (!newDate) {
      setRescheduleError("Please select a valid date.");
      return;
    }
    
    const chosenDate = new Date(`${newDate}T00:00:00`);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    if (chosenDate < today) {
      setRescheduleError("Reschedule date cannot be in the past.");
      return;
    }

    actualSetBookings((prev: Booking[]) =>
      prev.map((b) =>
        b.id === selectedBookingForReschedule?.id
          ? { ...b, date: newDate, timeSlot: newTimeSlot }
          : b
      )
    );

    setSelectedBookingForReschedule(null);
  };

  const handleAddTip = (booking: Booking) => {
    setSelectedBookingForTip(booking);
    setTipAmount(15);
    setTipSuccess(false);
  };

  const submitTip = () => {
    actualSetBookings((prev: Booking[]) =>
      prev.map((b) =>
        b.id === selectedBookingForTip?.id
          ? { ...b, tipAmount: tipAmount }
          : b
      )
    );
    setTipSuccess(true);
    setTimeout(() => {
      setSelectedBookingForTip(null);
      setTipSuccess(false);
    }, 1500);
  };

  const handleUpdateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardEditForm.number || !cardEditForm.holder || !cardEditForm.expiry || !cardEditForm.cvv) {
      return;
    }
    
    // Simulate updating card
    const last4 = cardEditForm.number.replace(/\s/g, "").slice(-4) || "4242";
    setCardDetails({
      number: `•••• •••• •••• ${last4}`,
      holder: cardEditForm.holder,
      expiry: cardEditForm.expiry,
      cvv: "•••",
      brand: cardEditForm.number.startsWith("5") ? "mastercard" : "visa"
    });
    setCardUpdateSuccess(true);
    setTimeout(() => {
      setIsEditingCard(false);
      setCardUpdateSuccess(false);
      setCardEditForm({ number: "", holder: "", expiry: "", cvv: "" });
    }, 1200);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans" id="client-dashboard-root">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400 animate-pulse"></span>
              <span className="text-sky-400 font-mono text-xs uppercase tracking-widest font-bold">Client Dashboard</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">Sly Bell</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage your eco-cleaning subscriptions, reschedule appointments, and view service history.
            </p>
          </div>
          
          <button 
            onClick={() => setActiveView(ActiveView.QuoteFlow)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Book a New Clean
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Bookings List (Left Column) */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-display text-xl font-bold text-white flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-sky-400" />
              Your Cleaning Bookings
            </h2>

            {bookings.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-6">
                <div className="h-16 w-16 bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-white text-lg">No bookings scheduled</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    You haven't scheduled any cleaning sessions yet. Get started by booking through our dynamic scoping system.
                  </p>
                </div>
                <button
                  onClick={() => setActiveView(ActiveView.QuoteFlow)}
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-display font-bold text-xs px-5 py-3 rounded-lg"
                >
                  Schedule First Session
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking: Booking) => {
                  const allowed = isRescheduleAllowed(booking.date);
                  return (
                    <div 
                      key={booking.id} 
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col md:flex-row justify-between gap-6"
                    >
                      <div className="space-y-4 flex-1">
                        {/* Header card info */}
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-[11px] font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded border border-sky-500/20">
                            {booking.id}
                          </span>
                          <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            booking.cleanType === "deep" 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : booking.cleanType === "move-in-out"
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}>
                            {booking.cleanType === "deep" ? "Deep Clean" : booking.cleanType === "move-in-out" ? "Move-In/Out Clean" : "Standard Clean"}
                          </span>
                          <span className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                            booking.status === "completed"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : booking.status === "cancelled"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {booking.status}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-slate-300">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <span>{new Date(`${booking.date}T00:00:00`).toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-slate-500" />
                              <span className="font-mono">{booking.timeSlot}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                              <span>{booking.address} <span className="text-[10px] text-slate-500 font-mono">({booking.zipCode})</span></span>
                            </div>
                          </div>

                          <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-4">
                            <div>
                              <span className="text-slate-500 font-mono text-[10px] uppercase block">House size:</span>
                              <span className="font-semibold">{booking.bedrooms} Bed, {booking.bathrooms} Bath • <span className="text-[11px] text-slate-400">{booking.sqFtRange}</span></span>
                            </div>
                            {booking.addons.length > 0 && (
                              <div>
                                <span className="text-slate-500 font-mono text-[10px] uppercase block">Add-ons:</span>
                                <span className="text-[11px] text-slate-400">{booking.addons.join(", ")}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-slate-500 font-mono text-[10px] uppercase block">Frequency:</span>
                              <span className="font-semibold text-sky-400 capitalize">{booking.frequency}</span>
                            </div>
                          </div>
                        </div>

                        {/* Cleaner notes */}
                        {booking.entryInstructions && (
                          <div className="bg-slate-950 px-3.5 py-2.5 rounded-lg border border-slate-850 text-[11px] text-slate-400 leading-normal">
                            <span className="font-mono text-slate-500 uppercase text-[9px] block mb-0.5">Entry Instructions:</span>
                            "{booking.entryInstructions}"
                          </div>
                        )}

                        {/* Completed Photos Proof Section */}
                        {booking.status === "completed" && (booking.beforePhoto || booking.afterPhoto) && (
                          <div className="space-y-2 pt-2">
                            <span className="text-slate-500 font-mono text-[10px] uppercase block">Proof of Clean:</span>
                            <div className="flex gap-4">
                              {booking.beforePhoto && (
                                <div className="space-y-1">
                                  <div className="h-20 w-28 bg-slate-950 rounded-lg overflow-hidden border border-slate-850 relative">
                                    <img src={booking.beforePhoto} alt="Before" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                                    <span className="absolute bottom-1 right-1 bg-black/70 text-[8px] font-mono font-bold text-red-400 px-1 py-0.2 rounded">BEFORE</span>
                                  </div>
                                </div>
                              )}
                              {booking.afterPhoto && (
                                <div className="space-y-1">
                                  <div className="h-20 w-28 bg-slate-950 rounded-lg overflow-hidden border border-emerald-500/30 relative">
                                    <img src={booking.afterPhoto} alt="After" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                                    <span className="absolute bottom-1 right-1 bg-emerald-950/80 text-[8px] font-mono font-bold text-emerald-400 px-1 py-0.2 rounded">AFTER</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Pricing and Actions (Right Column inside card) */}
                      <div className="flex flex-row md:flex-col justify-between items-end md:items-end md:justify-between border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 shrink-0 md:w-44 text-right">
                        <div className="space-y-1 text-right">
                          <span className="text-slate-500 font-mono text-[10px] uppercase block">Total Cost:</span>
                          <span className="text-white font-mono text-xl font-bold">${booking.price.toFixed(2)}</span>
                          {booking.tipAmount > 0 && (
                            <span className="block font-mono text-[11px] text-emerald-400 font-medium">+ ${booking.tipAmount.toFixed(2)} Tip</span>
                          )}
                        </div>

                        {/* Actions buttons */}
                        <div className="flex flex-col gap-2 w-full md:w-auto">
                          {booking.status === "pending" && (
                            <>
                              {allowed ? (
                                <button
                                  onClick={() => handleOpenReschedule(booking)}
                                  className="w-full text-xs font-semibold py-2 px-3.5 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 rounded-xl transition-all border border-slate-700/50"
                                >
                                  Reschedule
                                </button>
                              ) : (
                                <div className="space-y-1 text-right">
                                  <button
                                    disabled
                                    className="w-full text-xs font-medium py-2 px-3.5 bg-slate-900 text-slate-600 rounded-xl border border-slate-850/50 cursor-not-allowed"
                                    title="Booking is within 24 hours and cannot be modified."
                                  >
                                    Reschedule Lock
                                  </button>
                                  <span className="text-[9px] text-red-400 font-mono block">Less than 24h: call support</span>
                                </div>
                              )}
                            </>
                          )}

                          {booking.status === "completed" && booking.tipAmount === 0 && (
                            <button
                              onClick={() => handleAddTip(booking)}
                              className="text-xs font-bold py-2 px-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-all flex items-center justify-center gap-1.5"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              Add Tip
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar Area (Right Column) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Card on File Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-sky-400" />
                  Card On File
                </h3>
                {!isEditingCard && (
                  <button 
                    onClick={() => {
                      setIsEditingCard(true);
                      setCardEditForm({ number: "", holder: cardDetails.holder, expiry: cardDetails.expiry, cvv: "" });
                    }} 
                    className="text-xs text-sky-400 hover:text-sky-300 font-mono hover:underline"
                  >
                    Update
                  </button>
                )}
              </div>

              {!isEditingCard ? (
                /* Static premium card design */
                <div className="relative h-44 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-850 p-5 flex flex-col justify-between overflow-hidden shadow-xl" id="client-card-preview">
                  <div className="absolute -right-8 -top-8 h-24 w-24 bg-sky-500/5 rounded-full blur-2xl"></div>
                  <div className="absolute -left-8 -bottom-8 h-24 w-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
                  
                  <div className="flex justify-between items-start z-10">
                    <span className="font-display font-black text-xs text-slate-400 tracking-wider">CLEAN WORLD PLATINUM</span>
                    {cardDetails.brand === "visa" ? (
                      <span className="text-white font-black italic font-display text-base tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">VISA</span>
                    ) : (
                      <span className="text-white font-black italic font-display text-base tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-500">MC</span>
                    )}
                  </div>

                  <div className="font-mono text-base tracking-widest text-white/90 z-10 py-1">
                    {cardDetails.number}
                  </div>

                  <div className="flex justify-between items-end z-10 font-mono">
                    <div>
                      <span className="block text-[8px] text-slate-500 uppercase font-mono">Card Holder</span>
                      <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase truncate block max-w-[120px]">{cardDetails.holder}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] text-slate-500 uppercase font-mono">Expires</span>
                      <span className="text-xs font-semibold text-slate-300 tracking-wider block">{cardDetails.expiry}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Card editing form */
                <form onSubmit={handleUpdateCard} className="space-y-3 font-sans text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono uppercase">Cardholder Name</label>
                    <input 
                      type="text" 
                      required
                      value={cardEditForm.holder}
                      onChange={(e) => setCardEditForm({...cardEditForm, holder: e.target.value})}
                      placeholder="e.g. Sly Bell"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono uppercase">Card Number</label>
                    <input 
                      type="text" 
                      required
                      value={cardEditForm.number}
                      onChange={(e) => setCardEditForm({...cardEditForm, number: e.target.value})}
                      placeholder="4111 2222 3333 4444"
                      maxLength={19}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-mono uppercase">Expiry</label>
                      <input 
                        type="text" 
                        required
                        value={cardEditForm.expiry}
                        onChange={(e) => setCardEditForm({...cardEditForm, expiry: e.target.value})}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-mono uppercase">CVV</label>
                      <input 
                        type="password" 
                        required
                        value={cardEditForm.cvv}
                        onChange={(e) => setCardEditForm({...cardEditForm, cvv: e.target.value})}
                        placeholder="•••"
                        maxLength={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  {cardUpdateSuccess && (
                    <p className="text-emerald-400 font-mono text-[10px] text-center animate-pulse pt-1">Card validated &amp; authorized successfully!</p>
                  )}

                  <div className="flex gap-2 pt-2 justify-end">
                    <button 
                      type="button" 
                      onClick={() => setIsEditingCard(false)} 
                      className="px-3 py-1.5 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-lg transition-colors"
                    >
                      Save Card
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Trust Assurances / Happy Guarantee */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Your Guarantees
              </h3>
              <div className="space-y-3 font-sans text-xs">
                <div className="flex gap-3">
                  <div className="h-6 w-6 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 shrink-0">
                    <Heart className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-200">24-Hour Happiness Guarantee</span>
                    <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                      If you're not 100% satisfied with our clean, we'll return and reclean the area absolutely free.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-200">Licensed, Bonded &amp; Insured</span>
                    <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                      All cleaners are background-screened, professionally certified, and bonded for your absolute security.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Reschedule Dialog Modal */}
      <AnimatePresence>
        {selectedBookingForReschedule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBookingForReschedule(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            
            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 space-y-6"
            >
              <button 
                onClick={() => setSelectedBookingForReschedule(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-950"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2">
                <span className="text-sky-400 font-mono text-[10px] uppercase font-bold tracking-wider block">// RESCHEDULE APPOINTMENT</span>
                <h3 className="font-display text-xl font-bold text-white">Choose New Appointment Time</h3>
                <p className="text-xs text-slate-400">
                  Rescheduling booking <span className="font-mono text-white">{selectedBookingForReschedule.id}</span>.
                </p>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="text-slate-400 font-mono text-[10px] uppercase">New Date</label>
                  <input 
                    type="date" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-mono text-[10px] uppercase block mb-1">Preferred Time Window</label>
                  <div className="grid grid-cols-1 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setNewTimeSlot(slot)}
                        className={`w-full py-2.5 px-3 rounded-lg border text-left font-mono text-[11px] transition-all ${
                          newTimeSlot === slot
                            ? "bg-sky-500/10 border-sky-500 text-sky-400 font-bold"
                            : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {rescheduleError && (
                  <p className="text-red-400 font-mono text-[10px] text-center">{rescheduleError}</p>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForReschedule(null)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitReschedule}
                  className="w-full sm:w-auto px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-display font-bold text-xs rounded-xl shadow-lg shadow-sky-500/10 transition-colors"
                >
                  Confirm Reschedule
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tip Dialog Modal */}
      <AnimatePresence>
        {selectedBookingForTip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBookingForTip(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            
            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 space-y-6"
            >
              <button 
                onClick={() => setSelectedBookingForTip(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-950"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-3">
                <div className="h-12 w-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                  <ThumbsUp className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider block">SUPPORT OUR CREW</span>
                  <h3 className="font-display text-xl font-bold text-white">Add a Professional Tip</h3>
                  <p className="text-xs text-slate-400">
                    Add a tip for the Clean World team who completed job <span className="font-mono text-white">{selectedBookingForTip.id}</span>.
                  </p>
                </div>
              </div>

              {!tipSuccess ? (
                <div className="space-y-6">
                  {/* Tip Presets */}
                  <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                    {[10, 15, 20, 25].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setTipAmount(amt)}
                        className={`py-3 rounded-xl border text-center transition-all ${
                          tipAmount === amt
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold"
                            : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>

                  {/* Custom tip input */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 font-mono uppercase block text-center">Custom Tip Amount</label>
                    <div className="relative max-w-[150px] mx-auto">
                      <span className="absolute left-3 top-3.5 text-slate-500 font-mono">$</span>
                      <input 
                        type="number" 
                        value={tipAmount}
                        onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-center text-sm font-mono focus:outline-none focus:border-emerald-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBookingForTip(null)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-medium text-slate-300 transition-colors"
                    >
                      Skip
                    </button>
                    <button
                      type="button"
                      onClick={submitTip}
                      className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition-colors"
                    >
                      Authorize Tip
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center space-y-2 animate-fadeIn">
                  <ThumbsUp className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <p className="text-emerald-400 font-bold text-sm">Tip Added Successfully!</p>
                  <p className="text-xs text-slate-500">Thank you for supporting Clean World experts!</p>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
