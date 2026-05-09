export type QueryMode = "normal" | "surprise";

export type RecommendationItem = {
  placeId: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  distanceMeters: number;
  rating: number;
  reason: string;
  score: number;
};

export type RecommendationResponse = {
  sessionId: string;
  query: string;
  mode: QueryMode;
  location: { lat: number; lng: number };
  recommendations: RecommendationItem[];
  meta: { mocked: boolean; generatedAt: string };
};
