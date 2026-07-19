"use client";

import { useEffect, useRef } from "react";
import { isDayLogged } from "@/logic/scheduler";
import type { WeekGroup, ScheduleEntry, Logs } from "@/logic/scheduler";

const DOW = ["M", "T", "W", "T", "F", "S", "S"];

type Status = "completed" | "missed" | "upcoming" | "rest";

function getStatus(entry: ScheduleEntry, logs: Logs): Status {
  const { dayPlan, programDay, isFuture } = entry;
  if (dayPlan.isRest) return "rest";
  if (isDayLogged(programDay, logs)) return "completed";
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
  todayStr: string;
  logs: Logs;
  onGoToDate: (programDay: number, dateStr: string) => void;
}

export function ProgramGrid({ weeks, viewDateStr, todayStr, logs, onGoToDate }: ProgramGridProps) {
  const grouped = withMonthBreaks(weeks);
  const todayRef = useRef<HTMLElement>(null);

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
                // isToday is always derived from the actual date, never from schedule status
                const isToday = cell.dateStr === todayStr;
                const isSelected = viewDateStr === cell.dateStr;

                // Outside program window
                if (!cell.entry) {
                  return (
                    <div
                      key={cell.dateStr}
                      ref={isToday ? (todayRef as React.RefObject<HTMLDivElement>) : undefined}
                      className={[
                        "aspect-square rounded-lg flex flex-col items-center justify-center",
                        isToday ? "bg-[#C1443C]" : "",
                      ].join(" ")}
                    >
                      <span className={[
                        "tabular-nums font-bold leading-none",
                        isToday ? "text-[14px] text-white" : "text-[11px] text-white/[0.06]",
                      ].join(" ")}>
                        {cell.date.getDate()}
                      </span>
                      {isToday && <span className="w-1 h-1 rounded-full bg-white/60 mt-1" />}
                    </div>
                  );
                }

                const { programDay } = cell.entry;
                const status = getStatus(cell.entry, logs);
                const isRest = cell.entry.dayPlan.isRest;

                const isDay1 = !isToday && programDay === 1;

                // Today always overrides to red, regardless of rest/status
                const cellClass = isToday
                  ? "bg-[#C1443C] text-white"
                  : isDay1
                  ? "bg-amber-500/40 text-amber-100 ring-1 ring-amber-400/60"
                  : {
                      completed: "bg-blue-500/40 text-blue-200",
                      missed:    "bg-red-900/30 text-red-400/70",
                      upcoming:  "bg-white/[0.07] text-white/30",
                      rest:      "text-white/[0.08]",
                    }[status];

                return (
                  <button
                    key={cell.dateStr}
                    ref={isToday ? (todayRef as React.RefObject<HTMLButtonElement>) : undefined}
                    onClick={() => onGoToDate(programDay, cell.dateStr)}
                    className={[
                      "relative aspect-square rounded-lg flex flex-col items-center justify-center transition-all duration-150",
                      isRest && !isToday ? "cursor-default" : "active:scale-90",
                      cellClass,
                      isSelected
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
          { cls: "bg-[#C1443C]",                             label: "Today" },
          { cls: "bg-amber-500/40 ring-1 ring-amber-400/60", label: "Start" },
          { cls: "bg-blue-500/40",                           label: "Done" },
          { cls: "bg-red-900/30 ring-1 ring-red-500/30",     label: "Missed" },
          { cls: "bg-white/[0.12]",                          label: "Upcoming" },
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
