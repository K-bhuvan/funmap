type NominatimResult = {
  lat: string;
  lon: string;
  display_name?: string;
};

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

export class GeocodeError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "GeocodeError";
  }
}

/**
 * Resolves a postal code via Nominatim (server-side only; include a real contact in production).
 * @see https://operations.osmfoundation.org/policies/nominatim/
 */
export async function geocodePostalCode(
  postalCode: string,
  countryCode: string,
): Promise<{ lat: number; lng: number; label: string }> {
  const params = new URLSearchParams({
    postalcode: postalCode,
    countrycodes: countryCode,
    format: "json",
    limit: "1",
  });

  const url = `${NOMINATIM}?${params.toString()}`;
  const userAgent =
    process.env.NOMINATIM_USER_AGENT ??
    "funmap/0.1 (development; configure NOMINATIM_USER_AGENT for production)";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  let res: Response;
  try {
    res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": userAgent,
      },
    });
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new GeocodeError("Geocoding request timed out.", 504);
    }
    throw new GeocodeError("Could not reach geocoding service.", 502);
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    throw new GeocodeError("Geocoding service returned an error.", 502);
  }

  const data: unknown = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new GeocodeError("No location found for that postal code.", 404);
  }

  const first = data[0] as NominatimResult;
  const lat = Number.parseFloat(first.lat);
  const lng = Number.parseFloat(first.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new GeocodeError("Invalid response from geocoding service.", 502);
  }

  const label =
    typeof first.display_name === "string" && first.display_name.length > 0
      ? first.display_name
      : `${postalCode}, ${countryCode.toUpperCase()}`;

  return { lat, lng, label };
}
