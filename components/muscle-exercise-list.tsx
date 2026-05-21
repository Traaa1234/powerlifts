"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RankBadge } from "@/components/rank-badge";
import { useSelection } from "@/components/selection-provider";
import {
  type RankedExercise,
  MUSCLE_LABELS,
  youtubeSearchUrl,
  emgSearchUrl,
} from "@/lib/exercises";
import { cn } from "@/lib/utils";

export function MuscleExerciseList({
  exercises,
}: {
  exercises: RankedExercise[];
}) {
  const { isSelected, toggle } = useSelection();
  const pickedHere = exercises.filter((ex) => isSelected(ex.id)).length;
  const cutCount = exercises.filter((ex) => ex.aboveCut).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
        <span>
          All {exercises.length} lifts ranked · top {cutCount} are the 80/20
          picks
        </span>
        <span>
          {pickedHere > 0 ? (
            <Link href="/routine" className="text-gold hover:underline">
              {pickedHere} picked → my routine
            </Link>
          ) : (
            "Tap a lift to add it to your routine"
          )}
        </span>
      </div>

      <ol className="space-y-4">
        {exercises.map((ex, i) => {
          const selected = isSelected(ex.id);
          const showCutLine =
            i > 0 && exercises[i - 1].aboveCut && !ex.aboveCut;
          return (
            <li key={ex.id}>
              {showCutLine && (
                <div className="flex items-center gap-3 py-3 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  <span>80/20 line — diminishing returns below</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
              )}
              <Card
                className={cn(
                  "transition-colors",
                  selected
                    ? "border-gold"
                    : !ex.aboveCut && "border-border/50 opacity-90",
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-5">
                    <RankBadge rank={ex.rank} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <h2 className="text-2xl font-bold tracking-tight">
                          {ex.name}
                        </h2>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="font-mono">
                            {ex.rep_range}
                          </Badge>
                          <Badge variant="outline" className="font-mono">
                            ~{ex.estimated_minutes} min
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {ex.secondary.length > 0 ? (
                          <>
                            <Badge className="font-mono uppercase">
                              Compound
                            </Badge>
                            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                              Also trains:{" "}
                              {ex.secondary
                                .map((m) => MUSCLE_LABELS[m])
                                .join(", ")}
                            </span>
                          </>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="font-mono uppercase"
                          >
                            Isolation — {MUSCLE_LABELS[ex.primary]} only
                          </Badge>
                        )}
                      </div>

                      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                        {ex.why_it_works}
                      </p>

                      <button
                        type="button"
                        onClick={() => toggle(ex.id)}
                        aria-pressed={selected}
                        className={cn(
                          "mt-4 inline-flex items-center gap-2 rounded-md px-4 py-2 font-mono uppercase tracking-wider text-xs transition-colors",
                          selected
                            ? "bg-gold text-black hover:bg-gold/80"
                            : "border border-foreground hover:bg-foreground hover:text-background",
                        )}
                      >
                        {selected ? "✓ In my routine" : "+ Add to routine"}
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between flex-wrap gap-3 text-xs font-mono uppercase tracking-wider text-muted-foreground border-t border-border pt-4">
                    <div className="flex gap-4">
                      <span>
                        Impact{" "}
                        <span className="text-foreground font-bold">
                          {ex.impact_score}
                        </span>
                      </span>
                      <span>
                        Efficiency{" "}
                        <span className="text-foreground font-bold">
                          {ex.time_efficiency_score}
                        </span>
                      </span>
                      <span>
                        Pareto{" "}
                        <span className="text-foreground font-bold">
                          {ex.pareto_score}
                        </span>
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <a
                        href={emgSearchUrl(ex.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground"
                      >
                        EMG research →
                      </a>
                      <a
                        href={youtubeSearchUrl(ex.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground"
                      >
                        Form on YouTube →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
