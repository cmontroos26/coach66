import { TOTAL_DAYS, buildDayPlan } from "./program";
import type { DayPlan } from "./program";

export type Logs = Record<number, Record<string, { weight: string; reps: string }[]>>;

export interface ScheduleEntry {
  dateStr: string;
  date: Date;
  programDay: number;
  dayPlan: DayPlan;
  isFuture: boolean;
  isToday: boolean;
}

export interface WeekGroup {
  weekStart: Date;
  days: { date: Date; dateStr: string; entry: ScheduleEntry | null }[];
}

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function isDayLogged(day: number, logs: Logs): boolean {
  const dl = logs[day];
  return !!(dl && Object.keys(dl).some(exId => (dl[exId] || []).some(s => s.weight && s.reps)));
}

export function getWeekBounds(date: Date): { monday: Date; sunday: Date } {
  const d = new Date(date);
  const dow = d.getDay();
  const diffToMonday = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { monday, sunday };
}

// Replays every calendar day from the program start, advancing the program-day
// pointer only when a slot is resolved (rest days always resolve; training days
// resolve when logged or in the future). Sundays are always rest (gym closed).
export function simulateSchedule(
  startDateStr: string,
  logs: Logs,
  windowEndStr: string,
): ScheduleEntry[] {
  const start = new Date(startDateStr + "T00:00:00");
  const today = new Date(isoDate(new Date()) + "T00:00:00");
  const windowEnd = new Date(windowEndStr + "T00:00:00");

  const entries: ScheduleEntry[] = [];
  let pointer = 1;
  let cursor = new Date(start);

  while (cursor.getTime() <= windowEnd.getTime() && pointer <= TOTAL_DAYS) {
    const dateStr = isoDate(cursor);
    const isFuture = cursor.getTime() > today.getTime();
    const isToday = cursor.getTime() === today.getTime();
    const isSunday = cursor.getDay() === 0;
    const rawPlan = buildDayPlan(pointer);

    let dayPlan: DayPlan;
    let willAdvance: boolean;

    if (isSunday) {
      dayPlan = rawPlan.isRest
        ? { ...rawPlan, gymClosed: true }
        : { ...rawPlan, isRest: true, type: "rest", exercises: [], finisher: null, gymClosed: true };
      willAdvance = rawPlan.isRest;
    } else {
      dayPlan = rawPlan;
      willAdvance = rawPlan.isRest || isFuture || isDayLogged(pointer, logs);
    }

    entries.push({ dateStr, date: new Date(cursor), programDay: pointer, dayPlan, isFuture, isToday });
    if (willAdvance) pointer++;
    cursor.setDate(cursor.getDate() + 1);
  }

  return entries;
}

export function groupIntoWeeks(entries: ScheduleEntry[]): WeekGroup[] {
  if (!entries.length) return [];
  const lastDate = entries[entries.length - 1].date;
  let cursorMonday = getWeekBounds(entries[0].date).monday;
  const weeks: WeekGroup[] = [];

  while (cursorMonday.getTime() <= lastDate.getTime()) {
    const days: WeekGroup["days"] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(cursorMonday);
      d.setDate(cursorMonday.getDate() + i);
      const dateStr = isoDate(d);
      const entry = entries.find(e => e.dateStr === dateStr) || null;
      days.push({ date: d, dateStr, entry });
    }
    weeks.push({ weekStart: new Date(cursorMonday), days });
    cursorMonday = new Date(cursorMonday);
    cursorMonday.setDate(cursorMonday.getDate() + 7);
  }

  return weeks;
}
