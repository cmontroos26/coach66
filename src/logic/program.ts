// ─── Constants ────────────────────────────────────────────────────────────────

export const TOTAL_DAYS = 66;
export const STORAGE_KEY = "coach66-state-v1";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PhaseId = "reactivation" | "rebuild" | "intensify" | "peak";
export type DayType = "push" | "pull" | "legs" | "upper" | "legsCore" | "rest";
export type Category = "compound" | "isolation";

export interface Phase {
  id: PhaseId;
  label: string;
  range: [number, number];
  color: string;
  blurb: string;
}

export interface Exercise {
  id: string;
  name: string;
  unit: string;
  defaultWeight?: number;
  step?: number;
  category: Category;
}

export interface Prescription {
  sets: number;
  reps: string;
  rpe: string;
  rest: string;
  note: string;
}

export interface ExerciseWithPrescription extends Exercise, Prescription {}

export interface DayPlan {
  day: number;
  phase: Phase;
  type: DayType;
  deload: boolean;
  testDay: boolean;
  isRest: boolean;
  gymClosed?: boolean;
  exercises: ExerciseWithPrescription[];
  finisher: string | null;
}

// ─── Movement patterns (drives stick figure animation) ───────────────────────

export const EXERCISE_PATTERN: Record<string, string> = {
  bench: "press", inclineDb: "press", ohp: "press", latRaise: "raise", tricepRope: "raise",
  pullup: "pull", bbRow: "pull", seatedRow: "pull", facePull: "pull", curl: "raise",
  squat: "squatDip", rdl: "hinge", legPress: "squatDip", legCurl: "squatDip", calfRaise: "calfRise",
  inclineBb: "press", chinup: "pull", dbShoulder: "press", cableRow2: "pull", latRaiseCurl: "raise",
  bulgarian: "squatDip", hipThrust: "hinge", lunge: "squatDip", calfRaise2: "calfRise", core: "coreRaise",
  dbLatRaise: "raise", ohTricepExt: "raise", machineLatRaise: "raise", skullCrusher: "raise",
  frontRaise: "raise", tricepDip: "press",
  rearDeltFly: "pull", hammerCurl: "raise", cableRearDeltFly: "pull", inclineCurl: "raise", ezBarCurl: "raise",
  lyingLegCurl: "squatDip", singleLegCurl: "squatDip", donkeyCalfRaise: "calfRise",
  rearDeltHammerCurl: "raise", cableLatConcCurl: "raise", frontRaiseCurlSuperset: "raise",
  cableCrunch: "coreRaise", weightedLegRaise: "coreRaise", abWheel: "coreRaise",
};

export function getPattern(exerciseId: string): string {
  return EXERCISE_PATTERN[exerciseId] || "press";
}

// ─── Phases ───────────────────────────────────────────────────────────────────

export const PHASES: Phase[] = [
  { id: "reactivation", label: "Reactivation", range: [1, 9],   color: "#7C8B93", blurb: "Rebuild the groove. Lighter loads, clean form, nothing to failure." },
  { id: "rebuild",      label: "Rebuild",      range: [10, 33], color: "#4E7DBF", blurb: "Volume goes up. Progressive overload, session over session." },
  { id: "intensify",    label: "Intensify",    range: [34, 57], color: "#C1443C", blurb: "Heavier, fewer reps. Conditioning finishers added." },
  { id: "peak",         label: "Peak & Test",  range: [58, 66], color: "#C9A25D", blurb: "Taper the junk volume. Retest what you started with." },
];

// Full 7-day deload cycle: covers push/pull/legs/rest/upper/legsCore/rest at reduced load.
// Sitting at 4 days (47-50) was too short — the body needs the full week to absorb the
// accumulated fatigue from Intensify before peaking.
export const DELOAD_RANGE: [number, number] = [47, 53];

export function getPhase(day: number): Phase {
  return PHASES.find(p => day >= p.range[0] && day <= p.range[1]) || PHASES[0];
}

// ─── Weekly rotation ──────────────────────────────────────────────────────────

// 0 Push, 1 Pull, 2 Legs, 3 Rest, 4 Upper, 5 Legs+Core, 6 Rest
const ROTATION: DayType[] = ["push", "pull", "legs", "rest", "upper", "legsCore", "rest"];

export function dayType(day: number): DayType {
  return ROTATION[(day - 1) % 7];
}

export function isTestDay(day: number): boolean {
  return [62, 64, 66].includes(day);
}

export const TYPE_LABEL: Record<DayType, string> = {
  push: "Push", pull: "Pull", legs: "Legs",
  upper: "Upper", legsCore: "Legs + Core", rest: "Rest",
};

// ─── Exercise library ─────────────────────────────────────────────────────────

const ISO = "isolation" as const;

