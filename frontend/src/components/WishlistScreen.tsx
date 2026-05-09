import { openAppleMapsDirections, openGoogleMapsDirections } from "../utils/maps";
import type { DistanceUnit } from "../types/profile";
import type { WishlistEntry } from "../types/wishlist";
import { formatDistance } from "../utils/distance";
import styles from "./WishlistScreen.module.css";

type Props = {
  entries: WishlistEntry[];
  onRemove: (placeId: string) => void;
  distanceUnit?: DistanceUnit;
};

export default function WishlistScreen({ entries, onRemove, distanceUnit = "miles" }: Props) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <h1 className={styles.title}>Wishlist</h1>
        <p className={styles.subtitle}>Saved places — open in your maps app.</p>
      </header>

      <div className={styles.list}>
        {entries.length === 0 ? (
          <p className={styles.empty}>Nothing saved yet. Heart a place on Home to add it.</p>
        ) : (
          entries.map((item) => (
            <article key={item.placeId} className={styles.card}>
              <div className={styles.cardTop}>
                <div>
                  <div className={styles.name}>{item.name}</div>
                  <div className={styles.meta}>
                    <span>{item.category}</span>
                    <span>{formatDistance(item.distanceMeters, distanceUnit)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => onRemove(item.placeId)}
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  Remove
                </button>
              </div>
              <div className={styles.mapsRow}>
                <button
                  type="button"
                  className={`${styles.mapBtn} ${styles.mapBtnGoogle}`}
                  onClick={() => openGoogleMapsDirections(item.lat, item.lng)}
                >
                  Google Maps
                </button>
                <button
                  type="button"
                  className={`${styles.mapBtn} ${styles.mapBtnApple}`}
                  onClick={() => openAppleMapsDirections(item.lat, item.lng)}
                >
                  Apple Maps
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
