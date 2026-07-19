"use client";

import { isDayLogged } from "@/logic/scheduler";
import type { WeekGroup, ScheduleEntry, Logs } from "@/logic/scheduler";

// Mon–Sun column headers, shown once
const DOW = ["M", "T", "W", "T", "F", "S", "S"];

type Status = "completed" | "today" | "missed" | "upcoming" | "rest" | "empty";

function getStatus(entry: ScheduleEntry, logs: Logs): Status {
  const { dayPlan, programDay, isFuture, isToday } = entry;
  if (dayPlan.isRest) return "rest";
  const logged = isDayLogged(programDay, logs);
  if (logged) return "completed";
  if (isToday) return "today";
  if (isFuture) return "upcoming";
  return "missed";
}

// When month changes between weeks, emit a section label
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

const STATUS_STYLE: Record<Status, string> = {
  completed: "bg-blue-500/25 text-blue-200",
  today:     "bg-red-500/25 text-white ring-1 ring-red-500/80",
  missed:    "bg-red-500/10 text-red-400/60",
  upcoming:  "bg-white/[0.04] text-white/25",
  rest:      "text-white/10",
  empty:     "text-white/5",
};

interface ProgramGridProps {
  weeks: WeekGroup[];
  viewDateStr: string | null;
  logs: Logs;
  onGoToDate: (programDay: number, dateStr: string) => void;
}

export function ProgramGrid({ weeks, viewDateStr, logs, onGoToDate }: ProgramGridProps) {
  const grouped = withMonthBreaks(weeks);

  return (
    <div className="px-5 pt-2 pb-6">
      {/* Single column-header row */}
      <div className="grid grid-cols-7 mb-2 px-0.5">
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
                // Days outside the program window
                if (!cell.entry) {
                  return (
                    <div key={cell.dateStr} className="aspect-square flex items-center justify-center">
                      <span className="text-[12px] font-bold tabular-nums text-white/5">
                        {cell.date.getDate()}
                      </span>
                    </div>
                  );
                }

                const { programDay } = cell.entry;
                const status = getStatus(cell.entry, logs);
                const isSelected = viewDateStr === cell.dateStr;
                const isRest = cell.entry.dayPlan.isRest;

                return (
                  <button
                    key={cell.dateStr}
                    onClick={() => onGoToDate(programDay, cell.dateStr)}
                    className={[
                      "aspect-square rounded-lg flex items-center justify-center transition-all duration-150",
                      isRest ? "cursor-default" : "active:scale-90",
                      STATUS_STYLE[status],
                      isSelected && !isRest
                        ? "ring-2 ring-white ring-offset-2 ring-offset-[#1C1C1E]"
                        : "",
                    ].join(" ")}
                  >
                    <span className={[
                      "tabular-nums font-bold leading-none",
                      isRest ? "text-[10px]" : "text-[13px]",
                    ].join(" ")}>
                      {cell.date.getDate()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-5 px-0.5">
        {[
          { cls: "bg-blue-500/25", label: "Done" },
          { cls: "bg-red-500/25 ring-1 ring-red-500/80", label: "Today" },
          { cls: "bg-red-500/10", label: "Missed" },
          { cls: "bg-white/[0.04]", label: "Upcoming" },
        ].map(({ cls, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${cls}`} />
            <span className="text-[10px] text-neutral-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
