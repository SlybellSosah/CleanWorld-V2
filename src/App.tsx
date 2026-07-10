import React, { useState, useEffect } from "react";
import { ActiveView, ServicePillar, RiskClass, QuoteState, Product, Booking, ProductOrder, UserSession, UserRole, B2BInquiry } from "./types";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import ConsultancyPage from "./components/ConsultancyPage";
import ServicesPage from "./components/ServicesPage";
import EcoShopPage from "./components/EcoShopPage";
import QuoteWizard from "./components/QuoteWizard";
import ClientDashboard from "./components/ClientDashboard";
import CleanerPortal from "./components/CleanerPortal";
import LoginModal from "./components/LoginModal";
import { useDocumentMetadata } from "./hooks/useDocumentMetadata";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Navigation active state
  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.Home);

  // Authentication and Session state
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Route Guards for Authenticated Portals
  useEffect(() => {
    if (activeView === ActiveView.ClientDashboard) {
      if (!currentUser) {
        setActiveView(ActiveView.Home);
        setShowLoginModal(true);
      } else if (currentUser.role !== UserRole.Client) {
        setActiveView(ActiveView.CleanerPortal);
      }
    } else if (activeView === ActiveView.CleanerPortal) {
      if (!currentUser) {
        setActiveView(ActiveView.Home);
        setShowLoginModal(true);
      } else if (currentUser.role !== UserRole.Cleaner) {
        setActiveView(ActiveView.ClientDashboard);
      }
    }
  }, [activeView, currentUser]);

  // Dynamic SEO metadata, open graph tags and JSON-LD schema injection
  useDocumentMetadata(activeView);

  // Procurement cart state: maps { [productId]: quantity }
  const [cartProducts, setCartProducts] = useState<{ [key: string]: number }>({});

  // Product purchase orders history
  const [productOrders, setProductOrders] = useState<ProductOrder[]>([
    {
      id: "PO-7210",
      items: [
        {
          product: {
            id: "prod-1",
            name: "Bio-Clean Pro-X",
            price: 45.00,
            unit: "5-Liter Canister",
            description: "Industrial strength bio-enzymatic cleaner. Concentrated organic formulation for heavy-duty facility sanitization. Leaving zero environmental runoff.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDm8aWmUCTIgiKoxLCINbvsdFJE8cGiBHvrBLEcttEuPOrfKFvgZB6D3LqQMtGOEqO0e0oNHdhYSltYB4r8WxFvUQVjYmhVIW5Z701Qn7FJD0RkvceVqu-x8m5II63nhZTBC7sG3_A-VQR6vcbZ0id9jxad8mgvftvk-CN8MadFdZdWjDsuIjfPKTWvNhBPVfe3cnE0P8nY4yGfHqaLihddkkL2w58SMY2r8QYKdOXMjToONkdh926tOfjx3YUnC894yYfXm-6GZ5s",
            category: "Sanitizers"
          },
          quantity: 2
        },
        {
          product: {
            id: "prod-2",
            name: "Verde Surface Mist",
            price: 18.50,
            unit: "500ml Spray Bottle",
            description: "Plant-based broad spectrum surface spray. Fast drying, active botanical compounds neutralize pathogens without toxic residues.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLBElue0ml3DxSAaDWuYMCAPR5t58MKJfqVWyMdDlckvMr7CFWmOdC6iCsjHWqWAjVTbR21faxE8CW0oRL1AwtcH9oN4ZE_DIQJn77k3UcQGcxxW03CO9GgXQzh8RdGwYPmaveLVRFR3MalY6TCSgb6jTa22X2vRV5b0-iNLHuMtvKtxGN-CDNg6mbl6J2AU-VaVs6dSBRR-R4UJkdtv0we1bz4D6--mWvIgTJkC03zqoMdks6D4XMBPCkfSSRs4V_fMYbH20W5hM",
            category: "Sanitizers"
          },
          quantity: 1
        }
      ],
      totalUSD: 108.50,
      totalSSP: 141050,
      currencyPaid: "USD",
      paymentMethod: "m-GURUSH",
      phonePaid: "+211 928 300 401",
      deliveryLocation: "Tongping",
      deliveryAddress: "Plot 42, Airport Road, Tongping",
      transactionRef: "MG-9102-JUB",
      status: "dispatched",
      createdAt: "2026-07-01T15:30:00Z"
    }
  ]);

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
      createdAt: "2026-06-29T10:00:00Z",
      lat: 4.85610,
      lng: 31.58100,
      landmark: "Near Juba International Airport (opposite Zain HQ Office)",
      transportMode: "truck",
      roadCondition: "clear"
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
      createdAt: "2026-06-27T08:30:00Z",
      lat: 4.84320,
      lng: 31.57210,
      landmark: "Behind Turkish Embassy (Amarat Street 3)",
      transportMode: "boda",
      roadCondition: "muddy"
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

  // Prefilled specs state to bridge Services page selections and QuoteWizard
  const [prefilledSpecs, setPrefilledSpecs] = useState<any>(null);

  // Technical scoping inquiries state
  const [b2bInquiries, setB2bInquiries] = useState<B2BInquiry[]>([]);

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
  const handleAddOrder = (order: ProductOrder) => {
    setProductOrders((prev) => [order, ...prev]);
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
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onLoginClick={() => setShowLoginModal(true)}
      />

      {/* 2. Main Page Render Module */}
      <main className="flex-grow overflow-hidden">
        <AnimatePresence mode="wait">
          {activeView === ActiveView.Home && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <LandingPage 
                setActiveView={setActiveView} 
                setQuotePillar={handleSetQuotePillar} 
              />
            </motion.div>
          )}
          
          {activeView === ActiveView.Consultancy && (
            <motion.div
              key="consultancy"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <ConsultancyPage 
                setActiveView={setActiveView} 
                setQuotePillar={handleSetQuotePillar} 
                b2bInquiries={b2bInquiries}
                onAddB2BInquiry={(inquiry) => setB2bInquiries((prev) => [inquiry, ...prev])}
              />
            </motion.div>
          )}

          {activeView === ActiveView.Services && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <ServicesPage 
                setActiveView={setActiveView} 
                setQuotePillar={handleSetQuotePillar} 
                onAddProductToCart={handleAddProductToCart}
                cartProducts={cartProducts}
                setPrefilledSpecs={setPrefilledSpecs}
              />
            </motion.div>
          )}

          {activeView === ActiveView.Shop && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <EcoShopPage 
                setActiveView={setActiveView} 
                cartProducts={cartProducts}
                onUpdateCartQuantity={handleUpdateCartQuantity}
                onClearCart={handleClearCart}
                onAddOrder={handleAddOrder}
              />
            </motion.div>
          )}

          {activeView === ActiveView.QuoteFlow && (
            <motion.div
              key="quote"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <QuoteWizard 
                setActiveView={setActiveView} 
                bookings={bookings}
                setBookings={setBookings}
                initialSpecs={prefilledSpecs}
                currentUser={currentUser}
                onRegisterSuccess={(session) => {
                  // Set user without auto-navigating — keep them on the receipt
                  setCurrentUser(session);
                }}
              />
            </motion.div>
          )}

          {activeView === ActiveView.ClientDashboard && (
            <motion.div
              key="client-dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <ClientDashboard 
                bookings={bookings}
                setBookings={setBookings}
                setActiveView={setActiveView}
                productOrders={productOrders}
              />
            </motion.div>
          )}

          {activeView === ActiveView.CleanerPortal && (
            <motion.div
              key="cleaner-portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <CleanerPortal 
                bookings={bookings}
                setBookings={setBookings}
                setActiveView={setActiveView}
              />
            </motion.div>
          )}




        </AnimatePresence>
      </main>

      {/* 3. Footer with 24/7 Rapid Emergency Response Banner */}
      <Footer setActiveView={setActiveView} />

      {/* Login Modal Overlay */}
      <AnimatePresence>
        {showLoginModal && (
          <LoginModal 
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={(session) => {
              setCurrentUser(session);
              // Auto route to respective portal
              if (session.role === UserRole.Client) {
                setActiveView(ActiveView.ClientDashboard);
              } else {
                setActiveView(ActiveView.CleanerPortal);
              }
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
