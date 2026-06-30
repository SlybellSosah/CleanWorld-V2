import React, { useState } from "react";
import { ActiveView, Product, CartItem } from "../types";
import { PRODUCTS } from "../data";
import { ShoppingCart, Plus, Minus, ShieldCheck, Tag, Info, ArrowRight, RefreshCw, Layers } from "lucide-react";

interface EcoShopPageProps {
  setActiveView: (view: ActiveView) => void;
  cartProducts: { [key: string]: number };
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
}

export default function EcoShopPage({
  setActiveView,
  cartProducts,
  onUpdateCartQuantity,
  onClearCart
}: EcoShopPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [subFrequency, setSubFrequency] = useState("Monthly"); // Monthly, Bi-Monthly, Single

  const categories = ["All", "Sanitizers", "Aerosols", "Equipment"];

  const filteredProducts = selectedCategory === "All"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === selectedCategory);

  // Calculate cart metrics
  const cartItems: CartItem[] = PRODUCTS.map(product => ({
    product,
    quantity: cartProducts[product.id] || 0
  })).filter(item => item.quantity > 0);

  const subTotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // Subscription discounts
  const getDiscountPercentage = (freq: string) => {
    switch (freq) {
      case "Monthly": return 15;
      case "Bi-Monthly": return 10;
      default: return 0;
    }
  };

  const discountPercent = getDiscountPercentage(subFrequency);
  const discountAmount = (subTotal * discountPercent) / 100;
  const grandTotal = subTotal - discountAmount;

  const handleIntegrateIntoQuoteFlow = () => {
    setActiveView(ActiveView.QuoteFlow);
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-16 px-4" id="eco-shop-root">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-emerald-500 font-mono text-xs font-semibold tracking-widest uppercase">// ECO-FRIENDLY PRODUCTS</span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Safe Cleaning Products &amp; Organic Disinfectants
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Keep your business and home safe with organic, plant-based cleaning products. Non-toxic, eco-friendly, and safe for everyone.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-800 pb-4" id="shop-category-selector">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-500 text-slate-950 font-display shadow-md shadow-emerald-500/10"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid: Left - Products Catalog, Right - Quote Builder Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Catalog Column */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6" id="shop-products-grid">
            {filteredProducts.map((prod) => {
              const currentQty = cartProducts[prod.id] || 0;
              return (
                <div 
                  key={prod.id}
                  id={`product-card-${prod.id}`}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden flex flex-col justify-between group transition-all"
                >
                  <div>
                    <div className="h-64 relative overflow-hidden bg-slate-900 border-b border-slate-900/60 flex items-center justify-center">
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 right-3 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded text-[10px] font-mono text-emerald-400">
                        {prod.category}
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-display text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {prod.name}
                        </h3>
                        <span className="font-mono text-emerald-400 font-bold text-sm bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10">
                          ${prod.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Standard Unit: {prod.unit}
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed min-h-[48px]">
                        {prod.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-900/60 flex items-center justify-between gap-4">
                    <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1.5 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" /> Eco-Certified
                    </span>

                    {currentQty > 0 ? (
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-xl">
                        <button 
                          onClick={() => onUpdateCartQuantity(prod.id, currentQty - 1)}
                          className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-semibold px-1 text-white">{currentQty}</span>
                        <button 
                          onClick={() => onUpdateCartQuantity(prod.id, currentQty + 1)}
                          className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onUpdateCartQuantity(prod.id, 1)}
                        className="bg-slate-800 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 font-display font-semibold text-xs px-4 py-2.5 rounded-xl transition-all border border-slate-700/80 hover:border-emerald-500/10 flex items-center gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Add to Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart & B2B Quote Builder Sidebar */}
          <div className="lg:col-span-4 space-y-6 sticky top-28" id="shop-cart-sidebar">
            
            {/* Cart summary box */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Your Order Summary
                </h3>
                {cartItems.length > 0 && (
                  <button 
                    onClick={onClearCart}
                    className="text-[10px] font-mono text-slate-500 hover:text-red-400 transition-colors"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="py-12 text-center space-y-3" id="cart-empty-state">
                  <ShoppingCart className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Your cart is empty. Click "Add to Order" to begin.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cart items listing */}
                  <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between text-xs bg-slate-900 border border-slate-800/50 p-2.5 rounded-xl">
                        <div className="flex items-center gap-2">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-8 h-8 rounded-lg object-cover bg-slate-950 border border-slate-800"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="block font-medium text-white">{item.product.name}</span>
                            <span className="block text-[10px] text-slate-500 font-mono">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-mono text-slate-300 font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Subscribe & Protect replenishment selector */}
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                        Save on Regular Deliveries
                      </span>
                      <span className="bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                        SAVE UP TO 15%
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Choose scheduled deliveries for your home or business and save up to 15%.
                    </p>

                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      {[
                        { label: "Once", value: "Single", discount: 0 },
                        { label: "Every 2 Months", value: "Bi-Monthly", discount: 10 },
                        { label: "Every Month", value: "Monthly", discount: 15 }
                      ].map((freq) => (
                        <button
                          key={freq.value}
                          onClick={() => setSubFrequency(freq.value)}
                          className={`py-1.5 rounded-lg border text-[10px] font-mono transition-all ${
                            subFrequency === freq.value
                              ? "bg-emerald-500 border-emerald-400 text-slate-950 font-bold"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          {freq.label}
                          {freq.discount > 0 && <span className="block text-[8px] opacity-90">-{freq.discount}%</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calculations breakdown */}
                  <div className="space-y-2 border-t border-slate-900 pt-4 text-xs font-sans">
                    <div className="flex justify-between text-slate-400">
                      <span>Products Subtotal</span>
                      <span className="font-mono">${subTotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Scheduled Delivery Discount</span>
                        <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white font-semibold text-sm pt-2 border-t border-slate-900">
                      <span>Total Estimated Price</span>
                      <span className="font-mono text-emerald-400">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* CTA button to QuoteFlow */}
                  <button
                    onClick={handleIntegrateIntoQuoteFlow}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-display font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5"
                  >
                    Add to Free Quote
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-start gap-1.5 text-[9px] text-slate-500 leading-normal">
                    <Info className="w-3 h-3 shrink-0 mt-0.5" />
                    <span>Adding these products will include them in your final free quote summary.</span>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
