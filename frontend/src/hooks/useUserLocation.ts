import { useEffect, useState } from "react";

export type LatLng = { lat: number; lng: number };

type LocationState =
  | { status: "pending" }
  | { status: "granted"; coords: LatLng }
  | { status: "denied"; reason: string };

export function useUserLocation() {
  const [location, setLocation] = useState<LocationState>({ status: "pending" });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ status: "denied", reason: "Geolocation is not supported by this browser." });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          status: "granted",
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        });
      },
      (err) => {
        let reason = err.message;
        if (err.code === err.PERMISSION_DENIED) reason = "Permission denied";
        else if (err.code === err.POSITION_UNAVAILABLE) reason = "Position unavailable";
        else if (err.code === err.TIMEOUT) reason = "Timed out";
        setLocation({ status: "denied", reason });
      },
      { timeout: 8000, maximumAge: 60_000 },
    );
  }, []);

  return location;
}
