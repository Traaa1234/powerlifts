import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MUSCLES,
  MUSCLE_LABELS,
  MUSCLE_TAGLINES,
  rankedByMuscle,
} from "@/lib/exercises";
import { paretoMinutes } from "@/lib/pareto";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="text-5xl font-bold tracking-tight">
          The minimum lifts for maximum gains.
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Eighteen exercises. Six muscle groups. Ranked by impact-per-minute.
          Everything else has been cut.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MUSCLES.map((muscle) => {
          const top = rankedByMuscle(muscle);
          const minutes = paretoMinutes(top);
          return (
            <Link key={muscle} href={`/muscle/${muscle}`} className="group">
              <Card className="h-full transition-colors group-hover:border-foreground/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-mono uppercase tracking-wider text-2xl">
                      {MUSCLE_LABELS[muscle]}
                    </CardTitle>
                    <Badge variant="outline" className="font-mono">
                      {top.length} lifts
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {MUSCLE_TAGLINES[muscle]}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    <span>
                      <span className="text-foreground font-bold">
                        {minutes}
                      </span>{" "}
                      min/wk
                    </span>
                    <span>·</span>
                    <span className="truncate">Top: {top[0]?.name}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      <section>
        <Link
          href="/routine"
          className="inline-flex items-center gap-2 border border-foreground px-6 py-3 font-mono uppercase tracking-wider text-sm hover:bg-foreground hover:text-background transition-colors"
        >
          Build a 30-minute full-body workout →
        </Link>
      </section>
    </div>
  );
}
