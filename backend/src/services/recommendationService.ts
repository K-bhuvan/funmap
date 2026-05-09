import { randomUUID } from "node:crypto";
import {
  QueryMode,
  QueryRequestBody,
  RecommendationItem,
  RecommendationResponse,
} from "../types/recommendation.js";

type PlaceTemplate = {
  name: string;
  category: string;
  distanceMeters: number;
  rating: number;
  latOffset: number;
  lngOffset: number;
  normalReason: string;
  surpriseReason: string;
  tags: string[];
};

const PLACE_POOL: PlaceTemplate[] = [
  {
    name: "Riverside Walk + Coffee",
    category: "outdoor · café",
    distanceMeters: 1200,
    rating: 4.6,
    latOffset: 0.0065,
    lngOffset: 0.0045,
    normalReason: "Fresh air, calm vibe, and a great flat white — exactly after-work territory.",
    surpriseReason: "A waterfront path you haven't tried yet; still very close and highly rated.",
    tags: ["walk", "coffee", "outdoor", "calm"],
  },
  {
    name: "Quiet Book Café",
    category: "café · bookstore",
    distanceMeters: 1800,
    rating: 4.7,
    latOffset: -0.003,
    lngOffset: 0.008,
    normalReason: "Good ratings, cosy atmosphere, close enough for an hour out.",
    surpriseReason: "More literary than your usual picks — but you might love it.",
    tags: ["coffee", "bookstore", "calm", "solo"],
  },
  {
    name: "Neighbourhood Art Spot",
    category: "gallery · experience",
    distanceMeters: 2400,
    rating: 4.4,
    latOffset: 0.0025,
    lngOffset: -0.009,
    normalReason: "A change of scene without going far — local art, no crowds.",
    surpriseReason: "Adds novelty while staying in a realistic travel range.",
    tags: ["museum", "hidden gems", "solo", "calm"],
  },
  {
    name: "Rooftop Sunset Point",
    category: "viewpoint · outdoors",
    distanceMeters: 2900,
    rating: 4.8,
    latOffset: 0.009,
    lngOffset: 0.006,
    normalReason: "Golden hour views — worth the 20-minute drive on a clear evening.",
    surpriseReason: "You said sunset; this delivers the best one nearby.",
    tags: ["sunset", "viewpoint", "scenic drive", "romantic"],
  },
  {
    name: "Street Food Lane",
    category: "street food · market",
    distanceMeters: 900,
    rating: 4.5,
    latOffset: -0.005,
    lngOffset: -0.004,
    normalReason: "Quick bite, lively energy, and only 15 minutes away.",
    surpriseReason: "Not your usual spot — but the reviews suggest it punches above its radius.",
    tags: ["street food", "social", "energetic"],
  },
  {
    name: "Shaded Botanical Walk",
    category: "park · nature",
    distanceMeters: 3200,
    rating: 4.6,
    latOffset: -0.011,
    lngOffset: 0.003,
    normalReason: "A loop trail with plenty of shade — ideal if you just want to walk and decompress.",
    surpriseReason: "Quieter than central parks and often half-empty on weekday evenings.",
    tags: ["walk", "quiet park", "outdoor", "calm"],
  },
  {
    name: "Artisan Dessert Bar",
    category: "dessert · café",
    distanceMeters: 1400,
    rating: 4.7,
    latOffset: 0.004,
    lngOffset: -0.002,
    normalReason: "End the day with something excellent — consistently top-rated.",
    surpriseReason: "A sweet detour that takes 12 minutes and feels very worth it.",
    tags: ["dessert", "coffee", "social", "romantic"],
  },
  {
    name: "Indie Cinema + Espresso",
    category: "cinema · café",
    distanceMeters: 2100,
    rating: 4.5,
    latOffset: -0.007,
    lngOffset: -0.007,
    normalReason: "Catch an evening show and grab a coffee before — tight 90-minute window fits.",
    surpriseReason: "Indie schedule changes weekly; tonight's showing could be a gem.",
    tags: ["social", "coffee", "solo", "calm"],
  },
  {
    name: "Scenic Drive Ridge Road",
    category: "drive · viewpoint",
    distanceMeters: 5800,
    rating: 4.6,
    latOffset: 0.018,
    lngOffset: 0.012,
    normalReason: "Short scenic loop — 25 minutes of clear road and good views.",
    surpriseReason: "A bit further than usual but a different kind of reset.",
    tags: ["scenic drive", "viewpoint", "outdoor", "adventurous"],
  },
  {
    name: "Hidden Courtyard Gallery",
    category: "gallery · hidden gems",
    distanceMeters: 1700,
    rating: 4.3,
    latOffset: 0.006,
    lngOffset: -0.011,
    normalReason: "Small, rotating local exhibitions — easy to browse in 30 minutes.",
    surpriseReason: "Under the radar for most apps, but locals rate it highly.",
    tags: ["hidden gems", "museum", "solo", "calm"],
  },
  {
    name: "Waterfront Promenade",
    category: "walk · outdoors",
    distanceMeters: 2600,
    rating: 4.7,
    latOffset: -0.009,
    lngOffset: 0.011,
    normalReason: "Best evening walk in the area — flat path, good lighting, open late.",
    surpriseReason: "You might not realise how close this is; it has better ratings than the central park.",
    tags: ["walk", "outdoor", "calm", "romantic"],
  },
  {
    name: "Micro-Roastery Coffee Lab",
    category: "speciality coffee",
    distanceMeters: 1100,
    rating: 4.8,
    latOffset: 0.003,
    lngOffset: 0.007,
    normalReason: "Top-rated coffee within walking distance — opens till 8 pm.",
    surpriseReason: "More serious about coffee than your usual spot; worth branching out for.",
    tags: ["coffee", "bookstore", "calm", "solo"],
  },
];

