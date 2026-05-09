import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/**
 * WSL / dual-setup notes:
 * - `host: true` — listen on all interfaces so Windows Chrome can reach Vite in WSL reliably.
 * - `strictPort: true` — if :3000 is already taken (e.g. an old dev server on Windows), fail loudly
 *   instead of switching to :3001 (easy to keep staring at an old tab on :3000).
 * - Optional `.env.local`: `VITE_DEV_BACKEND_ORIGIN=http://172.x.x.x:8080` when backend runs on Windows
 *   but `npm run dev` runs inside WSL (`localhost` there is Linux, not Windows). Find Windows IP from WSL:
 *   `grep nameserver /etc/resolv.conf` or `ip route show default`.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendOrigin = env.VITE_DEV_BACKEND_ORIGIN ?? "http://127.0.0.1:8080";

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 3000,
      strictPort: true,
      proxy: {
        "/health": backendOrigin,
        "/v1": backendOrigin,
      },
    },
  };
});
