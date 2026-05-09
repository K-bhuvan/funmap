import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Proxy API calls to the backend so the browser never hits CORS issues
    proxy: {
      "/health": "http://localhost:8080",
      "/v1": "http://localhost:8080",
    },
  },
});
