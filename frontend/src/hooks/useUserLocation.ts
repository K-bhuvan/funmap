import { useEffect, useState } from "react";

export type LatLng = { lat: number; lng: number };

type LocationState =
  | { status: "pending" }
  | { status: "granted"; coords: LatLng }
  /** Precise location not available — UI should ask for postal code only (no browser error strings). */
  | { status: "denied" };

export function useUserLocation() {
  const [location, setLocation] = useState<LocationState>({ status: "pending" });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ status: "denied" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          status: "granted",
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        });
      },
      () => {
        setLocation({ status: "denied" });
      },
      { timeout: 8000, maximumAge: 60_000 },
    );
  }, []);

  return location;
}
