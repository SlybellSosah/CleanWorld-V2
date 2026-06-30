import React, { useState, useEffect } from "react";
import { ActiveView, ServicePillar, RiskClass, QuoteState, Product } from "./types";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import ServicesPage from "./components/ServicesPage";
import EcoShopPage from "./components/EcoShopPage";
import QuoteWizard from "./components/QuoteWizard";
import AcademyPage from "./components/AcademyPage";

export default function App() {
  // Navigation active state
  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.Home);

  // Procurement cart state: maps { [productId]: quantity }
  const [cartProducts, setCartProducts] = useState<{ [key: string]: number }>({});

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
            quoteState={quoteState}
            setQuoteState={setQuoteState}
            cartProducts={cartProducts}
            onUpdateCartQuantity={handleUpdateCartQuantity}
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
