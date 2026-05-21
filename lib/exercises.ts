import rawExercises from "@/data/exercises.json";
import { rankExercises } from "./pareto";

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
  aboveCut: boolean;
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

export function exerciseById(id: string): Exercise | undefined {
  return ALL.find((ex) => ex.id === id);
}

export function byMuscle(muscle: MuscleGroup): Exercise[] {
  return ALL.filter((ex) => ex.primary === muscle);
}

/** All exercises for a muscle, ranked — nothing removed. */
export function rankedByMuscle(muscle: MuscleGroup): RankedExercise[] {
  return rankExercises(byMuscle(muscle));
}

/** Only the recommended 80/20 picks for a muscle. */
export function recommendedByMuscle(muscle: MuscleGroup): RankedExercise[] {
  return rankedByMuscle(muscle).filter((ex) => ex.aboveCut);
}

export function isMuscle(value: string): value is MuscleGroup {
  return (MUSCLES as readonly string[]).includes(value);
}

export function youtubeSearchUrl(exerciseName: string): string {
  const q = encodeURIComponent(`${exerciseName} proper form`);
  return `https://www.youtube.com/results?search_query=${q}`;
}

/** Google Scholar search for an exercise's EMG-activation literature. */
export function emgSearchUrl(exerciseName: string): string {
  const q = encodeURIComponent(`${exerciseName} EMG muscle activation`);
  return `https://scholar.google.com/scholar?q=${q}`;
}

export function scholarUrl(query: string): string {
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
}

export function webSearchUrl(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}
