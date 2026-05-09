# Baby Step 5 - Frontend Scaffold and Map Baseline

## Goal

Create a minimal React + TypeScript web frontend with a live interactive map and a backend health indicator.

## What was implemented

- Created `frontend/` Vite project with React and TypeScript.
- Added `vite.config.ts` with a dev-proxy so `/health` and `/v1` are forwarded to the backend — no CORS setup needed.
- Added `src/main.tsx` as the React entry point, importing Leaflet's CSS globally.
- Added `App.tsx` with a fixed shell: narrow header + full-screen map.
- Added `MapView.tsx` using React-Leaflet with OpenStreetMap tiles (no API key required at this stage).
- Added `HealthStatus.tsx` which calls `GET /health` on mount and shows a green/amber/red badge in the header.
- Added `src/custom.d.ts` to declare `*.module.css` types for TypeScript.

## Files added in this step

- `frontend/package.json`
- `frontend/tsconfig.json`
- `frontend/vite.config.ts`
- `frontend/index.html`
- `frontend/src/main.tsx`
- `frontend/src/index.css`
- `frontend/src/custom.d.ts`
- `frontend/src/App.tsx`
- `frontend/src/App.module.css`
- `frontend/src/components/MapView.tsx`
- `frontend/src/components/HealthStatus.tsx`
- `frontend/src/components/HealthStatus.module.css`

## Proxy configuration explained

`vite.config.ts` proxies `/health` and `/v1` to `http://localhost:8080` during development. This means the browser treats both the frontend and the API as the same origin, avoiding cross-origin request errors without needing CORS headers on the backend.

## Map library choice

React-Leaflet with OpenStreetMap tiles is used here because it requires no API key. Google Maps Platform will be integrated in a later step once the full product flow is validated.

## How to run and verify

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Open `http://localhost:3000`. You should see a full-screen map of Bangalore and a **backend connected** badge in the header.

## Why this step matters

This establishes the visual shell the entire product will be built on. Every subsequent step adds components or data flow on top of this layout.
