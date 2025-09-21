"use client";
import { create } from "zustand";

type WeekPlan = { week: number; exercises: string[] };

type PlanState = {
  weeks: WeekPlan[];
  maxPerWeek: number;
  addToWeek: (week: number, name: string) => { ok: boolean; reason?: string };
  removeFromWeek: (week: number, index: number) => void;
  reset: () => void;
};

export const usePlanStore = create<PlanState>((set, get) => ({
  weeks: Array.from({ length: 12 }, (_, i) => ({
    week: i + 1,
    exercises: [], // Removed the seeded "Precision Passing" exercise
  })),
  maxPerWeek: 5,

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

  reset: () =>
    set({
      weeks: Array.from({ length: 12 }, (_, i) => ({ week: i + 1, exercises: [] })),
    }),
}));