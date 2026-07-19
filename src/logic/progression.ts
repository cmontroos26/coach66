import type { Logs } from "./scheduler";

export interface Suggestion {
  value: number | null;
  reason: string;
}

export interface SetTarget {
  weight: number;
  reps: number;
  label: string;
}

export function parseRepRange(repsStr: string): [number, number] {
  const match = String(repsStr).match(/(\d+)\s*-\s*(\d+)/);
  if (match) return [parseInt(match[1], 10), parseInt(match[2], 10)];
  const single = String(repsStr).match(/\d+/);
  const n = single ? parseInt(single[0], 10) : 10;
  return [n, n];
}

export function repChipValues(repsStr: string): number[] {
  const [lo, hi] = parseRepRange(repsStr);
  const start = Math.max(0, lo - 2);
  const end = hi + 3;
  const vals: number[] = [];
  for (let v = start; v <= end; v++) vals.push(v);
  return vals;
}

export function roundToHalf(n: number): number {
  return Math.round(n * 2) / 2;
}

// Ramp sets: early sets are lighter/higher-rep warm-ups; final sets are the true work sets.
export function setPrescription(
  totalSets: number,
  base: number,
  step: number,
  repLo: number,
  repHi: number,
  setIndex: number,
): SetTarget {
  const clamp = (w: number) => Math.max(roundToHalf(w), 0);
  const mid = Math.round((repLo + repHi) / 2);

  if (totalSets >= 4) {
    if (setIndex === 0) return { weight: clamp(base - step * 2), reps: repHi, label: "Warm-up" };
    if (setIndex === 1) return { weight: clamp(base - step),     reps: mid,   label: "Ramp-up" };
    return { weight: clamp(base), reps: repLo, label: "Work set" };
  }
  if (totalSets === 3) {
    if (setIndex === 0) return { weight: clamp(base - step), reps: repHi, label: "Warm-up" };
    return { weight: clamp(base), reps: repLo, label: "Work set" };
  }
  return { weight: clamp(base), reps: repLo, label: totalSets === 1 ? "Test" : "Work set" };
}

// Look back through all logged days for this exercise.
// Uses the TOP SET (heaviest weight with reps logged) so warm-up sets
// never accidentally stall or inflate the progression suggestion.
//
// Rules:
//   • Exceeded rep ceiling (> repHi) → +7.5%  (had more in the tank)
//   • Hit rep floor      (>= repLo)  → +5%    (earned the increase)
//   • Below rep floor                → hold    (build reps first)
export function suggestWeight(exerciseId: string, targetReps: string, logs: Logs): Suggestion {
  const [repLo, repHi] = parseRepRange(targetReps);
  const days = Object.keys(logs).map(Number).sort((a, b) => b - a);

  for (const d of days) {
    const entries = logs[d]?.[exerciseId];
    if (!entries) continue;

    const numeric = entries
      .filter(e => e.weight && e.reps)
      .map(e => ({ w: parseFloat(e.weight), r: parseFloat(e.reps) }))
      .filter(e => !isNaN(e.w) && !isNaN(e.r) && e.w > 0);

    if (numeric.length === 0) continue;

    // Top set = heaviest weight logged that session
    const top = numeric.reduce((best, cur) => cur.w > best.w ? cur : best);

    if (top.r > repHi) {
      return { value: roundToHalf(top.w * 1.075), reason: `up ~7.5% — you beat the rep ceiling last time (${top.r} reps)` };
    }
    if (top.r >= repLo) {
      return { value: roundToHalf(top.w * 1.05), reason: `up ~5% — you hit your target last time (${top.r} reps)` };
    }
    return { value: top.w, reason: `hold — hit ${repLo}+ reps before adding weight (got ${top.r} last time)` };
  }

  return { value: null, reason: "log your starting weight today" };
}
