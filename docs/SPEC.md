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
2. **`/muscle/[slug]`** — Top-ranked exercises for that muscle (80/20 cutoff, top 5 max). Gold/silver/bronze badges for top 3. Show name, why_it_works, rep range, estimated minutes, YouTube search link. "Time saved vs typical bro split" stat at top.
3. **`/routine`** — Auto-generated <30 min full-body workout. Greedy: pick #1 from each muscle (legs → back → chest → shoulders → arms → core), sum times, stop at 30 min. Show total time and bro-split equivalent.

## Pareto cutoff
Sort exercises for a muscle by `pareto_score` desc. Include until cumulative impact ≥ 80% of total impact for that muscle, cap at top 5. Effectively all 3 seeded per muscle pass for v1.

## Time-saved math
Baseline = 60 min/muscle/week (5-day bro split @ 60 min). Pareto routine ≈ sum of `estimated_minutes` for the muscle's top exercises. Display `Save ~X min/week`.

## Seed exercises (18)
- **Chest:** Barbell Bench Press, Weighted Dips, Incline DB Press
- **Back:** Weighted Pull-ups, Barbell Row, Deadlift
- **Legs:** Barbell Squat, Romanian Deadlift, Bulgarian Split Squat
- **Shoulders:** Overhead Press, Lateral Raise, Face Pull
- **Arms:** Close-Grip Bench, Barbell Curl, Skull Crushers
- **Core:** Hanging Leg Raise, Weighted Plank, Ab Wheel

Highest-EMG-activation variants only. No machines, no isolation that misses the 80/20.

## Design
- Dark mode default, high contrast
- Brutally minimal copy
- Rank badges: gold (#FFD700), silver (#C0C0C0), bronze (#CD7F32)
- shadcn/ui Card + Badge heavily

## Out of scope (v1)
- Accounts, logging, progress tracking
- Video demos (link to YouTube search URL only)
