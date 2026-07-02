import React, { useState } from "react";
import { ActiveView, Product, CartItem, ProductOrder } from "../types";
import { PRODUCTS } from "../data";
import { 
  ShoppingCart, Plus, Minus, ShieldCheck, Tag, Info, ArrowRight, 
  RefreshCw, Layers, X, Eye, Sparkles, AlertTriangle, Check, BookOpen, 
  Leaf, Droplet, CreditCard, User, MapPin, Phone, CheckCircle2, Receipt 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20
    }
  }
};

interface EcoShopPageProps {
  setActiveView: (view: ActiveView) => void;
  cartProducts: { [key: string]: number };
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  onAddOrder: (order: ProductOrder) => void;
}

export default function EcoShopPage({
  setActiveView,
  cartProducts,
  onUpdateCartQuantity,
  onClearCart,
  onAddOrder
}: EcoShopPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [subFrequency, setSubFrequency] = useState("Single"); // Single, Monthly, Bi-Monthly
  const [currency, setCurrency] = useState<"USD" | "SSP">("USD");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Checkout modal states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Delivery, 2: Carrier, 3: PIN USSD, 4: Receipt
  const [recipientName, setRecipientName] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("Juba Town");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNum, setPhoneNum] = useState("+211 ");
  const [paymentCarrier, setPaymentCarrier] = useState<"m-GURUSH" | "MTN MoMo" | "Zain Cash" | "Cash" | "">("");
  const [ussdPin, setUssdPin] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<ProductOrder | null>(null);
  const [checkoutError, setCheckoutError] = useState("");

  const categories = ["All", "Sanitizers", "Aerosols", "Equipment"];
  const exchangeRate = 1300; // Local rate: 1 USD = 1,300 SSP

  const filteredProducts = selectedCategory === "All"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === selectedCategory);

  // Convert prices dynamically
  const formatPrice = (usdPrice: number) => {
    if (currency === "SSP") {
      return `SSP ${(usdPrice * exchangeRate).toLocaleString()}`;
    }
    return `$${usdPrice.toFixed(2)}`;
  };

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

  // Phone Validation
  const validatePhone = (num: string) => {
    const cleanNum = num.replace(/\s+/g, "");
    // Regex for +211 followed by 9 digits starting with 9 (standard South Sudan format)
    const ssRegex = /^\+2119\d{8}$/;
    return ssRegex.test(cleanNum);
  };

  const handleNextStep = () => {
    setCheckoutError("");
    if (checkoutStep === 1) {
      if (!recipientName.trim()) {
        setCheckoutError("Please enter recipient name.");
        return;
      }
      if (!deliveryAddress.trim()) {
        setCheckoutError("Please enter street address in Juba.");
        return;
      }
      if (!validatePhone(phoneNum)) {
        setCheckoutError("Please enter a valid South Sudan phone number (+211 followed by 9 digits, e.g. +211 922 345 678).");
        return;
      }
      setCheckoutStep(2);
    } else if (checkoutStep === 2) {
      if (!paymentCarrier) {
        setCheckoutError("Please choose your mobile money carrier.");
        return;
      }
      if (paymentCarrier === "Cash") {
        const generatedOrder: ProductOrder = {
          id: `SSD-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          items: [...cartItems],
          totalUSD: grandTotal,
          totalSSP: grandTotal * exchangeRate,
          currencyPaid: currency,
          paymentMethod: "Cash",
          phonePaid: "Cash-on-Delivery",
          deliveryLocation,
          deliveryAddress,
          transactionRef: "COD-CASH-PAY",
          status: "processing",
          createdAt: new Date().toISOString()
        };
        setCreatedOrder(generatedOrder);
        onAddOrder(generatedOrder);
        setCheckoutStep(4);
      } else {
        setCheckoutStep(3);
      }
    }
  };

  const handleSimulateUSSDPayment = () => {
    setCheckoutError("");
    if (!ussdPin || ussdPin.length < 4) {
      setCheckoutError("Please enter your 4-digit mobile money PIN.");
      return;
    }
    
    setIsProcessingPayment(true);
    
    setTimeout(() => {
      setIsProcessingPayment(false);
      const generatedOrder: ProductOrder = {
        id: `SSD-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...cartItems],
        totalUSD: grandTotal,
        totalSSP: grandTotal * exchangeRate,
        currencyPaid: currency,
        paymentMethod: paymentCarrier as any,
        phonePaid: phoneNum.replace(/\s+/g, ""),
        deliveryLocation,
        deliveryAddress,
        transactionRef: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
        status: "processing",
        createdAt: new Date().toISOString()
      };
      
      setCreatedOrder(generatedOrder);
      onAddOrder(generatedOrder);
      setCheckoutStep(4);
    }, 2200);
  };

  const handleFinishOrder = () => {
    onClearCart();
    setIsCheckoutOpen(false);
    setCheckoutStep(1);
    setRecipientName("");
    setDeliveryAddress("");
    setPhoneNum("+211 ");
    setPaymentCarrier("");
    setUssdPin("");
    setCreatedOrder(null);
    setActiveView(ActiveView.ClientDashboard);
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-16 px-4" id="eco-shop-root">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page Header with Dual Currency Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-800 pb-8">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="text-emerald-400 font-mono text-xs font-semibold tracking-widest uppercase">ECO-FRIENDLY PRODUCTS</span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Safe Cleaning Products &amp; Organic Disinfectants
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Equip your corporate space or home in South Sudan with our non-toxic, HSE-certified organic formulas. 
              Safe for workers, zero toxic residue.
            </p>
          </div>
          
          {/* Currency Toggle Switch */}
          <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setCurrency("USD")}
              className={`px-4 py-2 text-xs font-bold font-mono transition-all rounded-lg ${
                currency === "USD" 
                  ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/10" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency("SSP")}
              className={`px-4 py-2 text-xs font-bold font-mono transition-all rounded-lg ${
                currency === "SSP" 
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              SSP (Juba Rate)
            </button>
          </div>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2" id="shop-category-selector">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-500 text-slate-950 font-display shadow-md shadow-emerald-500/10"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40 border border-slate-800"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Grid: Left - Products Catalog, Right - Checkout Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Catalog Column */}
          <motion.div 
            key={selectedCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6" 
            id="shop-products-grid"
          >
            {filteredProducts.map((prod) => {
              const currentQty = cartProducts[prod.id] || 0;
              return (
                <motion.div 
                  key={prod.id}
                  id={`product-card-${prod.id}`}
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700/80 rounded-3xl overflow-hidden flex flex-col justify-between group transition-all shadow-[0_15px_35px_-10px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] relative"
                >
                  {/* Category badge */}
                  <div className="absolute top-3 left-3 z-10 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-lg text-[15px] font-mono text-slate-400">
                    {prod.category}
                  </div>

                  <div>
                    {/* Image frame */}
                    <div className="h-56 relative overflow-hidden bg-slate-900 border-b border-slate-900/60 flex items-center justify-center">
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        width={300}
                        height={225}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Premium Hover Detail Overlay Link */}
                      <button
                        onClick={() => setSelectedProduct(prod)}
                        className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                      >
                        <span className="bg-sky-500 text-slate-950 font-display font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-sky-500/20">
                          <Eye className="w-3.5 h-3.5" />
                          View Safety Details
                        </span>
                      </button>
                    </div>

                    {/* Description */}
                    <div className="p-5 sm:p-6 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-display text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {prod.name}
                        </h3>
                        <span className="font-mono text-emerald-400 font-bold text-sm bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10 shrink-0">
                          {formatPrice(prod.price)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-[14px] text-slate-400 font-mono">
                        <span>Standard Unit: {prod.unit}</span>
                        {prod.ecoMetrics?.biodegradable && (
                          <span className="text-emerald-400 flex items-center gap-0.5">
                            <Leaf className="w-3 h-3" /> {prod.ecoMetrics.biodegradable} Biodegradable
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {prod.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-5 sm:p-6 pt-0 border-t border-slate-900/60 flex items-center justify-between gap-4">
                    <button
                      onClick={() => setSelectedProduct(prod)}
                      className="text-[14px] text-sky-400 hover:text-sky-300 font-mono flex items-center gap-1 hover:underline"
                    >
                      <Info className="w-3 h-3" /> Details
                    </button>

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
                      <motion.button
                        onClick={() => onUpdateCartQuantity(prod.id, 1)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-slate-800 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 font-display font-semibold text-xs px-4 py-2.5 rounded-xl transition-all border border-slate-705 flex items-center gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Add to Order
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
 
          {/* Cart & Checkout Sidebar */}
          <div className="lg:col-span-4 space-y-6 sticky top-28" id="shop-cart-sidebar">
            
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Your Order Summary
                </h3>
                {cartItems.length > 0 && (
                  <button 
                    onClick={onClearCart}
                    className="text-[14px] font-mono text-slate-400 hover:text-red-400 transition-colors"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="py-12 text-center space-y-3" id="cart-empty-state">
                  <ShoppingCart className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your shopping cart is empty. Choose organic sanitizers or safety equipment to begin.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Cart items list */}
                  <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between text-xs bg-slate-900 border border-slate-800/50 p-2.5 rounded-xl">
                        <div className="flex items-center gap-2">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            width={32}
                            height={32}
                            loading="lazy"
                            decoding="async"
                            className="w-8 h-8 rounded-lg object-cover bg-slate-950 border border-slate-800"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="block font-medium text-white max-w-[150px] truncate">{item.product.name}</span>
                            <span className="block text-[14px] text-slate-400 font-mono">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-mono text-slate-300 font-medium">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Scheduled Delivery discount card */}
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
                        Regular Deliveries
                      </span>
                      <span className="bg-emerald-500/10 text-emerald-400 font-mono text-[15px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                        SAVE UP TO 15%
                      </span>
                    </div>
                    <p className="text-[14px] text-slate-400 leading-normal">
                      Schedule a recurring delivery intervals for your workplace safety needs.
                    </p>

                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      {[
                        { label: "Once", value: "Single", discount: 0 },
                        { label: "Bi-Monthly", value: "Bi-Monthly", discount: 10 },
                        { label: "Monthly", value: "Monthly", discount: 15 }
                      ].map((freq) => (
                        <button
                          key={freq.value}
                          onClick={() => setSubFrequency(freq.value)}
                          className={`py-1.5 rounded-lg border text-[15px] font-mono transition-all ${
                            subFrequency === freq.value
                              ? "bg-emerald-500 border-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/10"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          {freq.label}
                          {freq.discount > 0 && <span className="block text-[15px] opacity-90">-{freq.discount}%</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calculations */}
                  <div className="space-y-2 border-t border-slate-900 pt-4 text-xs font-sans text-left">
                    <div className="flex justify-between text-slate-400">
                      <span>Products Subtotal</span>
                      <span className="font-mono">{formatPrice(subTotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Delivery Discount</span>
                        <span className="font-mono">-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white font-semibold text-sm pt-2 border-t border-slate-900">
                      <span>Total Amount</span>
                      <span className="font-mono text-emerald-400">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>

                  {/* Interactive Checkout Modal Launch Button */}
                  <button
                    onClick={() => {
                      setCheckoutStep(1);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-display font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5"
                  >
                    Proceed to Mobile Payment
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-start gap-1.5 text-[14px] text-slate-400 leading-normal text-left">
                    <Info className="w-3 h-3 shrink-0 mt-0.5" />
                    <span>Deliveries dispatched from Juba base station. Includes telemetry sync.</span>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Product Details Modal (Quick View) */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl z-10 overflow-y-auto max-h-[90vh] space-y-6 text-left"
            >
              {/* Close Icon */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-950 border border-slate-855"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title Header */}
              <div className="flex flex-col sm:flex-row gap-6 items-start pb-4 border-b border-slate-800">
                <div className="h-28 w-28 rounded-2xl overflow-hidden shrink-0 border border-slate-800 bg-slate-950">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[15px] font-mono text-emerald-400 uppercase">
                      {selectedProduct.category}
                    </span>
                    <span className="text-[14px] text-slate-400 font-mono">ID: {selectedProduct.id}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">{selectedProduct.name}</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-emerald-400 font-mono font-bold text-base">{formatPrice(selectedProduct.price)}</span>
                    <span className="text-xs text-slate-400">Unit: {selectedProduct.unit}</span>
                  </div>
                </div>
              </div>

              {/* Content sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
                
                {/* Safe Application Guide & Ingredients */}
                <div className="space-y-4">
                  {selectedProduct.ingredients && selectedProduct.ingredients.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-white flex items-center gap-1.5">
                        <Leaf className="w-4 h-4 text-emerald-400" />
                        Organic Ingredients
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProduct.ingredients.map((ing, idx) => (
                          <span key={idx} className="bg-slate-950 px-2.5 py-1 rounded-md text-[14px] text-slate-400 border border-slate-850">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProduct.usageGuide && selectedProduct.usageGuide.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-white flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-sky-400" />
                        Safe Application Guide
                      </h4>
                      <ul className="space-y-1.5 list-disc pl-4 text-slate-400 leading-normal">
                        {selectedProduct.usageGuide.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Eco Telemetry and Hazard Warning */}
                <div className="space-y-4">
                  {/* HSE Certifications */}
                  {selectedProduct.hseCertifications && selectedProduct.hseCertifications.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        HSE Certifications
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProduct.hseCertifications.map((cert, idx) => (
                          <span key={idx} className="bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded text-[14px] font-mono">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Eco Savings Metrics */}
                  {selectedProduct.ecoMetrics && (
                    <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                      <h4 className="font-display text-[14px] font-bold text-slate-400 uppercase tracking-wider">ENVIRONMENTAL IMPACT REPORT</h4>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {selectedProduct.ecoMetrics.carbonSaved && (
                          <div className="space-y-0.5">
                            <span className="text-[14px] text-slate-400 font-mono">Carbon Reduction</span>
                            <span className="block font-bold text-emerald-400">{selectedProduct.ecoMetrics.carbonSaved}</span>
                          </div>
                        )}
                        {selectedProduct.ecoMetrics.waterSaved && (
                          <div className="space-y-0.5">
                            <span className="text-[14px] text-slate-400 font-mono">Water Preserved</span>
                            <span className="block font-bold text-sky-400 flex items-center gap-0.5">
                              <Droplet className="w-3.5 h-3.5" />
                              {selectedProduct.ecoMetrics.waterSaved}
                            </span>
                          </div>
                        )}
                        {selectedProduct.ecoMetrics.biodegradable && (
                          <div className="space-y-0.5 col-span-2">
                            <span className="text-[14px] text-slate-400 font-mono">Biodegradable Duration</span>
                            <span className="block font-bold text-white">{selectedProduct.ecoMetrics.biodegradable}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Warnings */}
                  {selectedProduct.hazards && (
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex gap-3 text-red-400">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <div>
                        <span className="font-bold block">Safety Alert</span>
                        <p className="text-[14px] leading-relaxed text-red-300/90 mt-0.5">{selectedProduct.hazards}</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Footer details modal */}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <p className="text-[14px] text-slate-400 font-mono">Formulated with biodegradable ingredients.</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-xs rounded-xl transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const qty = cartProducts[selectedProduct.id] || 0;
                      onUpdateCartQuantity(selectedProduct.id, qty + 1);
                      setSelectedProduct(null);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/10"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* South Sudan Mobile Money Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (checkoutStep !== 3 || !isProcessingPayment) {
                  setIsCheckoutOpen(false);
                }
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl z-10 space-y-6 text-left"
            >
              {/* Close Button */}
              {checkoutStep !== 3 && (
                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-950"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Checkout Steps Title */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-4.5 h-4.5 text-emerald-400" />
                  <span className="text-[14px] text-emerald-400 font-mono uppercase tracking-widest font-bold">
                    South Sudan Local Checkout
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  {checkoutStep === 1 && "1. Delivery & Contact Details"}
                  {checkoutStep === 2 && "2. Select Payment Carrier"}
                  {checkoutStep === 3 && "3. USSD PIN Verification"}
                  {checkoutStep === 4 && "4. Order Confirmed"}
                </h3>
                
                {/* Wizard dots indicator */}
                <div className="flex gap-1.5 pt-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div 
                      key={step} 
                      className={`h-1.5 rounded-full transition-all ${
                        checkoutStep === step 
                          ? "w-8 bg-emerald-400" 
                          : checkoutStep > step 
                          ? "w-2 bg-emerald-600" 
                          : "w-2 bg-slate-800"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {checkoutError && (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex gap-2.5 text-red-400 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{checkoutError}</span>
                </div>
              )}

              {/* STEP 1: DELIVERY & CONTACT FORM */}
              {checkoutStep === 1 && (
                <div className="space-y-4 text-xs font-sans">
                  <div className="space-y-1">
                    <label className="text-[14px] text-slate-400 uppercase font-mono font-bold tracking-wider">Recipient Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input 
                        type="text"
                        placeholder="e.g. Sly Bell"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[14px] text-slate-400 uppercase font-mono font-bold tracking-wider">Juba District</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                        <select
                          value={deliveryLocation}
                          onChange={(e) => setDeliveryLocation(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500 appearance-none"
                        >
                          <option value="Juba Town">Juba Town</option>
                          <option value="Airport">Airport District</option>
                          <option value="Gudele">Gudele Area</option>
                          <option value="Munuki">Munuki Block</option>
                          <option value="Kator">Kator Quarter</option>
                          <option value="Malakia">Malakia</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[14px] text-slate-400 uppercase font-mono font-bold tracking-wider">Mobile Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                        <input 
                          type="text"
                          placeholder="+211 922 000 000"
                          value={phoneNum}
                          onChange={(e) => setPhoneNum(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[14px] text-slate-400 uppercase font-mono font-bold tracking-wider">Delivery Street Address</label>
                    <textarea 
                      placeholder="e.g. Block 4, off Ministries Road near Zain HQ"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-850 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[15px] text-slate-400 block">AMOUNT TO CHARGE:</span>
                      <span className="font-mono text-white font-bold">{formatPrice(grandTotal)}</span>
                    </div>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1"
                    >
                      Next: Choose Carrier
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: SELECT CARRIER */}
              {checkoutStep === 2 && (
                <div className="space-y-5 text-xs font-sans">
                  <p className="text-slate-400">
                    We support South Sudan's primary mobile money carriers. Payments will trigger a simulated USSD push prompt on your device.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { 
                        name: "m-GURUSH", 
                        desc: "Trinity Technologies", 
                        color: "border-rose-500/20 hover:border-rose-500/50 bg-rose-500/5", 
                        selectedColor: "border-rose-500 ring-1 ring-rose-500/50 bg-rose-500/10",
                        textColor: "text-rose-400"
                      },
                      { 
                        name: "MTN MoMo", 
                        desc: "MTN South Sudan", 
                        color: "border-yellow-500/20 hover:border-yellow-500/50 bg-yellow-500/5", 
                        selectedColor: "border-yellow-500 ring-1 ring-yellow-500/50 bg-yellow-500/10",
                        textColor: "text-yellow-400"
                      },
                      { 
                        name: "Zain Cash", 
                        desc: "Zain Mobile Money", 
                        color: "border-cyan-500/20 hover:border-cyan-500/50 bg-cyan-500/5", 
                        selectedColor: "border-cyan-500 ring-1 ring-cyan-500/50 bg-cyan-500/10",
                        textColor: "text-cyan-400"
                      },
                      { 
                        name: "Cash", 
                        desc: "Pay on Arrival", 
                        color: "border-emerald-500/20 hover:border-emerald-500/50 bg-emerald-500/5", 
                        selectedColor: "border-emerald-500 ring-1 ring-emerald-500/50 bg-emerald-500/10",
                        textColor: "text-emerald-400"
                      }
                    ].map((carrier) => {
                      const isSel = paymentCarrier === carrier.name;
                      return (
                        <button
                          key={carrier.name}
                          onClick={() => setPaymentCarrier(carrier.name as any)}
                          className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all aspect-[4/3] ${
                            isSel ? carrier.selectedColor : carrier.color
                          }`}
                        >
                          <div className="flex justify-between items-start w-full">
                            <span className={`font-display font-black text-sm ${carrier.textColor}`}>{carrier.name}</span>
                            {isSel && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          </div>
                          <div>
                            <span className="block text-[14px] text-slate-400 uppercase font-mono tracking-wider">CARRIER</span>
                            <span className="text-[14px] font-semibold text-slate-300 block">{carrier.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-slate-850 flex justify-between items-center text-xs">
                    <button
                      onClick={() => setCheckoutStep(1)}
                      className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1"
                    >
                      Next: Send PIN Request
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: USSD PIN POPUP SIMULATOR */}
              {checkoutStep === 3 && (
                <div className="space-y-6 text-xs font-sans">
                  
                  {/* Phone Device Mockup Wrapper */}
                  <div className="max-w-xs mx-auto border-4 border-slate-800 bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl relative p-5 space-y-4">
                    <div className="h-4 w-28 bg-slate-800 mx-auto rounded-full mb-1"></div> {/* Speaker */}

                    {!isProcessingPayment ? (
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 animate-fadeIn">
                        
                        <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                          <span className="font-mono text-[15px] font-bold text-slate-400 uppercase tracking-widest">{paymentCarrier} USSD GATE</span>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                        </div>

                        <div className="space-y-1 text-center py-2">
                          <p className="text-[14px] text-slate-400">Merchant: Clean World Inc.</p>
                          <p className="text-sm font-black text-white">{formatPrice(grandTotal)}</p>
                          <p className="text-[14px] text-slate-400 font-mono">Carrier Target: {phoneNum}</p>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[14px] text-slate-400 uppercase font-mono tracking-widest block text-center">ENTER YOUR PIN TO CONFIRM</label>
                          <input 
                            type="password"
                            maxLength={4}
                            placeholder="••••"
                            value={ussdPin}
                            onChange={(e) => setUssdPin(e.target.value.replace(/\D/g, ""))}
                            className="w-24 mx-auto text-center block bg-slate-950 border border-slate-800 rounded-lg py-1.5 text-base tracking-widest font-mono text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <button
                          onClick={handleSimulateUSSDPayment}
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-955 font-mono font-bold text-[14px] py-2 rounded-lg transition-colors"
                        >
                          Confirm &amp; Authorize
                        </button>
                      </div>
                    ) : (
                      <div className="py-12 text-center space-y-4 animate-pulse">
                        <RefreshCw className="w-10 h-10 text-emerald-400 mx-auto animate-spin" />
                        <div className="space-y-1">
                          <p className="font-bold text-white text-xs">Simulating Juba Network Transit...</p>
                          <p className="text-[14px] text-slate-400 font-mono">Carrier: {paymentCarrier} Gateway</p>
                        </div>
                      </div>
                    )}

                    <div className="h-8 w-8 border border-slate-800 rounded-full mx-auto flex items-center justify-center text-[14px] text-slate-400 font-mono">SSD</div>
                  </div>

                  <div className="text-center">
                    <p className="text-[14px] text-slate-400">
                      *Notice: This is a safe sandboxed payment environment. No actual funds are charged. 
                      Input any 4 digit code to verify order telemetry.
                    </p>
                  </div>

                  {!isProcessingPayment && (
                    <div className="pt-2 border-t border-slate-850 flex justify-between">
                      <button
                        onClick={() => setCheckoutStep(2)}
                        className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl"
                      >
                        Change Carrier
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* STEP 4: SUCCESS RECEIPT */}
              {checkoutStep === 4 && createdOrder && (
                <div className="space-y-6 text-xs font-sans">
                  
                  {/* Visual success check */}
                  <div className="text-center space-y-2 py-2">
                    <div className="h-12 w-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/25">
                      <Check className="w-6 h-6 animate-bounce" />
                    </div>
                    <h4 className="font-display font-extrabold text-white text-base">
                      {createdOrder.paymentMethod === "Cash" ? "Order Placed Successfully!" : "Payment Authorized Successfully!"}
                    </h4>
                    <p className="text-[14px] text-slate-400">
                      {createdOrder.paymentMethod === "Cash" ? "Pay upon dispatch delivery in Juba." : "Simulated mobile push cleared in Juba."}
                    </p>
                  </div>

                  {/* Summary invoice */}
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                      <span className="font-mono text-[14px] text-slate-400 font-bold uppercase">ORDER CONFIRMATION</span>
                      <span className="font-mono text-[15px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {createdOrder.id}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[15px] text-slate-400 font-mono uppercase block">TRANSACTION REF</span>
                      <span className="font-mono font-semibold text-white">{createdOrder.transactionRef}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[15px] text-slate-400 font-mono uppercase block">SHIPPING ADDR</span>
                      <span className="font-medium text-white">{createdOrder.deliveryLocation} District - {createdOrder.deliveryAddress}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-850">
                      <div>
                        <span className="text-[15px] text-slate-400 font-mono uppercase block">PAYMENT CARRIER</span>
                        <span className="font-semibold text-white">{createdOrder.paymentMethod}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[15px] text-slate-400 font-mono uppercase block">TOTAL AMOUNT</span>
                        <span className="font-mono text-emerald-400 font-bold text-sm">
                          {createdOrder.currencyPaid === "USD" 
                            ? `$${createdOrder.totalUSD.toFixed(2)}` 
                            : `SSP ${createdOrder.totalSSP.toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Redirection notice */}
                  <div className="bg-sky-500/10 border border-sky-500/20 p-3.5 rounded-xl flex gap-3 text-sky-400">
                    <Info className="w-5 h-5 shrink-0" />
                    <div>
                      <span className="font-bold block">Dashboard Synchronization</span>
                      <p className="text-[14px] leading-relaxed text-sky-300/90 mt-0.5">
                        This order has been synchronized with your global account. You can track status and print official receipts in the **Client Dashboard**.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleFinishOrder}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5"
                  >
                    Go to Client Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
