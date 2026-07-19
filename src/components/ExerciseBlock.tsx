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
      <p className="mt-2 text-[12px] text-green-400/90 font-medium">
        ✓ {!noWeight && <>{weight} {unit} × </>}{reps} reps
      </p>
    );
  }
  if (weight !== null || reps !== null) {
    return (
      <p className="mt-2 text-[12px] text-amber-500/70">
        {weight !== null ? "weight set — tap reps" : "reps set — tap weight"}
      </p>
    );
  }
  return null;
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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="py-4 border-b border-white/[0.06] last:border-0"
    >
      {/* Exercise header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-white/[0.04] text-amber-400/90 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <StickFigure exerciseId={exercise.id} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-white leading-tight">{exercise.name}</p>
          <p className="text-[11px] text-neutral-600 tabular-nums mt-0.5">
            {exercise.sets} × {exercise.reps} &nbsp;·&nbsp; RPE {exercise.rpe} &nbsp;·&nbsp; {exercise.rest}
          </p>
        </div>
      </div>

      {exercise.note && (
        <p className="text-[11px] text-neutral-600 italic mb-2 pl-13">{exercise.note}</p>
      )}

      {!noWeight && suggestion.value !== null && (
        <p className="text-[11px] text-amber-500/70 mb-3 pl-13">
          {suggestion.value} {exercise.unit} — {suggestion.reason}
        </p>
      )}

      {/* Sets */}
      <div className="flex flex-col gap-5 mt-3 pl-13">
        {setsArray.map((s, i) => {
          const prevSet = i > 0 ? setsArray[i - 1] : null;
          const currentWeight = s.weight === "" ? null : parseFloat(s.weight);
          const currentReps   = s.reps   === "" ? null : parseInt(s.reps, 10);
          const setTarget = setPrescription(exercise.sets, base, step, repLo, repHi, i);

          return (
            <div key={i}>
              {/* Set label */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-[10px] font-bold tracking-widest text-neutral-600 uppercase">
                  Set {i + 1}
                </span>
                <span className="text-[10px] text-neutral-700 uppercase tracking-wide">
                  {setTarget.label}
                </span>
                <span className="ml-auto text-[11px] text-neutral-600 tabular-nums">
                  {!noWeight && <>{setTarget.weight} {exercise.unit} × </>}{setTarget.reps}
                </span>
                {i > 0 && prevSet?.weight && (
                  <button
                    onClick={() => onChangeSet(i, "weight", prevSet.weight)}
                    className="text-[10px] text-neutral-700 hover:text-neutral-400 transition-colors"
                  >
                    ↳ copy
                  </button>
                )}
              </div>

              {/* Weight chips */}
              {!noWeight && (
                <div className="flex gap-1.5 mb-2">
                  {weightChips.map(v => {
                    const isSelected = currentWeight === v;
                    const isTarget   = v === setTarget.weight;
                    return (
                      <button
                        key={v}
                        onClick={() => onChangeSet(i, "weight", String(v))}
                        className={[
                          "relative flex-1 rounded-lg py-3 text-[14px] font-bold tabular-nums transition-all active:scale-95",
                          isSelected
                            ? "bg-white text-[#1C1C1E]"
                            : isTarget
                            ? "bg-white/[0.06] text-white ring-1 ring-white/20"
                            : "bg-white/[0.03] text-neutral-500 hover:bg-white/[0.06] hover:text-white",
                        ].join(" ")}
                      >
                        {v}
                        {isTarget && !isSelected && (
                          <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-amber-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Rep chips */}
              <div className="flex flex-wrap gap-1.5">
                {repChips.map(v => {
                  const isSelected = currentReps === v;
                  const isTarget   = v === setTarget.reps;
                  return (
                    <button
                      key={v}
                      onClick={() => onChangeSet(i, "reps", String(v))}
                      className={[
                        "relative w-10 rounded-lg py-2.5 text-[14px] font-bold tabular-nums transition-all active:scale-95",
                        isSelected
                          ? "bg-white text-[#1C1C1E]"
                          : isTarget
                          ? "bg-white/[0.06] text-white ring-1 ring-white/20"
                          : "bg-white/[0.03] text-neutral-500 hover:bg-white/[0.06] hover:text-white",
                      ].join(" ")}
                    >
                      {v}
                      {isTarget && !isSelected && (
                        <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              <LoggedLine noWeight={noWeight} unit={exercise.unit} weight={currentWeight} reps={currentReps} />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
