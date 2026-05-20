import rawExercises from "@/data/exercises.json";
import { rankAndCut } from "./pareto";

export const MUSCLES = [
  "chest",
  "back",
  "legs",
  "shoulders",
  "arms",
  "core",
] as const;

export type MuscleGroup = (typeof MUSCLES)[number];

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Exercise = {
  id: string;
  name: string;
  primary: MuscleGroup;
  secondary: MuscleGroup[];
  impact_score: number;
  time_efficiency_score: number;
  equipment: string;
  difficulty: Difficulty;
  rep_range: string;
  estimated_minutes: number;
  why_it_works: string;
};

export type RankedExercise = Exercise & {
  pareto_score: number;
  rank: number;
};

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  chest: "Chest",
  back: "Back",
  legs: "Legs",
  shoulders: "Shoulders",
  arms: "Arms",
  core: "Core",
};

export const MUSCLE_TAGLINES: Record<MuscleGroup, string> = {
  chest: "Press, dip, repeat.",
  back: "Pull heavy. Stand up with heavy.",
  legs: "Squat. Hinge. Split.",
  shoulders: "Press overhead. Raise to the side.",
  arms: "One curl. One extension. Heavy.",
  core: "Hang, hold, roll out.",
};

const ALL: Exercise[] = rawExercises as Exercise[];

export function allExercises(): Exercise[] {
  return ALL;
}

export function byMuscle(muscle: MuscleGroup): Exercise[] {
  return ALL.filter((ex) => ex.primary === muscle);
}

export function rankedByMuscle(muscle: MuscleGroup): RankedExercise[] {
  return rankAndCut(byMuscle(muscle));
}

export function isMuscle(value: string): value is MuscleGroup {
  return (MUSCLES as readonly string[]).includes(value);
}

export function youtubeSearchUrl(exerciseName: string): string {
  const q = encodeURIComponent(`${exerciseName} proper form`);
  return `https://www.youtube.com/results?search_query=${q}`;
}
