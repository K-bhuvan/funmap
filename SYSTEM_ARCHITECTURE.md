# Ask Places on Maps - System Architecture (MVP)

## 1. Architecture Goal

Deliver a production-grade, desktop-first web MVP for one user, while keeping boundaries clean so the same backend can later support Android and iOS clients.

## 2. High-Level Architecture

The system follows a modular client-server architecture:

1. Web Client (desktop-first, responsive)
2. Backend API (single entry point)
3. Recommendation Engine (deterministic scoring + exploration)
4. Integrations Layer (Maps/Places, Weather, Speech-to-Text)
5. Data Layer (operational DB + cache + logs/analytics)
6. Observability and Control Layer (metrics, tracing, feature flags, quotas)

## 3. Component Diagram

```text
[Web Client]
   |  HTTPS (REST/JSON)
   v
[API Gateway / Backend App]
   |-- Auth & Session
   |-- Query Orchestrator
   |-- Recommendation Service
   |-- Profile Service
   |-- Feedback Service
   |-- Place Detail Service
   |
   |--> [Maps/Places Provider Adapter] ---> [Google Maps Platform APIs]
   |--> [Weather Provider Adapter] -------> [Weather API]
   |--> [Voice Adapter] ------------------> [Browser/Platform STT]
   |
   v
[PostgreSQL]
   |-- user_profile
   |-- preference_seed
   |-- interaction_event
   |-- recommendation_session
   |-- recommendation_item
   |-- place_cache

[Redis]
   |-- short-lived candidate/result cache
   |-- idempotency keys

[Object/Log Store]
   |-- structured app logs
   |-- ranking explainability snapshots
   |-- cost and quota usage logs

[Monitoring Stack]
   |-- metrics
   |-- traces
   |-- alerts
```

## 4. Client Architecture (Web MVP)

### 4.1 Client modules

- Map View Module
- Swipe Card Module
- Voice/Text Input Module
- Filters and Surprise Me Controls
- Session and Profile State Module
- Analytics Event Emitter

### 4.2 Client responsibilities

- collect user query and context
- capture swipe and save feedback
- render map pins and synchronized cards
- display lightweight place cards and recommendation rationale
- degrade gracefully when voice or weather context is unavailable

### 4.3 Client boundaries

- no ranking logic in client
- no direct calls to external provider APIs from client for core recommendations
- all recommendation decisions come from backend to keep behavior consistent across future mobile apps

## 5. Backend Service Architecture

### 5.1 API Gateway / Backend App

Single backend service is acceptable for MVP, internally modularized by domain.

Modules:

- Auth and Session Module
- Query Orchestrator Module
- Recommendation Module
- Profile Module
- Feedback Module
- Place Details Module
- Provider Adapters Module

### 5.2 Query Orchestrator

Pipeline per request:

1. Normalize input (typed text or voice-transcribed text)
2. Parse intent and constraints
3. Resolve user context (profile, recent interactions, time, weather, location)
4. Fetch place candidates from provider adapter
5. Compute ranked results with deterministic scorer
6. Apply exploration policy (normal vs Surprise Me intensity)
7. Build explainable response payload
8. Persist session and ranking artifacts for analysis

### 5.3 Recommendation Module

Subcomponents:

- Candidate Filter
- Scoring Engine
- Exploration Policy Engine
- Diversity/Repetition Controller
- Explanation Builder

Key requirement:

- deterministic and inspectable behavior for each score component

## 6. Data Architecture

## 6.1 Primary storage (PostgreSQL)

Core entities:

- users
- user_preferences
- favorite_places
- interaction_events
- recommendation_sessions
- recommendation_items
- provider_place_cache
- feature_flags (optional for MVP)

## 6.2 Cache (Redis)

Use Redis for:

- short TTL place candidate caching by geo-cell + intent hash
- weather lookup caching by geo-cell
- request idempotency and duplicate suppression

## 6.3 Logging and analytics

Persist structured events:

- query_submitted
- recommendations_returned
- card_swiped_left
- card_swiped_right
- place_saved
- navigation_started
- surprise_mode_used

Include ranking metadata (weights, mode, weather severity class) for debugging and product tuning.

## 7. External Integrations Architecture

## 7.1 Maps/Places Adapter

Abstract provider calls behind a dedicated adapter interface:

