import type { RecommendationItem } from "../types/recommendation";
import PlaceTile from "./PlaceTile";
import styles from "./FeedRow.module.css";

type Props = {
  title: string;
  items: RecommendationItem[];
  loading?: boolean;
  error?: string | null;
  selectedPlaceId?: string | null;
  onSelectPlace?: (placeId: string) => void;
  wishlistIds?: Set<string>;
  onToggleWishlist?: (item: RecommendationItem) => void;
  onOpenGoogleMaps?: (item: RecommendationItem) => void;
  onOpenAppleMaps?: (item: RecommendationItem) => void;
};

export default function FeedRow({
  title,
  items,
  loading = false,
  error = null,
  selectedPlaceId = null,
  onSelectPlace,
  wishlistIds,
  onToggleWishlist,
  onOpenGoogleMaps,
  onOpenAppleMaps,
}: Props) {
  return (
    <section className={styles.row}>
      <h3 className={styles.title}>{title}</h3>
      {loading && <div className={styles.state}>Loading…</div>}
      {error && <div className={styles.state}>{error}</div>}
      {!loading && !error && (
        <div className={styles.scroller}>
          {items.map((item) => (
            <PlaceTile
              key={item.placeId}
              item={item}
              selected={item.placeId === selectedPlaceId}
              onSelect={onSelectPlace}
              inWishlist={wishlistIds?.has(item.placeId) ?? false}
              onToggleWishlist={onToggleWishlist}
              onOpenGoogleMaps={onOpenGoogleMaps}
              onOpenAppleMaps={onOpenAppleMaps}
            />
          ))}
        </div>
      )}
    </section>
  );
}

