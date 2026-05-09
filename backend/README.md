# Backend (Baby Step 3)

This is the minimal backend scaffold for AskMaps.

Current scope:

- health endpoint
- mock recommendations endpoint
- modular route/service/validation structure

## Run

1. `cd backend`
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:8080/health`

Expected response:

```json
{
  "service": "askmaps-backend",
  "status": "ok",
  "timestamp": "..."
}
```

## Mock recommendations endpoint

Endpoint:

- `POST /v1/recommendations/query`

Example request:

```bash
curl -X POST http://localhost:8080/v1/recommendations/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "I want to go outside after work",
    "mode": "surprise",
    "location": { "lat": 12.9716, "lng": 77.5946 }
  }'
```

Example response shape:

```json
{
  "sessionId": "...",
  "query": "I want to go outside after work",
  "mode": "surprise",
  "location": { "lat": 12.9716, "lng": 77.5946 },
  "recommendations": [
    {
      "placeId": "mock-place-1",
      "name": "Riverside Walk + Coffee",
      "category": "outdoor + cafe",
      "distanceMeters": 1200,
      "rating": 4.6,
      "reason": "...",
      "score": 0.86
    }
  ],
  "meta": {
    "mocked": true,
    "generatedAt": "..."
  }
}
```

## Source structure

- `src/index.ts`: app bootstrap
- `src/server.ts`: express app setup
- `src/routes/recommendations.ts`: recommendation endpoint route
- `src/validation/recommendationValidation.ts`: request validation
- `src/services/recommendationService.ts`: mock recommendation generator
- `src/types/recommendation.ts`: shared API types
