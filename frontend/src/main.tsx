import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";
import "./index.css";
import App from "./App";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found in index.html");

// Quick sanity check in DevTools: if this never appears, you're not on this dev bundle.
if (import.meta.env.DEV) {
  console.info("[funmap] dev client loaded (vite)");
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
