# Baby Step 1 - Backend Scaffold and Health Check

## Goal

Create a minimal TypeScript backend skeleton that can run locally and confirm service health.

## What was implemented

- Created backend Node project with TypeScript and Express.
- Added runtime and build scripts:
  - `npm run dev` for local development
  - `npm run build` for compile check
  - `npm run start` for running compiled output
- Added `tsconfig.json` for strict TypeScript compilation.
- Added `GET /health` endpoint in server entry file.
- Added `.gitignore` to exclude build and dependency artifacts.

## Files added in this step

- `backend/package.json`
- `backend/tsconfig.json`
- `backend/src/index.ts`
- `backend/README.md`
- `.gitignore`

## Endpoint behavior

`GET /health`

Example response:

```json
{
  "service": "askmaps-backend",
  "status": "ok",
  "timestamp": "2026-04-09T00:00:00.000Z"
}
```

## How to run and verify

1. From `backend`, run `npm install`.
2. Run `npm run dev`.
3. Open `http://localhost:8080/health`.
4. Confirm status is `ok` and timestamp is present.

## Why this step matters

This creates a stable base before introducing product endpoints and recommendation logic.
