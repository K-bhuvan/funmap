# Baby Step 7 - Swipe Gestures and Interaction Endpoint

## Goal

Add swipe-left / swipe-right gestures to recommendation cards and record each swipe on the backend.

## What was implemented

### Backend

- Added `src/types/interaction.ts` — `SwipeDirection` and `SwipeEventBody` types.
- Added `src/validation/interactionValidation.ts` — validates `placeId`, `sessionId`, and `direction`.
- Added `src/routes/interactions.ts` — `POST /v1/interactions/swipe` handler that validates input, logs the swipe event, and returns an acknowledgement. Persistence to database is deferred to a later step.
- Registered the new router in `server.ts` at `/v1/interactions`.

### Frontend

- Added `SwipeCard.tsx` — a swipeable card built on the Pointer Events API:
  - captures pointer on `pointerdown`
  - tracks horizontal delta on `pointermove`
  - at ≥ 80 px threshold shows a ✓ or ✕ label badge
  - on `pointerup`: if threshold met → flies off screen and fires swipe POST; else → snaps back
  - rotation angle is proportional to drag distance for a natural feel
- Refactored `RecommendationCards.tsx` to render one `SwipeCard` per item and track a `dismissed` set.
- Threaded `sessionId` from the recommendation response through `App.tsx` → `RecommendationCards` → `SwipeCard` so each swipe event is associated with its originating session.

## Files added in this step

- `backend/src/types/interaction.ts`
- `backend/src/validation/interactionValidation.ts`
- `backend/src/routes/interactions.ts`
- `frontend/src/components/SwipeCard.tsx`
- `frontend/src/components/SwipeCard.module.css`

## Files changed in this step

- `backend/src/server.ts`
- `frontend/src/components/RecommendationCards.tsx`
- `frontend/src/components/RecommendationCards.module.css`
- `frontend/src/App.tsx`

## Why Pointer Events instead of touch events

The Pointer Events API works for mouse, touch, and stylus with a single handler. Using `setPointerCapture` ensures the drag continues even if the pointer leaves the element boundary, which is important for fast swipes.

## Swipe POST is fire-and-forget

The frontend does not wait for the swipe acknowledgement before updating the UI. This keeps the animation smooth. If the network call fails, the card is still dismissed visually — the feedback is best-effort in MVP.

## How to verify

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

1. Ask a question to get three cards.
2. Drag a card right past 80 px. It rotates, shows ✓ Interested, flies off.
3. Check backend terminal — you should see: `[swipe] session=... place=mock-place-1 direction=right`.
4. Drag another card left. Check for `direction=left`.
5. After all cards are swiped the panel disappears.

## Why this step matters

Swipe events are the primary preference signal the recommendation engine will use in later steps. Recording them now — even just as logs — establishes the full feedback loop before any database or ranking logic is added.
