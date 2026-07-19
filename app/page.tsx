"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCoachStore } from "@/store/useCoachStore";
import { Header } from "@/components/Header";
import { ProgramGrid } from "@/components/ProgramGrid";
import { DayCard } from "@/components/DayCard";
import { buildDayPlan, TOTAL_DAYS } from "@/logic/program";
import { simulateSchedule, groupIntoWeeks, isoDate, isDayLogged } from "@/logic/scheduler";

function OnboardingScreen({ onStart }: { onStart: (dateStr: string) => void }) {
  const todayStr = isoDate(new Date());
  const [pickedDate, setPickedDate] = useState(todayStr);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm text-center"
      >
        <p className="text-[12px] tracking-[4px] text-neutral-500 uppercase mb-3">Digital Coach</p>
        <h1 className="text-[120px] font-extrabold leading-none tabular-nums text-white mb-2">66</h1>
        <p className="text-[15px] text-neutral-400 leading-relaxed mb-8">
          A comeback program. Full gym, 20 years of history, one year off. Time to reload.
        </p>
        <ul className="text-left text-[14px] text-neutral-300 flex flex-col gap-2.5 mb-10 list-none p-0">
          <li><strong>Days 1–9</strong> — Reactivation: groove the movement</li>
          <li><strong>Days 10–33</strong> — Rebuild: volume, progressive overload</li>
          <li><strong>Days 34–57</strong> — Intensify: heavier, conditioning added</li>
          <li><strong>Days 58–66</strong> — Peak &amp; Test: taper, retest your lifts</li>
        </ul>

        {/* Date picker */}
        <div className="mb-4">
          <p className="text-[11px] tracking-[2px] text-neutral-500 uppercase mb-2">Day 1 starts on</p>
          <input
            type="date"
            value={pickedDate}
            onChange={e => setPickedDate(e.target.value)}
            className="w-full bg-white/[0.06] text-white text-[16px] font-semibold text-center py-3 rounded-lg border border-white/[0.1] focus:outline-none focus:border-white/30 [color-scheme:dark]"
          />
        </div>

        <button
          onClick={() => onStart(pickedDate)}
          className="w-full bg-[#C1443C] text-white font-bold text-[16px] tracking-wide py-4 rounded-lg active:scale-[0.98] transition-all"
        >
          {pickedDate === todayStr ? "Start Day 1 — Today" : `Start Day 1 — ${new Date(pickedDate + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}`}
        </button>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const {
    loaded, startDate, logs, viewDay, viewDateStr, saveError,
    hydrate, startProgram, resetProgram, updateSet, goToDate,
  } = useCoachStore();

  useEffect(() => { hydrate(); }, [hydrate]);

  const todayStr = isoDate(new Date());

  // Schedule for current week strip (up to end of this week)
  const farEnd = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 260);
    return isoDate(d);
  })();

  const fullScheduleEntries = useMemo(
    () => (startDate ? simulateSchedule(startDate, logs, farEnd) : []),
    [startDate, logs, farEnd],
  );

  const programWeeks = useMemo(() => groupIntoWeeks(fullScheduleEntries), [fullScheduleEntries]);

  const todayScheduleEntry = fullScheduleEntries.find(e => e.isToday);
  const currentDayNumber = startDate
    ? Math.min(Math.max(todayScheduleEntry?.programDay ?? 1, 1), TOTAL_DAYS)
    : null;

  const viewedEntry = viewDateStr ? fullScheduleEntries.find(e => e.dateStr === viewDateStr) : null;
  const plan = viewedEntry ? viewedEntry.dayPlan : buildDayPlan(viewDay);
  const dayLogs = logs[viewDay] || {};

  const completedCount = useMemo(() => {
    let count = 0;
    for (let d = 1; d <= TOTAL_DAYS; d++) {
      const dp = buildDayPlan(d);
      if (!dp.isRest && isDayLogged(d, logs)) count++;
    }
    return count;
  }, [logs]);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-mono tracking-[2px] text-neutral-500 text-sm">LOADING…</span>
      </div>
    );
  }

  if (!startDate) {
    return <OnboardingScreen onStart={startProgram} />;
  }

  return (
    <div className="min-h-screen pb-12">
      <Header
        currentDayNumber={currentDayNumber}
        viewDay={viewDay}
        viewDateStr={viewDateStr}
        todayStr={todayStr}
        completedCount={completedCount}
        phase={plan.phase}
        saveError={saveError}
        onGoToToday={() => goToDate(currentDayNumber!, todayStr)}
        onReset={resetProgram}
      />
      <ProgramGrid
        weeks={programWeeks}
        viewDateStr={viewDateStr}
        logs={logs}
        onGoToDate={goToDate}
      />
      <DayCard
        plan={plan}
        dayLogs={dayLogs}
        logs={logs}
        onUpdateSet={updateSet}
      />
    </div>
  );
}
