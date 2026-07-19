"use client";

import { create } from "zustand";
import { storageGet, storageSet } from "@/storage/storage";
import { STORAGE_KEY } from "@/logic/program";
import { simulateSchedule, isoDate } from "@/logic/scheduler";
import { TOTAL_DAYS } from "@/logic/program";
import type { Logs } from "@/logic/scheduler";

interface PersistedState {
  startDate: string | null;
  logs: Logs;
}

interface CoachStore {
  loaded: boolean;
  startDate: string | null;
  logs: Logs;
  viewDay: number;
  viewDateStr: string | null;
  saveError: boolean;

  hydrate: () => Promise<void>;
  startProgram: (dateStr?: string) => void;
  resetProgram: () => void;
  updateSet: (day: number, exerciseId: string, setIndex: number, field: "weight" | "reps", value: string) => void;
  goToDate: (programDay: number, dateStr: string) => void;
}

async function persist(startDate: string | null, logs: Logs, setSaveError: (v: boolean) => void) {
  const ok = await storageSet(STORAGE_KEY, { startDate, logs } satisfies PersistedState);
  setSaveError(!ok);
}

export const useCoachStore = create<CoachStore>((set, get) => ({
  loaded: false,
  startDate: null,
  logs: {},
  viewDay: 1,
  viewDateStr: null,
  saveError: false,

  hydrate: async () => {
    const saved = await storageGet<PersistedState>(STORAGE_KEY);
    if (saved?.startDate) {
      const todayStr = isoDate(new Date());
      const entries = simulateSchedule(saved.startDate, saved.logs || {}, todayStr);
      const todayEntry = entries[entries.length - 1];
      const dn = todayEntry ? Math.min(Math.max(todayEntry.programDay, 1), TOTAL_DAYS) : 1;
      set({
        loaded: true,
        startDate: saved.startDate,
        logs: saved.logs || {},
        viewDay: dn,
        viewDateStr: todayStr,
      });
    } else {
      set({ loaded: true });
    }
  },

  startProgram: (dateStr?: string) => {
    const chosen = dateStr ?? isoDate(new Date());
    const today = isoDate(new Date());
    set({ startDate: chosen, viewDay: 1, viewDateStr: today });
    const { logs } = get();
    persist(chosen, logs, v => set({ saveError: v }));
  },

  resetProgram: () => {
    set({ startDate: null, logs: {}, viewDay: 1, viewDateStr: null });
    persist(null, {}, v => set({ saveError: v }));
  },

  updateSet: (day, exerciseId, setIndex, field, value) => {
    const prev = get().logs;
    const dayLogs = { ...(prev[day] || {}) };
    const exSets = dayLogs[exerciseId] ? [...dayLogs[exerciseId]] : [];
    while (exSets.length <= setIndex) exSets.push({ weight: "", reps: "" });
    exSets[setIndex] = { ...exSets[setIndex], [field]: value };
    dayLogs[exerciseId] = exSets;
    const next = { ...prev, [day]: dayLogs };
    set({ logs: next });
    persist(get().startDate, next, v => set({ saveError: v }));
  },

  goToDate: (programDay, dateStr) => {
    set({ viewDay: programDay, viewDateStr: dateStr });
  },
}));
