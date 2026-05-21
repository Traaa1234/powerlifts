# PowerLifts — Spec

A web app that ranks exercises by impact-per-minute using the Pareto Principle. Surface only the lifts that deliver maximum hypertrophy/strength with minimum time.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Local `data/exercises.json` (no DB)
- pnpm

## Data model
```ts
type Exercise = {
  id: string;
  name: string;
  primary: MuscleGroup;
  secondary: MuscleGroup[];
  impact_score: number;        // 1-100, EMG + compound-ness
  time_efficiency_score: number; // 1-100, inverse of sets * time/set
  pareto_score: number;        // computed: impact * efficiency / 100
  equipment: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  rep_range: string;           // "3x5", "4x6-8", etc.
  estimated_minutes: number;   // sets * time/set including rest
  why_it_works: string;        // one sentence
};

type MuscleGroup = "chest" | "back" | "legs" | "shoulders" | "arms" | "core";
```

## Pages
1. **`/`** — 6-muscle grid (Chest, Back, Legs, Shoulders, Arms, Core). Cards link to muscle detail.
2. **`/muscle/[slug]`** — **Every** exercise for that muscle, ranked by `pareto_score` — nothing hidden. The 80/20 line is drawn through the list (a divider) marking the recommended subset. Gold/silver/bronze badges for top 3. Each card: name, why_it_works, Compound/Isolation tag + secondary muscles, rep range, estimated minutes, EMG-research link, YouTube link, and a **+ Add to routine** toggle. Header stats: total lifts, 80/20 minutes, time saved.
3. **`/routine`** — Three parts: **My routine** (the user's hand-picked lifts, with total time + muscle coverage + remove/clear), **Add lifts** (a collapsible catalog of all 6 muscle groups — every exercise with a toggle, so a multi-muscle routine is built from one page), and the **Auto 80/20 routine** (compound set-cover, see below).
4. **`/method`** — Documentation page. Explains the score in plain English, the 80/20 line, the bro-split baseline, both time-saved formulas, compound coverage, and a Sources section naming the real evidence bases. Numbers are computed live from the data so docs never drift.

## Selection / pick-and-choose
A client-side `SelectionProvider` (React context) holds the user's picked exercise IDs, persisted to `localStorage` (`powerlifts:selection`). The muscle-page toggle adds/removes; the routine page renders the picks as a custom routine; the nav shows a live count badge. No DB, no accounts — picks live in the browser.

## Routine builder (compound set-cover)
Greedy weighted set-cover. Each round picks the exercise covering the most still-uncovered muscle groups (primary + secondary both count), ties broken by `pareto_score`, while keeping the session within 30 min. Result: Weighted Dips + Romanian Deadlift + Ab Wheel = 28 min, all 6 groups covered. Six separate primary lifts would need 51+ min, so compound coverage is what makes a true sub-30 full body possible.

## Pareto line (not a cut)
Sort a muscle's exercises by `pareto_score` desc. Walk the list accumulating impact; the run of lifts reaching ≥80% of total impact (capped at 5) is flagged `aboveCut: true` — the recommended subset. **Nothing is removed** — all exercises render, ranked, with the 80/20 line drawn as a divider.

## Time-saved math
Baseline = 60 min/muscle/week (5-day bro split @ 60 min). The muscle's 80/20 minutes = sum of `estimated_minutes` for the `aboveCut` lifts. Display `Saved = 60 − 80/20 min`.

## Seed exercises (24)
- **Chest:** Barbell Bench Press, Weighted Dips, Incline DB Press
- **Back:** Weighted Pull-ups, Barbell Row, Deadlift
- **Legs:** Barbell Squat, Romanian Deadlift, Bulgarian Split Squat
- **Shoulders:** Overhead Press, Lateral Raise, Face Pull
- **Arms:** Close-Grip Bench, Barbell Curl, Skull Crushers
- **Core:** Hanging Leg Raise, Weighted Plank, Ab Wheel
- **Kettlebell (compound):** KB Swing, KB Clean & Press, KB Goblet Squat, KB Single-Arm Row, KB Front Rack Carry, Turkish Get-Up

Highest-EMG-activation variants only. No machines, no isolation that misses the 80/20.

`impact_score` and `time_efficiency_score` are seeded expert estimates (editorial, synthesised from EMG/training research, not formula-derived); `pareto_score` is computed. The `/method` Sources section names the real evidence bases (ACE EMG studies, Boeckh-Behrens EMG database, Contreras "Inside the Muscles", Schoenfeld reviews); each exercise card links a Google Scholar EMG search. Exercises below the 80/20 line still display — they are just marked, never hidden.

## Design
- Dark mode default, high contrast
- Brutally minimal copy
- Rank badges: gold (#FFD700), silver (#C0C0C0), bronze (#CD7F32)
- shadcn/ui Card + Badge heavily

## Out of scope (v1)
- Accounts, logging, progress tracking
- Video demos (link to YouTube search URL only)
