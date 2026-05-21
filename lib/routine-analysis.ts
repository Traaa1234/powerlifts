import { type Exercise, type MuscleGroup, MUSCLES } from "./exercises";

/** A lift's assisting (secondary) muscles count at half its impact. */
export const SECONDARY_FACTOR = 0.5;

export type IntensityBand = "Light" | "Moderate" | "Hard" | "Brutal";
export type EffectLevel = "Untrained" | "Light" | "Moderate" | "Heavy";

export type MuscleEffect = {
  muscle: MuscleGroup;
  stimulus: number; // summed impact: full for primary, half for assists
  share: number; // 0-1, relative to the most-worked muscle in the routine
  level: EffectLevel;
};

export type RoutineAnalysis = {
  exerciseCount: number;
  totalMinutes: number;
  musclesWorkedCount: number; // of 6
  compoundCount: number;
  isolationCount: number;
  avgImpact: number;
  intensity: IntensityBand;
  totalVolume: number; // summed stimulus across all muscles
  perMuscle: MuscleEffect[];
};

function intensityBand(avgImpact: number): IntensityBand {
  if (avgImpact >= 90) return "Brutal";
  if (avgImpact >= 80) return "Hard";
  if (avgImpact >= 70) return "Moderate";
  return "Light";
}

function effectLevel(stimulus: number): EffectLevel {
  if (stimulus <= 0) return "Untrained";
  if (stimulus < 55) return "Light"; // assist work only
  if (stimulus < 130) return "Moderate"; // roughly one direct lift
  return "Heavy"; // two+ direct lifts, or a lift plus strong assists
}

/**
 * Summarises a hand-built routine: how intense it is, how much total work it
 * does, and how much stimulus each of the six muscle groups receives.
 */
export function analyzeRoutine(exercises: Exercise[]): RoutineAnalysis {
  const stimulus: Record<MuscleGroup, number> = {
    chest: 0,
    back: 0,
    legs: 0,
    shoulders: 0,
    arms: 0,
    core: 0,
  };

  let impactSum = 0;
  let totalMinutes = 0;
  let compoundCount = 0;

  for (const ex of exercises) {
    impactSum += ex.impact_score;
    totalMinutes += ex.estimated_minutes;
    if (ex.secondary.length > 0) compoundCount += 1;
    stimulus[ex.primary] += ex.impact_score;
    for (const m of ex.secondary) {
      stimulus[m] += ex.impact_score * SECONDARY_FACTOR;
    }
  }

  const totalVolume = MUSCLES.reduce((sum, m) => sum + stimulus[m], 0);
  const maxStimulus = Math.max(1, ...MUSCLES.map((m) => stimulus[m]));
  const avgImpact = exercises.length
    ? Math.round(impactSum / exercises.length)
    : 0;

  const perMuscle: MuscleEffect[] = MUSCLES.map((muscle) => ({
    muscle,
    stimulus: Math.round(stimulus[muscle]),
    share: stimulus[muscle] / maxStimulus,
    level: effectLevel(stimulus[muscle]),
  }));

  return {
    exerciseCount: exercises.length,
    totalMinutes,
    musclesWorkedCount: MUSCLES.filter((m) => stimulus[m] > 0).length,
    compoundCount,
    isolationCount: exercises.length - compoundCount,
    avgImpact,
    intensity: intensityBand(avgImpact),
    totalVolume: Math.round(totalVolume),
    perMuscle,
  };
}
