import { SwipeEventBody, SwipeDirection } from "../types/interaction.js";

type ValidationResult =
  | { ok: true; data: SwipeEventBody }
  | { ok: false; message: string };

const VALID_DIRECTIONS = new Set<string>(["left", "right"]);

const MAX_ID_LENGTH = 128;

function isSafeIdString(value: string): boolean {
  if (value.length > MAX_ID_LENGTH) {
    return false;
  }
  return !/[\r\n\0]/.test(value);
}

export function validateSwipeRequest(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, message: "Request body must be a JSON object." };
  }

  const maybe = body as { placeId?: unknown; sessionId?: unknown; direction?: unknown };

  if (typeof maybe.placeId !== "string" || maybe.placeId.trim().length === 0) {
    return { ok: false, message: "'placeId' is required and must be a non-empty string." };
  }

  if (typeof maybe.sessionId !== "string" || maybe.sessionId.trim().length === 0) {
    return { ok: false, message: "'sessionId' is required and must be a non-empty string." };
  }

  const placeId = maybe.placeId.trim();
  const sessionId = maybe.sessionId.trim();

  if (!isSafeIdString(placeId)) {
    return {
      ok: false,
      message: `'placeId' must be at most ${MAX_ID_LENGTH} characters and cannot contain control characters.`,
    };
  }

  if (!isSafeIdString(sessionId)) {
    return {
      ok: false,
      message: `'sessionId' must be at most ${MAX_ID_LENGTH} characters and cannot contain control characters.`,
    };
  }

  if (typeof maybe.direction !== "string" || !VALID_DIRECTIONS.has(maybe.direction)) {
    return { ok: false, message: "'direction' must be either 'left' or 'right'." };
  }

  return {
    ok: true,
    data: {
      placeId,
      sessionId,
      direction: maybe.direction as SwipeDirection,
    },
  };
}
