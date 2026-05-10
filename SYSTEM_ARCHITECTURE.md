# FunMap — System Architecture

## 1) Scope And Status

This document is split into:

1. **Implemented architecture (current state)**
2. **Future architecture roadmap (planned state)**

The goal is to keep architecture honest: what exists today is documented as implemented, and everything else is explicitly marked as planned.

---

## 2) Implemented Architecture (Current State)

## 2.1 Runtime shape

Current runtime is a simple two-service local setup:

```text
[Frontend: React + Vite]  http://localhost:3000
            |
            | proxied /health and /v1
            v
[Backend: Node + Express] http://localhost:8080
```

Frontend and backend are independently runnable, with Vite proxying API requests to avoid CORS issues in local development.

## 2.2 Frontend architecture

Implemented modules:

- **Onboarding/Profile bootstrap** (profile collected and stored locally)
- **Browse feed** (horizontal recommendation rails)
- **Place cards** (drive action, details action, wishlist heart)
- **Map overlay** (leaflet map with recommendation pins)
- **Bottom navigation** (Home, Wishlist, Profile)
- **ZIP fallback input** (when geolocation is unavailable)
- **Place details sheet** (photos + metadata)

State characteristics:

- Profile and ZIP fallback location are stored in browser `localStorage`
- Wishlist is managed in frontend state
- Recommendation rows are fetched from backend

## 2.3 Backend architecture

Single Express app with modular folders for routes, validation, middleware, types, and services.

Implemented endpoints:

- `GET /health`
- `POST /v1/recommendations/query`
- `POST /v1/interactions/swipe`

Behavior:

- Recommendation responses are generated from mock data
- Swipe endpoint validates payload and acknowledges interaction
- No persistent DB writes yet

## 2.4 Integrations currently in use

- **Map tiles:** OpenStreetMap tiles via Leaflet
- **ZIP lookup:** `zippopotam.us` (frontend-side fallback flow)
- **Navigation handoff:** Google Maps direction URL launch

## 2.5 Data and persistence (current)

- No PostgreSQL/Redis in active runtime
- No backend profile persistence yet
- No backend wishlist persistence yet
- Primary persistence is browser local storage for profile/zip

---

## 3) Current Constraints

1. Recommendation quality is mock-backed (not live Places/Routes data)
2. Distances/ratings/photos are not sourced from a live provider yet
3. User persona/profile lives client-side only
4. No server-side auth/session model yet
5. No production-grade observability stack wired yet

---

## 4) Future Architecture Roadmap (Planned)

## 4.1 Provider-backed recommendations

Planned:

- Introduce a provider adapter layer for:
  - place candidate search
  - place details (ratings/photos)
  - travel distance/ETA
- Start with Google Maps Platform integration
- Keep adapter boundary so provider can be swapped later

## 4.2 Backend persistence

Planned:

- Persist profile/persona on backend (`GET/PUT /v1/profile`)
- Persist wishlist and interaction history
- Add PostgreSQL as source of truth
- Add Redis for short-lived caching and rate-sensitive paths

## 4.3 Recommendation engine evolution

Planned:

- Move from static mock rows to deterministic ranking pipeline
- Add candidate filtering + scoring + diversity balancing
- Keep ranking primarily server-side for cross-client consistency

## 4.4 Security and reliability hardening

Planned:

- stricter input/rate controls
- secret management and environment hardening
- request timeouts/retries/circuit patterns for provider calls

## 4.5 Observability and deployment

Planned:

- metrics/logging dashboards for latency, failures, and usage
- environment strategy (`dev`, `staging`, `prod`)
- containerized backend deployment

## 4.6 Multi-client expansion

Planned:

- Maintain channel-neutral backend contracts
- Add native Android and iOS clients against the same API layer

---

## 5) API Surface

## 5.1 Implemented now

- `GET /health`
- `POST /v1/recommendations/query`
- `POST /v1/interactions/swipe`

## 5.2 Planned next

- `GET /v1/profile`
- `PUT /v1/profile/preferences`
- `POST /v1/interactions/save`
- provider-backed place details and routing endpoints as needed

---

## 6) Architecture Decision Summary

1. Keep current runtime simple (frontend + single backend) for iteration speed
2. Preserve clear module boundaries in backend for future growth
3. Treat unimplemented architecture as roadmap, not current state
4. Evolve by adding provider adapter + persistence before adding major complexity

