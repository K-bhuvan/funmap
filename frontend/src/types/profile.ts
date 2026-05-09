export type TimeBudget = "45-60" | "60-90" | "90-150";

export type DriveTolerance = "10" | "20" | "35+";

export type Vibe = "calm" | "energetic" | "social" | "solo" | "romantic" | "adventurous";

export type UserProfile = {
  version: 1;
  activities: string[];
  afterWorkTime: TimeBudget;
  weekendTime: TimeBudget;
  driveTolerance: DriveTolerance;
  vibe?: Vibe;
  createdAt: string;
  updatedAt: string;
};

