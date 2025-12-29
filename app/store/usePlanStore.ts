"use client";
import { create } from "zustand";
import { ExerciseType } from "../types/exercise";

export type PlannedExercise = { name: string; type: ExerciseType };
type WeekPlan = { week: number; exercises: PlannedExercise[] };
type SetAllPayload = { weeks: WeekPlan[]; maxPerWeek: number };

type PlanState = {
  weeks: WeekPlan[];
  maxPerWeek: number;
  hasHydrated: boolean;
  addToWeek: (week: number, name: string, type: ExerciseType) => { ok: boolean; reason?: string };
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

  addToWeek: (week, name, type) => {
    const { weeks, maxPerWeek } = get();
    const idx = week - 1;
    const current = weeks[idx];
    if (!current) return { ok: false, reason: "invalid-week" };
    
    // Check for duplicate (same name AND type)
    if (current.exercises.some(e => e.name === name && e.type === type)) {
      return { ok: false, reason: "duplicate" };
    }
    
    // Count only exercises of the same type for the limit
    const sameTypeCount = current.exercises.filter(e => e.type === type).length;
    if (sameTypeCount >= maxPerWeek) {
      return { ok: false, reason: "full" };
    }
    
    const nextWeeks = weeks.slice();
    nextWeeks[idx] = { ...current, exercises: [...current.exercises, { name, type }] };
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
      exercises: w.exercises.filter((e) => e.name !== name),
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