# Incremental Build Plan

Detailed docs for each step are in `docs/README.md`.

## Note — current web prototype

Steps 6–7 once added **QueryBar**, **useRecommendations**, **RecommendationCards**, and **SwipeCard** wired through **App**. That tree was **never mounted** once **BrowseHome** became the main surface; those modules were **removed** as dead code. The live path is **BrowseHome** → **FeedRow** / **PlaceTile**, map **MapView** in a sheet, and **fetch** to **`/v1/recommendations/query`** inside effects. **`POST /v1/interactions/swipe`** stays on the backend for native apps; the web bundle no longer includes swipe UI.

## Baby Step 1 (current)

- Setup TypeScript backend scaffold
- Add `/health` endpoint
- Verify local run
- Implementation details: `docs/STEP_01.md`

## Baby Step 2 (current)

- Add basic API structure for `POST /v1/recommendations/query` with mock response
- No real provider integration yet
- Implementation details: `docs/STEP_02.md`

## Baby Step 3 (current)

- Refactor endpoint into route + service structure
- Add lightweight request schema validation module
- Keep mock data, but prepare clean extension points for real providers
- Implementation details: `docs/STEP_03.md`

## Baby Step 4 (current)

- Add centralized error middleware and not-found handler
- Keep existing endpoint behavior unchanged
- Implementation details: `docs/STEP_04.md`

## Baby Step 5 (current)

- Scaffold the frontend: Vite + React + TypeScript
- Add a full-screen interactive map using React-Leaflet (OpenStreetMap tiles, no API key needed)
- Add HealthStatus component that polls GET /health and shows backend connection state
- Vite dev proxy routes /health and /v1 to backend, no CORS needed

## Baby Step 6 (current)

- Add QueryBar component — floating search bar overlaid on top of the map
- Add Surprise Me toggle inside the bar
- Add useRecommendations hook — calls POST /v1/recommendations/query, tracks idle/loading/error/success state
- Add RecommendationCards component — bottom sheet panel showing each result with name, category, distance, rating, reason
- Wire everything in App — map always visible, cards appear when results arrive, error banner on failure

## Baby Step 7 (current)

- Backend: add POST /v1/interactions/swipe endpoint with validation, logs swipe direction
- Frontend: add SwipeCard component — pointer/touch drag, left/right classify at 80 px threshold, rotation + opacity animation, fire-and-forget swipe POST
- RecommendationCards now uses SwipeCard per item and removes dismissed cards from view
- sessionId threaded from API response through to each swipe event

## Baby Step 8 (complete)

- Add user location detection in the browser (Geolocation API)
- Pass actual lat/lng to the recommendations query
- Center the map on the user's real location on first load
- Postal / ZIP fallback via backend geocode when permission denied (mock default center if neither)
- Implementation details: `docs/STEP_08.md`

## Baby Step 9 (complete)

- Add map markers (pins) for each recommendation result
- Each pin shows place details in a popup
- Clicking a marker highlights the matching card in the bottom sheet (and vice-versa)
- Selection remains stable as cards are swiped away
- Implementation details: `docs/STEP_09.md`

## Baby Step 10 (complete)

- Postal / ZIP input when geolocation is denied; backend **`POST /v1/geocode/postal`**; coords feed the same recommendation requests
