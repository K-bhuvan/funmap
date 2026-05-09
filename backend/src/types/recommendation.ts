export type QueryMode = "normal" | "surprise";

export type QueryRequestBody = {
  query: string;
  mode: QueryMode;
  location: {
    lat: number;
    lng: number;
  };
};

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
  location: QueryRequestBody["location"];
  recommendations: RecommendationItem[];
  meta: {
    mocked: true;
    generatedAt: string;
  };
};
