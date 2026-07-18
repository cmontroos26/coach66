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
  return (
    <header className="flex flex-wrap items-start justify-between gap-3 px-5 py-5 border-b border-white/[0.07]">
      <div>
        <p className="text-[11px] tracking-[1.5px] text-neutral-500 mb-1 uppercase">
          Digital Coach · Day {viewDay} of {TOTAL_DAYS}
        </p>
        <h1 className="text-[22px] font-extrabold tracking-wide" style={{ color: phase.color }}>
          {phase.label.toUpperCase()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-center">
          <div className="text-[20px] font-extrabold tabular-nums text-white">{completedCount}</div>
          <div className="text-[10px] tracking-widest text-neutral-500 uppercase">logged</div>
        </div>

        {currentDayNumber && viewDateStr !== todayStr && (
          <button
            onClick={onGoToToday}
            className="text-[12px] px-3 py-2 rounded border border-blue-500/60 text-white bg-transparent hover:bg-blue-500/10 transition-colors"
          >
            Today →
          </button>
        )}

        <button
          onClick={() => {
            if (window.confirm("Reset the whole 66-day program? This clears all logs.")) onReset();
          }}
          className="text-[12px] px-3 py-2 rounded border border-white/10 text-neutral-400 bg-transparent hover:bg-white/5 transition-colors"
        >
          Reset
        </button>
      </div>

      {saveError && (
        <p className="w-full text-[11px] text-red-400 mt-1">
          Could not save — your last change may not persist.
        </p>
      )}
    </header>
  );
}
