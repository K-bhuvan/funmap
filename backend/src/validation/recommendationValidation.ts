import { QueryRequestBody, QueryMode } from "../types/recommendation.js";

type ValidationResult =
  | { ok: true; data: QueryRequestBody }
  | { ok: false; message: string };

const MAX_QUERY_LENGTH = 2000;

function isValidLocation(value: unknown): value is { lat: number; lng: number } {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const maybe = value as { lat?: unknown; lng?: unknown };

  if (typeof maybe.lat !== "number" || typeof maybe.lng !== "number") {
    return false;
  }
  if (!Number.isFinite(maybe.lat) || !Number.isFinite(maybe.lng)) {
    return false;
  }
  return maybe.lat >= -90 && maybe.lat <= 90 && maybe.lng >= -180 && maybe.lng <= 180;
}

export function validateQueryRequest(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return {
      ok: false,
      message: "Request body must be a JSON object.",
    };
  }

  const maybe = body as {
    query?: unknown;
    mode?: unknown;
    location?: unknown;
  };

  if (typeof maybe.query !== "string" || maybe.query.trim().length === 0) {
    return {
      ok: false,
      message: "'query' is required and must be a non-empty string.",
    };
  }

  if (maybe.query.length > MAX_QUERY_LENGTH) {
    return {
      ok: false,
      message: `'query' must be at most ${MAX_QUERY_LENGTH} characters.`,
    };
  }

  const mode: QueryMode = maybe.mode === "surprise" ? "surprise" : "normal";

  if (typeof maybe.mode !== "undefined" && maybe.mode !== "normal" && maybe.mode !== "surprise") {
    return {
      ok: false,
      message: "'mode' must be either 'normal' or 'surprise' when provided.",
    };
  }

  if (typeof maybe.location !== "undefined" && maybe.location !== null && !isValidLocation(maybe.location)) {
    return {
      ok: false,
      message: "'location' must be an object with numeric 'lat' and 'lng' when provided.",
    };
  }

  return {
    ok: true,
    data: {
      query: maybe.query.trim(),
      mode,
      location: maybe.location ?? null,
    },
  };
}
