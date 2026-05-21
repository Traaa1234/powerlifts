import type { Exercise, RankedExercise } from "./exercises";

export const PARETO_CUTOFF = 0.8;
export const MAX_PER_MUSCLE = 5;
export const BRO_SPLIT_MIN_PER_MUSCLE_PER_WEEK = 60;

export function paretoScore(impact: number, efficiency: number): number {
  return Math.round((impact * efficiency) / 100);
}

/**
 * Ranks every exercise by pareto_score (descending). Nothing is removed —
 * `aboveCut` flags the recommended 80/20 subset: the run of top lifts whose
 * cumulative impact reaches 80% of the muscle's total, capped at 5.
 */
export function rankExercises(exercises: Exercise[]): RankedExercise[] {
  const ranked = exercises
    .map((ex) => ({
      ...ex,
      pareto_score: paretoScore(ex.impact_score, ex.time_efficiency_score),
    }))
    .sort((a, b) => b.pareto_score - a.pareto_score);

  const totalImpact = ranked.reduce((sum, ex) => sum + ex.impact_score, 0);
  const target = totalImpact * PARETO_CUTOFF;

  let running = 0;
  let cutClosed = false;
  return ranked.map((ex, i) => {
    const aboveCut = !cutClosed && i < MAX_PER_MUSCLE;
    if (aboveCut) {
      running += ex.impact_score;
      if (running >= target || i + 1 >= MAX_PER_MUSCLE) cutClosed = true;
    }
    return { ...ex, rank: i + 1, aboveCut };
  });
}

/** The recommended 80/20 subset of a ranked list. */
export function recommended(ranked: RankedExercise[]): RankedExercise[] {
  return ranked.filter((ex) => ex.aboveCut);
}

export function paretoMinutes(
  exercises: { estimated_minutes: number }[],
): number {
  return exercises.reduce((sum, ex) => sum + ex.estimated_minutes, 0);
}

export function timeSavedVsBroSplit(paretoMin: number): number {
  return Math.max(0, BRO_SPLIT_MIN_PER_MUSCLE_PER_WEEK - paretoMin);
}
