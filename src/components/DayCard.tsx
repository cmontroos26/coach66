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
      <div className="px-5 py-4 max-w-2xl mx-auto">
        <span className="inline-block text-[12px] tracking-[2px] text-neutral-500 border border-white/10 rounded px-3 py-1.5 mb-4 uppercase">
          {plan.gymClosed ? "Rest Day · Gym Closed" : "Rest Day"}
        </span>
        <p className="text-[15px] text-neutral-300 leading-relaxed">
          No lifting today. Walk, stretch, sleep well — recovery is part of the program, not a break from it.
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 pb-10 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mt-3 mb-1">
        <h2 className="text-[24px] font-extrabold tracking-wide text-white">
          {plan.testDay ? "TEST DAY" : TYPE_LABEL[plan.type].toUpperCase()}
        </h2>
        {plan.deload && (
          <span className="text-[11px] tracking-wide text-[#1C1C1E] bg-amber-400 rounded px-2 py-0.5 font-bold uppercase">
            Deload
          </span>
        )}
      </div>

      <p className="text-[13px] text-neutral-500 mb-5">{plan.phase.blurb}</p>

      {plan.exercises.map(ex => (
        <ExerciseBlock
          key={ex.id}
          exercise={ex}
          loggedSets={dayLogs?.[ex.id] || []}
          suggestion={suggestWeight(ex.id, ex.reps, logs)}
          onChangeSet={(setIndex, field, value) => onUpdateSet(plan.day, ex.id, setIndex, field, value)}
        />
      ))}

      {plan.finisher && (
        <div className="mt-2 text-[13px] text-neutral-200 bg-[#242629] rounded-xl p-3.5 border-l-[3px] border-blue-500">
          {plan.finisher}
        </div>
      )}
    </div>
  );
}
