import { Product, ServicePillar, JubaLocation } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Bio-Clean Pro-X",
    price: 45.00,
    unit: "5-Liter Canister",
    description: "Bio-enzymatic cleaner for heavy-duty facility sanitization. Zero runoff.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDm8aWmUCTIgiKoxLCINbvsdFJE8cGiBHvrBLEcttEuPOrfKFvgZB6D3LqQMtGOEqO0e0oNHdhYSltYB4r8WxFvUQVjYmhVIW5Z701Qn7FJD0RkvceVqu-x8m5II63nhZTBC7sG3_A-VQR6vcbZ0id9jxad8mgvftvk-CN8MadFdZdWjDsuIjfPKTWvNhBPVfe3cnE0P8nY4yGfHqaLihddkkL2w58SMY2r8QYKdOXMjToONkdh926tOfjx3YUnC894yYfXm-6GZ5s",
    category: "Sanitizers",
    ingredients: ["Active Bio-enzymes", "Citrus-derived Surfactants", "Purified Water", "Eucalyptus Essential Oil"],
    usageGuide: ["Dilute 100ml per 5 Liters of warm water for general surfaces.", "Apply directly for heavy grease stains and let sit for 5 minutes.", "Scrub lightly and wipe clean with a microfiber cloth."],
    hazards: "Mild eye irritant. In case of contact, rinse eyes thoroughly with water for 15 minutes. Keep out of reach of children.",
    hseCertifications: ["ISO 14001:2015 Compliant", "Juba EPA Approved", "Green Seal Certified (GS-37)"],
    ecoMetrics: {
      carbonSaved: "45% reduction in carbon footprint",
      biodegradable: "99.8% biodegradable within 14 days",
      waterSaved: "15 Liters of water saved per canister via low-foam formula"
    }
  },
  {
    id: "prod-2",
    name: "Verde Surface Mist",
    price: 18.50,
    unit: "500ml Spray Bottle",
    description: "Botanical surface spray. Neutralizes pathogens with zero toxic residues.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLBElue0ml3DxSAaDWuYMCAPR5t58MKJfqVWyMdDlckvMr7CFWmOdC6iCsjHWqWAjVTbR21faxE8CW0oRL1AwtcH9oN4ZE_DIQJn77k3UcQGcxxW03CO9GgXQzh8RdGwYPmaveLVRFR3MalY6TCSgb6jTa22X2vRV5b0-iNLHuMtvKtxGN-CDNg6mbl6J2AU-VaVs6dSBRR-R4UJkdtv0we1bz4D6--mWvIgTJkC03zqoMdks6D4XMBPCkfSSRs4V_fMYbH20W5hM",
    category: "Sanitizers",
    ingredients: ["Thyme Extract (Thymol 0.05%)", "Plant-based Alcohol", "Decyl Glucoside", "Lemongrass Extract"],
    usageGuide: ["Spray evenly onto hard, non-porous surfaces from a distance of 15-20cm.", "Allow surface to remain wet for 30 seconds for standard sanitization.", "Wipe clean or allow to air dry. No rinsing required."],
    hazards: "Flammable liquid. Keep away from open flames and hot surfaces. Avoid direct contact with eyes.",
    hseCertifications: ["EcoLogo certified (UL 2794)", "HSE Safe to Spray Standard", "EPA Safer Choice Recognized"],
    ecoMetrics: {
      carbonSaved: "32% carbon offset via local sourcing",
      biodegradable: "100.0% biodegradable within 7 days",
      waterSaved: "Ready-to-use formulation requires zero added water"
    }
  },
  {
    id: "prod-3",
    name: "PureAir Bio-Mist",
    price: 29.00,
    unit: "1-Liter Mist Fluid",
    description: "Fogging fluid for safe airspace sanitization and deodorizing.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHCmJQ95UJmVyUDPQdn6LDkQCfKp4E9YFLbWkKMJxWwmLL0SkQdEHmIomZ62Umd80u0LSpia61FiJjTtWuBQnO07Pa5AeoXqXmTHW0-vqdFQ4bhe8d6QuOYFCi05_r8JWuE9js3bPg_XUwDjNweE9VI9B76ht-G6OJp6-FKugMQ5x3QZEaOtCa2bW9Zv3K42nQCLBlP1Y7NBhWlkLmFdBqTSTKw8yxvH39uOpjIznUGQJX6wajO7uuJfGGTyA3OzdvnN8rRJwTiw4",
    category: "Aerosols",
    ingredients: ["Tea Tree Oil Extract", "Soya-based Deodorizers", "Vegetable Glycerin", "Purified Water"],
    usageGuide: ["Pour directly into ULV cold foggers or thermal fogging devices.", "Ensure the room is vacant of humans and pets during active fogging.", "Ventilate the room for 15 minutes before re-entering."],
    hazards: "Do not breathe mist directly. Irritating to respiratory system in concentrated fog form. Wear a particulate mask when applying.",
    hseCertifications: ["OSHA Respiratory Safety Compliant", "UN WHO Vector Guidelines Approved"],
    ecoMetrics: {
      carbonSaved: "50% lower VOC emissions than synthetic aerosols",
      biodegradable: "98.5% biodegradable within 10 days",
      waterSaved: "Saves water by sanitizing hard-to-reach areas dry"
    }
  },
  {
    id: "prod-4",
    name: "Eco-Armor Gear Set",
    price: 65.00,
    unit: "Full Protective Pack",
    description: "HSE gear pack: recycled rubber gloves, N95 mask, and safety goggles.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHgHaRv_CvDPgVoguGAaTzXZtOxtcQRFjAeEC3Fwb2LYe3E-7hrlYYmt3RJLsnalQqSXCpIDX0rtyXunQlPZYkwzfwoiV3fuDIwYuA3KuhcU2MoZncRRmyUYDgOp-v48Hn-mXzl_vQPqmiy8D5tVbi_jP0fq7ngYMWx076_Y7KoHkfNIZoihpaH3Pe2HdMUHuicUoaTXQHITJMBtJErm_izdfxtL0OerIB2SmwoUUo1BdJNEZ2DY2TP0iGNxXsNlJaCnxkFk5xGfE",
    category: "Equipment",
    ingredients: ["85% Recycled Natural Rubber (Gloves)", "Polycarbonate Impact Shield (Goggles)", "Non-woven Cotton & Meltblown Fiber (Mask)"],
    usageGuide: ["Inspect gloves for punctures or tearing prior to handling any chemicals.", "Adjust mask straps to ensure a tight facial seal around nose and mouth.", "Clean goggles after each use with a dry cloth and store in a cool dry place."],
    hazards: "Latex hazard. Gloves contain natural rubber latex which may cause allergic reactions in sensitive individuals.",
    hseCertifications: ["EN 166:2001 (Impact Protection)", "EN 374 (Chemical Glove Standard)", "NIOSH N95 Equivalent Filtration"],
    ecoMetrics: {
      carbonSaved: "60% carbon reduction by utilizing recycled rubbers",
      biodegradable: "Reusable gear reduces single-use plastic waste by 80%",
      waterSaved: "Manufactured using closed-loop zero-waste water recycling"
    }
  },
  {
    id: "prod-5",
    name: "Terra-Nourish Organic Booster",
    price: 32.00,
    unit: "5-Liter Canister",
    description: "Liquid organic booster. Restores nutrients and root health.",
    image: "/terra_nourish.png",
    category: "Nutrition",
    ingredients: ["Fermented Compost Leachate", "Kelps & Marine Algae Extracts", "Humic & Fulvic Acids", "Molasses Stabilizer"],
    usageGuide: ["Mix 50ml of booster per 10 Liters of water in a watering can.", "Apply directly to the base of plants and turf every 2 weeks.", "For agricultural crops, apply early morning or late afternoon."],
    hazards: "Non-hazardous. Mild organic odor. Wash hands with soap and water after handling. Do not ingest.",
    hseCertifications: ["OMRI Listed for Organic Use", "South Sudan Ministry of Agriculture Approved"],
    ecoMetrics: {
      carbonSaved: "70% carbon storage booster in soil systems",
      biodegradable: "100.0% organic soil-enriching bio-nutrients",
      waterSaved: "Improves soil water retention capacity by up to 40%"
    }
  }
];

