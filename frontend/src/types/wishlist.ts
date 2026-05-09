import type { RecommendationItem } from "./recommendation";

export type WishlistEntry = RecommendationItem & {
  savedAt: string;
};