function queryMatchScore(template: PlaceTemplate, query: string): number {
  const q = query.toLowerCase();
  let score = 0;
  for (const tag of template.tags) {
    if (q.includes(tag.toLowerCase())) score += 3;
  }
  if (q.includes("coffee") && template.tags.includes("coffee")) score += 2;
  if (q.includes("walk") && template.tags.includes("walk")) score += 2;
  if (q.includes("surprise") || q.includes("new")) score += 1;
  return score;
}

function pickPlaces(
  query: string,
  mode: QueryMode,
  count = 3,
): PlaceTemplate[] {
  const scored = PLACE_POOL.map((p) => ({
    template: p,
    score: queryMatchScore(p, query) + Math.random() * 2,
  }));

  if (mode === "surprise") {
    scored.sort((a, b) => a.score - b.score + Math.random() - 0.5);
  } else {
    scored.sort((a, b) => b.score - a.score);
  }

  return scored.slice(0, count).map((s) => s.template);
}

function buildMockRecommendations(input: QueryRequestBody): RecommendationItem[] {
  const base = input.location;
  const picked = pickPlaces(input.query, input.mode, 3);

  return picked.map((p) => ({
    placeId: randomUUID(),
    name: p.name,
    category: p.category,
    lat: +(base.lat + p.latOffset).toFixed(6),
    lng: +(base.lng + p.lngOffset).toFixed(6),
    distanceMeters: p.distanceMeters,
    rating: p.rating,
    reason: input.mode === "surprise" ? p.surpriseReason : p.normalReason,
    score: input.mode === "surprise"
      ? +(0.78 + Math.random() * 0.1).toFixed(2)
      : +(0.85 + Math.random() * 0.1).toFixed(2),
  }));
}

export function generateMockRecommendationResponse(
  input: QueryRequestBody,
): RecommendationResponse {
  return {
    sessionId: randomUUID(),
    query: input.query,
    mode: input.mode,
    location: input.location,
    recommendations: buildMockRecommendations(input),
    meta: {
      mocked: true,
      generatedAt: new Date().toISOString(),
    },
  };
}