- searchCandidates(context)
- getPlaceDetails(placeId)
- getTravelEstimate(origin, destination, mode)

Purpose:

- isolate vendor-specific schemas
- allow future provider migration
- centralize retries, backoff, quota checks, and response normalization

## 7.2 Weather Adapter

Expose normalized weather contract:

- weatherSeverity: none | mild | moderate | severe
- precipitationProbability
- temperatureBand
- advisoryFlags

Recommendation engine consumes normalized severity rather than raw provider format.

## 7.3 Voice Input Architecture

For MVP:

- speech capture and speech-to-text occurs in browser/platform APIs
- client submits transcript as standard query text
- backend treats voice and typed input identically after transcript stage

## 8. Recommendation and Policy Architecture

## 8.1 Scoring layers

1. Eligibility filters (open/closed, distance bounds, severe-weather safety gates)
2. Base relevance scoring (intent, taste fit, quality, proximity)
3. Context adjustments (time fit, weather fit)
4. Exploration adjustments (novelty and repetition penalties)
5. Final ranking and diversity pass

## 8.2 Surprise Me configurability

Exploration intensity is policy-driven and configurable:

- low
- medium
- high

Each level adjusts novelty boost and repetition penalty while enforcing minimum quality and feasibility thresholds.

## 8.3 Weather severity policy

- mild/moderate weather: ranking adjustment
- severe weather: conditional hard constraints for unsafe outdoor-heavy options
- fallback behavior: if weather unavailable, continue with time and taste signals only

## 9. API Surface (MVP)

Core endpoints:

- POST /v1/recommendations/query
- POST /v1/recommendations/surprise
- POST /v1/interactions/swipe
- POST /v1/interactions/save
- GET /v1/places/{placeId}
- GET /v1/profile
- PUT /v1/profile/preferences

All endpoints return typed, versioned JSON contracts to support later mobile clients.

## 10. Deployment Architecture

## 10.1 Runtime shape

- Web client served via CDN/static host
- Backend containerized and deployed on managed runtime
- PostgreSQL managed instance
- Redis managed instance
- Centralized logging and metrics platform

## 10.2 Environment topology

- dev
- staging
- prod

Even with one user, staging is retained to validate provider integration, ranking logic, and regressions before production changes.

## 11. Reliability and SLA Architecture

## 11.1 Latency controls

- parallelize provider fetches where possible
- strict timeouts per integration call
- cached candidate reuse for nearby repeated queries
- partial-response fallback when non-critical context providers fail

## 11.2 Failure handling

- circuit breakers for external provider instability
- retry with exponential backoff for transient errors
- graceful degradation hierarchy:
  1. no weather -> continue without weather
  2. no travel ETA -> fallback to straight-line distance
  3. no voice transcript -> allow typed retry

## 11.3 Cost and quota control

- provider quota guardrails at adapter layer
- request budgeting metrics per endpoint
- cache-first policy for repeated place detail lookups

## 12. Security and Privacy Architecture

- HTTPS everywhere
- encrypted secrets in managed secret store
- least-privilege service credentials
- minimal retention policy for location and interaction data
- explicit user controls for location and voice usage
- audit logging for profile and preference changes

## 13. Observability Architecture

Capture three telemetry classes:

1. Product telemetry
2. System telemetry
3. Ranking telemetry

Minimum dashboards:

- query latency (P50/P95)
- recommendation success actions per session
- Surprise Me usage and acceptance
- provider error rates and quota consumption
- weather severity distribution and impact on outcomes

## 14. Evolution Path to Android and iOS

The architecture is mobile-ready by design:

- backend APIs are channel-neutral
- ranking logic is fully server-side
- shared contracts support web, Android, and iOS clients
- client-specific UI can diverge while core behavior remains consistent

Expected expansion path:

1. Validate full behavior in web MVP
2. Build Android client using same API contracts
3. Build iOS client using same API contracts
4. Optionally extract recommendation module into separate service once load or team size justifies it

## 15. Architecture Decision Summary

1. Web-first, desktop-first MVP with full feature completeness
2. Modular monolith backend for fastest reliable delivery
3. Provider adapters to isolate third-party dependencies
4. Deterministic recommendation engine with configurable exploration
5. Severity-aware weather policy with graceful degradation
6. Contracts and boundaries designed for straightforward Android/iOS rollout