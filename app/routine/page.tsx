import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MUSCLE_LABELS, youtubeSearchUrl } from "@/lib/exercises";
import { buildRoutine, ROUTINE_FREQUENCY_PER_WEEK, ROUTINE_MAX_MIN } from "@/lib/routine";

export default function RoutinePage() {
  const routine = buildRoutine();

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <Link
          href="/"
          className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          ← All muscles
        </Link>
        <h1 className="text-5xl font-bold tracking-tight">
          {routine.totalMinutes}-minute full body.
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Top-ranked lift from every muscle group that fits inside{" "}
          {ROUTINE_MAX_MIN} minutes. Do it {ROUTINE_FREQUENCY_PER_WEEK}×/week.
        </p>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Per session" value={`${routine.totalMinutes} min`} />
        <Stat label="Per week" value={`${routine.weeklyMinutes} min`} />
        <Stat label="Bro split" value={`${routine.broSplitMinutes} min`} />
        <Stat
          label="Saved"
          value={`${routine.weeklySaved} min/wk`}
          highlight
        />
      </section>

      <ol className="space-y-4">
        {routine.entries.map(({ muscle, exercise }, i) => (
          <li key={exercise.id}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-foreground font-mono text-xl font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <Badge
                          variant="outline"
                          className="font-mono uppercase mb-2"
                        >
                          {MUSCLE_LABELS[muscle]}
                        </Badge>
                        <h2 className="text-2xl font-bold tracking-tight">
                          {exercise.name}
                        </h2>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="font-mono">
                          {exercise.rep_range}
                        </Badge>
                        <Badge variant="outline" className="font-mono">
                          ~{exercise.estimated_minutes} min
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {exercise.why_it_works}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-end border-t border-border pt-4">
                  <a
                    href={youtubeSearchUrl(exercise.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  >
                    Form on YouTube →
                  </a>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>

      {routine.skipped.length > 0 && (
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Skipped (over budget):{" "}
          {routine.skipped.map((m) => MUSCLE_LABELS[m]).join(" · ")}
        </p>
      )}
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
