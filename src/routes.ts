import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("services", "routes/services.tsx"),
  route("services/:slug", "routes/service.tsx"),
  route("quote", "routes/quote.tsx"),
  route("how-to-pay", "routes/how-to-pay.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("admin", "routes/admin.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
