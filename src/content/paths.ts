import { services } from "./services";

export const staticPaths = ["/", "/services", "/quote", "/how-to-pay", "/privacy"];

/** Public, indexable pages. */
export const publicPaths = [...staticPaths, ...services.map((s) => `/services/${s.slug}`)];

/** Everything pre-rendered to HTML, including the staff page shell. */
export const prerenderPaths = [...publicPaths, "/admin"];