export const COMPOUNDS: Record<string, Exercise[]> = {
  push: [
    { id: "bench",     name: "Barbell Bench Press",             unit: "kg",      defaultWeight: 40, step: 2.5, category: "compound" },
    { id: "inclineDb", name: "Incline Dumbbell Press",          unit: "kg/side", defaultWeight: 12, step: 2,   category: "compound" },
    { id: "ohp",       name: "Seated Barbell Overhead Press",   unit: "kg",      defaultWeight: 25, step: 2.5, category: "compound" },
  ],
  pull: [
    { id: "pullup",    name: "Pull-Ups (weighted if needed)",   unit: "kg added", defaultWeight: 0,  step: 2.5, category: "compound" },
    { id: "bbRow",     name: "Barbell Row",                     unit: "kg",       defaultWeight: 35, step: 2.5, category: "compound" },
    { id: "seatedRow", name: "Seated Cable Row",                unit: "kg",       defaultWeight: 35, step: 2.5, category: "compound" },
  ],
  legs: [
    { id: "squat",    name: "Back Squat",          unit: "kg", defaultWeight: 50, step: 2.5, category: "compound" },
    { id: "rdl",      name: "Romanian Deadlift",   unit: "kg", defaultWeight: 40, step: 2.5, category: "compound" },
    { id: "legPress", name: "Leg Press",            unit: "kg", defaultWeight: 80, step: 10,  category: "compound" },
  ],
  upper: [
    { id: "inclineBb",  name: "Incline Barbell Press",      unit: "kg",      defaultWeight: 35, step: 2.5, category: "compound" },
    { id: "chinup",     name: "Chin-Ups",                   unit: "kg added", defaultWeight: 0, step: 2.5, category: "compound" },
    { id: "dbShoulder", name: "Dumbbell Shoulder Press",    unit: "kg/side", defaultWeight: 10, step: 2,   category: "compound" },
    { id: "cableRow2",  name: "Single-Arm Cable Row",       unit: "kg",      defaultWeight: 15, step: 2.5, category: "compound" },
  ],
  legsCore: [
    { id: "bulgarian", name: "Bulgarian Split Squat", unit: "kg/side", defaultWeight: 10, step: 2, category: "compound" },
    { id: "hipThrust", name: "Barbell Hip Thrust",    unit: "kg",      defaultWeight: 40, step: 5, category: "compound" },
    { id: "lunge",     name: "Walking Lunges",        unit: "kg/side", defaultWeight: 8,  step: 2, category: "compound" },
  ],
  rest: [],
};

