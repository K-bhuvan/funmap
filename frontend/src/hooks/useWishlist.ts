import { useCallback, useMemo, useState } from "react";
import type { RecommendationItem } from "../types/recommendation";
import type { WishlistEntry } from "../types/wishlist";
import {
  loadWishlist,
  removeWishlistItem,
  saveWishlist,
  toggleWishlistItem,
  wishlistContains,
} from "../services/wishlistStorage";

export function useWishlist() {
  const [entries, setEntries] = useState<WishlistEntry[]>(() => loadWishlist());

  const toggle = useCallback((item: RecommendationItem) => {
    setEntries((prev) => {
      const next = toggleWishlistItem(item, prev);
      saveWishlist(next);
      return next;
    });
  }, []);

  const remove = useCallback((placeId: string) => {
    setEntries((prev) => {
      const next = removeWishlistItem(placeId, prev);
      saveWishlist(next);
      return next;
    });
  }, []);

  const ids = useMemo(() => new Set(entries.map((e) => e.placeId)), [entries]);

  const has = useCallback((placeId: string) => wishlistContains(placeId, entries), [entries]);

  return { entries, ids, has, toggle, remove };
}
