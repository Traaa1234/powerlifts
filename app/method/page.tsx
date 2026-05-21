import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MUSCLES, MUSCLE_LABELS, rankedByMuscle } from "@/lib/exercises";
import {
  paretoMinutes,
  timeSavedVsBroSplit,
  paretoScore,
  PARETO_CUTOFF,
  BRO_SPLIT_MIN_PER_MUSCLE_PER_WEEK,
} from "@/lib/pareto";
import {
  buildRoutine,
  ROUTINE_FREQUENCY_PER_WEEK,
  BRO_SPLIT_TOTAL_MIN_PER_WEEK,
} from "@/lib/routine";

export const metadata = {
  title: "PowerLifts — The Method",
  description:
    "How exercises are scored, how the 80/20 cut works, and how time saved is calculated.",
};

export default function MethodPage() {
  const routine = buildRoutine();
  const exampleSaved = paretoScore(95, 75); // bench: impact 95, efficiency 75

  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <Link
          href="/"
          className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          ← All muscles
        </Link>
        <h1 className="text-5xl font-bold tracking-tight">The Method</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          PowerLifts ranks every lift on one number: gains per minute. Here is
          exactly how that number — and the time saved — is calculated.
        </p>
      </header>

      {/* 1. The score */}
      <Section n="01" title="The score">
        <p>
          Every exercise carries two researched ratings, each on a 1–100 scale.
        </p>
        <dl className="space-y-3">
          <Term name="impact_score">
            How much muscle the lift builds per hard set — driven by EMG
            activation studies and whether the movement is compound or
            isolation. Heavy multi-joint lifts (squat, deadlift, weighted
            pull-up) sit at 90–100.
          </Term>
          <Term name="time_efficiency_score">
            Gains relative to the clock — a function of sets needed and time
            per set including rest. Short, dense movements (face pull, plank)
            score highest here; long-rest strength work scores lower.
          </Term>
        </dl>
        <Formula>pareto_score = impact_score × time_efficiency_score ÷ 100</Formula>
        <p>
          Example — Barbell Bench Press: impact <b>95</b> × efficiency{" "}
          <b>75</b> ÷ 100 = <b>{exampleSaved}</b>. That single number is what
          every ranking and routine is sorted by.
        </p>
      </Section>

      {/* 2. The 80/20 cut */}
      <Section n="02" title="The 80/20 cut">
        <p>
          The Pareto Principle says ~80% of results come from ~20% of inputs.
          PowerLifts applies it literally. For each muscle, exercises are sorted
          by <code className="text-foreground">pareto_score</code>, then added
          to the list only until their combined impact reaches{" "}
          <b>{Math.round(PARETO_CUTOFF * 100)}%</b> of the muscle&apos;s total —
          capped at the top 5. Everything below the line is cut. No machines, no
          junk isolation.
        </p>
      </Section>

      {/* 3. The bro-split baseline */}
      <Section n="03" title="The bro-split baseline">
        <p>
          &quot;Time saved&quot; is measured against a{" "}
          <b>classic 5-day bro split</b> — one muscle group per training day
          (Chest day, Back day, Legs day, Shoulders day, Arms day), each session
          running about <b>{BRO_SPLIT_MIN_PER_MUSCLE_PER_WEEK} minutes</b>. Core
          gets folded into other days.
        </p>
        <Formula>
          5 days × {BRO_SPLIT_MIN_PER_MUSCLE_PER_WEEK} min ={" "}
          {BRO_SPLIT_TOTAL_MIN_PER_WEEK} min / week
        </Formula>
        <p>
          That {BRO_SPLIT_TOTAL_MIN_PER_WEEK}-minute week is the number every
          time-saved figure is compared against.
        </p>
      </Section>

      {/* 4. Time saved */}
      <Section n="04" title="How time saved is calculated">
        <p>
          It is computed in two places, with two formulas.
        </p>

        <h3 className="font-mono uppercase tracking-wider text-sm text-foreground pt-2">
          On a muscle page
        </h3>
        <Formula>
          saved = {BRO_SPLIT_MIN_PER_MUSCLE_PER_WEEK} − (time of that
          muscle&apos;s ranked lifts)
        </Formula>
        <p>
          A bro split gives each muscle one {BRO_SPLIT_MIN_PER_MUSCLE_PER_WEEK}
          -minute day. PowerLifts replaces that day with the short list of lifts
          that survived the 80/20 cut:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-border text-muted-foreground uppercase text-xs tracking-wider">
                <th className="text-left py-2">Muscle</th>
                <th className="text-right py-2">Pareto min</th>
                <th className="text-right py-2">Bro split</th>
                <th className="text-right py-2">Saved</th>
              </tr>
            </thead>
            <tbody>
              {MUSCLES.map((m) => {
                const min = paretoMinutes(rankedByMuscle(m));
                return (
                  <tr key={m} className="border-b border-border/50">
                    <td className="py-2">{MUSCLE_LABELS[m]}</td>
                    <td className="text-right py-2">{min}</td>
                    <td className="text-right py-2 text-muted-foreground">
                      {BRO_SPLIT_MIN_PER_MUSCLE_PER_WEEK}
                    </td>
                    <td className="text-right py-2 text-gold">
                      {timeSavedVsBroSplit(min)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h3 className="font-mono uppercase tracking-wider text-sm text-foreground pt-4">
          On the routine page
        </h3>
        <Formula>
          weekly = session × {ROUTINE_FREQUENCY_PER_WEEK} runs · saved ={" "}
          {BRO_SPLIT_TOTAL_MIN_PER_WEEK} − weekly
        </Formula>
        <p>
          The full-body routine is {routine.totalMinutes} minutes, run{" "}
          {ROUTINE_FREQUENCY_PER_WEEK}×/week ={" "}
          <b>{routine.weeklyMinutes} min/week</b>. Against the{" "}
          {BRO_SPLIT_TOTAL_MIN_PER_WEEK}-minute bro split that is{" "}
          <b className="text-gold">{routine.weeklySaved} min saved every week</b>
          .
        </p>
        <p className="text-xs text-muted-foreground">
          Note: the routine trains all six groups with compound coverage (see
          below), so the comparison is whole-week vs whole-week.
        </p>
      </Section>

      {/* 5. Compound coverage */}
      <Section n="05" title="Compound coverage">
        <p>
          A <b>compound</b> lift trains more than one muscle group: a{" "}
          <b>primary</b> target plus <b>secondary</b> muscles that work hard as
          assistors. An <b>isolation</b> lift trains one. This is why three
          lifts can be a full-body workout.
        </p>
        <div className="space-y-2">
          {routine.entries.map(({ exercise }) => (
            <div
              key={exercise.id}
              className="flex flex-wrap items-center gap-2 border border-border rounded-md p-3"
            >
              <span className="font-bold">{exercise.name}</span>
              <Badge className="font-mono uppercase">
                Primary: {MUSCLE_LABELS[exercise.primary]}
              </Badge>
              {exercise.secondary.length > 0 ? (
                <Badge variant="secondary" className="font-mono uppercase">
                  Also: {exercise.secondary.map((m) => MUSCLE_LABELS[m]).join(", ")}
                </Badge>
              ) : (
                <Badge variant="outline" className="font-mono uppercase">
                  Isolation
                </Badge>
              )}
            </div>
          ))}
        </div>
        <p>
          The routine builder picks the fewest lifts whose combined primary +
          secondary coverage spans all six muscle groups — that is the 80/20
          rule applied to the whole body, not just one muscle.
        </p>
      </Section>

      <div className="flex gap-3 flex-wrap pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-foreground px-6 py-3 font-mono uppercase tracking-wider text-sm hover:bg-foreground hover:text-background transition-colors"
        >
          Browse muscles →
        </Link>
        <Link
          href="/routine"
          className="inline-flex items-center gap-2 border border-border px-6 py-3 font-mono uppercase tracking-wider text-sm hover:border-foreground transition-colors"
        >
          See the routine →
        </Link>
      </div>
    </div>
  );
}

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-gold text-sm">{n}</span>
        <h2 className="text-2xl font-bold tracking-tight font-mono uppercase">
          {title}
        </h2>
      </div>
      <div className="space-y-4 text-muted-foreground leading-relaxed text-sm max-w-2xl">
        {children}
      </div>
    </section>
  );
}

function Term({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-border pl-4">
      <dt className="font-mono text-foreground text-sm">{name}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-4 font-mono text-sm text-foreground">
        {children}
      </CardContent>
    </Card>
  );
}
