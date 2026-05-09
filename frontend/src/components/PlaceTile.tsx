import type { DistanceUnit } from "../types/profile";
import type { RecommendationItem } from "../types/recommendation";
import { formatDistance } from "../utils/distance";
import styles from "./PlaceTile.module.css";

type Props = {
  item: RecommendationItem;
  selected?: boolean;
  onSelect?: (placeId: string) => void;
  inWishlist?: boolean;
  onToggleWishlist?: (item: RecommendationItem) => void;
  onOpenGoogleMaps?: (item: RecommendationItem) => void;
  onOpenAppleMaps?: (item: RecommendationItem) => void;
  distanceUnit?: DistanceUnit;
};

type ThumbStyle = { gradient: string; emoji: string };

function thumbStyle(category: string): ThumbStyle {
  const c = category.toLowerCase();
  if (c.includes("coffee") || c.includes("café") || c.includes("cafe") || c.includes("roastery"))
    return { gradient: "linear-gradient(145deg, #3b1f08, #78350f)", emoji: "☕" };
  if (c.includes("book"))
    return { gradient: "linear-gradient(145deg, #1a1a3e, #312e81)", emoji: "📚" };
  if (c.includes("dessert") || c.includes("sweet"))
    return { gradient: "linear-gradient(145deg, #3b0764, #7c3aed)", emoji: "🍰" };
  if (c.includes("food") || c.includes("market") || c.includes("street"))
    return { gradient: "linear-gradient(145deg, #450a0a, #b91c1c)", emoji: "🍜" };
  if (c.includes("sunset") || c.includes("view") || c.includes("ridge") || c.includes("scenic"))
    return { gradient: "linear-gradient(145deg, #1c1917, #c2410c)", emoji: "🌅" };
  if (c.includes("gallery") || c.includes("art") || c.includes("museum"))
    return { gradient: "linear-gradient(145deg, #2e1065, #7c3aed)", emoji: "🎨" };
  if (c.includes("cinema") || c.includes("film"))
    return { gradient: "linear-gradient(145deg, #0f172a, #1e40af)", emoji: "🎬" };
  if (c.includes("drive") || c.includes("road"))
    return { gradient: "linear-gradient(145deg, #0c1445, #1e3a8a)", emoji: "🚗" };
  if (c.includes("outdoor") || c.includes("walk") || c.includes("park") || c.includes("nature") || c.includes("promenade") || c.includes("botanical"))
    return { gradient: "linear-gradient(145deg, #052e16, #166534)", emoji: "🌿" };
  return { gradient: "linear-gradient(145deg, #1c1c24, #374151)", emoji: "📍" };
}

export default function PlaceTile({
  item,
  selected = false,
  onSelect,
  inWishlist = false,
  onToggleWishlist,
  onOpenGoogleMaps,
  onOpenAppleMaps,
  distanceUnit = "miles",
}: Props) {
  const thumb = thumbStyle(item.category);

  return (
    <div
      className={`${styles.tile} ${selected ? styles.tileSelected : ""}`}
      onClick={() => onSelect?.(item.placeId)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onSelect?.(item.placeId); }}
    >
      {/* ── Thumbnail ── */}
      <div className={styles.thumb} style={{ background: thumb.gradient }}>
        <span className={styles.thumbEmoji}>{thumb.emoji}</span>

        {/* Rating badge */}
        <div className={styles.ratingBadge}>
          <span className={styles.ratingStars}>★</span>
          {item.rating.toFixed(1)}
        </div>

        {/* Wishlist button */}
        {onToggleWishlist ? (
          <button
            type="button"
            className={`${styles.wishlistBtn} ${inWishlist ? styles.wishlistBtnOn : ""}`}
            aria-label={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(item); }}
          >
            {inWishlist ? "♥" : "♡"}
          </button>
        ) : null}

        {/* Gradient fade to card body */}
        <div className={styles.thumbFade} />
      </div>

      {/* ── Card body ── */}
      <div className={styles.body}>
        <div className={styles.name}>{item.name}</div>

        <div className={styles.meta}>
          <span className={styles.categoryTag}>{item.category}</span>
          <span className={styles.distance}>{formatDistance(item.distanceMeters, distanceUnit)}</span>
        </div>

        <p className={styles.reason}>{item.reason}</p>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnGoogle}`}
            onClick={(e) => { e.stopPropagation(); onOpenGoogleMaps?.(item); }}
          >
            Google Maps
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnApple}`}
            onClick={(e) => { e.stopPropagation(); onOpenAppleMaps?.(item); }}
          >
            Apple Maps
          </button>
        </div>
      </div>
    </div>
  );
}
