import type { Service, ServiceSlug } from "../types";

// Order sets the order on Home and Services. No prices, certifications or client names:
// add them only from the owner's confirmed fact sheet.
export const services: Service[] = [
  {
    slug: "fumigation",
    title: "Fumigation and pest control",
    short: "Fumigation",
    summary: "Mosquito, termite, cockroach and rodent control for homes, offices, compounds and warehouses.",
    intro:
      "Mosquitoes, termites and rodents damage health, buildings and stock. We find where they breed and get in, treat the problem, and help you keep them out.",
    includes: [
      "Mosquito control: clearing breeding sites, treating standing water and treating indoor walls",
      "Termite protection for new buildings and treatment of existing nests",
      "Cockroach and ant control for kitchens, restaurants, hotels and shops",
      "Rodent proofing and removal for warehouses, stores and offices",
      "Perimeter treatment around compound walls",
    ],
    method: [
      "We inspect first and tell you what we found before any treatment",
      "We seal cracks and entry points so less chemical is needed later",
      "We time mosquito work to the season and the weather",
      "We show your own staff how to keep the site clean and sealed between visits",
    ],
    safety: [
      "We tell you which products we will use before we start",
      "We tell you how long to keep people, pets and food away from treated areas",
      "Our team wears protective equipment on every job",
    ],
    frequency: "A single treatment, or a regular schedule through the rainy season and beyond.",
    goodFor: ["Homes and compounds", "Offices and guesthouses", "Hotels and restaurants", "Warehouses and stores", "Clinics and schools"],
  },
  {
    slug: "cleaning",
    title: "Cleaning",
    short: "Cleaning",
    summary: "Regular and deep cleaning for offices, compounds, clinics, hotels and homes.",
    intro:
      "A clean building protects the people who work and live in it. We provide regular cleaning teams for organisations and one-off deep cleans for homes and offices.",
    includes: [
      "Daily or weekly office and compound cleaning",
      "Deep cleaning of kitchens, washrooms, floors and high-touch surfaces",
      "Move-in and move-out cleaning",
      "Disinfection after illness or during outbreaks",
      "Clean-up after flooding or building work",
    ],
    method: [
      "We visit the site and agree a written scope and schedule with you",
      "The same team returns each visit wherever possible",
      "A team leader checks the work against the agreed list before leaving",
    ],
    safety: [
      "Cleaning products are labelled and stored away from food and children",
      "Disinfection follows a set routine for washrooms, kitchens and shared surfaces",
      "Our team wears gloves and protective equipment",
    ],
    frequency: "One-off, weekly, monthly, or a staffed contract with cleaners on site.",
    goodFor: ["NGO and UN offices", "Embassies and compounds", "Hotels and guesthouses", "Clinics", "Homes"],
  },
  {
    slug: "waste-collection",
    title: "Waste collection",
    short: "Waste",
    summary: "Scheduled and one-off collection of waste from compounds, offices, businesses and homes.",
    intro:
      "Uncollected waste brings flies, rodents and blocked drains. We collect on an agreed schedule and take waste away from your site.",
    includes: [
      "Scheduled collection from compounds, offices and businesses",
      "One-off clearance of accumulated waste",
      "Bins and collection points set up on your site",
      "Drainage and yard clearing",
    ],
    method: [
      "We agree the collection days and the amount of waste with you",
      "Waste is loaded and covered before it leaves your site",
      "We tell you where your waste is taken",
    ],
    safety: [
      "Tell us in advance about medical, chemical or other hazardous waste: it must be handled separately",
      "Our collectors wear gloves, boots and protective clothing",
    ],
    frequency: "Weekly or several times a week, or a single clearance.",
    goodFor: ["Residential compounds", "Offices", "Restaurants and hotels", "Markets and shops", "Construction sites"],
  },
  {
    slug: "landscaping",
    title: "Landscaping and grounds",
    short: "Landscaping",
    summary: "Garden design, planting and regular grounds maintenance for compounds and homes.",
    intro:
      "Well-kept grounds are cooler, drain better and give pests fewer places to hide. We design, plant and maintain gardens and compound grounds.",
    includes: [
      "Garden design and planting",
      "Lawn laying, mowing and trimming",
      "Cutting back trees and bushes that touch walls and roofs",
      "Planting to hold soil and reduce erosion",
      "Regular grounds maintenance",
    ],
    method: [
      "We visit, measure and agree a simple plan with you",
      "We favour plants that suit Juba's climate and need less water",
      "We agree a maintenance schedule so the work lasts",
    ],
    safety: ["Tools and cuttings are cleared from the site at the end of every visit"],
    frequency: "A one-off project, then weekly or monthly maintenance if you want it.",
    goodFor: ["Embassies and compounds", "Hotels", "Offices", "Homes"],
  },
  {
    slug: "consultancy",
    title: "Environmental and safety consultancy",
    short: "Consultancy",
    summary: "Site assessments and practical advice on waste, hygiene and environmental health.",
    intro:
      "If you manage a site, you may need to show how waste, hygiene and environmental risks are handled. We assess your site and give you a clear written report and plan.",
    includes: [
      "Site hygiene and environmental health assessments",
      "Waste audits: what you produce, where it goes, and how to reduce it",
      "Written procedures for cleaning, waste and pest control",
      "Training for your own cleaning and facilities staff",
    ],
    method: [
      "We agree the questions you need answered before we visit",
      "We inspect the site and speak to the people who run it",
      "You receive a written report with findings and practical next steps",
    ],
    safety: ["Findings are confidential to you"],
    frequency: "A single assessment, with follow-up visits if you want progress checked.",
    goodFor: ["NGOs and UN agencies", "Companies with large sites", "Hotels", "Clinics and schools"],
  },
];

export const serviceBySlug = (slug: string | undefined): Service | undefined =>
  services.find((s) => s.slug === slug);

export const serviceTitle = (slug: ServiceSlug): string => serviceBySlug(slug)?.title ?? slug;
