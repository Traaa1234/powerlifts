import {
  MUSCLES,
  type MuscleGroup,
  type Exercise,
  type RankedExercise,
  allExercises,
} from "./exercises";
import { paretoScore } from "./pareto";

export const ROUTINE_MAX_MIN = 30;
export const ROUTINE_FREQUENCY_PER_WEEK = 3;
export const BRO_SPLIT_TOTAL_MIN_PER_WEEK = 300;

export type RoutineEntry = {
  exercise: RankedExercise;
  /** Muscle groups this lift was the first in the routine to cover. */
  fills: MuscleGroup[];
};

export type Routine = {
  entries: RoutineEntry[];
  totalMinutes: number;
  covered: MuscleGroup[];
  uncovered: MuscleGroup[];
  weeklyMinutes: number;
  broSplitMinutes: number;
  weeklySaved: number;
};

/** Every muscle a lift trains: its primary plus all secondaries. */
export function musclesWorked(ex: Exercise): MuscleGroup[] {
  return [ex.primary, ...ex.secondary];
}

/**
 * Greedy weighted set-cover. Each round picks the exercise that covers the most
 * still-uncovered muscle groups (primary + secondary both count), breaking ties
 * by pareto_score, while keeping the session within ROUTINE_MAX_MIN.
 */
export function buildRoutine(): Routine {
  const pool: RankedExercise[] = allExercises().map((ex) => ({
    ...ex,
    pareto_score: paretoScore(ex.impact_score, ex.time_efficiency_score),
    rank: 0,
  }));

  const covered = new Set<MuscleGroup>();
  const used = new Set<string>();
  const entries: RoutineEntry[] = [];
  let total = 0;

  while (covered.size < MUSCLES.length) {
    let best: RankedExercise | null = null;
    let bestFills: MuscleGroup[] = [];

    for (const ex of pool) {
      if (used.has(ex.id)) continue;
      if (total + ex.estimated_minutes > ROUTINE_MAX_MIN) continue;
      const fills = musclesWorked(ex).filter((m) => !covered.has(m));
      if (fills.length === 0) continue;
      const better =
        !best ||
        fills.length > bestFills.length ||
        (fills.length === bestFills.length &&
          ex.pareto_score > best.pareto_score);
      if (better) {
        best = ex;
        bestFills = fills;
      }
    }

    if (!best) break; // nothing else fits the time budget

    used.add(best.id);
    bestFills.forEach((m) => covered.add(m));
    entries.push({
      exercise: { ...best, rank: entries.length + 1 },
      fills: bestFills,
    });
    total += best.estimated_minutes;
  }

  const weeklyMinutes = total * ROUTINE_FREQUENCY_PER_WEEK;
  return {
    entries,
    totalMinutes: total,
    covered: MUSCLES.filter((m) => covered.has(m)),
    uncovered: MUSCLES.filter((m) => !covered.has(m)),
    weeklyMinutes,
    broSplitMinutes: BRO_SPLIT_TOTAL_MIN_PER_WEEK,
    weeklySaved: Math.max(0, BRO_SPLIT_TOTAL_MIN_PER_WEEK - weeklyMinutes),
  };
}

export { MUSCLES };
