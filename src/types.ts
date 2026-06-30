export enum ActiveView {
  Home = "home",
  Services = "services",
  Shop = "shop",
  QuoteFlow = "quote-flow",
  Academy = "academy"
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
}

export interface CartItem {
  product: Product;
  quantity: number;
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
