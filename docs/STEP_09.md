# Step 9 - Recommendation Pins + Card/Map Sync

## Goal

Show recommendation results directly on the map as pins and keep selection synchronized between map and bottom-sheet cards.

## What changed

### 1) Recommendation data now includes coordinates

Updated both backend and frontend `RecommendationItem` types with:
- `lat: number`
- `lng: number`

Files:
- `backend/src/types/recommendation.ts`
- `frontend/src/types/recommendation.ts`

### 2) Mock backend now generates place coordinates around the user location

`generateMockRecommendationResponse` now builds recommendations from `input.location` (or Bangalore fallback) and offsets each mock item by a small delta so all pins appear in nearby but distinct positions.

File:
- `backend/src/services/recommendationService.ts`

### 3) Map renders recommendation pins

`MapView` now accepts:
- `recommendations?: RecommendationItem[]`
- `selectedPlaceId?: string | null`
- `onSelectPlace?: (placeId: string | null) => void`

It renders one `CircleMarker` per recommendation and highlights the selected item with a larger radius and stronger color.

Clicking a marker calls `onSelectPlace(placeId)`.

File:
- `frontend/src/components/MapView.tsx`

### 4) App holds shared selected state

`App` now owns:
- `selectedPlaceId` state

It passes this to both map and cards so either side can drive selection.

Also behavior on new results:
- Auto-select first recommendation (if present)

File:
- `frontend/src/App.tsx`

### 5) Cards highlight selected recommendation and can select on click

`RecommendationCards` now accepts selection props and forwards them into each `SwipeCard`.

`SwipeCard` now:
- Accepts `selected?: boolean`
- Accepts `onSelect?: (placeId: string) => void`
- Calls `onSelect(placeId)` on click
- Applies selected style class for visible focus

When a selected card is swiped away, cards choose the next visible card (or clear selection).

Files:
- `frontend/src/components/RecommendationCards.tsx`
- `frontend/src/components/SwipeCard.tsx`
- `frontend/src/components/SwipeCard.module.css`

## Why `CircleMarker` in MVP

Leaflet image-based default markers can require additional asset handling in Vite setups. `CircleMarker` avoids that packaging friction while still giving clear, clickable map pins with good visual differentiation.

## Verification

1. Start backend and frontend.
2. Submit a query.
3. Confirm pins appear on the map.
4. Click a pin and verify matching card gets highlighted.
5. Click a card and verify matching pin becomes highlighted.
6. Swipe selected card away and verify selection moves to the next visible card.
