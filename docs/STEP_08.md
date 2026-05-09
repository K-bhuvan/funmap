# Step 8 — User Location Detection

## Goal

When the app loads, ask the browser for the user's GPS position, fly the map to that position,
and include the real coordinates in every recommendation query.  
If the user denies, the app falls back silently to the Bangalore default center.

---

## New file: `frontend/src/hooks/useUserLocation.ts`

Wraps the one-shot `navigator.geolocation.getCurrentPosition` API.

```
State machine
  pending  → waiting for browser response
  granted  → coords received
  denied   → permission refused or API unsupported
```

Key decisions:
- **One-shot, not `watchPosition`** — user position is only needed at app start; continuous
  watching burns battery and adds real-time complexity not needed yet.
- **`maximumAge: 60_000`** — accept a 60 s cached fix to avoid spinning on every reload.
- **`timeout: 8000`** — give up after 8 s so the user can still type a query quickly.

---

## Updated: `frontend/src/components/MapView.tsx`

Added an optional `center?: [number, number]` prop and a `MapFlyTo` inner component.

### Why `MapFlyTo` instead of re-mounting `<MapContainer>`?

`MapContainer` ignores `center` changes after mount (React-Leaflet design: it is
the initial value only).  
The correct pattern is to use `useMap()` inside a child component and call
`map.flyTo(center, zoom)` imperatively.  `MapFlyTo` does exactly that via a
`useEffect` that fires whenever the `center` prop changes.

```tsx
function MapFlyTo({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, DEFAULT_ZOOM, { duration: 1.2 });
  }, [center, map]);
  return null;
}
```

`MapFlyTo` is only rendered when `center` is truthy, so the fallback Bangalore
view is unaffected when geolocation is denied.

---

## Updated: `frontend/src/hooks/useRecommendations.ts`

`fetchRecommendations` now accepts an optional third parameter:

```ts
async function fetchRecommendations(
  query: string,
  mode: QueryMode,
  location: { lat: number; lng: number } | null = null,
)
```

When `location` is provided it is spread into the POST body:

```json
{ "query": "...", "mode": "normal", "location": { "lat": 12.9716, "lng": 77.5946 } }
```

The backend currently ignores the `location` field (mock data is static), but it is
present in the payload ready for Step 10 when real provider calls are made.

---

## Updated: `frontend/src/App.tsx`

```tsx
const locationState = useUserLocation();
const userCoords = locationState.status === "granted" ? locationState.coords : null;
const mapCenter: [number, number] | undefined = userCoords
  ? [userCoords.lat, userCoords.lng]
  : undefined;
```

- `<MapView center={mapCenter} />` — undefined until location is granted; map stays
  at Bangalore default until then.
- `fetchRecommendations(query, mode, userCoords)` — `null` when denied.
- A secondary error banner is shown when `status === "denied"` with the browser's
  reason string.

---

## Behavior summary

| Browser action            | Map center    | Recommendation body      | Banner      |
|---------------------------|---------------|--------------------------|-------------|
| Grants location           | Flies to real | includes `location` obj  | none        |
| Denies / times out        | Bangalore     | no `location` field      | orange note |
| Browser has no geolocation| Bangalore     | no `location` field      | orange note |

---

## TypeScript check

```
npm exec tsc -- --noEmit   # inside frontend/
# no output = no errors
```
