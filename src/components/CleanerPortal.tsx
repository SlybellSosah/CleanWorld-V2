import React, { useState } from "react";
import { Booking, ActiveView } from "../types";
import { 
  Briefcase, CheckCircle, Smartphone, MapPin, Clipboard, Camera, Eye, 
  Trash2, Upload, Navigation, ShieldCheck, AlertCircle, RefreshCw, X, ArrowLeft,
  Signal, Wifi, Battery, Database, Map, Route, Truck
} from "lucide-react";
import MapComponent from "./MapComponent";

interface CleanerPortalProps {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  setActiveView: (view: ActiveView) => void;
}

export default function CleanerPortal({ bookings, setBookings, setActiveView }: CleanerPortalProps) {
  const [selectedJob, setSelectedJob] = useState<Booking | null>(null);
  
  // South Sudan Juba specific localizations
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [signalCarrier, setSignalCarrier] = useState<"Zain-SSD" | "MTN-SSD" | "Digitel">("Zain-SSD");
  const [activeTab, setActiveTab] = useState<"list" | "map">("list");
  const [mapMode, setMapMode] = useState<"routing" | "tracking">("routing");
  
  // Fake state for camera/photo uploader
  const [uploadMode, setUploadMode] = useState<"before" | "after" | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Track checked checklist items for the current active job
  const [jobCheckedTasks, setJobCheckedTasks] = useState<string[]>([]);

  // List of pre-configured mock upload options
  const samplePhotosBefore = [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=400&auto=format&fit=crop"
  ];

  const samplePhotosAfter = [
    "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=400&auto=format&fit=crop"
  ];

  // Derive dynamic checklist based on booking parameters
  const getRequiredTasks = (booking: Booking): string[] => {
    const list = [
      "Sweep and vacuum all floors",
      "Sanitize countertops, sinks and tables",
      "Dust visible surfaces, baseboards and electronics",
      "Empty trash bins and replace liners",
      "Verify municipal/borehole water tank supply level",
      "Submit Boda-Boda or Crew Truck fuel mileage log"
    ];

    if (booking.cleanType === "deep") {
      list.push("Wet-wipe all baseboards and detailed moulding");
      list.push("Disinfect doors, handles and light switches");
      list.push("Scrub tile grout and sanitize high-contact zones");
    }

    if (booking.cleanType === "move-in-out") {
      list.push("Deep vacuum all carpets and empty closets");
      list.push("Wipe inside all empty cabinets and drawers");
      list.push("Scrub range hood and detail stove top");
    }

    // Addon-specific tasks
    if (booking.addons.includes("Inside Fridge") || booking.addons.includes("inside-fridge")) {
      list.push("[Fridge Add-on] Clean and sanitize inside refrigerator shelves");
    }
    if (booking.addons.includes("Inside Oven") || booking.addons.includes("inside-oven")) {
      list.push("[Oven Add-on] Scrub inside oven chambers and racks");
    }
    if (booking.addons.includes("Cabinets") || booking.addons.includes("inside-cabinets")) {
      list.push("[Cabinets Add-on] Detail wipe inside pantry & cabinetry");
    }
    if (booking.addons.includes("Interior Windows") || booking.addons.includes("interior-windows")) {
      list.push("[Windows Add-on] Clean interior glass panes and tracks");
    }
    if (booking.addons.includes("Pet Hair Treatment") || booking.addons.includes("pet-hair")) {
      list.push("[Pet Add-on] Double-vacuum pet dander and treat upholstery");
    }
    if (booking.addons.includes("Wet Wiping Baseboards") || booking.addons.includes("wet-baseboards")) {
      list.push("[Baseboard Add-on] Wet sanitization of all property baseboards");
    }

    return list;
  };

  const handleOpenJob = (booking: Booking) => {
    setSelectedJob(booking);
    setJobCheckedTasks(booking.checkedTasks || []);
    setBeforePreview(booking.beforePhoto || null);
    setAfterPreview(booking.afterPhoto || null);
    setErrorMessage("");
  };

  const toggleTask = (task: string) => {
    setJobCheckedTasks(prev => 
      prev.includes(task) ? prev.filter(t => t !== task) : [...prev, task]
    );
  };

  const selectPredefinedPhoto = (url: string) => {
    setIsCapturing(true);
    setTimeout(() => {
      if (uploadMode === "before") {
        setBeforePreview(url);
      } else {
        setAfterPreview(url);
      }
      setIsCapturing(false);
      setUploadMode(null);
    }, 600);
  };

  // Trigger simulated native camera upload
  const simulateCameraCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      const randomBefore = samplePhotosBefore[Math.floor(Math.random() * samplePhotosBefore.length)];
      const randomAfter = samplePhotosAfter[Math.floor(Math.random() * samplePhotosAfter.length)];
      
      if (uploadMode === "before") {
        setBeforePreview(randomBefore);
      } else {
        setAfterPreview(randomAfter);
      }
      setIsCapturing(false);
      setUploadMode(null);
    }, 1000);
  };

  const handleCompleteJob = () => {
    if (!selectedJob) return;

    const required = getRequiredTasks(selectedJob);
    const incompleteTasks = required.filter(t => !jobCheckedTasks.includes(t));

    // Validations:
    // 1. All tasks checked
    if (incompleteTasks.length > 0) {
      setErrorMessage(`Please check off all required tasks first (${incompleteTasks.length} pending).`);
      return;
    }

    // 2. Proof of clean: requires at least one After photo
    if (!afterPreview) {
      setErrorMessage("Strict HSE Rule: You must upload at least one AFTER photo as proof of clean before completing.");
      return;
    }

    // Update shared bookings state
    setBookings(prev => 
      prev.map(b => 
        b.id === selectedJob.id 
          ? { 
              ...b, 
              status: "completed", 
              beforePhoto: beforePreview, 
              afterPhoto: afterPreview, 
              checkedTasks: jobCheckedTasks 
            } 
          : b
      )
    );

    // Update local active state
    setSelectedJob(prev => prev ? { ...prev, status: "completed" } : null);
    setErrorMessage("");
    alert("Excellent job! Ticket verified and closed successfully on our system.");
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-0 md:py-8 px-0 md:px-4" id="cleaner-portal-root">
      <div className="w-full md:max-w-md mx-auto bg-slate-950 border-0 md:border-4 border-slate-800 rounded-none md:rounded-[40px] overflow-hidden relative shadow-2xl flex flex-col h-screen md:h-[820px] font-sans">
        
        {/* Mobile Device Camera Notch / Bar */}
        <div className="hidden md:flex bg-slate-955 h-6 justify-center items-center relative shrink-0">
          <div className="w-20 h-4 bg-slate-900 rounded-full border border-slate-800/80 mt-1 flex justify-center items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800 mr-2"></span>
            <span className="w-8 h-1 bg-slate-800 rounded-full"></span>
          </div>
        </div>

        {/* Local Juba Network Signals & Telemetry Bar */}
        <div className="hidden md:flex bg-slate-900 px-4 py-1 items-center justify-between border-b border-slate-950 text-[14px] text-slate-400 font-mono shrink-0 select-none">
          <div className="flex items-center gap-1 cursor-pointer hover:text-white" onClick={() => {
            setSignalCarrier(prev => {
              if (prev === "Zain-SSD") return "MTN-SSD";
              if (prev === "MTN-SSD") return "Digitel";
              return "Zain-SSD";
            });
          }} title="Click to switch Juba cellular carriers">
            <Signal className="w-3 h-3 text-sky-400" />
            <span className="font-bold text-sky-400">{signalCarrier}</span>
            <span className="text-[14px] px-1 bg-slate-800 rounded text-slate-400 font-sans">LTE</span>
          </div>
          <div>09:41 AM</div>
          <div className="flex items-center gap-1.5">
            {offlineMode ? (
              <span className="text-[14px] bg-red-500/20 text-red-400 border border-red-500/30 px-1 rounded animate-pulse font-sans">OFFLINE</span>
            ) : (
              <Wifi className="w-3 h-3 text-emerald-400" />
            )}
            <Battery className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[15px]">87%</span>
          </div>
        </div>

        {/* Offline Sync Command Center bar */}
        <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[14px] text-slate-300 font-sans">
              {isSyncing ? "Syncing data to Juba server..." : (offlineMode ? "Cached offline queue (2 tickets)" : "Database Online")}
            </span>
          </div>
          <button
            onClick={() => {
              if (offlineMode) {
                setOfflineMode(false);
                setIsSyncing(true);
                setTimeout(() => {
                  setIsSyncing(false);
                  alert("Zain/MTN Signal Restored. 2 completed dispatches successfully synced to Clean World HQ server (Hai Kuwait, Juba).");
                }, 1500);
              } else {
                setOfflineMode(true);
              }
            }}
            disabled={isSyncing}
            className={`px-2 py-0.5 rounded text-[15px] font-mono font-bold uppercase border transition-all ${
              offlineMode
                ? "bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500"
            }`}
          >
            {offlineMode ? "Go Online" : "Go Offline"}
          </button>
        </div>

        {/* Custom Mobile Navigation Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
          {selectedJob ? (
            <button 
              onClick={() => setSelectedJob(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-950 flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              Jobs
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400">
                <Briefcase className="w-4 h-4" />
              </span>
              <span className="font-display font-black text-sm tracking-wider">CW DISPATCH</span>
            </div>
          )}

          <div className="text-right">
            <span className="text-[14px] font-mono text-emerald-400 font-bold block">CLEANER PORTAL</span>
            <span className="text-[15px] font-mono text-slate-400 uppercase">Juba Region #928</span>
          </div>
        </div>

        {/* Mobile App Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-950/40">
          
          {!selectedJob ? (
            /* ACTIVE JOB LIST VIEW */
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h2 className="font-display text-lg font-extrabold text-white">Today's Assigned Route</h2>
                <p className="text-[15px] text-slate-400">Tap an assigned job ticket to view entry details and checklists.</p>
              </div>

              {/* Segmented Tab Control */}
              <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 shrink-0">
                <button
                  onClick={() => setActiveTab("list")}
                  className={`flex-1 py-1.5 text-[14px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "list"
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  List View
                </button>
                <button
                  onClick={() => setActiveTab("map")}
                  className={`flex-1 py-1.5 text-[14px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "map"
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Map className="w-3.5 h-3.5" />
                  Dispatch Map
                </button>
              </div>

              {activeTab === "list" ? (
                bookings.filter(b => b.status !== "cancelled").length === 0 ? (
                  <div className="bg-slate-900 border border-slate-850 p-6 text-center rounded-2xl space-y-2">
                    <Clipboard className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">No active dispatches for today.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.filter(b => b.status !== "cancelled").map((booking) => (
                      <button
                        key={booking.id}
                        onClick={() => handleOpenJob(booking)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col gap-3 ${
                          booking.status === "completed"
                            ? "bg-slate-900/30 border-slate-900 hover:border-slate-800 text-slate-400"
                            : "bg-slate-900 border-slate-800 hover:border-sky-500/30 text-slate-200 shadow-md"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-mono text-xs font-bold text-sky-400">{booking.id}</span>
                          <span className={`text-[15px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                            booking.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          }`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="block font-display font-extrabold text-white text-sm capitalize">{booking.cleanType} Clean</span>
                          <div className="flex items-center gap-1.5 text-xs text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{booking.address}</span>
                          </div>
                          {booking.landmark && (
                            <div className="text-[14px] text-slate-400 italic font-medium pl-5 mt-0.5">
                              📍 Landmark: {booking.landmark}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-0.5">
                          <span className="text-[15px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50 flex items-center gap-1 select-none">
                            {booking.transportMode === "boda" ? "🏍️ Boda-Boda" : "🚚 Crew Truck"}
                          </span>
                          {booking.roadCondition && (
                            <span className={`text-[15px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 select-none ${
                              booking.roadCondition === "clear"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : booking.roadCondition === "muddy"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}>
                              ⚠️ Road: {booking.roadCondition}
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-800/60 pt-2.5 mt-1 text-[14px] font-mono text-slate-400 w-full">
                          <span>Time: {booking.timeSlot.split(" ")[0]} {booking.timeSlot.split(" ")[1]}</span>
                          <div className="text-right">
                            <span className="text-white font-bold block">${booking.price.toFixed(0)}</span>
                            <span className="text-emerald-400 text-[15px] font-bold block">SSP {(booking.price * 1300).toLocaleString()}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )
              ) : (
                <div className="h-[480px] rounded-2xl border border-slate-800 overflow-hidden relative shadow-lg">
                  <MapComponent
                    mode="all-dispatches"
                    bookings={bookings}
                    onSelectBooking={handleOpenJob}
                  />
                </div>
              )}
            </div>
          ) : (
            /* INDIVIDUAL JOB DISPATCH SHEET VIEW */
            <div className="space-y-5 animate-fadeIn">
              
              {/* Job Summary Banner */}
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-sky-400">{selectedJob.id}</span>
                  <span className={`text-[15px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    selectedJob.status === "completed"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {selectedJob.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-display font-black text-base text-white capitalize leading-tight">{selectedJob.cleanType} Cleaning Service</h3>
                    {selectedJob.landmark && (
                      <span className="text-[14px] text-slate-400 italic block mt-1">📍 Landmark: {selectedJob.landmark}</span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-white font-mono font-bold text-sm block">${selectedJob.price.toFixed(0)}</span>
                    <span className="text-emerald-400 font-mono font-bold text-[14px] block">SSP {(selectedJob.price * 1300).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800/40">
                  <div className="text-[14px] text-slate-300 font-sans flex items-center gap-1">
                    <span className="text-slate-450">Dispatch:</span>
                    <span className="font-bold text-sky-400">{selectedJob.transportMode === "boda" ? "🏍️ Boda-Boda (Rapid)" : "🚚 Crew Truck (Heavy)"}</span>
                  </div>
                  <div className="text-[14px] text-slate-300 font-sans flex items-center gap-1">
                    <span className="text-slate-450">Road:</span>
                    <span className={`font-bold uppercase ${selectedJob.roadCondition === "clear" ? "text-emerald-400" : "text-amber-400 animate-pulse"}`}>{selectedJob.roadCondition || "clear"}</span>
                  </div>
                </div>
                
                <div className="space-y-1.5 text-xs text-slate-300 font-sans border-t border-slate-800/40 pt-2">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{selectedJob.address} <span className="font-mono text-[14px] text-slate-400">({selectedJob.zipCode})</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 pl-5.5">
                    <Navigation className="w-4 h-4 text-emerald-400 shrink-0" />
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(selectedJob.address)}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-emerald-400 hover:underline font-mono text-[14px]"
                    >
                      OPEN IN GOOGLE MAPS
                    </a>
                  </div>
                </div>
              </div>

              {/* Map Segment Switcher for Routing vs Live Crew Tracker */}
              <div className="flex bg-slate-900/60 p-0.5 rounded-xl border border-slate-800/80 shrink-0">
                <button
                  onClick={() => setMapMode("routing")}
                  className={`flex-1 py-1.5 text-[15px] font-mono font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1 ${
                    mapMode === "routing"
                      ? "bg-slate-800 text-sky-400 border border-slate-700/50 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Route className="w-3.5 h-3.5" />
                  HQ Routing Plan
                </button>
                <button
                  onClick={() => setMapMode("tracking")}
                  className={`flex-1 py-1.5 text-[15px] font-mono font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1 ${
                    mapMode === "tracking"
                      ? "bg-slate-800 text-emerald-400 border border-slate-700/50 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  Live Crew Tracker
                </button>
              </div>

              {/* Dispatch Route Map Pinning */}
              <div className="h-56 rounded-2xl border border-slate-855 overflow-hidden relative shadow-inner">
                <MapComponent 
                  mode={mapMode} 
                  targetLat={selectedJob.lat || 4.85610} 
                  targetLng={selectedJob.lng || 31.58100} 
                  crewName={selectedJob.transportMode === "boda" ? "Juba Boda Dispatch #4" : "Clean World Crew Truck Alpha"}
                />
              </div>

              {/* Customer Instructions Panel */}
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 space-y-2 font-sans">
                <span className="font-mono text-slate-400 text-[14px] uppercase tracking-wider block">Access &amp; Entry Code</span>
                <p className="text-xs text-slate-200 leading-normal bg-slate-950 p-2.5 rounded-xl border border-slate-850 font-mono">
                  🔑 Entry instructions: {selectedJob.entryInstructions || "No special code. Ring front doorbell."}
                </p>
                <div className="text-[15px] text-slate-400">
                  <span className="font-semibold text-slate-300">Client:</span> {selectedJob.clientName} ({selectedJob.clientPhone})
                </div>
              </div>

              {/* Dynamic Task Checklist (State-Enforced) */}
              <div className="space-y-3 font-sans">
                <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Clipboard className="w-4 h-4 text-sky-400" />
                  Service Tasks Checklist
                </h4>
                
                <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden p-3.5 space-y-2.5">
                  {getRequiredTasks(selectedJob).map((task, index) => {
                    const isChecked = jobCheckedTasks.includes(task);
                    return (
                      <button
                        key={index}
                        disabled={selectedJob.status === "completed"}
                        onClick={() => toggleTask(task)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-3 ${
                          isChecked 
                            ? "bg-emerald-500/5 border-emerald-500/30 text-slate-400" 
                            : "bg-slate-950 border-slate-850 text-slate-200"
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          readOnly
                          className="mt-0.5 accent-emerald-500 h-4 w-4 shrink-0 rounded"
                        />
                        <span className={`text-[15px] leading-snug ${isChecked ? "line-through" : ""}`}>
                          {task}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Visual Proof / Photo Component */}
              <div className="space-y-3 font-sans">
                <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-sky-400" />
                  Visual Proof of Clean
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {/* Before Photo */}
                  <div className="bg-slate-900 border border-slate-850 rounded-2xl p-3 flex flex-col justify-between items-center text-center gap-2.5 min-h-[140px]">
                    <span className="text-[14px] font-mono text-slate-400 uppercase tracking-wide">BEFORE PHOTO</span>
                    
                    {beforePreview ? (
                      <div className="relative h-20 w-full rounded-xl overflow-hidden border border-slate-800">
                        <img src={beforePreview} alt="Before clean" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        {selectedJob.status !== "completed" && (
                          <button 
                            onClick={() => setBeforePreview(null)} 
                            className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded-full"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setUploadMode("before")}
                        className="p-3 bg-slate-950 border border-dashed border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-slate-200 transition-all flex flex-col items-center gap-1.5 w-full"
                      >
                        <Upload className="w-4 h-4" />
                        <span className="text-[15px] font-mono uppercase">Upload</span>
                      </button>
                    )}
                  </div>

                  {/* After Photo (REQUIRED) */}
                  <div className={`bg-slate-900 border rounded-2xl p-3 flex flex-col justify-between items-center text-center gap-2.5 min-h-[140px] ${
                    afterPreview ? "border-slate-850" : "border-emerald-500/30 shadow-lg shadow-emerald-500/5"
                  }`}>
                    <span className="text-[14px] font-mono text-slate-400 uppercase tracking-wide">AFTER PHOTO *</span>
                    
                    {afterPreview ? (
                      <div className="relative h-20 w-full rounded-xl overflow-hidden border border-slate-800">
                        <img src={afterPreview} alt="After clean" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        {selectedJob.status !== "completed" && (
                          <button 
                            onClick={() => setAfterPreview(null)} 
                            className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded-full"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setUploadMode("after")}
                        className="p-3 bg-emerald-500/5 border border-dashed border-emerald-500/40 hover:border-emerald-500 rounded-xl text-emerald-400 hover:text-emerald-300 transition-all flex flex-col items-center gap-1.5 w-full"
                      >
                        <Camera className="w-4 h-4 animate-pulse" />
                        <span className="text-[15px] font-mono uppercase font-bold">SNAP *</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Complete Action Area */}
              {errorMessage && (
                <div className="bg-red-950/20 border border-red-500/30 p-3 rounded-xl text-[15px] text-red-400 font-sans flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {selectedJob.status !== "completed" ? (
                <button
                  onClick={handleCompleteJob}
                  className="w-full py-4.5 bg-emerald-500 hover:bg-emerald-400 text-slate-955 font-display font-black text-xs tracking-wider rounded-2xl shadow-lg shadow-emerald-500/15 transition-all flex items-center justify-center gap-2 uppercase shrink-0"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Complete Dispatch Ticket
                </button>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-center space-y-1.5 font-sans shrink-0">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold text-white">Job Completed Successfully</p>
                  <p className="text-[14px] text-slate-400 leading-normal">Proof of clean submitted and validated. Work is verified on client billing system.</p>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Camera Simulation Overlay Sheet */}
        {uploadMode && (
          <div className="absolute inset-0 bg-black/95 z-40 p-6 flex flex-col justify-between font-sans">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-slate-450 tracking-wider">CAMERA INTERFACE</span>
              <button 
                onClick={() => setUploadMode(null)} 
                className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isCapturing ? (
              <div className="flex-1 flex flex-col justify-center items-center gap-3">
                <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
                <span className="text-xs font-mono text-slate-400">Processing HD image...</span>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <h4 className="font-display font-bold text-sm text-white">Capture Proof of Clean</h4>
                  <p className="text-[15px] text-slate-400">Choose a predefined pristine test image or click snap to simulate camera capture.</p>
                </div>

                {/* Predefined mock picker */}
                <div className="space-y-2">
                  <span className="text-[14px] font-mono text-slate-450 uppercase block text-center">Available Test Frames</span>
                  <div className="grid grid-cols-2 gap-3">
                    {uploadMode === "before" ? (
                      samplePhotosBefore.map((url, i) => (
                        <button 
                          key={i} 
                          onClick={() => selectPredefinedPhoto(url)}
                          className="h-20 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-emerald-500 transition-all"
                        >
                          <img src={url} alt={`Option ${i}`} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))
                    ) : (
                      samplePhotosAfter.map((url, i) => (
                        <button 
                          key={i} 
                          onClick={() => selectPredefinedPhoto(url)}
                          className="h-20 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-emerald-500 transition-all"
                        >
                          <img src={url} alt={`Option ${i}`} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button
                    onClick={simulateCameraCapture}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    SIMULATE SHUTTER
                  </button>
                </div>
              </div>
            )}

            <div className="text-[15px] text-slate-600 text-center font-mono uppercase tracking-widest leading-none">
              Clean World Mobile Dispatch Client v2.26
            </div>
          </div>
        )}

        {/* Fake PWA bottom bar */}
        <div className="bg-slate-900 border-t border-slate-800/60 px-4 py-2 flex justify-around shrink-0 text-slate-400 text-[14px] font-sans">
          <button 
            disabled={!selectedJob}
            onClick={() => setSelectedJob(null)}
            className={`flex flex-col items-center gap-0.5 ${!selectedJob ? "text-sky-400 font-bold" : "hover:text-slate-200"}`}
          >
            <Clipboard className="w-4 h-4" />
            Dispatches
          </button>
          <button 
            onClick={() => {
              setSelectedJob(null);
              setActiveView(ActiveView.Home);
            }} 
            className="flex flex-col items-center gap-0.5 hover:text-slate-200"
          >
            <Smartphone className="w-4 h-4" />
            Home
          </button>
        </div>

      </div>
    </div>
  );
}
