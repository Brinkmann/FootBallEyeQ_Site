"use client";
import { create } from "zustand";

type WeekPlan = { week: number; exercises: string[] };
type SetAllPayload = { weeks: WeekPlan[]; maxPerWeek: number };

type PlanState = {
  weeks: WeekPlan[];
  maxPerWeek: number;
  hasHydrated: boolean;
  addToWeek: (week: number, name: string) => { ok: boolean; reason?: string };
  removeFromWeek: (week: number, index: number) => void;
  removeExerciseFromAll: (name: string) => void;
  reset: () => void;
  setAll: (payload: { weeks: WeekPlan[]; maxPerWeek: number }) => void;
  setHydrated: () => void;
};

export const usePlanStore = create<PlanState>((set, get) => ({
  weeks: Array.from({ length: 12 }, (_, i) => ({
    week: i + 1,
    exercises: [],
  })),
  maxPerWeek: 5,
  hasHydrated: false,

  addToWeek: (week, name) => {
    const { weeks, maxPerWeek } = get();
    const idx = week - 1;
    const current = weeks[idx];
    if (!current) return { ok: false, reason: "invalid-week" };
    if (current.exercises.includes(name)) return { ok: false, reason: "duplicate" };
    if (current.exercises.length >= maxPerWeek) return { ok: false, reason: "full" };
    const nextWeeks = weeks.slice();
    nextWeeks[idx] = { ...current, exercises: [...current.exercises, name] };
    set({ weeks: nextWeeks });
    return { ok: true };
  },

  removeFromWeek: (week, index) => {
    const { weeks } = get();
    const idx = week - 1;
    const current = weeks[idx];
    if (!current) return;
    const next = current.exercises.slice();
    next.splice(index, 1);
    const nextWeeks = weeks.slice();
    nextWeeks[idx] = { ...current, exercises: next };
    set({ weeks: nextWeeks });
  },

  removeExerciseFromAll: (name) => {
    const { weeks } = get();
    const nextWeeks = weeks.map((w) => ({
      ...w,
      exercises: w.exercises.filter((e) => e !== name),
    }));
    set({ weeks: nextWeeks });
  },

  reset: () =>
    set({
      weeks: Array.from({ length: 12 }, (_, i) => ({ week: i + 1, exercises: [] })),
    }),
  
  setAll: ({ weeks, maxPerWeek }: SetAllPayload) =>
    set({
      weeks: weeks.map((w: WeekPlan) => ({ week: w.week, exercises: [...w.exercises] })),
      maxPerWeek,
  }),

  setHydrated: () => set({ hasHydrated: true }),
}));