import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomRoutine } from "@/components/custom-routine";
import { MUSCLES, MUSCLE_LABELS, youtubeSearchUrl } from "@/lib/exercises";
import {
  buildRoutine,
  ROUTINE_FREQUENCY_PER_WEEK,
  ROUTINE_MAX_MIN,
} from "@/lib/routine";

export default function RoutinePage() {
  const routine = buildRoutine();

  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <Link
          href="/"
          className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          ← All muscles
        </Link>
        <h1 className="text-5xl font-bold tracking-tight">Routine</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Build your own from the lifts you picked, or take the auto-generated
          80/20 full-body workout below.
        </p>
      </header>

      {/* User's hand-picked routine */}
      <CustomRoutine />

      <hr className="border-border" />

      {/* Auto-generated 80/20 routine */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight font-mono uppercase">
            Auto 80/20 routine
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl">
            The fewest compound lifts whose combined muscle coverage hits all
            six groups inside {ROUTINE_MAX_MIN} minutes —{" "}
            {routine.totalMinutes} min, done {ROUTINE_FREQUENCY_PER_WEEK}×/week.
          </p>
        </div>

        {/* Coverage strip */}
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Muscle coverage
          </div>
          <div className="flex flex-wrap gap-2">
            {MUSCLES.map((m) => {
              const hit = routine.covered.includes(m);
              return (
                <span
                  key={m}
                  className={`font-mono text-xs uppercase tracking-wider rounded-full border px-3 py-1 ${
                    hit
                      ? "border-gold text-gold"
                      : "border-border text-muted-foreground line-through"
                  }`}
                >
                  {MUSCLE_LABELS[m]}
                </span>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat label="Per session" value={`${routine.totalMinutes} min`} />
          <Stat label="Per week" value={`${routine.weeklyMinutes} min`} />
          <Stat label="Bro split" value={`${routine.broSplitMinutes} min`} />
          <Stat label="Saved" value={`${routine.weeklySaved} min/wk`} highlight />
        </div>
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          <Link href="/method" className="hover:text-foreground underline">
            How is time saved calculated? →
          </Link>
        </p>

        {/* Exercises */}
        <ol className="space-y-4">
          {routine.entries.map(({ exercise, fills }, i) => (
            <li key={exercise.id}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-foreground font-mono text-xl font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <h3 className="text-2xl font-bold tracking-tight">
                          {exercise.name}
                        </h3>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="font-mono">
                            {exercise.rep_range}
                          </Badge>
                          <Badge variant="outline" className="font-mono">
                            ~{exercise.estimated_minutes} min
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <Badge className="font-mono uppercase">
                          Primary: {MUSCLE_LABELS[exercise.primary]}
                        </Badge>
                        {exercise.secondary.length > 0 && (
                          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                            Also:{" "}
                            {exercise.secondary
                              .map((m) => MUSCLE_LABELS[m])
                              .join(", ")}
                          </span>
                        )}
                      </div>

                      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                        {exercise.why_it_works}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between flex-wrap gap-3 border-t border-border pt-4 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    <span>
                      Fills:{" "}
                      <span className="text-foreground">
                        {fills.map((m) => MUSCLE_LABELS[m]).join(" · ")}
                      </span>
                    </span>
                    <a
                      href={youtubeSearchUrl(exercise.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground"
                    >
                      Form on YouTube →
                    </a>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>

        {routine.uncovered.length > 0 && (
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Not covered within budget:{" "}
            {routine.uncovered.map((m) => MUSCLE_LABELS[m]).join(" · ")}
          </p>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="border border-border rounded-lg p-4 space-y-1">
      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div
        className={`font-bold text-2xl ${
          highlight ? "text-gold" : "text-foreground"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
