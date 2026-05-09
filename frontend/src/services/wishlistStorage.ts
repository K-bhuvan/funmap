import type { WishlistEntry } from "../types/wishlist";
import type { RecommendationItem } from "../types/recommendation";

const STORAGE_KEY = "askmaps.wishlist.v1";

export function loadWishlist(): WishlistEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out: WishlistEntry[] = [];
    for (const row of parsed) {
      if (typeof row !== "object" || row === null) continue;
      const e = row as Partial<WishlistEntry>;
      if (typeof e.placeId !== "string" || typeof e.savedAt !== "string") continue;
      if (typeof e.name !== "string" || typeof e.lat !== "number" || typeof e.lng !== "number") continue;
      out.push(e as WishlistEntry);
    }
    return out;
  } catch {
    return [];
  }
}

export function saveWishlist(entries: WishlistEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function wishlistContains(placeId: string, entries: WishlistEntry[]): boolean {
  return entries.some((e) => e.placeId === placeId);
}

export function toggleWishlistItem(
  item: RecommendationItem,
  entries: WishlistEntry[],
): WishlistEntry[] {
  const i = entries.findIndex((e) => e.placeId === item.placeId);
  if (i >= 0) {
    return entries.filter((_, j) => j !== i);
  }
  const next: WishlistEntry = {
    ...item,
    savedAt: new Date().toISOString(),
  };
  return [...entries, next];
}

export function removeWishlistItem(placeId: string, entries: WishlistEntry[]): WishlistEntry[] {
  return entries.filter((e) => e.placeId !== placeId);
}
