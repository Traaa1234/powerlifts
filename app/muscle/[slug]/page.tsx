import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RankBadge } from "@/components/rank-badge";
import {
  MUSCLES,
  MUSCLE_LABELS,
  isMuscle,
  rankedByMuscle,
  youtubeSearchUrl,
} from "@/lib/exercises";
import { paretoMinutes, timeSavedVsBroSplit } from "@/lib/pareto";

export function generateStaticParams() {
  return MUSCLES.map((slug) => ({ slug }));
}

export default function MusclePage({ params }: { params: { slug: string } }) {
  if (!isMuscle(params.slug)) notFound();
  const muscle = params.slug;
  const ranked = rankedByMuscle(muscle);
  const totalMin = paretoMinutes(ranked);
  const saved = timeSavedVsBroSplit(totalMin);

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <Link
          href="/"
          className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          ← All muscles
        </Link>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h1 className="text-5xl font-bold tracking-tight font-mono uppercase">
            {MUSCLE_LABELS[muscle]}
          </h1>
          <div className="flex gap-6 font-mono text-sm uppercase tracking-wider">
            <Stat label="Lifts" value={String(ranked.length)} />
            <Stat label="Min / wk" value={String(totalMin)} />
            <Stat label="Saved" value={`${saved} min`} />
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Cut everything below the 80/20 line. A typical 5-day bro split spends
          ~60 min/week per muscle. Pareto does it in {totalMin}.
        </p>
      </header>

      <ol className="space-y-4">
        {ranked.map((ex) => (
          <li key={ex.id}>
            <Card>
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
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {ex.why_it_works}
                    </p>
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
                  <a
                    href={youtubeSearchUrl(ex.name)}
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
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-foreground font-bold text-lg">{value}</span>
    </div>
  );
}
