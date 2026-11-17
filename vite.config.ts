import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: { alias: { "~": "/src" } },
  server: {
    port: Number(process.env.PORT) || 3000,
    host: "0.0.0.0",
    proxy: { "/api": "http://localhost:8787" },
  },
});
