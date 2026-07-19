"use client";

import { useEffect, useRef } from "react";
import { isDayLogged } from "@/logic/scheduler";
import type { WeekGroup, ScheduleEntry, Logs } from "@/logic/scheduler";

const DOW = ["M", "T", "W", "T", "F", "S", "S"];

type Status = "completed" | "today" | "missed" | "upcoming" | "rest";

function getStatus(entry: ScheduleEntry, logs: Logs): Status {
  const { dayPlan, programDay, isFuture, isToday } = entry;
  if (dayPlan.isRest) return "rest";
  const logged = isDayLogged(programDay, logs);
  if (logged) return "completed";
  if (isToday) return "today";
  if (isFuture) return "upcoming";
  return "missed";
}

function withMonthBreaks(weeks: WeekGroup[]) {
  let lastMonth = -1;
  return weeks.map(week => {
    const month = week.days[0].date.getMonth();
    const showLabel = month !== lastMonth;
    if (showLabel) lastMonth = month;
    return {
      week,
      showLabel,
      label: week.days[0].date.toLocaleDateString(undefined, { month: "long", year: "numeric" }).toUpperCase(),
    };
  });
}

interface ProgramGridProps {
  weeks: WeekGroup[];
  viewDateStr: string | null;
  logs: Logs;
  onGoToDate: (programDay: number, dateStr: string) => void;
}

export function ProgramGrid({ weeks, viewDateStr, logs, onGoToDate }: ProgramGridProps) {
  const grouped = withMonthBreaks(weeks);
  const todayRef = useRef<HTMLButtonElement>(null);

  // Scroll today into view once on mount
  useEffect(() => {
    todayRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);

  return (
    <div className="px-5 pt-2 pb-6">
      {/* Column headers */}
      <div className="grid grid-cols-7 mb-2">
        {DOW.map((d, i) => (
          <p key={i} className="text-center text-[10px] font-bold tracking-widest text-neutral-700">
            {d}
          </p>
        ))}
      </div>

      <div className="flex flex-col gap-0.5">
        {grouped.map(({ week, showLabel, label }, wi) => (
          <div key={wi}>
            {showLabel && (
              <p className="text-[10px] font-bold tracking-[2px] text-neutral-600 uppercase mt-4 mb-2">
                {label}
              </p>
            )}

            <div className="grid grid-cols-7 gap-1">
              {week.days.map(cell => {
                // Outside program window
                if (!cell.entry) {
                  return (
                    <div key={cell.dateStr} className="aspect-square flex items-center justify-center">
                      <span className="text-[11px] tabular-nums text-white/[0.06]">
                        {cell.date.getDate()}
                      </span>
                    </div>
                  );
                }

                const { programDay } = cell.entry;
                const status = getStatus(cell.entry, logs);
                const isToday = status === "today";
                const isSelected = viewDateStr === cell.dateStr;
                const isRest = cell.entry.dayPlan.isRest;

                const cellClass = {
                  completed: "bg-blue-500/20 text-blue-300",
                  today:     "bg-[#C1443C] text-white",
                  missed:    "bg-white/[0.04] text-red-400/50",
                  upcoming:  "bg-white/[0.04] text-white/30",
                  rest:      "text-white/[0.08]",
                }[status];

                return (
                  <button
                    key={cell.dateStr}
                    ref={isToday ? todayRef : undefined}
                    onClick={() => onGoToDate(programDay, cell.dateStr)}
                    className={[
                      "relative aspect-square rounded-lg flex flex-col items-center justify-center transition-all duration-150",
                      isRest ? "cursor-default" : "active:scale-90",
                      cellClass,
                      isSelected && !isRest
                        ? "ring-2 ring-white/70 ring-offset-1 ring-offset-[#1C1C1E]"
                        : "",
                    ].join(" ")}
                  >
                    <span className={[
                      "tabular-nums font-bold leading-none",
                      isToday ? "text-[14px]" : isRest ? "text-[10px]" : "text-[13px]",
                    ].join(" ")}>
                      {cell.date.getDate()}
                    </span>
                    {/* Dot under the date for today */}
                    {isToday && (
                      <span className="w-1 h-1 rounded-full bg-white/60 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-5">
        {[
          { cls: "bg-[#C1443C]",    label: "Today" },
          { cls: "bg-blue-500/20",  label: "Done" },
          { cls: "bg-white/[0.04] border border-red-500/20", label: "Missed" },
          { cls: "bg-white/[0.04]", label: "Upcoming" },
        ].map(({ cls, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm ${cls}`} />
            <span className="text-[10px] text-neutral-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
