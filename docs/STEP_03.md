# Baby Step 3 - Route Service Validation Refactor

## Goal

Refactor single-file API code into modular components while preserving behavior.

## What was implemented

- Split app bootstrap from server setup.
- Moved endpoint logic to a dedicated route module.
- Moved response generation into a recommendation service module.
- Added lightweight request validation module.
- Added shared type definitions for recommendation DTOs.

## Files changed in this step

- `backend/src/index.ts`
- `backend/src/server.ts`
- `backend/src/routes/recommendations.ts`
- `backend/src/services/recommendationService.ts`
- `backend/src/validation/recommendationValidation.ts`
- `backend/src/types/recommendation.ts`
- `backend/README.md`
- `STEP_PLAN.md`

## Refactor boundaries introduced

- Route layer:
  - handles HTTP request and response mapping
- Validation layer:
  - checks payload shape and required fields
- Service layer:
  - generates recommendation payload
- Types layer:
  - centralizes API data structures

## Behavior guarantees

- `GET /health` unchanged
- `POST /v1/recommendations/query` response format unchanged
- Validation now explicitly reports invalid `mode` and invalid `location`

## How to verify

1. Build project from `backend` with `npm run build`.
2. Call recommendation endpoint with valid payload and compare response keys to Step 2.
3. Call with invalid `mode` and verify HTTP 400 with clear message.

## Why this step matters

This unlocks safe scaling for future changes such as provider adapters, ranking modules, and middleware without growing a monolithic entry file.
