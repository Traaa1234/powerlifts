"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSelection } from "@/components/selection-provider";
import {
  type Exercise,
  type MuscleGroup,
  MUSCLES,
  MUSCLE_LABELS,
  exerciseById,
  youtubeSearchUrl,
} from "@/lib/exercises";
import { musclesWorked } from "@/lib/routine";

const ORDER: Record<MuscleGroup, number> = {
  legs: 0,
  back: 1,
  chest: 2,
  shoulders: 3,
  arms: 4,
  core: 5,
};

export function CustomRoutine() {
  const { selected, toggle, clear } = useSelection();

  const picks: Exercise[] = selected
    .map((id) => exerciseById(id))
    .filter((ex): ex is Exercise => Boolean(ex))
    .sort((a, b) => ORDER[a.primary] - ORDER[b.primary]);

  const totalMinutes = picks.reduce((s, ex) => s + ex.estimated_minutes, 0);
  const covered = new Set<MuscleGroup>();
  picks.forEach((ex) => musclesWorked(ex).forEach((m) => covered.add(m)));

  if (picks.length === 0) {
    return (
      <section className="space-y-3">
        <h2 className="text-2xl font-bold tracking-tight font-mono uppercase">
          My routine
        </h2>
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <p className="text-muted-foreground text-sm">
              No lifts picked yet. Open any muscle page and tap{" "}
              <span className="font-mono text-foreground">
                + Add to routine
              </span>{" "}
              to build your own workout.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 border border-foreground px-5 py-2.5 font-mono uppercase tracking-wider text-xs hover:bg-foreground hover:text-background transition-colors"
            >
              Browse muscles →
            </Link>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold tracking-tight font-mono uppercase">
          My routine
        </h2>
        <button
          type="button"
          onClick={clear}
          className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 font-mono text-sm uppercase tracking-wider">
        <span>
          <span className="text-foreground font-bold text-lg">
            {picks.length}
          </span>{" "}
          lifts
        </span>
        <span>
          <span className="text-gold font-bold text-lg">{totalMinutes}</span>{" "}
          min/session
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {MUSCLES.map((m) => {
          const hit = covered.has(m);
          return (
            <span
              key={m}
              className={`font-mono text-xs uppercase tracking-wider rounded-full border px-3 py-1 ${
                hit
                  ? "border-gold text-gold"
                  : "border-border text-muted-foreground"
              }`}
            >
              {MUSCLE_LABELS[m]}
            </span>
          );
        })}
      </div>

      <ol className="space-y-3">
        {picks.map((ex, i) => (
          <li key={ex.id}>
            <Card>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-foreground font-mono text-sm font-bold">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <span className="font-bold">{ex.name}</span>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="font-mono">
                        {ex.rep_range}
                      </Badge>
                      <Badge variant="outline" className="font-mono">
                        ~{ex.estimated_minutes} min
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    <span className="text-gold">
                      {MUSCLE_LABELS[ex.primary]}
                    </span>
                    {ex.secondary.length > 0 && (
                      <span>
                        + {ex.secondary.map((m) => MUSCLE_LABELS[m]).join(", ")}
                      </span>
                    )}
                    <a
                      href={youtubeSearchUrl(ex.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground"
                    >
                      Form →
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(ex.id)}
                  aria-label={`Remove ${ex.name}`}
                  className="shrink-0 font-mono text-sm text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
    </section>
  );
}
