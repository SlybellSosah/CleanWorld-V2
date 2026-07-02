export enum ActiveView {
  Home = "home",
  Services = "services",
  Shop = "shop",
  QuoteFlow = "quote-flow",
  Academy = "academy",
  ClientDashboard = "client-dashboard",
  CleanerPortal = "cleaner-portal"
}

export enum UserRole {
  Client = "client",
  Cleaner = "cleaner"
}

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  address: string;
  zipCode: string;
  entryInstructions: string;
  bedrooms: number;
  bathrooms: number;
  sqFtRange: string; // e.g. "< 1000", "1000 - 1999", etc.
  cleanType: "standard" | "deep" | "move-in-out";
  addons: string[];
  frequency: "one-time" | "weekly" | "bi-weekly" | "monthly";
  date: string;
  timeSlot: string;
  price: number;
  status: "pending" | "completed" | "cancelled";
  tipAmount: number;
  beforePhoto: string | null;
  afterPhoto: string | null;
  checkedTasks: string[];
  createdAt: string;
  lat?: number;
  lng?: number;
  paymentMethod?: "m-GURUSH" | "MTN MoMo" | "Zain Cash" | "Cash";
  paymentPhone?: string;
  transactionRef?: string;
  landmark?: string;
  transportMode?: "boda" | "truck";
  roadCondition?: "clear" | "muddy" | "flooded" | "construction";
}

export enum ServicePillar {
  Consultancy = "Consultancy",
  Management = "Management",
  Fumigation = "Fumigation",
  Landscaping = "Landscaping"
}

export enum RiskClass {
  Low = "Class I (Low Risk)",
  Medium = "Class II (Medium Risk)",
  High = "Class III (High Risk)"
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  unit: string;
  category: string;
  ingredients?: string[];
  usageGuide?: string[];
  hazards?: string;
  hseCertifications?: string[];
  ecoMetrics?: {
    carbonSaved?: string;
    biodegradable?: string;
    waterSaved?: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductOrder {
  id: string;
  items: CartItem[];
  totalUSD: number;
  totalSSP: number;
  currencyPaid: "USD" | "SSP";
  paymentMethod: "m-GURUSH" | "MTN MoMo" | "Zain Cash" | "Cash";
  phonePaid: string;
  deliveryLocation: string;
  deliveryAddress: string;
  transactionRef: string;
  status: "processing" | "dispatched" | "delivered";
  createdAt: string;
}

export interface JubaLocation {
  name: string;
  lat: number;
  lng: number;
  description: string;
}

export interface QuoteState {
  servicePillar: ServicePillar;
  areaSize: number; // in square meters
  riskClass: RiskClass;
  locationName: string;
  lat: number;
  lng: number;
  contactName: string;
  facilityName: string;
  contactPhone: string;
  contactEmail: string;
  notes: string;
  items: CartItem[];
  subscriptionFrequency?: string; // e.g. "Monthly", "Bi-Monthly", "Single"
}