export const ISOLATION_BY_PHASE: Record<string, Record<PhaseId, Exercise[]>> = {
  push: {
    reactivation: [
      { id: "latRaise",    name: "Cable Lateral Raise",       unit: "kg",      defaultWeight: 5,  step: 1,   category: ISO },
      { id: "tricepRope",  name: "Triceps Rope Pushdown",     unit: "kg",      defaultWeight: 15, step: 2.5, category: ISO },
    ],
    rebuild: [
      { id: "dbLatRaise",   name: "Dumbbell Lateral Raise",         unit: "kg/side", defaultWeight: 6,  step: 1,   category: ISO },
      { id: "ohTricepExt",  name: "Overhead Triceps Extension",     unit: "kg",      defaultWeight: 15, step: 2.5, category: ISO },
    ],
    intensify: [
      { id: "machineLatRaise", name: "Machine Lateral Raise", unit: "kg",  defaultWeight: 10, step: 2.5, category: ISO },
      { id: "skullCrusher",    name: "Skull Crushers",        unit: "kg",  defaultWeight: 20, step: 2.5, category: ISO },
    ],
    peak: [
      { id: "frontRaise", name: "Dumbbell Front Raise", unit: "kg/side",  defaultWeight: 6, step: 1,   category: ISO },
      { id: "tricepDip",  name: "Triceps Dip",          unit: "kg added", defaultWeight: 0, step: 2.5, category: ISO },
    ],
  },
  pull: {
    reactivation: [
      { id: "facePull", name: "Face Pull",      unit: "kg", defaultWeight: 12, step: 2,   category: ISO },
      { id: "curl",     name: "Barbell Curl",   unit: "kg", defaultWeight: 20, step: 2.5, category: ISO },
    ],
    rebuild: [
      { id: "rearDeltFly",  name: "Dumbbell Rear Delt Fly",   unit: "kg/side", defaultWeight: 6,  step: 1, category: ISO },
      { id: "hammerCurl",   name: "Dumbbell Hammer Curl",     unit: "kg/side", defaultWeight: 10, step: 2, category: ISO },
    ],
    intensify: [
      { id: "cableRearDeltFly", name: "Cable Rear Delt Fly",      unit: "kg",      defaultWeight: 10, step: 2, category: ISO },
      { id: "inclineCurl",      name: "Incline Dumbbell Curl",    unit: "kg/side", defaultWeight: 10, step: 2, category: ISO },
    ],
    peak: [
      { id: "facePull",  name: "Face Pull",    unit: "kg", defaultWeight: 12, step: 2,   category: ISO },
      { id: "ezBarCurl", name: "EZ-Bar Curl",  unit: "kg", defaultWeight: 18, step: 2.5, category: ISO },
    ],
  },
  legs: {
    reactivation: [
      { id: "legCurl",   name: "Seated Leg Curl",       unit: "kg", defaultWeight: 25, step: 2.5, category: ISO },
      { id: "calfRaise", name: "Standing Calf Raise",   unit: "kg", defaultWeight: 40, step: 5,   category: ISO },
    ],
    rebuild: [
      { id: "lyingLegCurl", name: "Lying Leg Curl",     unit: "kg", defaultWeight: 25, step: 2.5, category: ISO },
      { id: "calfRaise2",   name: "Seated Calf Raise",  unit: "kg", defaultWeight: 30, step: 5,   category: ISO },
    ],
    intensify: [
      { id: "singleLegCurl", name: "Single-Leg Leg Curl",     unit: "kg", defaultWeight: 15, step: 2.5, category: ISO },
      { id: "calfRaise",     name: "Standing Calf Raise",     unit: "kg", defaultWeight: 40, step: 5,   category: ISO },
    ],
    peak: [
      { id: "legCurl",        name: "Seated Leg Curl",     unit: "kg", defaultWeight: 25, step: 2.5, category: ISO },
      { id: "donkeyCalfRaise", name: "Donkey Calf Raise",  unit: "kg", defaultWeight: 20, step: 5,   category: ISO },
    ],
  },
  upper: {
    reactivation: [{ id: "latRaiseCurl",          name: "Lateral Raise + Curl Superset",                        unit: "kg", defaultWeight: 8, step: 1,   category: ISO }],
    rebuild:      [{ id: "rearDeltHammerCurl",    name: "Rear Delt Fly + Hammer Curl Superset",                 unit: "kg", defaultWeight: 8, step: 1,   category: ISO }],
    intensify:    [{ id: "cableLatConcCurl",      name: "Cable Lateral Raise + Concentration Curl Superset",    unit: "kg", defaultWeight: 9, step: 1.5, category: ISO }],
    peak:         [{ id: "frontRaiseCurlSuperset", name: "Front Raise + Curl Superset",                         unit: "kg", defaultWeight: 7, step: 1,   category: ISO }],
  },
  legsCore: {
    reactivation: [
      { id: "calfRaise2", name: "Seated Calf Raise",         unit: "kg",       defaultWeight: 30, step: 5,   category: ISO },
      { id: "core",       name: "Hanging Leg Raise",         unit: "reps only",                              category: ISO },
    ],
    rebuild: [
      { id: "calfRaise",    name: "Standing Calf Raise", unit: "kg", defaultWeight: 40, step: 5,   category: ISO },
      { id: "cableCrunch",  name: "Cable Crunch",        unit: "kg", defaultWeight: 15, step: 2.5, category: ISO },
    ],
    intensify: [
      { id: "calfRaise2",       name: "Seated Calf Raise",                unit: "kg",       defaultWeight: 30, step: 5,   category: ISO },
      { id: "weightedLegRaise", name: "Weighted Hanging Leg Raise",       unit: "kg added", defaultWeight: 0,  step: 2.5, category: ISO },
    ],
    peak: [
      { id: "calfRaise", name: "Standing Calf Raise", unit: "kg",       defaultWeight: 40, step: 5, category: ISO },
      { id: "abWheel",   name: "Ab Wheel Rollout",    unit: "reps only",                            category: ISO },
    ],
  },
  rest: { reactivation: [], rebuild: [], intensify: [], peak: [] },
};

