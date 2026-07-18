"use client";

import { isDayLogged } from "@/logic/scheduler";
import type { WeekGroup, ScheduleEntry, Logs } from "@/logic/scheduler";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getEntryStatus(entry: ScheduleEntry, logs: Logs) {
  const { dayPlan, programDay, isFuture, isToday } = entry;
  const logged = !dayPlan.isRest && isDayLogged(programDay, logs);
  let status: string;

  if (dayPlan.isRest) {
    status = "rest";
  } else if (logged) {
    status = isFuture ? "projected-done" : "completed";
  } else if (isFuture) {
    status = "projected-pending";
  } else if (isToday) {
    status = "today-pending";
  } else {
    status = "missed";
  }

  const classMap: Record<string, string> = {
    completed:         "border-blue-500/60 bg-blue-500/10",
    "projected-done":  "border-white/10 opacity-50",
    "projected-pending": "border-white/10 opacity-50",
    "today-pending":   "border-red-500/70 bg-red-500/10",
    missed:            "border-red-500/40 bg-red-500/5 opacity-70",
    rest:              "opacity-30",
  };
  const badgeMap: Record<string, string> = {
    completed: "✓", "projected-done": "~", "projected-pending": "~",
    "today-pending": "•", missed: "!", rest: "",
  };

  return { status, cls: classMap[status] || "", badge: badgeMap[status] || "" };
}

function clusterWeekDays(days: WeekGroup["days"]) {
  type Cluster = { type: "rest" | "train"; cells: WeekGroup["days"] };
  const clusters: Cluster[] = [];
  let current: Cluster | null = null;
  for (const cell of days) {
    const isRestCell = !cell.entry || cell.entry.dayPlan.isRest;
    if (isRestCell) {
      if (current) { clusters.push(current); current = null; }
      clusters.push({ type: "rest", cells: [cell] });
    } else {
      if (!current) current = { type: "train", cells: [] };
      current.cells.push(cell);
    }
  }
  if (current) clusters.push(current);
  return clusters;
}

interface ProgramGridProps {
  weeks: WeekGroup[];
  viewDateStr: string | null;
  logs: Logs;
  onGoToDate: (programDay: number, dateStr: string) => void;
}

export function ProgramGrid({ weeks, viewDateStr, logs, onGoToDate }: ProgramGridProps) {
  return (
    <div className="px-5 py-4">
      <p className="text-[11px] tracking-[1.5px] text-neutral-600 uppercase mb-3">Full 66-Day Program</p>

      <div className="flex flex-col gap-4">
        {weeks.map((week, wi) => {
          const clusters = clusterWeekDays(week.days);
          return (
            <div key={wi}>
              <p className="text-[11px] text-neutral-500 mb-1.5 tracking-wide">
                Week {wi + 1} · {week.weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </p>
              <div className="flex items-stretch gap-1.5">
                {clusters.map((cluster, ci) => (
                  <div
                    key={ci}
                    className={cluster.type === "rest" ? "flex gap-1 flex-none" : "flex gap-1 flex-1"}
                  >
                    {cluster.cells.map(cell => {
                      const dow = WEEKDAY_LABELS[cell.date.getDay() === 0 ? 6 : cell.date.getDay() - 1];
                      if (!cell.entry) {
                        return (
                          <div key={cell.dateStr} className="flex flex-col items-center justify-center gap-0.5 px-0.5 py-2 rounded-md border border-white/5 opacity-25 min-h-12 w-6">
                            <span className="text-[8px] tracking-wide text-neutral-500 font-bold">{dow}</span>
                            <span className="text-[13px] font-extrabold text-white tabular-nums">{cell.date.getDate()}</span>
                          </div>
                        );
                      }

                      const { programDay } = cell.entry;
                      const { cls, badge } = getEntryStatus(cell.entry, logs);
                      const isRestCell = cell.entry.dayPlan.isRest;
                      const isSelected = viewDateStr === cell.dateStr;

                      return (
                        <button
                          key={cell.dateStr}
                          onClick={() => onGoToDate(programDay, cell.dateStr)}
                          className={[
                            "relative flex flex-col items-center justify-center gap-0.5 py-2 rounded-md border transition-all",
                            isRestCell ? "w-6 px-0.5 border-dashed border-white/10" : "flex-1 px-0.5 min-h-12",
                            cls,
                            isSelected ? "outline outline-2 outline-white" : "",
                          ].join(" ")}
                        >
                          <span className="text-[8px] tracking-wide text-neutral-500 font-bold">{dow}</span>
                          <span className="text-[13px] font-extrabold text-white tabular-nums">{cell.date.getDate()}</span>
                          {badge && (
                            <span className="absolute top-0.5 right-0.5 text-[9px] font-extrabold">{badge}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
