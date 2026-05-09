# Baby Step 6 - Query Bar and Mock Recommendation Cards

## Goal

Wire the frontend to the backend recommendations endpoint so a user can type a query and see results displayed on screen.

## What was implemented

- Added `src/types/recommendation.ts` — frontend type definitions matching the backend response contract (`QueryMode`, `RecommendationItem`, `RecommendationResponse`).
- Added `src/hooks/useRecommendations.ts` — a React hook that manages four states (`idle`, `loading`, `error`, `success`) and calls `POST /v1/recommendations/query`.
- Added `QueryBar.tsx` — a floating search bar overlaid on top of the map with:
  - free-text input
  - a Surprise Me toggle button
  - an Ask submit button that is disabled while loading or with empty input
- Added `RecommendationCards.tsx` — a bottom-sheet panel that renders result cards with name, rating, category, distance, and recommendation reason.
- Updated `App.tsx` to wire up the hook and both components, passing state through correctly.

## Files added in this step

- `frontend/src/types/recommendation.ts`
- `frontend/src/hooks/useRecommendations.ts`
- `frontend/src/components/QueryBar.tsx`
- `frontend/src/components/QueryBar.module.css`
- `frontend/src/components/RecommendationCards.tsx`
- `frontend/src/components/RecommendationCards.module.css`

## Files changed in this step

- `frontend/src/App.tsx`
- `frontend/src/App.module.css`

## State machine in useRecommendations

The hook uses a discriminated union type for its state so every render path is typed and explicit:

```
idle     → user has not asked yet
loading  → fetch in progress
error    → fetch failed or backend returned a non-ok status
success  → recommendations available
```

## How to verify

```bash
# Both servers running
cd backend && npm run dev
cd frontend && npm run dev
```

1. Open `http://localhost:3000`.
2. Type "coffee walk" and press Ask.
3. Three mock cards appear at the bottom.
4. Toggle Surprise Me and ask again — card reasons change.
5. Delete the query text — Ask button disables.

## Why this step matters

This is the first end-to-end product loop: user intent → backend → visible results. Everything after this step adds quality to this loop.
