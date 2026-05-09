# funmap

> Discover places worth leaving home for. Scroll, find something you like, and go.

**funmap** is a personal local discovery app that recommends nearby places based on your taste, mood, time, and location. No more typing queries into a search box — just scroll, heart what looks good, and go.

> **Status:** Early MVP — the web prototype is fully functional. Native Android and iOS apps are in scaffold stage.

---

## What it does

- **Personalized feed** — after a quick 2-step onboarding (pick activities you enjoy + time/drive preferences), the home screen shows horizontally scrollable rows of recommended places tailored to you.
- **Location-aware** — works with your device GPS. If you decline location permission, just type your ZIP or postal code instead and the feed loads from there.
- **Maps handoff** — tap **Google Maps** or **Apple Maps** on any place card to get turn-by-turn directions instantly.
- **Wishlist** — heart any place to save it. View and manage saved places from the Wishlist tab.
- **Bottom navigation** — Home and Wishlist tabs, always one tap away.

---

## Project layout

```
funmap/
├── backend/      Node.js + Express API (recommendations, geocoding, security)
├── frontend/     React web prototype (runs in any browser — not the shipping app)
├── android/      Native Android app — Kotlin + Jetpack Compose (build in Android Studio)
└── ios/          Native iOS app — Swift + SwiftUI (build in Xcode on a Mac)
```

The **web prototype** (`frontend/`) is the fastest way to try the product. The **native apps** are the actual shipping targets per the product vision.

---

## Quick start (web prototype)

### Prerequisites

- [Node.js 20+](https://nodejs.org/) and npm
- A terminal (macOS/Linux/WSL recommended; Windows PowerShell also works)

### 1 — Clone the repo

```bash
git clone https://github.com/K-bhuvan/funmap.git
cd funmap
```

### 2 — Start the backend

```bash
cd backend
npm install
npm run dev
```

The API starts on **http://localhost:8080**. You should see:

```
AskMaps backend listening on http://localhost:8080
```

### 3 — Start the frontend (new terminal tab)

```bash
cd frontend
npm install
npm run dev
```

### 4 — Open in browser

Go to **http://localhost:3000**

The frontend automatically proxies API calls to the backend — no CORS setup needed.

### Try it on your phone (same Wi-Fi)

```bash
cd frontend
npm run dev:lan
```

Vite will print a Network URL like `http://192.168.x.x:3000` — open that on your phone.

---

## Backend environment variables

The backend works out of the box for local development with no `.env` file needed. For customisation, copy `.env.example` to `.env`:

```bash
cp backend/.env.example backend/.env
```

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | Port the API listens on |
| `CORS_ORIGIN` | `http://localhost:3000` | Comma-separated allowed browser origins |
| `NOMINATIM_USER_AGENT` | `AskMaps/0.1 (dev)` | User-Agent sent to OpenStreetMap's Nominatim geocoder. Set a real contact email for any non-local use ([OSM policy](https://operations.osmfoundation.org/policies/nominatim/)) |
| `TRUST_PROXY` | _(unset)_ | Set to `1` when running behind a reverse proxy (nginx, Fly.io, etc.) |

---

## Build for production

```bash
# Backend — compiles TypeScript to dist/
cd backend && npm run build && npm start

# Frontend — compiles TypeScript + bundles with Vite into dist/
cd frontend && npm run build
```

---

## Native apps

### Android

See [`android/README.md`](android/README.md) for full setup.

**Summary:**
1. Open the `android/` folder in Android Studio.
2. Copy `android/local.properties.example` → `android/local.properties`.
3. Set `ASKMAPS_BACKEND_URL=http://<your-local-ip>:8080` (use your machine's LAN IP, not `localhost`).
4. Run on an emulator or physical device.

### iOS

See [`ios/README.md`](ios/README.md) for full setup.

**Summary:**
1. Install [XcodeGen](https://github.com/yonaskolb/XcodeGen): `brew install xcodegen`
2. Inside the `ios/` folder, run `xcodegen generate`.
3. Open the generated `.xcodeproj` in Xcode.
4. Build and run on a simulator or device (Mac required).

---

## Tech stack

| Layer | Tech |
|---|---|
| Web prototype | React 18, TypeScript, Vite, react-leaflet (OpenStreetMap) |
| Backend API | Node.js, Express, TypeScript |
| Security | helmet, cors, express-rate-limit |
| Geocoding | OpenStreetMap Nominatim (postal code → lat/lng) |
| Android | Kotlin, Jetpack Compose, Retrofit |
| iOS | Swift, SwiftUI, URLSession |

---

## Disclaimers & acknowledgements

- **Prototype quality:** The web frontend is a prototype for iterating on UX and API shape. It is not intended to be a production web app — the shipping targets are the native Android and iOS clients.
- **Mock data:** Recommendations are currently generated from a curated mock dataset. A real ML/LLM-powered recommendation engine is on the roadmap.
- **Geocoding:** Postal code lookup uses [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/). Please respect the [OSM Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/) — set a proper `NOMINATIM_USER_AGENT` with a contact address before any non-local deployment.
- **Maps handoff:** "Open in Google Maps" and "Open in Apple Maps" launch the respective apps via deep link URLs. This project is not affiliated with, endorsed by, or sponsored by Google or Apple.
- **Map tiles:** Map tiles in the web prototype are © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), licensed under [ODbL](https://opendatacommons.org/licenses/odbl/).
- **No warranty:** This project is provided as-is for personal and educational use. Use in production is at your own risk.

---

## Contributing

This is a personal MVP project. Issues and pull requests are welcome, but please open an issue first to discuss significant changes.

---

## License

MIT — see [LICENSE](LICENSE) if present, otherwise consider the code freely usable for personal and educational purposes.
