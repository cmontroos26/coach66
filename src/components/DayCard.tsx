"use client";

import { ExerciseBlock } from "./ExerciseBlock";
import { TYPE_LABEL } from "@/logic/program";
import { suggestWeight } from "@/logic/progression";
import type { DayPlan } from "@/logic/program";
import type { Logs } from "@/logic/scheduler";

interface DayCardProps {
  plan: DayPlan;
  dayLogs: Logs[number];
  logs: Logs;
  onUpdateSet: (day: number, exerciseId: string, setIndex: number, field: "weight" | "reps", value: string) => void;
}

export function DayCard({ plan, dayLogs, logs, onUpdateSet }: DayCardProps) {
  if (plan.isRest) {
    return (
      <div className="px-5 pt-6 pb-12 max-w-2xl mx-auto">
        <p className="text-[10px] tracking-[2px] text-neutral-600 uppercase mb-3">
          {plan.gymClosed ? "Rest · Gym closed" : "Rest day"}
        </p>
        <p className="text-[15px] text-neutral-400 leading-relaxed">
          No lifting today. Walk, stretch, sleep well.
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 pt-5 pb-16 max-w-2xl mx-auto">
      {/* Day header */}
      <div className="flex items-center gap-2.5 mb-1">
        <h2 className="text-[20px] font-extrabold tracking-tight text-white">
          {plan.testDay ? "Test Day" : TYPE_LABEL[plan.type]}
        </h2>
        {plan.deload && (
          <span className="text-[9px] font-bold tracking-widest text-[#1C1C1E] bg-amber-400 rounded-sm px-1.5 py-0.5 uppercase">
            Deload
          </span>
        )}
      </div>

      {/* Exercises */}
      <div className="mt-4">
        {plan.exercises.map(ex => (
          <ExerciseBlock
            key={ex.id}
            exercise={ex}
            loggedSets={dayLogs?.[ex.id] || []}
            suggestion={suggestWeight(ex.id, ex.reps, logs)}
            onChangeSet={(setIndex, field, value) => onUpdateSet(plan.day, ex.id, setIndex, field, value)}
          />
        ))}
      </div>

      {plan.finisher && (
        <p className="mt-6 text-[12px] text-neutral-500 leading-relaxed border-l-2 border-blue-500/40 pl-3">
          {plan.finisher}
        </p>
      )}
    </div>
  );
}
