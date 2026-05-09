import { useMemo, useState } from "react";
import type { DistanceUnit, DriveTolerance, TimeBudget, UserProfile, Vibe } from "../types/profile";
import styles from "./OnboardingWizard.module.css";

type Props = {
  onComplete: (profile: UserProfile) => void;
  onSkip?: () => void;
  /** When editing preferences, seed form from existing profile */
  initialProfile?: UserProfile | null;
};

const DEFAULT_ACTIVITIES = [
  "Walk",
  "Coffee",
  "Sunset",
  "Scenic drive",
  "Street food",
  "Dessert",
  "Bookstore",
  "Viewpoint",
  "Quiet park",
  "Museum",
  "Shopping stroll",
  "Hidden gems",
] as const;

const TIME_OPTIONS: Array<{ value: TimeBudget; label: string }> = [
  { value: "45-60", label: "45–60 min" },
  { value: "60-90", label: "60–90 min" },
  { value: "90-150", label: "90–150 min" },
];

const DRIVE_OPTIONS: Array<{ value: DriveTolerance; label: string }> = [
  { value: "10", label: "10 min" },
  { value: "20", label: "20 min" },
  { value: "35+", label: "35+ min" },
];

const VIBE_OPTIONS: Array<{ value: Vibe; label: string }> = [
  { value: "calm", label: "Calm" },
  { value: "energetic", label: "Energetic" },
  { value: "social", label: "Social" },
  { value: "solo", label: "Solo" },
  { value: "romantic", label: "Romantic" },
  { value: "adventurous", label: "Adventurous" },
];

export default function OnboardingWizard({ onComplete, onSkip, initialProfile = null }: Props) {
  const [step, setStep] = useState<1 | 2>(1);

  const [activities, setActivities] = useState<string[]>(() => initialProfile?.activities.slice() ?? []);
  const [afterWorkTime, setAfterWorkTime] = useState<TimeBudget>(
    () => initialProfile?.afterWorkTime ?? "60-90",
  );
  const [weekendTime, setWeekendTime] = useState<TimeBudget>(
    () => initialProfile?.weekendTime ?? "90-150",
  );
  const [driveTolerance, setDriveTolerance] = useState<DriveTolerance>(
    () => initialProfile?.driveTolerance ?? "20",
  );
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>(
    () => initialProfile?.distanceUnit ?? "miles",
  );
  const [vibe, setVibe] = useState<Vibe | "">(() => initialProfile?.vibe ?? "");

  const canContinueFromStep1 = activities.length >= 3;

  const title = useMemo(() => {
    if (step === 1) return "Pick what you like";
    return "How do you feel today?";
  }, [step]);

  const subtitle = useMemo(() => {
    if (step === 1) {
      return "Choose a few activities. We’ll build a browse-first feed around them.";
    }
    return "Optional. Saved to your profile; the live feed will reflect it when mood-aware ranking is enabled.";
  }, [step]);

  function toggleActivity(a: string) {
    setActivities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  function handlePrimary() {
    if (step === 1) {
      if (!canContinueFromStep1) return;
      setStep(2);
      return;
    }

    const now = new Date().toISOString();
    const profile: UserProfile = {
      version: 1,
      activities,
      afterWorkTime,
      weekendTime,
      driveTolerance,
      distanceUnit,
      vibe: vibe === "" ? undefined : (vibe as Vibe),
      createdAt: initialProfile?.createdAt ?? now,
      updatedAt: now,
    };
    onComplete(profile);
  }

  function handleBack() {
    if (step === 1) return;
    setStep(1);
  }

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <div className={styles.titleRow}>
          <div className={styles.title}>{title}</div>
          <div className={styles.step}>Step {step} / 2</div>
        </div>
        <p className={styles.subtitle}>{subtitle}</p>

        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={2}
          aria-label="Onboarding progress"
        >
          <div className={styles.progressFill} style={{ width: `${(step / 2) * 100}%` }} />
        </div>

        {step === 1 && (
          <>
            <div className={styles.chips}>
              {DEFAULT_ACTIVITIES.map((a) => {
                const active = activities.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                    onClick={() => toggleActivity(a)}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
            <div className={styles.hint}>
              Pick at least 3. You can change this later.
            </div>

            <div className={styles.sectionLabel}>Time and travel</div>
            <p className={styles.sectionHint}>
              Saved with your profile. Recommendations will use these when ranking by how long you have and how far
              you’ll go.
            </p>
            <div className={styles.row}>
              <div className={styles.field}>
                <div className={styles.label}>After work time</div>
                <select
                  className={styles.select}
                  value={afterWorkTime}
                  onChange={(e) => setAfterWorkTime(e.target.value as TimeBudget)}
                >
                  {TIME_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Weekend time</div>
                <select
                  className={styles.select}
                  value={weekendTime}
                  onChange={(e) => setWeekendTime(e.target.value as TimeBudget)}
                >
                  {TIME_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Drive tolerance</div>
                <select
                  className={styles.select}
                  value={driveTolerance}
                  onChange={(e) => setDriveTolerance(e.target.value as DriveTolerance)}
                >
                  {DRIVE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.sectionLabel}>Distance unit</div>
            <div className={styles.unitToggle}>
              {(["miles", "km"] as DistanceUnit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  className={`${styles.unitBtn} ${distanceUnit === u ? styles.unitBtnActive : ""}`}
                  onClick={() => setDistanceUnit(u)}
                  aria-pressed={distanceUnit === u}
                >
                  {u === "miles" ? "Miles" : "Kilometers"}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <div className={styles.chips}>
            {VIBE_OPTIONS.map((v) => {
              const active = vibe === v.value;
              return (
                <button
                  key={v.value}
                  type="button"
                  className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                  onClick={() => setVibe((prev) => (prev === v.value ? "" : v.value))}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        )}

        <div className={styles.actions}>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" className={styles.btn} onClick={handleBack} disabled={step === 1}>
              Back
            </button>
            {onSkip && (
              <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={onSkip}>
                Skip for now
              </button>
            )}
          </div>

          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary} ${
              step === 1 && !canContinueFromStep1 ? styles.btnDisabled : ""
            }`}
            onClick={handlePrimary}
            disabled={step === 1 && !canContinueFromStep1}
          >
            {step === 2 ? "Finish" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

