import type { Exercise, RankedExercise } from "./exercises";

export const PARETO_CUTOFF = 0.8;
export const MAX_PER_MUSCLE = 5;
export const BRO_SPLIT_MIN_PER_MUSCLE_PER_WEEK = 60;

export function paretoScore(impact: number, efficiency: number): number {
  return Math.round((impact * efficiency) / 100);
}

export function rankAndCut(exercises: Exercise[]): RankedExercise[] {
  const ranked = exercises
    .map((ex) => ({
      ...ex,
      pareto_score: paretoScore(ex.impact_score, ex.time_efficiency_score),
    }))
    .sort((a, b) => b.pareto_score - a.pareto_score);

  const totalImpact = ranked.reduce((sum, ex) => sum + ex.impact_score, 0);
  const target = totalImpact * PARETO_CUTOFF;

  const cut: RankedExercise[] = [];
  let running = 0;
  for (const ex of ranked) {
    if (cut.length >= MAX_PER_MUSCLE) break;
    cut.push({ ...ex, rank: cut.length + 1 });
    running += ex.impact_score;
    if (running >= target) break;
  }
  return cut;
}

export function paretoMinutes(exercises: RankedExercise[]): number {
  return exercises.reduce((sum, ex) => sum + ex.estimated_minutes, 0);
}

export function timeSavedVsBroSplit(paretoMin: number): number {
  return Math.max(0, BRO_SPLIT_MIN_PER_MUSCLE_PER_WEEK - paretoMin);
}