export interface ServiceDetail {
  id: ServicePillar;
  title: string;
  subtitle: string;
  image: string;
  shortDescription: string;
  bulletPoints: string[];
  equipment: string[];
  timeline: string;
  color: string;
}

export const SERVICES_DETAILS: ServiceDetail[] = [
  {
    id: ServicePillar.Consultancy,
    title: "Environmental Consultancy",
    subtitle: "Technical Audits & ESG Frameworks",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCueMCIIwXziPTmpXtAzQAfem6akCdst69PdqJ8ARlJy3AjAk_9X8OQ4hdvahlz1JKu8jg2HG8p7rXJS21rcA9XXKhnygOSdepw03n4fDGKq1CRJXN8tyR406-b1vcscQZNhuKttaiLypQ7WWhhVFFxJoFlAgz1w1hYsfoIaTDOcxyoU0HtUXMZR7GvtUTjobFHRBFCpYGF-reYhvlm65gnsWpzGL11PpWeBJ796JSIxJipfa17dp3ideQKDZKF_1zSnv57l4LgzNE",
    shortDescription: "Environmental impact assessments, waste stream audits, and regulatory compliance guidance.",
    bulletPoints: [
      "Environmental Impact Assessments (EIA) for industrial developments",
      "Waste stream mapping and optimization protocols for zero-leakage safety",
      "HSE documentation matching South Sudanese regulatory frameworks",
      "Corporate ESG (Environmental, Social, Governance) scoring"
    ],
    equipment: ["Multi-gas Emission Analyzers", "Water Quality Photometers", "Soil Chemistry Lab Kits"],
    timeline: "Initial site audit in 48 hrs; full documentation in 10-15 business days",
    color: "emerald"
  },
  {
    id: ServicePillar.Management,
    title: "Integrated Facility & Cleaning Management",
    subtitle: "Premium Cleaning for Residential & Commercial Clients",
    image: "/south_sudan_female_maid.png",
    shortDescription: "Professional deep cleaning, bio-sanitization, and custom custodial care for residential and commercial spaces.",
    bulletPoints: [
      "Residential Deep Cleaning: Pristine child-safe sanitation using botanical agents",
      "Commercial Facility Cleaning: Custom custodial routines for head offices",
      "Move-In / Move-Out Deep Cleans: Complete high-touch disinfection sweeps",
      "HSE-Trained dedicated team members adhering to strict safety standards"
    ],
    equipment: ["HEPA-filtration vacuums", "Industrial floor scrubbers", "Electrostatic sanitization sprayers", "Eco-safe botanical solutions"],
    timeline: "Custom recurring weekly/monthly plans, or single intensive deep cleans",
    color: "blue"
  },
  {
    id: ServicePillar.Fumigation,
    title: "Fumigation and Pest Control",
    subtitle: "Vector Control & Pathogen Suppression",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4Z2YFQdO4NupFjHu7T3Lskw7v38FyQxLhRak0dCIWWYjoVul5rKty8cU_T6-VgovbyMgwWg8qv1vx6phbyaTXAwE41T_KtxwZjQF73PxvlPfE-guEK8rAP0589UZMvSQ61PyeXrp5HFtntbbDQv-ItQfGOT8BLhPibndnNLP-AIF0oz07nAXOB4xMNJJ7QchPAXVt0VqUck8DV4M_jzqiL-yj9tStKGvGfgV_bFbbqqS34Wd-fwaMd5hKi3ERTx7CJdNBGTUzMV4",
    shortDescription: "Pest control and vector suppression using safe, eco-certified treatments matching international guidelines.",
    bulletPoints: [
      "Malaria and dengue vector containment networks",
      "ULV (Ultra-Low Volume) fogging for airspace treatment",
      "Integrated Pest Management (IPM) with bio-safe agents",
      "Diplomatic compound protective perimeter treatments"
    ],
    equipment: ["ULV Thermal Foggers", "Pneumatic Sprayers", "Eco-safe Larvicides"],
    timeline: "Complete property treatment, typically 4-8 hours with zero toxic residue",
    color: "amber"
  },
  {
    id: ServicePillar.Landscaping,
    title: "Landscaping & Garden Design",
    subtitle: "Eco-Sensitive Greenery & Turf Engineering",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxqmJo08gXhNRay7xWRarxpXxMzT8r6M3FnD9lnLRBlPjBpKgTR_SEpaP3OfP1Au0hoZkpFkPr3BO3hvC8wCxjAAs4I2XfTczNlxuZZgRW7hA6NvF1PcsCWDccCZuKfPeeOdpz6pi2KcZZ3iZ5iajgq7QYPkpSo81dYvUftdnAKETLjYsf-BK5NNmqHyML34Uny3-4F8D9J9Yi0j90AG3t2WDKGXKUhUIlWkcinIMnXA_VsPI3y8i3Bi-6Ha8wBQQzcDVJnq98Pls",
    shortDescription: "Eco-sensitive landscaping and custom botanical designs for private, community, and commercial spaces.",
    bulletPoints: [
      "Residential Gardens: Custom floral displays, turf layouts, and flower beds",
      "Community Grounds: Peaceful grounds using low-water local flora",
      "Soil & Erosion Control: Engineered root grids using native grasses",
      "Corporate & Diplomatic: Immaculate green designs for estate compounds"
    ],
    equipment: ["Zero-emission Lawn Mowers", "Drip Irrigation Systems", "Organic Soil Nutrition Kits"],
    timeline: "Conceptual designs in 5 business days; landscaping layout is project-dependent",
    color: "teal"
  }
];

export const JUBA_LOCATIONS: JubaLocation[] = [
  {
    name: "Tongping",
    lat: 4.8601,
    lng: 31.5910,
    description: "High-density commercial district near Juba International Airport. Fast dispatch response."
  },
  {
    name: "Amarat",
    lat: 4.8550,
    lng: 31.5840,
    description: "Premium diplomatic zone and corporate head offices. Requires strict HSE protocol adherence."
  },
  {
    name: "Kololo",
    lat: 4.8640,
    lng: 31.5790,
    description: "Ministerial structures, administrative hubs, and international agencies."
  },
  {
    name: "Juba 3",
    lat: 4.8380,
    lng: 31.5580,
    description: "Major university campuses, corporate compounds, and secure institutional estates."
  },
  {
    name: "Munuki",
    lat: 4.8720,
    lng: 31.5490,
    description: "Sprawling commercial sector and large high-density mixed enterprise layouts."
  },
  {
    name: "Gudele",
    lat: 4.8450,
    lng: 31.5250,
    description: "Active light-industrial facilities, logistical centers, and development sites."
  },
  {
    name: "Kator",
    lat: 4.8390,
    lng: 31.5940,
    description: "Historic commercial district, high landscaping density, along the White Nile corridor."
  }
];
