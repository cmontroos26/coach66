"use client";

import { TOTAL_DAYS } from "@/logic/program";
import type { Phase } from "@/logic/program";

interface HeaderProps {
  currentDayNumber: number | null;
  viewDay: number;
  viewDateStr: string | null;
  todayStr: string;
  completedCount: number;
  phase: Phase;
  saveError: boolean;
  onGoToToday: () => void;
  onReset: () => void;
}

export function Header({
  currentDayNumber, viewDay, viewDateStr, todayStr,
  completedCount, phase, saveError, onGoToToday, onReset,
}: HeaderProps) {
  const isViewingToday = viewDateStr === todayStr;
  const progress = Math.round((completedCount / TOTAL_DAYS) * 100);

  return (
    <header className="pt-6 pb-0 border-b border-white/[0.06]">
      {/* Main row */}
      <div className="flex items-start justify-between px-5 mb-4">
        <div>
          <p className="text-[10px] tracking-[2px] text-neutral-600 uppercase mb-1.5">
            coach 66
          </p>
          <h1
            className="text-[26px] font-extrabold tracking-tight leading-none"
            style={{ color: phase.color }}
          >
            {phase.label}
          </h1>
          <p className="text-[12px] text-neutral-600 mt-1.5 leading-snug max-w-[200px]">
            {phase.blurb}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3 pt-1">
          {/* Day counter */}
          <div className="text-right">
            <span className="text-[28px] font-extrabold tabular-nums text-white leading-none">
              {viewDay}
            </span>
            <span className="text-[14px] font-bold text-neutral-600 tabular-nums">
              {" "}/ {TOTAL_DAYS}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {currentDayNumber && !isViewingToday && (
              <button
                onClick={onGoToToday}
                aria-label="Go to today's session"
                className="text-[12px] font-semibold text-neutral-400 hover:text-white transition-colors"
              >
                Today →
              </button>
            )}
            <button
              onClick={() => {
                if (window.confirm("Reset the whole 66-day program? This clears all logs.")) onReset();
              }}
              aria-label="Reset program and clear all logs"
              className="text-[10px] font-bold tracking-[1.5px] uppercase text-neutral-600 hover:text-red-500 border border-white/[0.08] rounded px-2 py-1 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 mb-px flex items-center gap-3">
        <div className="flex-1 h-px bg-white/[0.06] relative overflow-hidden rounded-full">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: phase.color, opacity: 0.7 }}
          />
        </div>
        <span className="text-[10px] tabular-nums text-neutral-600 flex-none">
          {completedCount} done
        </span>
      </div>

      {saveError && (
        <p className="px-5 pt-2 text-[11px] text-red-400">
          Could not save — your last change may not persist.
        </p>
      )}
    </header>
  );
}
