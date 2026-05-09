import { useEffect } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import type { RecommendationItem } from "../types/recommendation";

// Default map center when no user location is passed in (no GPS / postal yet); aligns with backend mock default
const DEFAULT_CENTER: [number, number] = [12.9716, 77.5946];
const DEFAULT_ZOOM = 13;

interface Props {
  center?: [number, number];
  recommendations?: RecommendationItem[];
  selectedPlaceId?: string | null;
  onSelectPlace?: (placeId: string | null) => void;
}

/** Inner component that imperatively flies the map when `center` changes. */
function MapFlyTo({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, DEFAULT_ZOOM, { duration: 1.2 });
  }, [center, map]);
  return null;
}

export default function MapView({
  center,
  recommendations = [],
  selectedPlaceId = null,
  onSelectPlace,
}: Props) {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {recommendations.map((item) => {
        const isSelected = item.placeId === selectedPlaceId;
        return (
          <CircleMarker
            key={item.placeId}
            center={[item.lat, item.lng]}
            radius={isSelected ? 10 : 8}
            pathOptions={{
              color: isSelected ? "#0f766e" : "#0ea5e9",
              fillColor: isSelected ? "#14b8a6" : "#38bdf8",
              fillOpacity: 0.9,
              weight: isSelected ? 3 : 2,
            }}
            eventHandlers={{
              click: () => onSelectPlace?.(item.placeId),
            }}
          >
            <Popup>
              <strong>{item.name}</strong>
              <br />
              {item.category}
            </Popup>
          </CircleMarker>
        );
      })}

      {center && <MapFlyTo center={center} />}
    </MapContainer>
  );
}
