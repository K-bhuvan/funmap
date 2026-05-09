# funmap — Backend

Express + TypeScript API. Serves recommendations, geocoding, and interactions for the native Android and iOS clients (and the web prototype).

## Run

```bash
cd backend
npm install
npm run dev
```

Open `http://localhost:8080/health` — expected response:

```json
{ "service": "funmap-backend", "status": "ok", "timestamp": "..." }
```

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/health` | Health check |
| `POST` | `/v1/recommendations/query` | Get place recommendations |
| `POST` | `/v1/geocode/postal` | Postal code → lat/lng (Nominatim) |
| `POST` | `/v1/interactions/swipe` | Record a swipe interaction |

## Example — recommendations

```bash
curl -X POST http://localhost:8080/v1/recommendations/query \
  -H "Content-Type: application/json" \
  -d '{"query":"coffee walk","mode":"normal","location":{"lat":12.9716,"lng":77.5946}}'
```

## Source structure

```
src/
  index.ts               # App bootstrap
  server.ts              # Express app + route mounting
  middleware/            # helmet, CORS, rate-limit, error handler
  routes/                # recommendations, geocode, interactions
  services/              # Mock recommendation generator, Nominatim geocoder
  validation/            # Request validation (no external schema lib)
  types/                 # Shared API types
```
