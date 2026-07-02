import React, { useState } from "react";
import { Booking, ActiveView, ProductOrder } from "../types";
import { 
  Calendar, Clock, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, CreditCard, 
  Sparkles, ShieldCheck, Heart, User, MapPin, DollarSign, RotateCcw, ThumbsUp, X, ShoppingBag, Receipt
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import MapComponent from "./MapComponent";

interface ClientDashboardProps {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  setActiveView: (view: ActiveView) => void;
  productOrders?: ProductOrder[];
}

export default function ClientDashboard({ bookings, setBookings, setActiveView, productOrders = [] }: ClientDashboardProps) {
  // Fix arguments for the component safely
  const actualSetBookings = setBookings;
  
  const [selectedBookingForReschedule, setSelectedBookingForReschedule] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState("09:00 AM - 12:00 PM");
  const [rescheduleError, setRescheduleError] = useState("");
  
  const [selectedBookingForTip, setSelectedBookingForTip] = useState<Booking | null>(null);
  const [tipAmount, setTipAmount] = useState<number>(15);
  const [tipSuccess, setTipSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookings" | "orders">("bookings");
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<ProductOrder | null>(null);
  const [selectedBookingForTracking, setSelectedBookingForTracking] = useState<Booking | null>(null);
  const [etaMinutes, setEtaMinutes] = useState<number>(18);

  React.useEffect(() => {
    let interval: any;
    if (selectedBookingForTracking) {
      setEtaMinutes(18); // Reset to 18 mins on open
      interval = setInterval(() => {
        setEtaMinutes((prev) => (prev > 2 ? prev - 1 : 2));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [selectedBookingForTracking]);

  const [paymentProfile, setPaymentProfile] = useState({
    method: "MTN MoMo" as "m-GURUSH" | "MTN MoMo" | "Zain Cash" | "Cash",
    phone: "+211 928 300 401",
    holder: "Sly Bell Sosah"
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileEditForm, setProfileEditForm] = useState({
    method: "MTN MoMo" as "m-GURUSH" | "MTN MoMo" | "Zain Cash" | "Cash",
    phone: "+211 928 300 401",
    holder: "Sly Bell Sosah"
  });
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);

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

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileEditForm.holder || (profileEditForm.method !== "Cash" && !profileEditForm.phone)) {
      return;
    }
    
    // Simulate updating payment profile
    setPaymentProfile({
      method: profileEditForm.method,
      phone: profileEditForm.method === "Cash" ? "" : profileEditForm.phone,
      holder: profileEditForm.holder
    });
    setProfileUpdateSuccess(true);
    setTimeout(() => {
      setIsEditingProfile(false);
      setProfileUpdateSuccess(false);
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-6 mb-6">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`pb-4 text-sm font-semibold transition-all relative ${
              activeTab === "bookings"
                ? "text-sky-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5" />
              Cleaning Bookings
            </span>
            {activeTab === "bookings" && (
              <motion.span
                layoutId="dashboardActiveTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400 rounded-full"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 text-sm font-semibold transition-all relative ${
              activeTab === "orders"
                ? "text-emerald-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4.5 h-4.5" />
              Product Orders
              {productOrders.length > 0 && (
                <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
                  {productOrders.length}
                </span>
              )}
            </span>
            {activeTab === "orders" && (
              <motion.span
                layoutId="dashboardActiveTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full"
              />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Column (Left Column) */}
          <div className="lg:col-span-8 space-y-6">
            {activeTab === "bookings" ? (
              <>
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
                                {booking.paymentMethod && (
                                  <div>
                                    <span className="text-slate-500 font-mono text-[10px] uppercase block">Payment Method:</span>
                                    <span className="font-semibold text-emerald-400">{booking.paymentMethod} {booking.paymentPhone ? `(${booking.paymentPhone})` : ""}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {booking.entryInstructions && (
                              <div className="bg-slate-950 px-3.5 py-2.5 rounded-lg border border-slate-850 text-[11px] text-slate-400 leading-normal">
                                <span className="font-mono text-slate-500 uppercase text-[9px] block mb-0.5">Entry Instructions:</span>
                                "{booking.entryInstructions}"
                              </div>
                            )}

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

                          <div className="flex flex-row md:flex-col justify-between items-end md:items-end md:justify-between border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 shrink-0 md:w-44 text-right">
                            <div className="space-y-1 text-right">
                              <span className="text-slate-500 font-mono text-[10px] uppercase block">Total Cost:</span>
                              <span className="text-white font-mono text-base sm:text-lg font-bold block">${booking.price.toFixed(2)}</span>
                              <span className="text-emerald-400 font-mono text-[10px] block font-semibold">SSP {(booking.price * 1300).toLocaleString()}</span>
                              {booking.tipAmount > 0 && (
                                <div className="text-right">
                                  <span className="block font-mono text-[10px] text-sky-400 font-semibold">+ ${booking.tipAmount.toFixed(2)} Tip</span>
                                  <span className="block font-mono text-[9px] text-sky-500/80 font-medium">+ SSP {(booking.tipAmount * 1300).toLocaleString()}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col gap-2 w-full md:w-auto">
                              {booking.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => setSelectedBookingForTracking(booking)}
                                    className="w-full text-xs font-bold py-2 px-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/10"
                                  >
                                    Track Crew
                                  </button>
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
              </>
            ) : (
              <div className="space-y-4 font-sans text-left">
                {productOrders.length > 0 ? (
                  productOrders.map((order: ProductOrder) => (
                    <div 
                      key={order.id} 
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col md:flex-row justify-between gap-6"
                    >
                      <div className="space-y-4 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                            {order.id}
                          </span>
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                            {order.paymentMethod}
                          </span>
                          <span className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                            order.status === "delivered"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : order.status === "dispatched"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 space-y-2">
                          <p className="font-medium text-white">Items Ordered:</p>
                          <div className="space-y-1.5">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between max-w-md text-slate-400 bg-slate-950/35 px-3 py-1.5 rounded-lg border border-slate-800">
                                <span>{item.product.name} (x{item.quantity})</span>
                                <span className="font-mono">${(item.product.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                            <div>
                              <span className="text-slate-500 font-mono text-[10px] uppercase block">Paid via Phone:</span>
                              <span className="font-semibold font-mono text-slate-300">{order.phonePaid}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 font-mono text-[10px] uppercase block">Delivery Address:</span>
                              <span className="font-semibold text-slate-300">{order.deliveryLocation} - {order.deliveryAddress}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col justify-between items-end md:items-end md:justify-between border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 shrink-0 md:w-44 text-right">
                        <div className="space-y-1 text-right">
                          <span className="text-slate-500 font-mono text-[10px] uppercase block">Total Paid:</span>
                          <span className="text-white font-mono text-lg font-bold">
                            {order.currencyPaid === "USD" 
                              ? `$${order.totalUSD.toFixed(2)}` 
                              : `SSP ${order.totalSSP.toLocaleString()}`}
                          </span>
                          <span className="block text-[10px] text-slate-500 font-mono">Ref: {order.transactionRef}</span>
                        </div>

                        <button
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="text-xs font-bold py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl transition-all border border-slate-700/50 flex items-center justify-center gap-1.5 w-full"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          View Invoice
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
                    No product orders found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar: Card & Guarantees */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-sky-400" />
                  Payment Profile
                </h3>
                {!isEditingProfile && (
                  <button 
                    onClick={() => {
                      setIsEditingProfile(true);
                      setProfileEditForm({ method: paymentProfile.method, phone: paymentProfile.phone, holder: paymentProfile.holder });
                    }} 
                    className="text-xs text-sky-400 hover:text-sky-300 font-mono hover:underline"
                  >
                    Update
                  </button>
                )}
              </div>

              {!isEditingProfile ? (
                /* Static premium local wallet card design */
                <div 
                  className={`relative h-44 rounded-2xl border p-5 flex flex-col justify-between overflow-hidden shadow-xl transition-all duration-500 bg-gradient-to-br ${
                    paymentProfile.method === "MTN MoMo"
                      ? "from-amber-400 to-yellow-600 border-yellow-500/30 text-slate-950"
                      : paymentProfile.method === "Zain Cash"
                      ? "from-cyan-500 to-blue-600 border-cyan-500/30 text-white"
                      : paymentProfile.method === "m-GURUSH"
                      ? "from-rose-500 to-red-700 border-rose-500/30 text-white"
                      : "from-emerald-600 to-teal-800 border-emerald-600/30 text-white"
                  }`} 
                  id="client-wallet-preview"
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 bg-white/5 rounded-full blur-2xl"></div>
                  <div className="absolute -left-8 -bottom-8 h-24 w-24 bg-black/5 rounded-full blur-2xl"></div>
                  
                  <div className="flex justify-between items-start z-10">
                    <span className={`font-display font-black text-[10px] tracking-wider uppercase ${
                      paymentProfile.method === "MTN MoMo" ? "text-slate-900/70" : "text-white/70"
                    }`}>
                      {paymentProfile.method === "Cash" ? "CASH ON SERVICE" : "MOBILE MONEY PROFILE"}
                    </span>
                    <span className="font-display font-black italic text-sm tracking-widest uppercase">
                      {paymentProfile.method}
                    </span>
                  </div>

                  <div className="z-10 py-1">
                    {paymentProfile.method === "Cash" ? (
                      <span className="font-display font-bold text-sm tracking-wide block">
                        Pay Deng Lual / Dispatch Lead
                      </span>
                    ) : (
                      <span className="font-mono text-base tracking-widest font-bold">
                        {paymentProfile.phone}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-end z-10 font-mono">
                    <div>
                      <span className={`block text-[8px] uppercase font-mono ${
                        paymentProfile.method === "MTN MoMo" ? "text-slate-900/60" : "text-slate-300/60"
                      }`}>Profile Holder</span>
                      <span className={`text-xs font-bold tracking-wide uppercase truncate block max-w-[120px] ${
                        paymentProfile.method === "MTN MoMo" ? "text-slate-955" : "text-white"
                      }`}>{paymentProfile.holder}</span>
                    </div>
                    <div className="text-right">
                      <span className={`block text-[8px] uppercase font-mono ${
                        paymentProfile.method === "MTN MoMo" ? "text-slate-900/60" : "text-slate-300/60"
                      }`}>Channel</span>
                      <span className={`text-xs font-bold block ${
                        paymentProfile.method === "MTN MoMo" ? "text-slate-955" : "text-white"
                      }`}>{paymentProfile.method === "Cash" ? "Juba Cash" : "USSD Push"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Profile editing form */
                <form onSubmit={handleUpdateProfile} className="space-y-3 font-sans text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono uppercase">Profile Holder Name</label>
                    <input 
                      type="text" 
                      required
                      value={profileEditForm.holder}
                      onChange={(e) => setProfileEditForm({...profileEditForm, holder: e.target.value})}
                      placeholder="e.g. Rebecca Nyandeng"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono uppercase">Payment Channel</label>
                    <select
                      value={profileEditForm.method}
                      onChange={(e) => setProfileEditForm({...profileEditForm, method: e.target.value as any})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 text-white cursor-pointer"
                    >
                      <option value="MTN MoMo">MTN MoMo (Mobile Money)</option>
                      <option value="Zain Cash">Zain Cash (Mobile Money)</option>
                      <option value="m-GURUSH">m-GURUSH (Mobile Money)</option>
                      <option value="Cash">Cash Payment (Pay on Arrival)</option>
                    </select>
                  </div>

                  {profileEditForm.method !== "Cash" && (
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-mono uppercase">Mobile Number</label>
                      <input 
                        type="text" 
                        required
                        value={profileEditForm.phone}
                        onChange={(e) => setProfileEditForm({...profileEditForm, phone: e.target.value})}
                        placeholder="+211 922 000 000"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 font-mono"
                      />
                    </div>
                  )}

                  {profileUpdateSuccess && (
                    <p className="text-emerald-400 font-mono text-[10px] text-center animate-pulse pt-1">Profile updated successfully!</p>
                  )}

                  <div className="flex gap-2 pt-2 justify-end">
                    <button 
                      type="button" 
                      onClick={() => setIsEditingProfile(false)} 
                      className="px-3 py-1.5 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-lg transition-colors"
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Trust Assurances / Happy Guarantee */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                South Sudan Trust Clearances
              </h3>
              <div className="space-y-4 font-sans text-xs">
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
                    <span className="block font-bold text-slate-200">Ministry Registered &amp; Licensed</span>
                    <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                      Fully registered under the Republic of South Sudan Ministry of Environment &amp; Forestry.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 bg-sky-500/10 rounded-full flex items-center justify-center text-sky-400 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-200">NCA &amp; Trinity Tech Verified</span>
                    <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                      NCA approved mobile billing merchant, integrated with Zain Cash, MTN MoMo, and m-GURUSH.
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
                <span className="text-sky-400 font-mono text-[10px] uppercase font-bold tracking-wider block">RESCHEDULE APPOINTMENT</span>
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

      {/* Live Crew Tracker Modal */}
      <AnimatePresence>
        {selectedBookingForTracking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBookingForTracking(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            
            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl z-10 space-y-6"
            >
              <button 
                onClick={() => setSelectedBookingForTracking(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-950"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1 text-left">
                <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider block">LIVE VEHICLE DISPATCH TRACKER</span>
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Tracking Crew for Job {selectedBookingForTracking.id}
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Real-time GPS vehicle coordinates and ETA from Juba base station.
                </p>
              </div>

              {/* Map container */}
              <div className="h-80 rounded-2xl border border-slate-850 overflow-hidden relative">
                <MapComponent 
                  mode="tracking" 
                  targetLat={selectedBookingForTracking.lat || 4.85610} 
                  targetLng={selectedBookingForTracking.lng || 31.58100} 
                  crewName="Clean World Alpha Crew"
                />
              </div>

              {/* Dispatch telemetry status card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-950 border border-slate-850 p-4 rounded-2xl font-sans text-left">
                <div className="space-y-1 border-b sm:border-b-0 sm:border-r border-slate-850 pb-2 sm:pb-0 sm:pr-4">
                  <span className="text-[10px] text-slate-500 font-mono uppercase">ESTIMATED ARRIVAL</span>
                  <div className="text-lg font-bold text-emerald-400 font-mono animate-pulse">{etaMinutes} mins</div>
                  <span className="text-[10px] text-slate-400 block">Juba traffic included</span>
                </div>
                <div className="space-y-1 border-b sm:border-b-0 sm:border-r border-slate-850 pb-2 sm:pb-0 sm:pr-4">
                  <span className="text-[10px] text-slate-500 font-mono uppercase">DISPATCH CREW</span>
                  <div className="font-semibold text-white">Deng Lual &amp; Team Alpha</div>
                  <span className="text-[10px] text-slate-400 block">3 Certified HSE Technicians</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono uppercase">VEHICLE DETAILS</span>
                  <div className="font-semibold text-white">Toyota Land Cruiser</div>
                  <span className="text-[10px] text-slate-400 font-mono block">Juba Plate: SSD-309A</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedBookingForTracking(null)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-colors border border-slate-750"
                >
                  Close Tracker
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Order Invoice Receipt Modal */}
      <AnimatePresence>
        {selectedOrderForInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderForInvoice(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            
            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl z-10 space-y-6 text-left"
            >
              <button 
                onClick={() => setSelectedOrderForInvoice(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-950"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="border-b border-slate-800 pb-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                      <Receipt className="w-5 h-5 text-emerald-400" />
                      OFFICIAL INVOICE
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">CLEAN WORLD INC. JUBA OFFICE</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
                    {selectedOrderForInvoice.id}
                  </span>
                </div>
              </div>

              {/* Telemetry info */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <span className="text-[9px] text-slate-500 font-mono uppercase block">TRANSACTION REF</span>
                  <span className="font-mono font-bold text-white">{selectedOrderForInvoice.transactionRef}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-mono uppercase block">DATE</span>
                  <span className="font-semibold text-white">
                    {new Date(selectedOrderForInvoice.createdAt).toLocaleString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-mono uppercase block">PAYMENT METHOD</span>
                  <span className="font-semibold text-white">
                    {selectedOrderForInvoice.paymentMethod === "Cash" 
                      ? "Cash (Pay on Delivery)" 
                      : `${selectedOrderForInvoice.paymentMethod} Mobile Money`}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-mono uppercase block">PHONE PAID</span>
                  <span className="font-mono font-bold text-white">{selectedOrderForInvoice.phonePaid}</span>
                </div>
              </div>

              <div className="border-t border-b border-slate-800 py-4 space-y-2.5">
                <span className="text-[9px] text-slate-500 font-mono uppercase block">ORDER ITEMS</span>
                <div className="space-y-2">
                  {selectedOrderForInvoice.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{item.product.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{item.product.unit} (x{item.quantity})</span>
                      </div>
                      <span className="font-mono text-slate-300">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono">${selectedOrderForInvoice.totalUSD.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold pt-2 border-t border-slate-850">
                  <span className="text-white">Total Paid</span>
                  <div className="text-right">
                    <span className="block font-mono text-emerald-400 text-lg font-bold">
                      {selectedOrderForInvoice.currencyPaid === "USD" 
                        ? `$${selectedOrderForInvoice.totalUSD.toFixed(2)}` 
                        : `SSP ${selectedOrderForInvoice.totalSSP.toLocaleString()}`}
                    </span>
                    <span className="block text-[8px] text-slate-500 font-mono">Simulated Exchange Rate: 1 USD = 1,300 SSP</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-800 p-3.5 rounded-xl text-[10px] text-slate-400 leading-normal space-y-1.5">
                <div>
                  <span className="font-mono text-slate-500 uppercase text-[8px] block">DELIVERY TARGET:</span>
                  <span className="font-semibold text-white">{selectedOrderForInvoice.deliveryLocation} District</span>
                </div>
                <div>
                  <span className="font-mono text-slate-500 uppercase text-[8px] block">STREET ADDRESS:</span>
                  <span>{selectedOrderForInvoice.deliveryAddress}</span>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => {
                    alert("Generating invoice print job... (Simulated)");
                  }}
                  className="px-5 py-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
                >
                  Print Receipt
                </button>
                <button
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition-colors"
                >
                  Close Receipt
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
