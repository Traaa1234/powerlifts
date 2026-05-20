import { MUSCLES, type MuscleGroup, type RankedExercise, rankedByMuscle } from "./exercises";

export const ROUTINE_MAX_MIN = 30;
export const ROUTINE_FREQUENCY_PER_WEEK = 3;
export const BRO_SPLIT_TOTAL_MIN_PER_WEEK = 300;

const ROUTINE_ORDER: MuscleGroup[] = [
  "legs",
  "back",
  "chest",
  "shoulders",
  "arms",
  "core",
];

export type RoutineEntry = {
  muscle: MuscleGroup;
  exercise: RankedExercise;
};

export type Routine = {
  entries: RoutineEntry[];
  totalMinutes: number;
  skipped: MuscleGroup[];
  weeklyMinutes: number;
  broSplitMinutes: number;
  weeklySaved: number;
};

export function buildRoutine(): Routine {
  const entries: RoutineEntry[] = [];
  const skipped: MuscleGroup[] = [];
  let total = 0;

  for (const muscle of ROUTINE_ORDER) {
    const top = rankedByMuscle(muscle)[0];
    if (!top) continue;
    if (total + top.estimated_minutes > ROUTINE_MAX_MIN) {
      skipped.push(muscle);
      continue;
    }
    entries.push({ muscle, exercise: top });
    total += top.estimated_minutes;
  }

  const weeklyMinutes = total * ROUTINE_FREQUENCY_PER_WEEK;
  return {
    entries,
    totalMinutes: total,
    skipped,
    weeklyMinutes,
    broSplitMinutes: BRO_SPLIT_TOTAL_MIN_PER_WEEK,
    weeklySaved: Math.max(0, BRO_SPLIT_TOTAL_MIN_PER_WEEK - weeklyMinutes),
  };
}

export { MUSCLES };
