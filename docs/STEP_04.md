# Baby Step 4 - Error Handling Middleware

## Goal

Introduce centralized error handling and not-found handling without changing endpoint behavior.

## What was implemented

- Added `notFoundHandler` middleware — catches any route not matched and returns HTTP 404 with a structured message.
- Added `errorHandler` middleware — catches any unhandled error thrown in route handlers and returns HTTP 500 safely without leaking stack traces to the client.
- Both are registered in `server.ts` **after** all route registrations so they only activate as fallbacks.

## Files added in this step

- `backend/src/middleware/notFound.ts`
- `backend/src/middleware/errorHandler.ts`

## Files changed in this step

- `backend/src/server.ts` — two new imports and two `app.use()` registrations after routes

## Why order matters in Express

Express processes middleware top to bottom in the order it is registered.

- Routes must come first: `GET /health` and `/v1/recommendations`.
- `notFoundHandler` comes after routes: it only fires if nothing matched.
- `errorHandler` must be **last** and must accept exactly four arguments `(err, req, res, next)` — Express uses the four-argument signature to identify an error middleware.

## Behavior guarantees

- `GET /health` — unchanged, HTTP 200
- `POST /v1/recommendations/query` — unchanged, HTTP 200 or 400
- `GET /anything-else` — now returns HTTP 404 JSON instead of default Express HTML
- Any exception thrown inside a route handler — now returns HTTP 500 JSON

## How to verify

```bash
# 1. Known route — still works
curl http://localhost:8080/health

# 2. Unknown route — new 404
curl http://localhost:8080/v1/unknown

# 3. Valid recommendation request — still works
curl -X POST http://localhost:8080/v1/recommendations/query \
  -H "Content-Type: application/json" \
  -d '{"query": "coffee nearby"}'
```

## Why this step matters

Every production backend needs defined error boundaries. Without this, unhandled errors return Express default HTML responses which are confusing in an API context and expose framework information unnecessarily.
