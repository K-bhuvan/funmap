# AskMaps (funmap)

Map-native, browse-first local discovery MVP — **mobile-first native** shipping target: Android + iOS (**not** hybrid WebView shells).

Browse like Netflix. Tap once. Open in Google Maps or Apple Maps.

---

## Product & engineering direction

- **[PRD.md](PRD.md)** — native mobile-first scope, dual platform, no hybrid UI as the shipped product.
- **[first_principles_mobile_app.md](first_principles_mobile_app.md)** — performance, state, offline, security, and release quality bar.
- **[aesthetic.md](aesthetic.md)** — visual design principles: smooth, elegant, minimal, premium.

---

## Repo layout

| Directory | Purpose |
|-----------|---------|
| **`backend/`** | Express API: recommendations, geocoding (postal→coords via Nominatim), interactions, security middleware (helmet, CORS, rate-limit). |
| **`android/`** | **Native** Kotlin + Jetpack Compose app — build in Android Studio. |
| **`ios/`** | **Native** Swift + SwiftUI app — run XcodeGen on a Mac, build in Xcode. |
| **`frontend/`** | **Non-shipping** web prototype to iterate on UX and API shape. |

---

## Core features (web prototype)

- **Onboarding** — pick activities + time/drive preferences (2-step wizard)
- **Location** — GPS (ideal) or ZIP/postal code (minimum) → gated feed
- **Browse** — Netflix-style horizontal rows, each row scoped to an activity/context
- **Maps handoff** — any place card can open directions in **Google Maps** or **Apple Maps**
- **Wishlist** — heart a place to save it; view/remove from the Wishlist tab
- **Bottom nav** — Home | Wishlist

---

## Run the prototype locally

**Prerequisites:** Node 20+, npm.

```bash
# Terminal 1 — backend (port 8080)
cd backend
npm install
npm run dev

# Terminal 2 — frontend (port 3000, proxies /v1 and /health to backend)
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000/** in your browser.

**Test on a real phone (same Wi-Fi):**
```bash
cd frontend && npm run dev:lan
```

---

## Build

```bash
# Backend
cd backend && npm run build   # tsc → dist/

# Frontend
cd frontend && npm run build  # tsc + vite → dist/
```

---

## Environment (backend)

Copy `.env.example` to `.env` and set:

| Variable | Default | Notes |
|----------|---------|-------|
| `PORT` | `8080` | Listening port |
| `CORS_ORIGIN` | `http://localhost:3000` (dev) | Comma-separated allowed origins |
| `NOMINATIM_USER_AGENT` | `AskMaps/0.1 (dev)` | Required for production geocoding per OSM policy |
| `TRUST_PROXY` | — | Set to `1` behind a reverse proxy |

---

## Android

See **[android/README.md](android/README.md)** for Android Studio setup.
Copy `android/local.properties.example` → `android/local.properties` and set `ASKMAPS_BACKEND_URL`.

## iOS

See **[ios/README.md](ios/README.md)** for XcodeGen + Xcode setup (Mac required).
