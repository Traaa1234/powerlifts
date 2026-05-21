"use client";

import { useState } from "react";
import { useSelection } from "@/components/selection-provider";
import {
  type MuscleGroup,
  type RankedExercise,
  MUSCLE_LABELS,
  rankedByMuscle,
} from "@/lib/exercises";
import { cn } from "@/lib/utils";

// Workout order: big compounds first, core last.
const ORDER: MuscleGroup[] = [
  "legs",
  "back",
  "chest",
  "shoulders",
  "arms",
  "core",
];

export function ExercisePicker() {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight font-mono uppercase">
          Add lifts
        </h2>
        <p className="text-muted-foreground text-sm">
          Every lift, every muscle group — tap to add it to your routine above.
        </p>
      </div>
      <div className="space-y-2">
        {ORDER.map((muscle) => (
          <MuscleSection key={muscle} muscle={muscle} />
        ))}
      </div>
    </section>
  );
}

function MuscleSection({ muscle }: { muscle: MuscleGroup }) {
  const { isSelected } = useSelection();
  const [open, setOpen] = useState(false);
  const exercises = rankedByMuscle(muscle);
  const pickedCount = exercises.filter((ex) => isSelected(ex.id)).length;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-accent transition-colors"
      >
        <span className="font-mono uppercase tracking-wider text-sm">
          {MUSCLE_LABELS[muscle]}{" "}
          <span className="text-muted-foreground">({exercises.length})</span>
        </span>
        <span className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider">
          {pickedCount > 0 && (
            <span className="text-gold">{pickedCount} picked</span>
          )}
          <span className="text-muted-foreground text-lg leading-none">
            {open ? "−" : "+"}
          </span>
        </span>
      </button>
      {open && (
        <ul className="border-t border-border divide-y divide-border">
          {exercises.map((ex) => (
            <PickerRow key={ex.id} exercise={ex} />
          ))}
        </ul>
      )}
    </div>
  );
}

function PickerRow({ exercise }: { exercise: RankedExercise }) {
  const { isSelected, toggle } = useSelection();
  const selected = isSelected(exercise.id);

  return (
    <li className="flex items-center justify-between gap-3 p-3">
      <div className="min-w-0">
        <div className="font-medium truncate">{exercise.name}</div>
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          ~{exercise.estimated_minutes} min · pareto {exercise.pareto_score}
          {exercise.secondary.length > 0 &&
            ` · +${exercise.secondary
              .map((m) => MUSCLE_LABELS[m])
              .join(", ")}`}
          {!exercise.aboveCut && " · below 80/20"}
        </div>
      </div>
      <button
        type="button"
        onClick={() => toggle(exercise.id)}
        aria-pressed={selected}
        className={cn(
          "shrink-0 rounded-md px-3 py-1.5 font-mono uppercase tracking-wider text-xs transition-colors",
          selected
            ? "bg-gold text-black hover:bg-gold/80"
            : "border border-foreground hover:bg-foreground hover:text-background",
        )}
      >
        {selected ? "✓ Added" : "+ Add"}
      </button>
    </li>
  );
}
