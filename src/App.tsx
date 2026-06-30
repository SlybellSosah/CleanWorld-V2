import React, { useState, useEffect } from "react";
import { ActiveView, ServicePillar, RiskClass, QuoteState, Product, Booking } from "./types";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import ServicesPage from "./components/ServicesPage";
import EcoShopPage from "./components/EcoShopPage";
import QuoteWizard from "./components/QuoteWizard";
import AcademyPage from "./components/AcademyPage";
import ClientDashboard from "./components/ClientDashboard";
import CleanerPortal from "./components/CleanerPortal";

export default function App() {
  // Navigation active state
  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.Home);

  // Procurement cart state: maps { [productId]: quantity }
  const [cartProducts, setCartProducts] = useState<{ [key: string]: number }>({});

  // Procure bookings state for client & cleaner dispatches
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "CW-8921",
      clientName: "John Garang",
      clientEmail: "garang@juba-net.com",
      clientPhone: "+211 928 300 401",
      address: "Plot 42, Airport Road, Tongping",
      zipCode: "61101",
      entryInstructions: "Ring bell twice, gatekeeper will open the metal gate.",
      bedrooms: 3,
      bathrooms: 2,
      sqFtRange: "2,000 - 2,999 sq ft",
      cleanType: "deep",
      addons: ["Inside Fridge", "Inside Oven", "Wet Wiping Baseboards"],
      frequency: "bi-weekly",
      date: "2026-07-02",
      timeSlot: "09:00 AM - 12:00 PM",
      price: 185.00,
      status: "pending",
      tipAmount: 0,
      beforePhoto: null,
      afterPhoto: null,
      checkedTasks: [],
      createdAt: "2026-06-29T10:00:00Z"
    },
    {
      id: "CW-4201",
      clientName: "Rebecca Nyandeng",
      clientEmail: "rebecca@juba-solutions.com",
      clientPhone: "+211 912 400 300",
      address: "Block B, Amarat District",
      zipCode: "61104",
      entryInstructions: "Key box code: 2026. Side doors open.",
      bedrooms: 4,
      bathrooms: 3,
      sqFtRange: "3,000+ sq ft",
      cleanType: "standard",
      addons: ["Interior Windows"],
      frequency: "monthly",
      date: "2026-06-28",
      timeSlot: "01:00 PM - 04:00 PM",
      price: 165.50,
      status: "completed",
      tipAmount: 25.00,
      beforePhoto: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop",
      afterPhoto: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=400&auto=format&fit=crop",
      checkedTasks: ["Sweep and vacuum all floors", "Sanitize countertops, sinks and tables", "Dust visible surfaces, baseboards and electronics", "Empty trash bins and replace liners"],
      createdAt: "2026-06-27T08:30:00Z"
    }
  ]);

  // Unified corporate Assessment Quote State
  const [quoteState, setQuoteState] = useState<QuoteState>({
    servicePillar: ServicePillar.Consultancy,
    areaSize: 1000,
    riskClass: RiskClass.Low,
    locationName: "Tongping",
    lat: 4.8601,
    lng: 31.5910,
    contactName: "",
    facilityName: "",
    contactPhone: "",
    contactEmail: "",
    notes: "",
    items: []
  });

  // Scroll to top on view changes to mimic professional routing transitions
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeView]);

  // Cart operations helpers
  const handleAddProductToCart = (product: Product, quantity: number) => {
    setCartProducts((prev) => {
      const currentQty = prev[product.id] || 0;
      return {
        ...prev,
        [product.id]: currentQty + quantity
      };
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCartProducts((prev) => {
      const updated = { ...prev };
      if (quantity <= 0) {
        delete updated[productId];
      } else {
        updated[productId] = quantity;
      }
      return updated;
    });
  };

  const handleClearCart = () => {
    setCartProducts({});
  };

  const handleSetQuotePillar = (pillar: ServicePillar) => {
    setQuoteState((prev) => ({
      ...prev,
      servicePillar: pillar
    }));
  };

  // Count total items in the cart
  const cartCount = Object.keys(cartProducts).reduce((acc, key) => acc + (cartProducts[key] || 0), 0);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950" id="clean-world-app">
      
      {/* 1. Header Navigation */}
      <Navbar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        cartCount={cartCount} 
      />

      {/* 2. Main Page Render Module */}
      <main className="flex-grow">
        {activeView === ActiveView.Home && (
          <LandingPage 
            setActiveView={setActiveView} 
            setQuotePillar={handleSetQuotePillar} 
          />
        )}
        
        {activeView === ActiveView.Services && (
          <ServicesPage 
            setActiveView={setActiveView} 
            setQuotePillar={handleSetQuotePillar} 
            onAddProductToCart={handleAddProductToCart}
            cartProducts={cartProducts}
          />
        )}

        {activeView === ActiveView.Shop && (
          <EcoShopPage 
            setActiveView={setActiveView} 
            cartProducts={cartProducts}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onClearCart={handleClearCart}
          />
        )}

        {activeView === ActiveView.QuoteFlow && (
          <QuoteWizard 
            setActiveView={setActiveView} 
            bookings={bookings}
            setBookings={setBookings}
          />
        )}

        {activeView === ActiveView.ClientDashboard && (
          <ClientDashboard 
            bookings={bookings}
            setBookings={setBookings}
            setActiveView={setActiveView}
          />
        )}

        {activeView === ActiveView.CleanerPortal && (
          <CleanerPortal 
            bookings={bookings}
            setBookings={setBookings}
            setActiveView={setActiveView}
          />
        )}

        {activeView === ActiveView.Academy && (
          <AcademyPage 
            setActiveView={setActiveView} 
          />
        )}
      </main>

      {/* 3. Footer with 24/7 Rapid Emergency Response Banner */}
      <Footer setActiveView={setActiveView} />

    </div>
  );
}
