type ValidationResult =
  | { ok: true; data: { postalCode: string; countryCode: string } }
  | { ok: false; message: string };

const MAX_POSTAL_LEN = 16;

/** Alphanumeric, spaces, hyphens — typical ZIP / PIN formats. */
const POSTAL_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9 \-]{1,15}$/;

export function validatePostalGeocodeBody(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, message: "Request body must be a JSON object." };
  }

  const maybe = body as { postalCode?: unknown; countryCode?: unknown };

  if (typeof maybe.postalCode !== "string" || maybe.postalCode.trim().length === 0) {
    return { ok: false, message: "'postalCode' is required and must be a non-empty string." };
  }

  const postalCode = maybe.postalCode.trim();
  if (postalCode.length > MAX_POSTAL_LEN || !POSTAL_PATTERN.test(postalCode)) {
    return {
      ok: false,
      message: `'postalCode' must be 2–${MAX_POSTAL_LEN} characters (letters, digits, spaces, or hyphens).`,
    };
  }

  let countryCode = "us";
  if (maybe.countryCode !== undefined && maybe.countryCode !== null) {
    if (typeof maybe.countryCode !== "string" || !/^[a-zA-Z]{2}$/.test(maybe.countryCode)) {
      return { ok: false, message: "'countryCode' must be a two-letter ISO country code when provided." };
    }
    countryCode = maybe.countryCode.toLowerCase();
  }

  return { ok: true, data: { postalCode, countryCode } };
}
