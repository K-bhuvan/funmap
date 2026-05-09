# Baby Step 2 - Mock Recommendation Endpoint

## Goal

Add a first API contract for recommendations without real provider integrations.

## What was implemented

- Enabled JSON parsing middleware.
- Added `POST /v1/recommendations/query` endpoint.
- Added request checks for:
  - required non-empty `query`
  - optional `mode` with `normal` or `surprise`
  - optional `location`
- Returned deterministic mock recommendations with metadata.
- Added API usage examples in backend README.

## Files changed in this step

- `backend/src/index.ts`
- `backend/README.md`
- `STEP_PLAN.md`

## Request and response contract

Request:

```json
{
  "query": "I want to go outside after work",
  "mode": "surprise",
  "location": { "lat": 12.9716, "lng": 77.5946 }
}
```

Response shape:

- `sessionId`
- `query`
- `mode`
- `location`
- `recommendations[]`
- `meta.mocked`
- `meta.generatedAt`

## How to verify

1. Start backend with `npm run dev`.
2. Send POST request to `http://localhost:8080/v1/recommendations/query`.
3. Confirm HTTP 200 and `meta.mocked: true`.
4. Send invalid request with empty query and confirm HTTP 400.

## Why this step matters

This establishes the first recommendation API surface so frontend work can begin against a stable mock contract.
