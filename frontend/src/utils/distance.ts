import type { DistanceUnit } from "../types/profile";

const METERS_PER_MILE = 1609.344;

export function formatDistance(meters: number, unit: DistanceUnit = "miles"): string {
  if (unit === "miles") {
    const miles = meters / METERS_PER_MILE;
    return miles < 0.1 ? "< 0.1 mi" : `${miles.toFixed(1)} mi`;
  }
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
}
