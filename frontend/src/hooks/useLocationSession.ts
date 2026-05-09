import { useCallback, useMemo, useState } from "react";
import { useUserLocation, type LatLng } from "./useUserLocation";

export function useLocationSession() {
  const locationState = useUserLocation();
  const [postalLocation, setPostalLocation] = useState<{ coords: LatLng; summary: string } | null>(null);
  const [postalCodeInput, setPostalCodeInput] = useState("");
  const [countryCodeInput, setCountryCodeInput] = useState("US");
  const [postalError, setPostalError] = useState<string | null>(null);
  const [postalLoading, setPostalLoading] = useState(false);

  const effectiveCoords: LatLng | null = useMemo(
    () =>
      locationState.status === "granted" ? locationState.coords : postalLocation?.coords ?? null,
    [locationState, postalLocation],
  );

  const applyPostal = useCallback(async () => {
    setPostalError(null);
    setPostalLoading(true);
    try {
      const res = await fetch("/v1/geocode/postal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postalCode: postalCodeInput.trim(),
          countryCode: countryCodeInput,
        }),
      });
      const json: unknown = await res.json();
      if (!res.ok) {
        const err = json as { message?: string };
        setPostalError(err.message ?? "Could not look up that postal code.");
        return;
      }
      const data = json as {
        lat: number;
        lng: number;
        label?: string;
        postalCode?: string;
        countryCode?: string;
      };
      setPostalLocation({
        coords: { lat: data.lat, lng: data.lng },
        summary:
          data.label ??
          `${data.postalCode ?? postalCodeInput.trim()} (${data.countryCode ?? countryCodeInput})`,
      });
    } catch {
      setPostalError("Could not reach the server.");
    } finally {
      setPostalLoading(false);
    }
  }, [postalCodeInput, countryCodeInput]);

  const clearPostalLocation = useCallback(() => {
    setPostalLocation(null);
    setPostalError(null);
  }, []);

  return {
    locationState,
    effectiveCoords,
    postalLocation,
    postalCodeInput,
    setPostalCodeInput,
    countryCodeInput,
    setCountryCodeInput,
    postalError,
    postalLoading,
    applyPostal,
    clearPostalLocation,
  };
}

export type LocationSession = ReturnType<typeof useLocationSession>;
