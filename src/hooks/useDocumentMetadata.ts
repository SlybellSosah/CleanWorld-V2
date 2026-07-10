import { useEffect } from "react";
import { ActiveView } from "../types";

export function useDocumentMetadata(activeView: ActiveView) {
  useEffect(() => {
    let title = "Clean World Inc.";
    let description = "Clean World Inc. is South Sudan’s leading environmental consultancy and facility management partner.";
    let robots = "index, follow";
    let schemaData: any = null;
    const logoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuC8fFJemvF3DwJM9jvAhXJxgDNCEvkdoL_jM3vqHykN6uW-sD3OsnOrhZ1F7fOMukiMLKC4FjZD5WSf7bQ5cvagWxmpGR9E8eauBD3AxH926AkX0NnZ3y-MdIcFZW1_RF6VR8qSGGiMpx4kD1aekulsY1UN0BABgYYW3Hxe65vO8vZavPZixF7azOOXbjkZodQp1TLXJ1Y-sJR7Wh7jQr7f5Aw5KuGtk0488xjUMmOiHC3WG4E721HP9zM6vrmRHI5Z81acGH-WBLE";

    switch (activeView) {
      case ActiveView.Home:
        title = "Clean World Inc. | Clean . Green . Sustainable.";
        description = "Clean World Inc. is South Sudan’s leading environmental consultancy and facility management partner based in Juba. Bridging the gap between sterile hygiene and active ecological restoration.";
        robots = "index, follow";
        schemaData = {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Clean World Inc.",
          "image": logoUrl,
          "@id": "https://www.cleanworld.live/#localbusiness",
          "url": "https://www.cleanworld.live",
          "telephone": "+211 924 444 044",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Hai Kuwait, Juba",
            "addressLocality": "Juba",
            "addressRegion": "Central Equatoria",
            "addressCountry": "SS"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 4.85610,
            "longitude": 31.58100
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ],
            "opens": "00:00",
            "closes": "23:59"
          },
          "sameAs": [
            "https://facebook.com/cleanworld",
            "https://instagram.com/cleanworld",
            "https://tiktok.com/@cleanworld"
          ]
        };
        break;

      case ActiveView.Consultancy:
        title = "Environmental Consultancy & HSE Audits | Clean World Inc.";
        description = "Regulatory environmental audits, EIA certifications, ESG compliance mapping, and waste stream optimization for industrial and governmental facilities in Juba, South Sudan.";
        robots = "index, follow";
        schemaData = {
          "@context": "https://schema.org",
          "@type": "GovernmentService",
          "name": "Environmental Consultancy & HSE Audit Scoping",
          "serviceOperator": {
            "@type": "LocalBusiness",
            "name": "Clean World Inc.",
            "image": logoUrl,
            "telephone": "+211 924 444 044",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Hai Kuwait, Juba",
              "addressLocality": "Juba",
              "addressRegion": "Central Equatoria",
              "addressCountry": "SS"
            }
          },
          "serviceType": "Environmental Consultancy",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Clean World Inc."
          },
          "areaServed": {
            "@type": "AdministrativeArea",
            "name": "South Sudan"
          }
        };
        break;

      case ActiveView.Services:
        title = "Services | Clean World Inc.";
        description = "Explore our integrated professional facility ecology services in Juba, including environmental consultancy, facility management, vector-safe fumigation, and botanical landscaping.";
        robots = "index, follow";
        break;

      case ActiveView.Shop:
        title = "Eco-Shop | Clean World Inc.";
        description = "Sustainably manufactured HSE-compliant cleaning supplies, organic disinfectants, and eco-certified safety equipment in Juba, South Sudan.";
        robots = "index, follow";
        schemaData = {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "item": {
                "@type": "Product",
                "name": "Bio-Clean Pro-X",
                "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDm8aWmUCTIgiKoxLCINbvsdFJE8cGiBHvrBLEcttEuPOrfKFvgZB6D3LqQMtGOEqO0e0oNHdhYSltYB4r8WxFvUQVjYmhVIW5Z701Qn7FJD0RkvceVqu-x8m5II63nhZTBC7sG3_A-VQR6vcbZ0id9jxad8mgvftvk-CN8MadFdZdWjDsuIjfPKTWvNhBPVfe3cnE0P8nY4yGfHqaLihddkkL2w58SMY2r8QYKdOXMjToONkdh926tOfjx3YUnC894yYfXm-6GZ5s",
                "description": "Industrial strength bio-enzymatic cleaner. Concentrated organic formulation for heavy-duty facility sanitization. Leaving zero environmental runoff.",
                "offers": {
                  "@type": "Offer",
                  "price": "45.00",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock"
                }
              }
            },
            {
              "@type": "ListItem",
              "position": 2,
              "item": {
                "@type": "Product",
                "name": "Verde Surface Mist",
                "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCLBElue0ml3DxSAaDWuYMCAPR5t58MKJfqVWyMdDlckvMr7CFWmOdC6iCsjHWqWAjVTbR21faxE8CW0oRL1AwtcH9oN4ZE_DIQJn77k3UcQGcxxW03CO9GgXQzh8RdGwYPmaveLVRFR3MalY6TCSgb6jTa22X2vRV5b0-iNLHuMtvKtxGN-CDNg6mbl6J2AU-VaVs6dSBRR-R4UJkdtv0we1bz4D6--mWvIgTJkC03zqoMdks6D4XMBPCkfSSRs4V_fMYbH20W5hM",
                "description": "Plant-based broad spectrum surface spray. Fast drying, active botanical compounds neutralize pathogens without toxic residues.",
                "offers": {
                  "@type": "Offer",
                  "price": "18.50",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock"
                }
              }
            },
            {
              "@type": "ListItem",
              "position": 3,
              "item": {
                "@type": "Product",
                "name": "PureAir Bio-Mist",
                "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAHCmJQ95UJmVyUDPQdn6LDkQCfKp4E9YFLbWkKMJxWwmLL0SkQdEHmIomZ62Umd80u0LSpia61FiJjTtWuBQnO07Pa5AeoXqXmTHW0-vqdFQ4bhe8d6QuOYFCi05_r8JWuE9js3bPg_XUwDjNweE9VI9B76ht-G6OJp6-FKugMQ5x3QZEaOtCa2bW9Zv3K42nQCLBlP1Y7NBhWlkLmFdBqTSTKw8yxvH39uOpjIznUGQJX6wajO7uuJfGGTyA3OzdvnN8rRJwTiw4",
                "description": "Organic air purification formula designed for thermal and ULV fogging systems. Deodorizes and cleanses ambient airspace safely.",
                "offers": {
                  "@type": "Offer",
                  "price": "29.00",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock"
                }
              }
            },
            {
              "@type": "ListItem",
              "position": 4,
              "item": {
                "@type": "Product",
                "name": "Eco-Armor Gear Set",
                "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDHgHaRv_CvDPgVoguGAaTzXZtOxtcQRFjAeEC3Fwb2LYe3E-7hrlYYmt3RJLsnalQqSXCpIDX0rtyXunQlPZYkwzfwoiV3fuDIwYuA3KuhcU2MoZncRRmyUYDgOp-v48Hn-mXzl_vQPqmiy8D5tVbi_jP0fq7ngYMWx076_Y7KoHkfNIZoihpaH3Pe2HdMUHuicUoaTXQHITJMBtJErm_izdfxtL0OerIB2SmwoUUo1BdJNEZ2DY2TP0iGNxXsNlJaCnxkFk5xGfE",
                "description": "Heavy-duty recycled rubber safety gloves, particulate mask, and high-visibility impact-certified safety goggles for standard HSE operations.",
                "offers": {
                  "@type": "Offer",
                  "price": "65.00",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock"
                }
              }
            }
          ]
        };
        break;

      case ActiveView.QuoteFlow:
        title = "Get a Service Quote | Clean World Inc.";
        description = "Request an instant service quote and site assessment for your facility in Juba. Interactive coordinate pinning and real-time scoping estimates.";
        robots = "index, follow";
        break;


      case ActiveView.ClientDashboard:
        title = "Client Dashboard | Clean World Inc.";
        description = "Manage active facility schedules, coordinate pinning, and live dispatch tracking.";
        robots = "noindex, nofollow";
        break;

      case ActiveView.CleanerPortal:
        title = "Cleaner Portal | Clean World Inc.";
        description = "Cleaner operational dashboard with GPS guidance, task checklist, and visual proof of completion.";
        robots = "noindex, nofollow";
        break;

      default:
        break;
    }

    // Set Title
    document.title = title;

    // Set Meta Description
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement("meta");
      descMeta.setAttribute("name", "description");
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute("content", description);

    // Set Meta Robots
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute("content", robots);

    // Set OpenGraph Title
    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (!ogTitleMeta) {
      ogTitleMeta = document.createElement("meta");
      ogTitleMeta.setAttribute("property", "og:title");
      document.head.appendChild(ogTitleMeta);
    }
    ogTitleMeta.setAttribute("content", title);

    // Set OpenGraph Description
    let ogDescMeta = document.querySelector('meta[property="og:description"]');
    if (!ogDescMeta) {
      ogDescMeta = document.createElement("meta");
      ogDescMeta.setAttribute("property", "og:description");
      document.head.appendChild(ogDescMeta);
    }
    ogDescMeta.setAttribute("content", description);

    // Set OpenGraph Image
    let ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (!ogImageMeta) {
      ogImageMeta = document.createElement("meta");
      ogImageMeta.setAttribute("property", "og:image");
      document.head.appendChild(ogImageMeta);
    }
    ogImageMeta.setAttribute("content", logoUrl);

    // Set OpenGraph URL
    let ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (!ogUrlMeta) {
      ogUrlMeta = document.createElement("meta");
      ogUrlMeta.setAttribute("property", "og:url");
      document.head.appendChild(ogUrlMeta);
    }
    ogUrlMeta.setAttribute("content", `https://www.cleanworld.live/${activeView}`);

    // Set OpenGraph Type
    let ogTypeMeta = document.querySelector('meta[property="og:type"]');
    if (!ogTypeMeta) {
      ogTypeMeta = document.createElement("meta");
      ogTypeMeta.setAttribute("property", "og:type");
      document.head.appendChild(ogTypeMeta);
    }
    ogTypeMeta.setAttribute("content", "website");

    // Dynamic JSON-LD Schema
    const existingScript = document.getElementById("clean-world-jsonld-schema");
    if (existingScript) {
      existingScript.remove();
    }

    if (schemaData) {
      const script = document.createElement("script");
      script.id = "clean-world-jsonld-schema";
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify(schemaData);
      document.head.appendChild(script);
    }

    return () => {
      const scriptToClean = document.getElementById("clean-world-jsonld-schema");
      if (scriptToClean) {
        scriptToClean.remove();
      }
    };
  }, [activeView]);
}
