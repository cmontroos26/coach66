"use client";

import { motion } from "framer-motion";
import { StickFigure } from "./StickFigure";
import {
  parseRepRange, repChipValues, setPrescription, roundToHalf,
} from "@/logic/progression";
import type { ExerciseWithPrescription } from "@/logic/program";
import type { Suggestion } from "@/logic/progression";

interface LoggedSet { weight: string; reps: string }

function LoggedLine({ noWeight, unit, weight, reps }: {
  noWeight: boolean; unit: string; weight: number | null; reps: number | null;
}) {
  if (weight !== null && reps !== null) {
    return (
      <div className="mt-3 text-[13px] text-green-400 bg-green-400/10 border border-green-400/30 rounded-md px-3 py-2">
        ✓ Logged: <strong>{!noWeight && <>{weight} {unit} × </>}{reps} reps</strong>
      </div>
    );
  }
  if (!noWeight && weight !== null && reps === null) {
    return <div className="mt-3 text-[12px] text-amber-400 bg-amber-400/8 border border-amber-400/25 rounded-md px-3 py-2">Weight logged — tap reps to finish this set</div>;
  }
  if (!noWeight && weight === null && reps !== null) {
    return <div className="mt-3 text-[12px] text-amber-400 bg-amber-400/8 border border-amber-400/25 rounded-md px-3 py-2">Reps logged — tap weight to finish this set</div>;
  }
  return <div className="mt-3 text-[12px] text-neutral-600 px-3 py-2">Not logged yet — tap {noWeight ? "reps" : "weight, then reps"} above</div>;
}

interface ExerciseBlockProps {
  exercise: ExerciseWithPrescription;
  loggedSets: LoggedSet[];
  suggestion: Suggestion;
  onChangeSet: (setIndex: number, field: "weight" | "reps", value: string) => void;
}

export function ExerciseBlock({ exercise, loggedSets, suggestion, onChangeSet }: ExerciseBlockProps) {
  const noWeight = exercise.unit === "reps only";
  const setsArray = Array.from({ length: exercise.sets }, (_, i) => loggedSets[i] || { weight: "", reps: "" });

  const base = suggestion.value !== null ? suggestion.value : (exercise.defaultWeight ?? 20);
  const step = exercise.step ?? (base >= 60 ? 5 : 2.5);
  const weightChips = [base - step * 2, base - step, base, base + step, base + step * 2]
    .map(roundToHalf)
    .filter(v => v >= 0);
  const repChips = repChipValues(exercise.reps);
  const [repLo, repHi] = parseRepRange(exercise.reps);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-[#242629] rounded-xl p-4 mb-3"
    >
      {/* Exercise header */}
      <div className="flex items-start gap-3 mb-1">
        <div className="w-10 h-10 rounded-lg bg-[#1E2023] text-amber-400 flex items-center justify-center flex-shrink-0">
          <StickFigure exerciseId={exercise.id} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-white leading-tight">{exercise.name}</p>
          <p className="text-[12px] text-neutral-500 tabular-nums">
            {exercise.sets} × {exercise.reps} · RPE {exercise.rpe} · rest {exercise.rest}
          </p>
        </div>
      </div>

      {exercise.note && (
        <p className="text-[12px] text-neutral-400 italic mb-3 mt-1">{exercise.note}</p>
      )}

      {!noWeight && (
        <p className="text-[12px] text-amber-400 mb-3">
          {suggestion.value !== null
            ? <>Suggested: <strong>{suggestion.value} {exercise.unit}</strong> — {suggestion.reason}</>
            : "First time — tap what feels right, ringed chip is a reasonable starting guess."}
        </p>
      )}

      {/* Sets */}
      <div className="flex flex-col gap-4 mt-2">
        {setsArray.map((s, i) => {
          const prevSet = i > 0 ? setsArray[i - 1] : null;
          const currentWeight = s.weight === "" ? null : parseFloat(s.weight);
          const currentReps   = s.reps   === "" ? null : parseInt(s.reps, 10);
          const setTarget = setPrescription(exercise.sets, base, step, repLo, repHi, i);

          return (
            <div key={i} className="bg-[#1E2023] rounded-lg p-3">
              {/* Set label row */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[11px] tracking-widest text-neutral-500 font-bold uppercase">
                  Set {i + 1} <span className="text-[9px] text-neutral-600">{setTarget.label.toUpperCase()}</span>
                </span>
                <span className="text-[12px] text-amber-400 font-semibold ml-auto tabular-nums">
                  Target: {!noWeight && <>{setTarget.weight} {exercise.unit} × </>}{setTarget.reps} reps
                </span>
                {i > 0 && prevSet?.weight && (
                  <button
                    onClick={() => onChangeSet(i, "weight", prevSet.weight)}
                    className="text-[11px] text-neutral-400 border border-white/10 rounded-full px-2.5 py-1 hover:bg-white/5 transition-colors"
                  >
                    ↳ same as set {i}
                  </button>
                )}
              </div>

              {/* Weight chips */}
              {!noWeight && (
                <>
                  <p className="text-[10px] tracking-widest text-neutral-600 uppercase mb-1.5">Weight ({exercise.unit})</p>
                  <div className="flex gap-2 mb-3">
                    {weightChips.map(v => (
                      <button
                        key={v}
                        onClick={() => onChangeSet(i, "weight", String(v))}
                        className={[
                          "relative flex-1 rounded-lg py-3.5 text-[15px] font-bold tabular-nums transition-all",
                          currentWeight === v
                            ? "bg-red-500 border-2 border-red-500 text-white"
                            : v === setTarget.weight
                            ? "bg-[#2A2C30] border-2 border-amber-400 text-white"
                            : "bg-[#2A2C30] border border-white/10 text-white hover:border-white/25",
                        ].join(" ")}
                      >
                        {v}
                        {v === setTarget.weight && currentWeight !== v && (
                          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Rep chips */}
              <p className="text-[10px] tracking-widest text-neutral-600 uppercase mb-1.5">Reps</p>
              <div className="flex flex-wrap gap-2">
                {repChips.map(v => (
                  <button
                    key={v}
                    onClick={() => onChangeSet(i, "reps", String(v))}
                    className={[
                      "relative w-11 rounded-lg py-3 text-[15px] font-bold tabular-nums transition-all",
                      currentReps === v
                        ? "bg-red-500 border-2 border-red-500 text-white"
                        : v === setTarget.reps
                        ? "bg-[#2A2C30] border-2 border-amber-400 text-white"
                        : "bg-[#2A2C30] border border-white/10 text-white hover:border-white/25",
                    ].join(" ")}
                  >
                    {v}
                    {v === setTarget.reps && currentReps !== v && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </button>
                ))}
              </div>

              <LoggedLine noWeight={noWeight} unit={exercise.unit} weight={currentWeight} reps={currentReps} />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
