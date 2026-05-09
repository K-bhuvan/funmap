# Mobile-first engineering (funmap)

This repo ships native Android and iOS clients backed by a shared API.

## What we ship

- **Primary clients:** native **Android** (Kotlin, Jetpack Compose–oriented) and native **iOS** (Swift, SwiftUI-oriented).
- **Not in the middle:** no hybrid product where the main UI is a WebView, embedded SPA, Capacitor shell, or similar. Thin native UI + OS services (maps, speech, location) + **your** backend.

## What this monorepo is for

| Part | Role |
|------|------|
| **`backend/`** | **Source of truth for contracts:** HTTP APIs, validation, ranking hooks, geocoding, security headers, rate limits. Native apps consume these endpoints only. |
| **`android/`** | **Shipping-native client (Kotlin + Compose):** real app module; extend `network/` and `ui/` — see [android/README.md](../android/README.md). |
| **`ios/`** | **Shipping-native client (Swift + SwiftUI):** XcodeGen project; see [ios/README.md](../ios/README.md). |
| **`frontend/`** | **Non-shipping prototype:** fast iteration on browse/map flows and API shape. Treat it like a sketchpad, not the store app. |

When native apps exist, **business rules should not diverge**—keep them in the backend (or shared modules you explicitly choose), not duplicated in the React prototype.

## Principles mapped to AskMaps

From [first_principles_mobile_app.md](../first_principles_mobile_app.md), priorities for AskMaps:

1. **User intent:** one clear job—“browse, pick, navigate” with minimal steps; permission denial must not brick the flow (postal fallback, clear copy).
2. **Feels instant:** native cold start and transitions; on the server, explicit timeouts and mobile-friendly payloads.
3. **Reliability:** explicit states (loading / success / error / offline); retries and idempotency for any future **writes** (swipes, saves) via request ids.
4. **Trust:** no vague errors; server-enforced auth and validation; no secrets in clients (see [security.md](../security.md)).
5. **Backend APIs:** versioned (`/v1`), predictable errors, small JSON bodies; consider **OpenAPI** for Kotlin/Swift codegen.

## Checklist (abbreviated)

Before calling mobile MVP “done,” revisit section **§28 Uber-Grade Checklist** in `first_principles_mobile_app.md`—especially: shallow navigation, one-hand primary actions, robust maps/location, mobile-friendly APIs, and **location denial not breaking the app**.

## Next engineering steps (native)

1. **Scaffolded:** `android/` and `ios/` minimal apps ping **`GET /health`** — run backend, configure base URL (see each README), then build maps/onboarding/`/v1` parity.
2. **OpenAPI** (or equivalent) generated from or checked against `backend/` routes.
3. Move long-term **profile and interaction persistence** to the backend with idempotent APIs where needed.
