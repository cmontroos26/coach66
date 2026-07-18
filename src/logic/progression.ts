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

// Look back through all logged days for this exercise. If the last work set hit
// the target rep floor, suggest +5%; otherwise hold weight.
export function suggestWeight(exerciseId: string, targetReps: string, logs: Logs): Suggestion {
  const days = Object.keys(logs).map(Number).sort((a, b) => b - a);
  for (const d of days) {
    const entries = logs[d]?.[exerciseId];
    if (entries && entries.some(e => e.weight)) {
      const numeric = entries
        .filter(e => e.weight && e.reps)
        .map(e => ({ w: parseFloat(e.weight), r: parseFloat(e.reps) }));
      if (numeric.length === 0) continue;
      const lastSet = numeric[numeric.length - 1];
      if (isNaN(lastSet.w)) continue;
      const workTargetReps = parseInt(String(targetReps).split("-")[0], 10) || 10;
      if (lastSet.r >= workTargetReps) {
        return { value: Math.round((lastSet.w + lastSet.w * 0.05) * 2) / 2, reason: "up ~5% — you hit your heaviest set's target last time" };
      }
      return { value: lastSet.w, reason: "hold — build reps on your top set before adding weight" };
    }
  }
  return { value: null, reason: "log your starting weight today" };
}
