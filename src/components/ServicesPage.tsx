import React, { useState } from "react";
import { ActiveView, ServicePillar, Product } from "../types";
import { SERVICES_DETAILS, PRODUCTS } from "../data";
import { ShieldCheck, Truck, ClipboardList, Clock, Sparkles, Plus, Check } from "lucide-react";

interface ServicesPageProps {
  setActiveView: (view: ActiveView) => void;
  setQuotePillar: (pillar: ServicePillar) => void;
  onAddProductToCart: (product: Product, quantity: number) => void;
  cartProducts: { [key: string]: number };
}

export default function ServicesPage({ 
  setActiveView, 
  setQuotePillar, 
  onAddProductToCart,
  cartProducts
}: ServicesPageProps) {
  const [selectedPillar, setSelectedPillar] = useState<ServicePillar>(ServicePillar.Consultancy);

  const activeService = SERVICES_DETAILS.find(s => s.id === selectedPillar) || SERVICES_DETAILS[0];

  // Match products with services to recommend
  const getRecommendedProducts = (pillar: ServicePillar): Product[] => {
    switch (pillar) {
      case ServicePillar.Consultancy:
        return [PRODUCTS[3]]; // Eco-Armor Gear Set
      case ServicePillar.Management:
        return [PRODUCTS[0], PRODUCTS[1]]; // Bio-Clean Pro-X, Verde Surface Mist
      case ServicePillar.Fumigation:
        return [PRODUCTS[2], PRODUCTS[3]]; // PureAir Bio-Mist, Eco-Armor Gear Set
      case ServicePillar.Landscaping:
        return [PRODUCTS[0]]; // Bio-Clean Pro-X (for hardscapes)
      default:
        return [];
    }
  };

  const handleStartQuote = (pillar: ServicePillar) => {
    setQuotePillar(pillar);
    setActiveView(ActiveView.QuoteFlow);
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-16 px-4" id="services-page-root">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-emerald-500 font-mono text-xs font-semibold tracking-widest uppercase">// PROFESSIONAL CLEANING &amp; ECO SERVICES</span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Our Key Services &amp; Quality Standards
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            All of our services are delivered to the highest professional standards, using eco-friendly products that are safe for your family and the Juba environment. Select a service below to view how we work, our professional equipment, and recommended supplies.
          </p>
        </div>

        {/* Horizontal Navigation Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-800 pb-4" id="services-selector-tabs">
          {SERVICES_DETAILS.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedPillar(service.id)}
              className={`px-5 py-3 rounded-xl font-display text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${
                selectedPillar === service.id
                  ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/40 text-emerald-400 shadow-md shadow-emerald-500/5"
                  : "text-slate-400 hover:text-white border border-transparent hover:bg-slate-800/50"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${selectedPillar === service.id ? "bg-emerald-400" : "bg-slate-600"}`}></span>
              {service.title}
            </button>
          ))}
        </div>

        {/* Detailed Service Display Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="service-details-panel">
          
          {/* Main Specs Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative h-64 sm:h-96 rounded-3xl overflow-hidden border border-slate-800">
              <img 
                src={activeService.image} 
                alt={activeService.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-mono tracking-widest uppercase font-bold px-3 py-1 rounded-full border border-emerald-400/20">
                  HOW WE WORK
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-2">
                  {activeService.subtitle}
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-emerald-400" />
                Our Service Standards &amp; Commitments
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                We follow strict guidelines tailored for homes and businesses in South Sudan, ensuring complete pest eradication and deep cleaning with safe, natural products.
              </p>
              
              <ul className="space-y-3 pl-1">
                {activeService.bulletPoints.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3 bg-slate-950 border border-slate-800/60 p-4 rounded-xl">
                    <span className="bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold h-6 w-6 rounded-full flex items-center justify-center shrink-0 border border-emerald-500/20">
                      0{i + 1}
                    </span>
                    <span className="text-slate-300 text-xs sm:text-sm leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Logistics & Equipment Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* SLA Logistics Info Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Our Service Commitments
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center space-y-1">
                  <Clock className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <span className="block text-[10px] text-slate-400 font-mono uppercase">Service Hours</span>
                  <span className="block text-xs font-semibold text-white">24 / 7 Coverage</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center space-y-1">
                  <Truck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <span className="block text-[10px] text-slate-400 font-mono uppercase">Fast Response Time</span>
                  <span className="block text-xs font-semibold text-white">&lt; 4 Hours</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-900">
                  <span className="text-slate-400">Where We Work</span>
                  <span className="font-mono text-white text-right">Central Equatoria State</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-900">
                  <span className="text-slate-400">Response Time</span>
                  <span className="text-white font-medium text-right">{activeService.timeline.split(";")[0]}</span>
                </div>
                <div className="flex justify-between items-start text-xs">
                  <span className="text-slate-400">Our Quality Standards</span>
                  <span className="text-white text-right max-w-[180px] font-medium leading-relaxed">
                    ISO 9001/14001, SDS Chemical Sheets, GPS Geo-Tagging Report
                  </span>
                </div>
              </div>

              {/* Machinery list */}
              <div className="space-y-3 pt-2">
                <span className="block text-xs font-mono uppercase text-slate-400 tracking-wider">Professional Equipment We Use:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeService.equipment.map((eq, i) => (
                    <span key={i} className="text-[11px] font-mono text-emerald-300 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1 rounded">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleStartQuote(activeService.id)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
              >
                Get a Free Service Quote
              </button>
            </div>

            {/* Recommended Products Container */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Recommended Safe Products
                </h3>
                <button 
                  onClick={() => setActiveView(ActiveView.Shop)}
                  className="text-[10px] font-mono text-emerald-400 hover:underline"
                >
                  View Catalog
                </button>
              </div>

              <p className="text-xs text-slate-400">
                These eco-friendly, organic products are perfect for maintaining a clean and healthy environment after our service.
              </p>

              <div className="space-y-3">
                {getRecommendedProducts(activeService.id).map((prod) => {
                  const isInCart = (cartProducts[prod.id] || 0) > 0;
                  return (
                    <div 
                      key={prod.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 group hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className="w-12 h-12 rounded-lg object-cover bg-slate-950 shrink-0 border border-slate-800"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                            {prod.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            ${prod.price.toFixed(2)} / {prod.unit}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onAddProductToCart(prod, 1)}
                        className={`p-2 rounded-lg transition-all ${
                          isInCart 
                            ? "bg-emerald-500 text-slate-950" 
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                        }`}
                        title={isInCart ? "In Your Cart" : "Add to Cart"}
                      >
                        {isInCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