// Test days are split by body region so CNS fatigue from one lift doesn't
// compromise the next. Testing bench + squat + RDL all in one session means
// the squat and RDL numbers will be artificially lower.
//
// Day 62 = upper body focus (push pattern in the rotation)  → bench + OHP
// Day 64 = lower body focus (legs pattern)                  → squat + RDL
// Day 66 = full benchmark repeat                            → bench + squat + RDL
const TEST_UPPER: Exercise[] = [
  { id: "bench", name: "Barbell Bench Press — Test",           unit: "kg", defaultWeight: 40, step: 2.5, category: "compound" },
  { id: "ohp",   name: "Seated Barbell Overhead Press — Test", unit: "kg", defaultWeight: 25, step: 2.5, category: "compound" },
];
const TEST_LOWER: Exercise[] = [
  { id: "squat", name: "Back Squat — Test",        unit: "kg", defaultWeight: 50, step: 2.5, category: "compound" },
  { id: "rdl",   name: "Romanian Deadlift — Test", unit: "kg", defaultWeight: 40, step: 2.5, category: "compound" },
];
const TEST_FULL: Exercise[] = [
  { id: "bench", name: "Barbell Bench Press — Final Test", unit: "kg", defaultWeight: 40, step: 2.5, category: "compound" },
  { id: "squat", name: "Back Squat — Final Test",          unit: "kg", defaultWeight: 50, step: 2.5, category: "compound" },
  { id: "rdl",   name: "Romanian Deadlift — Final Test",   unit: "kg", defaultWeight: 40, step: 2.5, category: "compound" },
];
function testLiftsForDay(day: number): Exercise[] {
  if (day === 62) return TEST_UPPER;
  if (day === 64) return TEST_LOWER;
  return TEST_FULL; // day 66
}

// ─── Prescription logic ───────────────────────────────────────────────────────

export function prescription(phaseId: PhaseId, isDeload: boolean, category: Category): Prescription {
  const iso = category === "isolation";
  if (isDeload) {
    return iso
      ? { sets: 2, reps: "12-15", rpe: "6", rest: "60s",  note: "Deload week — half the sets, easy effort." }
      : { sets: 2, reps: "8-10",  rpe: "6", rest: "90s",  note: "Deload week — half the sets, easy effort. Let the joints catch up." };
  }
  switch (phaseId) {
    case "reactivation":
      return iso
        ? { sets: 3, reps: "15-20", rpe: "6-7", rest: "60s",    note: "Groove the movement, light and controlled." }
        : { sets: 3, reps: "10-12", rpe: "6-7 (leave 3-4 reps in the tank)", rest: "90s", note: "Groove the movement. Stop well short of failure." };
    case "rebuild":
      return iso
        ? { sets: 3, reps: "12-15", rpe: "7-8", rest: "75s",    note: "Chase the muscle, not the weight — keep it controlled." }
        : { sets: 4, reps: "8-10",  rpe: "7-8", rest: "2 min",  note: "Push each set close, but keep 1-2 reps in reserve." };
    case "intensify":
      return iso
        ? { sets: 3, reps: "10-12", rpe: "8-9", rest: "75s",    note: "Heavier than rebuild, still controlled through the full range." }
        : { sets: 4, reps: "5-8",   rpe: "8-9", rest: "2-3 min", note: "Heavier. Last set can be near failure." };
    case "peak":
      return iso
        ? { sets: 2, reps: "8-10", rpe: "7", rest: "60s",   note: "Taper — enough to stay sharp, not to grind." }
        : { sets: 3, reps: "4-6",  rpe: "7", rest: "3 min", note: "Taper — quality over quantity, save energy for test days." };
    default:
      return { sets: 3, reps: "10", rpe: "7", rest: "90s", note: "" };
  }
}

function finisherFor(day: number, type: DayType): string | null {
  const phase = getPhase(day);
  if (type === "legsCore" && phase.id !== "reactivation")
    return "Finisher: 12 min incline treadmill walk or rower intervals (easy, conversational pace).";
  if (type === "legs" && (phase.id === "intensify" || phase.id === "peak"))
    return "Finisher: 10 min steady-state cardio, low intensity.";
  return null;
}

function exercisesForDay(type: DayType, phaseId: PhaseId): Exercise[] {
  const compounds = COMPOUNDS[type] || [];
  const isolation = (ISOLATION_BY_PHASE[type]?.[phaseId]) || [];
  return [...compounds, ...isolation];
}

// ─── Build day plan ───────────────────────────────────────────────────────────

export function buildDayPlan(day: number): DayPlan {
  const phase = getPhase(day);
  const type = dayType(day);
  const deload = day >= DELOAD_RANGE[0] && day <= DELOAD_RANGE[1];
  const testDay = isTestDay(day);

  if (type === "rest") {
    return { day, phase, type, deload, testDay, exercises: [], finisher: null, isRest: true };
  }

  if (testDay) {
    const presc: Prescription = {
      sets: 1, reps: "1-3 (find today's honest top)", rpe: "9", rest: "4 min",
      note: "Warm up thoroughly. This is a test, not a max-out grind — stop if form breaks.",
    };
    return {
      day, phase, type, deload, testDay, isRest: false, finisher: null,
      exercises: testLiftsForDay(day).map(ex => ({ ...ex, ...presc })),
    };
  }

  const exercises = exercisesForDay(type, phase.id).map(ex => ({
    ...ex,
    ...prescription(phase.id, deload, ex.category),
  }));
  return { day, phase, type, deload, testDay, isRest: false, exercises, finisher: finisherFor(day, type) };
}
