"use client";
import { create } from "zustand";

type WeekPlan = { week: number; exercises: string[] };
type SetAllPayload = { weeks: WeekPlan[]; maxPerWeek: number };

const normalizeWeeks = (weeks: WeekPlan[]) => {
  const emptyWeek = { week: 0, exercises: [] as string[] };
  const byWeek = new Map<number, WeekPlan>();

  for (const w of weeks || []) {
    const weekNumber = typeof w.week === "number" ? w.week : Number(w.week);
    if (!Number.isFinite(weekNumber)) continue;
    const exercises = Array.isArray(w.exercises) ? [...w.exercises] : [];
    byWeek.set(weekNumber, { week: weekNumber, exercises });
  }

  return Array.from({ length: 12 }, (_, i) => byWeek.get(i + 1) ?? { ...emptyWeek, week: i + 1 });
};

type PlanState = {
  weeks: WeekPlan[];
  maxPerWeek: number;
  addToWeek: (week: number, name: string) => { ok: boolean; reason?: string };
  removeFromWeek: (week: number, index: number) => void;
  reset: () => void;
  setAll: (payload: { weeks: WeekPlan[]; maxPerWeek: number }) => void;
};

export const usePlanStore = create<PlanState>((set, get) => ({
  weeks: normalizeWeeks([]),
  maxPerWeek: 5,

  addToWeek: (week, name) => {
    const { maxPerWeek } = get();
    const weeks = normalizeWeeks(get().weeks);
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
    const weeks = normalizeWeeks(get().weeks);
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

  setAll: ({ weeks, maxPerWeek }: SetAllPayload) =>
    set({
      weeks: normalizeWeeks(weeks),
      maxPerWeek: typeof maxPerWeek === "number" && Number.isFinite(maxPerWeek) && maxPerWeek > 0 ? maxPerWeek : 5,
    }),
}));
