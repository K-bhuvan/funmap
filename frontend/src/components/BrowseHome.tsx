import { useEffect, useMemo, useState } from "react";
import type { QueryMode, RecommendationItem, RecommendationResponse } from "../types/recommendation";
import type { UserProfile } from "../types/profile";
import type { LocationSession } from "../hooks/useLocationSession";
import HealthStatus from "./HealthStatus";
import FeedRow from "./FeedRow";
import MapView from "./MapView";
import { openAppleMapsDirections, openGoogleMapsDirections } from "../utils/maps";
import styles from "./BrowseHome.module.css";

type RowSpec = {
  id: string;
  title: string;
  query: string;
  mode: QueryMode;
};

type RowState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; items: RecommendationItem[] };

type Props = {
  profile: UserProfile;
  onEditProfile: () => void;
  wishlistIds: Set<string>;
  onToggleWishlist: (item: RecommendationItem) => void;
  session: LocationSession;
};

function buildRows(profile: UserProfile, isWeekend: boolean): RowSpec[] {
  const topActivities = profile.activities.slice(0, 6);
  const base = isWeekend ? "weekend" : "after work";

  const rows: RowSpec[] = [
    { id: "now", title: isWeekend ? "Weekend ideas" : "After work, right now", query: base, mode: "normal" },
    ...topActivities.map((a) => ({
      id: `act:${a}`,
      title: `Because you like ${a}`,
      query: `${a} ${base}`,
      mode: "normal" as const,
    })),
    { id: "surprise", title: "Surprise, but plausible", query: `${base} something new`, mode: "surprise" },
  ];

  return rows;
}

export default function BrowseHome({
  profile,
  onEditProfile,
  wishlistIds,
  onToggleWishlist,
  session,
}: Props) {
  const {
    locationState,
    effectiveCoords,
    postalLocation,
    clearPostalLocation,
  } = session;
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [mapOpen, setMapOpen] = useState(false);

  const isWeekend = useMemo(() => {
    const d = new Date();
    const day = d.getDay(); // 0 Sun .. 6 Sat
    return day === 0 || day === 6;
  }, []);

  const rows = useMemo(() => buildRows(profile, isWeekend), [profile, isWeekend]);
  const [rowState, setRowState] = useState<Record<string, RowState>>({});

  useEffect(() => {
    if (!effectiveCoords) {
      setRowState({});
      return;
    }

    let cancelled = false;
    async function run() {
      const next: Record<string, RowState> = {};
      rows.forEach((r) => (next[r.id] = { status: "loading" }));
      setRowState(next);

      for (const r of rows) {
        try {
          const res = await fetch("/v1/recommendations/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: r.query,
              mode: r.mode,
              location: effectiveCoords,
            }),
          });
          const json: unknown = await res.json();
          if (!res.ok) {
            const err = json as { message?: string };
            if (!cancelled) {
              setRowState((prev) => ({ ...prev, [r.id]: { status: "error", message: err.message ?? "Request failed." } }));
            }
            continue;
          }
          const data = json as RecommendationResponse;
          const items = Array.isArray(data.recommendations) ? data.recommendations : [];
          if (!cancelled) {
            setRowState((prev) => ({ ...prev, [r.id]: { status: "success", items } }));
          }
        } catch {
          if (!cancelled) {
            setRowState((prev) => ({ ...prev, [r.id]: { status: "error", message: "Could not reach the backend." } }));
          }
        }
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
    // Use primitive lat/lng as deps to avoid infinite re-runs from new object refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, effectiveCoords?.lat, effectiveCoords?.lng]);

  const allRecommendations: RecommendationItem[] = useMemo(() => {
    const out: RecommendationItem[] = [];
    rows.forEach((r) => {
      const st = rowState[r.id];
      if (st?.status === "success") out.push(...st.items);
    });
    const seen = new Set<string>();
    return out.filter((i) => (seen.has(i.placeId) ? false : (seen.add(i.placeId), true)));
  }, [rows, rowState]);

  useEffect(() => {
    setSelectedPlaceId(allRecommendations[0]?.placeId ?? null);
  }, [allRecommendations]);

  function handleOpenGoogleMaps(item: RecommendationItem) {
    openGoogleMapsDirections(item.lat, item.lng);
  }

  function handleOpenAppleMaps(item: RecommendationItem) {
    openAppleMapsDirections(item.lat, item.lng);
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo}>funmap</div>
          <div className={styles.tagline}>Find somewhere worth going. Open in Maps.</div>
        </div>
        <div className={styles.actions}>
          <HealthStatus />
          <button type="button" className={styles.btn} onClick={() => setMapOpen(true)} disabled={!effectiveCoords}>
            Map
          </button>
          <button type="button" className={styles.btn} onClick={onEditProfile}>
            Preferences
          </button>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.feed}>
          {!effectiveCoords ? (
            <p className={styles.needsLocationHint}>
              Use the <strong>ZIP / postal code</strong> bar at the top of the screen, or allow precise location when
              prompted.
            </p>
          ) : null}

          {locationState.status === "granted" ? (
            <div className={styles.notice}>
              Using your device location. Pick a place, then open directions in Google Maps or Apple Maps.
            </div>
          ) : null}

          {postalLocation && locationState.status !== "granted" ? (
            <div className={styles.noticeRow}>
              <div className={styles.notice}>
                Based on your postal code:{" "}
                {postalLocation.summary.length > 90
                  ? `${postalLocation.summary.slice(0, 90)}…`
                  : postalLocation.summary}
                . Open directions from a card in Google Maps or Apple Maps.
              </div>
              <button
                type="button"
                className={styles.postalChange}
                onClick={() => {
                  clearPostalLocation();
                }}
              >
                Change
              </button>
            </div>
          ) : null}

          {effectiveCoords
            ? rows.map((r) => {
                const st = rowState[r.id] ?? { status: "idle" as const };
                return (
                  <FeedRow
                    key={r.id}
                    title={r.title}
                    items={st.status === "success" ? st.items : []}
                    loading={st.status === "loading"}
                    error={st.status === "error" ? st.message : null}
                    selectedPlaceId={selectedPlaceId}
                    onSelectPlace={(placeId) => setSelectedPlaceId(placeId)}
                    wishlistIds={wishlistIds}
                    onToggleWishlist={onToggleWishlist}
                    onOpenGoogleMaps={handleOpenGoogleMaps}
                    onOpenAppleMaps={handleOpenAppleMaps}
                    distanceUnit={profile.distanceUnit ?? "miles"}
                  />
                );
              })
            : null}
        </div>
      </div>

      {mapOpen && (
        <div
          className={styles.mapOverlay}
          onClick={() => setMapOpen(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Escape") setMapOpen(false);
          }}
        >
          <div
            className={styles.mapSheet}
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <div className={styles.sheetHeader}>
              <div className={styles.sheetTitle}>Map</div>
              <button type="button" className={styles.closeBtn} onClick={() => setMapOpen(false)}>
                Close
              </button>
            </div>
            <div className={styles.mapWrap}>
              {effectiveCoords ? (
                <MapView
                  center={[effectiveCoords.lat, effectiveCoords.lng]}
                  recommendations={allRecommendations}
                  selectedPlaceId={selectedPlaceId}
                  onSelectPlace={setSelectedPlaceId}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
