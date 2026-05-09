import type { RecommendationItem } from "../types/recommendation";
import styles from "./PlaceTile.module.css";

type Props = {
  item: RecommendationItem;
  selected?: boolean;
  onSelect?: (placeId: string) => void;
  inWishlist?: boolean;
  onToggleWishlist?: (item: RecommendationItem) => void;
  onOpenGoogleMaps?: (item: RecommendationItem) => void;
  onOpenAppleMaps?: (item: RecommendationItem) => void;
};

function formatDistance(meters: number): string {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
}

export default function PlaceTile({
  item,
  selected = false,
  onSelect,
  inWishlist = false,
  onToggleWishlist,
  onOpenGoogleMaps,
  onOpenAppleMaps,
}: Props) {
  return (
    <div
      className={styles.tile}
      style={{
        outline: selected ? "2px solid rgba(56, 189, 248, 0.55)" : "none",
      }}
      onClick={() => onSelect?.(item.placeId)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSelect?.(item.placeId);
      }}
    >
      <div className={styles.nameRow}>
        <div className={styles.name}>{item.name}</div>
        <div className={styles.nameRowActions}>
          {onToggleWishlist ? (
            <button
              type="button"
              className={`${styles.wishlistBtn} ${inWishlist ? styles.wishlistBtnOn : ""}`}
              aria-label={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(item);
              }}
            >
              {inWishlist ? "♥" : "♡"}
            </button>
          ) : null}
          <div className={styles.rating}>★ {item.rating}</div>
        </div>
      </div>
      <div className={styles.meta}>
        <span>{item.category}</span>
        <span>{formatDistance(item.distanceMeters)}</span>
      </div>
      <p className={styles.reason}>{item.reason}</p>
      <div className={styles.mapsActions}>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpenGoogleMaps?.(item);
          }}
        >
          Google Maps
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpenAppleMaps?.(item);
          }}
        >
          Apple Maps
        </button>
      </div>
    </div>
  );
}
