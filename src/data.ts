import { Product, ServicePillar, JubaLocation } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Bio-Clean Pro-X",
    price: 45.00,
    unit: "5-Liter Canister",
    description: "Industrial strength bio-enzymatic cleaner. Concentrated organic formulation for heavy-duty facility sanitization. Leaving zero environmental runoff.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDm8aWmUCTIgiKoxLCINbvsdFJE8cGiBHvrBLEcttEuPOrfKFvgZB6D3LqQMtGOEqO0e0oNHdhYSltYB4r8WxFvUQVjYmhVIW5Z701Qn7FJD0RkvceVqu-x8m5II63nhZTBC7sG3_A-VQR6vcbZ0id9jxad8mgvftvk-CN8MadFdZdWjDsuIjfPKTWvNhBPVfe3cnE0P8nY4yGfHqaLihddkkL2w58SMY2r8QYKdOXMjToONkdh926tOfjx3YUnC894yYfXm-6GZ5s",
    category: "Sanitizers"
  },
  {
    id: "prod-2",
    name: "Verde Surface Mist",
    price: 18.50,
    unit: "500ml Spray Bottle",
    description: "Plant-based broad spectrum surface spray. Fast drying, active botanical compounds neutralize pathogens without toxic residues.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLBElue0ml3DxSAaDWuYMCAPR5t58MKJfqVWyMdDlckvMr7CFWmOdC6iCsjHWqWAjVTbR21faxE8CW0oRL1AwtcH9oN4ZE_DIQJn77k3UcQGcxxW03CO9GgXQzh8RdGwYPmaveLVRFR3MalY6TCSgb6jTa22X2vRV5b0-iNLHuMtvKtxGN-CDNg6mbl6J2AU-VaVs6dSBRR-R4UJkdtv0we1bz4D6--mWvIgTJkC03zqoMdks6D4XMBPCkfSSRs4V_fMYbH20W5hM",
    category: "Sanitizers"
  },
  {
    id: "prod-3",
    name: "PureAir Bio-Mist",
    price: 29.00,
    unit: "1-Liter Mist Fluid",
    description: "Organic air purification formula designed for thermal and ULV fogging systems. Deodorizes and cleanses ambient airspace safely.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHCmJQ95UJmVyUDPQdn6LDkQCfKp4E9YFLbWkKMJxWwmLL0SkQdEHmIomZ62Umd80u0LSpia61FiJjTtWuBQnO07Pa5AeoXqXmTHW0-vqdFQ4bhe8d6QuOYFCi05_r8JWuE9js3bPg_XUwDjNweE9VI9B76ht-G6OJp6-FKugMQ5x3QZEaOtCa2bW9Zv3K42nQCLBlP1Y7NBhWlkLmFdBqTSTKw8yxvH39uOpjIznUGQJX6wajO7uuJfGGTyA3OzdvnN8rRJwTiw4",
    category: "Aerosols"
  },
  {
    id: "prod-4",
    name: "Eco-Armor Gear Set",
    price: 65.00,
    unit: "Full Protective Pack",
    description: "Heavy-duty recycled rubber safety gloves, particulate mask, and high-visibility impact-certified safety goggles for standard HSE operations.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHgHaRv_CvDPgVoguGAaTzXZtOxtcQRFjAeEC3Fwb2LYe3E-7hrlYYmt3RJLsnalQqSXCpIDX0rtyXunQlPZYkwzfwoiV3fuDIwYuA3KuhcU2MoZncRRmyUYDgOp-v48Hn-mXzl_vQPqmiy8D5tVbi_jP0fq7ngYMWx076_Y7KoHkfNIZoihpaH3Pe2HdMUHuicUoaTXQHITJMBtJErm_izdfxtL0OerIB2SmwoUUo1BdJNEZ2DY2TP0iGNxXsNlJaCnxkFk5xGfE",
    category: "Equipment"
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
    subtitle: "High-Stakes Technical Audits & ESG Frameworks",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCueMCIIwXziPTmpXtAzQAfem6akCdst69PdqJ8ARlJy3AjAk_9X8OQ4hdvahlz1JKu8jg2HG8p7rXJS21rcA9XXKhnygOSdepw03n4fDGKq1CRJXN8tyR406-b1vcscQZNhuKttaiLypQ7WWhhVFFxJoFlAgz1w1hYsfoIaTDOcxyoU0HtUXMZR7GvtUTjobFHRBFCpYGF-reYhvlm65gnsWpzGL11PpWeBJ796JSIxJipfa17dp3ideQKDZKF_1zSnv57l4LgzNE",
    shortDescription: "Professional environmental impact assessments, strategic waste management audits, and comprehensive regulatory compliance solutions designed to guide organizations toward sustainable, eco-friendly excellence.",
    bulletPoints: [
      "Rigorous Environmental Impact Assessments (EIA) for industrial developments",
      "Full waste stream mapping and optimization protocols for zero-leakage compliance",
      "Official HSE documentation drafting matching South Sudanese regulatory frameworks",
      "Corporate ESG (Environmental, Social, and Governance) compliance scoring"
    ],
    equipment: ["Multi-gas Emission Analyzers", "Water Quality Photometers", "Soil Chemistry Lab Kits"],
    timeline: "Initial site audit in 48 hrs; full documentation in 10-15 business days",
    color: "emerald"
  },
  {
    id: ServicePillar.Management,
    title: "Integrated Facility & Cleaning Management",
    subtitle: "Premium Cleaning for Residential & Commercial Clients",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&h=600&q=80",
    shortDescription: "Our core business is professional, top-tier deep cleaning, bio-sanitization, and custom custodial services designed for both residential homes and commercial office facilities.",
    bulletPoints: [
      "Residential Deep Cleaning: Pristine sanitization for homes, estates, and apartments using pet- & child-safe eco-enzymatic products",
      "Commercial Facility Cleaning: Custom routine care and heavy-duty custodial schedules to maintain spotless office productivity",
      "Move-In / Move-Out Deep Cleans: Complete deep sweep, high-touch sanitization, and eco-certified disinfection",
      "HSE-Trained Dedicated Personnel: Professional, background-checked cleaning specialists adhering to premium safety and hygiene standards"
    ],
    equipment: ["HEPA-filtration vacuums", "Industrial floor scrubbers", "Electrostatic sanitization sprayers", "Eco-safe botanical solutions"],
    timeline: "Custom recurring weekly/monthly plans, or immediate single intensive cleaning setups",
    color: "blue"
  },
  {
    id: ServicePillar.Fumigation,
    title: "Professional Fumigation",
    subtitle: "Vector Control & Standard Pathogen Suppression",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4Z2YFQdO4NupFjHu7T3Lskw7v38FyQxLhRak0dCIWWYjoVul5rKty8cU_T6-VgovbyMgwWg8qv1vx6phbyaTXAwE41T_KtxwZjQF73PxvlPfE-guEK8rAP0589UZMvSQ61PyeXrp5HFtntbbDQv-ItQfGOT8BLhPibndnNLP-AIF0oz07nAXOB4xMNJJ7QchPAXVt0VqUck8DV4M_jzqiL-yj9tStKGvGfgV_bFbbqqS34Wd-fwaMd5hKi3ERTx7CJdNBGTUzMV4",
    shortDescription: "Professional pest control and vector-borne pathogen suppression, utilizing child-safe, eco-certified treatments that strictly comply with international HSE safety standards.",
    bulletPoints: [
      "High-efficacy vector control focusing on malaria and dengue transmission networks",
      "ULV (Ultra-Low Volume) cold fogging for comprehensive airborne vector containment",
      "Integrated Pest Management (IPM) using zero-residue, eco-certified materials",
      "Diplomatic compound protective perimeter treatments"
    ],
    equipment: ["ULV Thermal Foggers", "Pneumatic Sprayers", "Eco-safe Larvicides"],
    timeline: "Complete property containment, typically 4-8 hours with zero toxic re-entry delays",
    color: "amber"
  },
  {
    id: ServicePillar.Landscaping,
    title: "Landscaping & Botanical Design",
    subtitle: "Eco-Sensitive Custom Greenery & Turf Engineering",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxqmJo08gXhNRay7xWRarxpXxMzT8r6M3FnD9lnLRBlPjBpKgTR_SEpaP3OfP1Au0hoZkpFkPr3BO3hvC8wCxjAAs4I2XfTczNlxuZZgRW7hA6NvF1PcsCWDccCZuKfPeeOdpz6pi2KcZZ3iZ5iajgq7QYPkpSo81dYvUftdnAKETLjYsf-BK5NNmqHyML34Uny3-4F8D9J9Yi0j90AG3t2WDKGXKUhUIlWkcinIMnXA_VsPI3y8i3Bi-6Ha8wBQQzcDVJnq98Pls",
    shortDescription: "Ecology-sensitive landscaping, turf management, and botanical design custom-tailored for private homes, churches, community facilities, corporate campuses, and diplomatic missions.",
    bulletPoints: [
      "Residential & Private Gardens: Beautiful customized botanical designs, flower beds, and turf layouts tailored for home estates",
      "Church & Community Grounds: Peaceful prayer gardens, community lawns, and serene public green spaces using local low-water flora",
      "Erosion-prevention landscaping grids utilizing native grasses and terracing",
      "Corporate gardens & diplomatic green belts maintaining immaculate high-profile layouts"
    ],
    equipment: ["Zero-emission Lawn Tractors", "Drip Irrigation Regulators", "Organic Soil Nutrition Kits"],
    timeline: "Conceptual designs in 5 business days; physical landscaping is project-dependent",
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
