# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start dev server at localhost:3000
npm run build     # production build
npm run type-check # run tsc --noEmit without building
npm run lint      # eslint
```

## Architecture

Next.js 15 App Router PWA. Single page (`app/page.tsx`) — no sub-routes.

### Layer breakdown

| Path | Purpose |
|---|---|
| `src/logic/program.ts` | All constants, types, and pure functions: phases, exercise library, `buildDayPlan` |
| `src/logic/scheduler.ts` | `simulateSchedule` — adaptive calendar replay logic; `groupIntoWeeks` |
| `src/logic/progression.ts` | `suggestWeight`, `setPrescription`, rep/weight chip helpers |
| `src/storage/storage.ts` | `idb-keyval` wrapper replacing `window.storage` from the original app |
| `src/store/useCoachStore.ts` | Zustand store — all app state and mutations; calls `persist` on every write |
| `src/components/` | Presentational components: `Header`, `ProgramGrid`, `DayCard`, `ExerciseBlock`, `StickFigure` |
| `app/page.tsx` | Root client component — hydrates store, derives schedule, renders all components |
| `public/manifest.json` | PWA manifest (icons must be added to `public/icons/`) |

### Key design rules (do not break)

- **Logic layer is pure TS** — `src/logic/` has zero React or browser dependencies. Keep it that way.
- **`simulateSchedule`** advances the program-day pointer only when a slot resolves. Training days resolve when logged or in the future. Sundays are always rest regardless of rotation.
- **`suggestWeight`** treats the *last* logged set as the work set. +5% if reps hit the floor of the range, else hold weight.
- **`setPrescription`** ramps early sets lighter; only the final sets are true work sets. The chip UI highlights the target weight per set, not a single global target.
- **Storage key** is `"coach66-state-v1"` — changing it wipes all user data.
- **PWA icons** (`public/icons/icon-192.png`, `icon-512.png`) must be created before deploying — the manifest references them.

## Deployment

Vercel project: `clinton-s-projects-13a80721/coach66`
GitHub repo: `cmontroos26/coach66`

Push to `main` → Vercel auto-deploys. Pull request branches get preview URLs automatically.
