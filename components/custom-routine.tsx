"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSelection } from "@/components/selection-provider";
import {
  type Exercise,
  type MuscleGroup,
  MUSCLE_LABELS,
  exerciseById,
  youtubeSearchUrl,
} from "@/lib/exercises";
import {
  type EffectLevel,
  type MuscleEffect,
  analyzeRoutine,
} from "@/lib/routine-analysis";

const ORDER: Record<MuscleGroup, number> = {
  legs: 0,
  back: 1,
  chest: 2,
  shoulders: 3,
  arms: 4,
  core: 5,
};

const INTENSITY_GOLD = new Set(["Hard", "Brutal"]);

const EFFECT_FILL: Record<EffectLevel, string> = {
  Untrained: "bg-transparent",
  Light: "bg-muted-foreground",
  Moderate: "bg-foreground",
  Heavy: "bg-gold",
};

export function CustomRoutine() {
  const { selected, toggle, clear } = useSelection();

  const picks: Exercise[] = selected
    .map((id) => exerciseById(id))
    .filter((ex): ex is Exercise => Boolean(ex))
    .sort((a, b) => ORDER[a.primary] - ORDER[b.primary]);

  if (picks.length === 0) {
    return (
      <section className="space-y-3">
        <h2 className="text-2xl font-bold tracking-tight font-mono uppercase">
          My routine
        </h2>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground text-sm">
              No lifts picked yet. Use the{" "}
              <span className="font-mono text-foreground">Add lifts</span>{" "}
              catalog below to pull exercises from any muscle group — or open a
              muscle page and tap{" "}
              <span className="font-mono text-foreground">
                + Add to routine
              </span>
              .
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const a = analyzeRoutine(picks);
  const effects = [...a.perMuscle].sort(
    (x, y) => ORDER[x.muscle] - ORDER[y.muscle],
  );

  return (
    <section className="space-y-5">
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

      {/* Summary stat tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Muscle groups" value={`${a.musclesWorkedCount} / 6`} />
        <Stat
          label="Intensity"
          value={a.intensity}
          sub={`avg impact ${a.avgImpact}`}
          gold={INTENSITY_GOLD.has(a.intensity)}
        />
        <Stat
          label="Total volume"
          value={String(a.totalVolume)}
          sub="stimulus pts"
        />
        <Stat label="Time" value={`${a.totalMinutes} min`} />
      </div>
      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground -mt-2">
        {a.exerciseCount} lifts · {a.compoundCount} compound ·{" "}
        {a.isolationCount} isolation
      </p>

      {/* Per-muscle effect bars */}
      <div className="space-y-2">
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Effect on each muscle
        </div>
        <div className="space-y-1.5">
          {effects.map((effect) => (
            <MuscleBar key={effect.muscle} effect={effect} />
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground pt-1">
          Effect = a lift&apos;s full impact for its primary muscle, half for
          each assisting muscle.
        </p>
      </div>

      {/* Exercise list */}
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

function Stat({
  label,
  value,
  sub,
  gold,
}: {
  label: string;
  value: string;
  sub?: string;
  gold?: boolean;
}) {
  return (
    <div className="border border-border rounded-lg p-4 space-y-1">
      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div
        className={`font-bold text-2xl ${gold ? "text-gold" : "text-foreground"}`}
      >
        {value}
      </div>
      {sub && (
        <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          {sub}
        </div>
      )}
    </div>
  );
}

function MuscleBar({ effect }: { effect: MuscleEffect }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 font-mono text-xs uppercase tracking-wider">
        {MUSCLE_LABELS[effect.muscle]}
      </span>
      <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full ${EFFECT_FILL[effect.level]}`}
          style={{ width: `${Math.round(effect.share * 100)}%` }}
        />
      </div>
      <span
        className={`w-24 shrink-0 text-right font-mono text-xs uppercase tracking-wider ${
          effect.level === "Untrained"
            ? "text-muted-foreground"
            : effect.level === "Heavy"
              ? "text-gold"
              : "text-foreground"
        }`}
      >
        {effect.level}
      </span>
    </div>
  );
}
