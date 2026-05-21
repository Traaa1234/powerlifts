import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MUSCLES,
  MUSCLE_LABELS,
  rankedByMuscle,
  scholarUrl,
  webSearchUrl,
} from "@/lib/exercises";
import {
  paretoMinutes,
  recommended,
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
    "How exercises are scored, how the 80/20 line works, how time saved is calculated, and the research the scores draw on.",
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
      <Section n="01" title="The score — in plain English">
        <p>
          Every exercise gets two scores, each from 1 to 100. They are{" "}
          <b>expert estimates</b> — hand-rated from strength-training research,
          not measured by a machine. Each one answers a simple question:
        </p>
        <dl className="space-y-3">
          <Term name="impact_score">
            <b>&ldquo;How much will this build me?&rdquo;</b> A higher number
            means the lift works more muscle at once and lets you keep adding
            weight over time — so it grows you faster. A barbell squat trains
            your whole lower body under hundreds of pounds, so it scores near
            100. A lateral raise trains one small shoulder muscle with light
            dumbbells, so it scores lower. Compound lifts (many muscles, one
            move) beat isolation lifts (one muscle).
          </Term>
          <Term name="time_efficiency_score">
            <b>&ldquo;How little time will it cost me?&rdquo;</b> A higher
            number means fewer sets and shorter rest — you are in and out fast.
            A plank scores high: hold for 30 seconds, barely rest, done. A heavy
            squat scores low: five sets with three minutes of rest between each
            eats your evening. A low score is not bad — it just means the lift
            is expensive in time.
          </Term>
        </dl>
        <p>
          The two scores pull in opposite directions — the biggest lifts often
          cost the most time. So PowerLifts multiplies them into one verdict:
        </p>
        <Formula>pareto_score = impact_score × time_efficiency_score ÷ 100</Formula>
        <p>
          Think of it as <b>value shopping for your gym time</b>:{" "}
          <i>impact</i> is how good the lift is, <i>time-efficiency</i> is how
          cheap it is to do. The lifts that score high on <i>both</i> — big
          results, low time cost — rise to the top. Every ranking in the app is
          sorted on this one number.
        </p>
        <p>
          Example — Barbell Bench Press: impact <b>95</b> × efficiency{" "}
          <b>75</b> ÷ 100 = <b>{exampleSaved}</b>.
        </p>
      </Section>

      {/* 2. The 80/20 line */}
      <Section n="02" title="The 80/20 line">
        <p>
          The Pareto Principle says ~80% of results come from ~20% of inputs.
          For each muscle, every exercise is sorted by{" "}
          <code className="text-foreground">pareto_score</code>. The top run of
          lifts whose combined impact reaches{" "}
          <b>{Math.round(PARETO_CUTOFF * 100)}%</b> of the muscle&apos;s total
          (capped at 5) are the <b>80/20 picks</b> — the short list that earns
          you most of the result.
        </p>
        <p>
          Nothing is hidden. Every lift stays on its muscle page, fully ranked,
          with the 80/20 line drawn through the list. Take the picks above the
          line, or choose any lifts you like and add them to a custom routine —
          the line is a recommendation, not a wall.
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
          -minute day. PowerLifts replaces that day with the muscle&apos;s 80/20
          picks (the lifts above the line):
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-border text-muted-foreground uppercase text-xs tracking-wider">
                <th className="text-left py-2">Muscle</th>
                <th className="text-right py-2">80/20 min</th>
                <th className="text-right py-2">Bro split</th>
                <th className="text-right py-2">Saved</th>
              </tr>
            </thead>
            <tbody>
              {MUSCLES.map((m) => {
                const min = paretoMinutes(recommended(rankedByMuscle(m)));
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

      {/* 6. Intensity vs volume */}
      <Section n="06" title="Intensity vs volume">
        <p>
          When you build your own routine, the summary at the top grades it on
          two numbers that sound alike but mean opposite things.
        </p>
        <dl className="space-y-3">
          <Term name="Intensity">
            <b>&ldquo;How hard do these lifts hit?&rdquo;</b> It is the{" "}
            <b>average</b> of your picked lifts&apos; impact scores. Choose
            heavy compounds — squats, deadlifts, presses — and it rates Hard or
            Brutal. Choose light isolation work and it rates Light. Because it
            is an average, adding a sixth easy exercise will not raise your
            intensity — it may even pull it down. Bands: Light (under 70),
            Moderate (70–79), Hard (80–89), Brutal (90+).
          </Term>
          <Term name="Volume">
            <b>&ldquo;How much total work am I doing?&rdquo;</b> Volume is a
            running total. Every lift you add piles more on, and every muscle a
            lift trains adds to the pile — the full impact for its primary
            muscle, half for each assisting muscle. So volume always climbs as
            your routine grows.
          </Term>
        </dl>
        <p>
          The simplest way to keep them straight:{" "}
          <b>intensity is how steep the hill is, volume is how far you walked</b>
          . A single heavy deadlift is steep but short — high intensity, low
          volume. Ten sets of light curls is a long flat walk — high volume,
          low intensity. A good routine needs enough of both.
        </p>
        <p>
          The <b>effect-per-muscle</b> bars take that same volume idea and split
          it by muscle group, so you can see which muscles are getting the work
          (Heavy / Moderate / Light) and which are being skipped (Untrained) —
          a quick read on whether your routine is balanced.
        </p>
        <h3 className="font-mono uppercase tracking-wider text-sm text-foreground pt-2">
          How this differs from the textbook
        </h3>
        <p>
          Important: these are PowerLifts&apos; own proxies, not the
          exercise-science definitions. Both are built from{" "}
          <code className="text-foreground">impact_score</code> — an editorial
          estimate — so the honesty caveat in Sources applies here too.
        </p>
        <ul className="space-y-2 list-none">
          <Cite
            href={scholarUrl(
              "resistance training volume hypertrophy dose response Schoenfeld",
            )}
          >
            <b>Volume</b>, in the research, means <b>hard sets per muscle per
            week</b> (or the older &ldquo;volume load&rdquo; = sets × reps ×
            load). Its dose-response with muscle growth is well studied.
            PowerLifts has no sets, reps, or weights — so its volume is an
            exercise-<i>selection</i> proxy, not a sets-per-week count.
          </Cite>
          <Cite
            href={scholarUrl(
              "training intensity percent 1RM strength hypertrophy",
            )}
          >
            <b>Intensity</b>, in the research, means <b>load as a % of your
            1-rep-max</b> (or effort measured by reps-in-reserve / RPE).
            PowerLifts doesn&apos;t know your weights or 1RM, so it uses the
            average impact of your chosen lifts instead.
          </Cite>
        </ul>
        <p>
          Bottom line: read PowerLifts&apos; intensity and volume as &ldquo;did
          I pick hard-hitting lifts, and enough of them?&rdquo; — not as
          &ldquo;% 1RM&rdquo; or &ldquo;sets per week.&rdquo;
        </p>
      </Section>

      {/* 7. Sources */}
      <Section n="07" title="Sources & honesty">
        <p>
          Straight talk: <code className="text-foreground">impact_score</code>{" "}
          and <code className="text-foreground">time_efficiency_score</code> are{" "}
          <b>editorial estimates</b>. They translate the consensus of
          EMG-activation research and established training science into a 1–100
          scale. They are not readings from a single lab study, and no one paper
          maps onto an exact number. Treat them as an informed starting point,
          not gospel.
        </p>
        <p className="text-foreground font-mono uppercase tracking-wider text-xs">
          Evidence base behind impact_score
        </p>
        <ul className="space-y-2 list-none">
          <Cite href={webSearchUrl("ACE commissioned EMG study best exercises")}>
            <b>ACE-commissioned EMG studies</b> — the American Council on
            Exercise has published EMG-ranked &ldquo;best exercise&rdquo; lists
            for chest, back, glutes, biceps, triceps, and abs.
          </Cite>
          <Cite
            href={scholarUrl("Boeckh-Behrens Buskies EMG fitnesskrafttraining")}
          >
            <b>Boeckh-Behrens &amp; Buskies EMG database</b> — a large German
            dataset of electromyographic activation across common gym lifts.
          </Cite>
          <Cite href={webSearchUrl("Bret Contreras Inside the Muscles EMG")}>
            <b>Contreras, &ldquo;Inside the Muscles&rdquo;</b> — a long-running
            EMG measurement series across upper- and lower-body exercises.
          </Cite>
          <Cite
            href={scholarUrl("Brad Schoenfeld hypertrophy mechanisms training")}
          >
            <b>Schoenfeld hypertrophy reviews</b> — peer-reviewed work on what
            actually drives growth: mechanical tension, range of motion,
            effective reps.
          </Cite>
        </ul>
        <p className="text-foreground font-mono uppercase tracking-wider text-xs pt-2">
          Behind time_efficiency_score
        </p>
        <p>
          Standard set-volume and rest-interval research — including{" "}
          <a
            href={scholarUrl("Schoenfeld rest interval hypertrophy")}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Schoenfeld&apos;s rest-interval work
          </a>{" "}
          — plus practical loading guidelines: how many hard sets a lift needs
          and how long it must be rested between them.
        </p>
        <p>
          Every exercise card links an{" "}
          <span className="font-mono text-foreground">EMG research →</span>{" "}
          search so you can read the primary literature for that lift and judge
          the rating yourself.
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

function Cite({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li className="border-l-2 border-border pl-4">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground"
      >
        {children}{" "}
        <span className="font-mono text-xs uppercase tracking-wider">→</span>
      </a>
    </li>
  );
}
