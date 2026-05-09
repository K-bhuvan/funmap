import type { DistanceUnit, UserProfile } from "../types/profile";

const STORAGE_KEY = "funmap.profile.v1";

export function loadUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const maybe = parsed as Partial<UserProfile>;
    if (maybe.version !== 1) return null;
    if (!Array.isArray(maybe.activities)) return null;
    if (typeof maybe.afterWorkTime !== "string") return null;
    if (typeof maybe.weekendTime !== "string") return null;
    if (typeof maybe.driveTolerance !== "string") return null;
    if (typeof maybe.createdAt !== "string") return null;
    if (typeof maybe.updatedAt !== "string") return null;

    const distanceUnit: DistanceUnit = maybe.distanceUnit === "km" ? "km" : "miles";
    const profile: UserProfile = {
      version: 1,
      activities: maybe.activities,
      afterWorkTime: maybe.afterWorkTime as UserProfile["afterWorkTime"],
      weekendTime: maybe.weekendTime as UserProfile["weekendTime"],
      driveTolerance: maybe.driveTolerance as UserProfile["driveTolerance"],
      distanceUnit,
      vibe: maybe.vibe,
      createdAt: maybe.createdAt,
      updatedAt: maybe.updatedAt,
    };

    if (maybe.distanceUnit !== "km" && maybe.distanceUnit !== "miles") {
      saveUserProfile(profile);
    }

    return profile;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function clearUserProfile() {
  localStorage.removeItem(STORAGE_KEY);
}

