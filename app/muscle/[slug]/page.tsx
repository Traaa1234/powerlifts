import Link from "next/link";
import { notFound } from "next/navigation";
import { MuscleExerciseList } from "@/components/muscle-exercise-list";
import {
  MUSCLES,
  MUSCLE_LABELS,
  isMuscle,
  rankedByMuscle,
} from "@/lib/exercises";
import { paretoMinutes, recommended, timeSavedVsBroSplit } from "@/lib/pareto";

export function generateStaticParams() {
  return MUSCLES.map((slug) => ({ slug }));
}

export default function MusclePage({ params }: { params: { slug: string } }) {
  if (!isMuscle(params.slug)) notFound();
  const muscle = params.slug;
  const ranked = rankedByMuscle(muscle);
  const picks = recommended(ranked);
  const recommendedMin = paretoMinutes(picks);
  const saved = timeSavedVsBroSplit(recommendedMin);

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
            <Stat label="80/20 min" value={String(recommendedMin)} />
            <Stat label="Saved" value={`${saved} min`} />
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Every lift for this muscle, ranked by impact-per-minute. The top{" "}
          {picks.length} are the 80/20 picks — doing just those takes{" "}
          {recommendedMin} min/week vs ~60 in a bro split. Nothing is hidden:
          pick whatever you want.{" "}
          <Link
            href="/method"
            className="underline hover:text-foreground font-mono uppercase tracking-wider text-xs"
          >
            How this is scored →
          </Link>
        </p>
      </header>

      <MuscleExerciseList exercises={ranked} />
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
