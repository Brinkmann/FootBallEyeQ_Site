"use client";
import Link from "next/link";
import NavBar from "../components/Navbar";
import SessionCodeButton from "../components/SessionCodeButton";
import WelcomeModal from "../components/WelcomeModal";
import SyncStatusIndicator from "../components/SyncStatusIndicator";
import { usePlanStore } from "../store/usePlanStore";
import { useEffect, useMemo, useState } from "react";
import { useEntitlements } from "../components/EntitlementProvider";
import { useExerciseType } from "../components/ExerciseTypeProvider";
import { ExerciseType } from "../types/exercise";

export default function SeasonPlanningPage() {
  const weeks = usePlanStore((s) => s.weeks);
  const maxExercisesPerWeek = usePlanStore((s) => s.maxPerWeek);
  const removeFromWeek = usePlanStore((s) => s.removeFromWeek);
  const hasHydrated = usePlanStore((s) => s.hasHydrated);
  const { entitlements, accountType, isAuthenticated, isLoading: entitlementsLoading } = useEntitlements();
  const { selectedExerciseType } = useExerciseType();

  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalog, setCatalog] = useState<{ id: number; title: string; exerciseType: ExerciseType }[]>([]);

  useEffect(() => {
    (async () => {
      setCatalogLoading(true);
      try {
        const res = await fetch("/api/exercises");
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const data = await res.json();
        const list = (data.exercises || []).map((ex: { title?: string; exerciseType?: ExerciseType }) => {
          const title = ex.title ?? "";
          const titleMatch = typeof title === "string" ? title.match(/^(\d+)\s*-/) : null;
          const id = titleMatch ? parseInt(titleMatch[1], 10) : 0;
          const exerciseType = ex.exerciseType || "eyeq";
          return { id, title, exerciseType };
        });
        setCatalog(list);
      } catch (error) {
        console.error("Failed to load exercise catalog for planner:", error);
      } finally {
        setCatalogLoading(false);
      }
    })();
  }, []);

  // Build name → id map for SessionCodeButton (filtered by exercise type)
  const ID_BY_NAME = useMemo(() => {
    const m: Record<string, number> = {};
    for (const ex of catalog) {
      if (typeof ex.id === "number" && !Number.isNaN(ex.id) && ex.exerciseType === selectedExerciseType) {
        m[ex.title] = ex.id;
      }
    }
    return m;
  }, [catalog, selectedExerciseType]);

  // Filter weeks' exercises to only show those matching the selected type
  // Keep track of original indices for correct removal
  const filteredWeeks = useMemo(() => {
    return weeks.map(week => {
      const filteredExercises: { name: string; originalIndex: number }[] = [];
      week.exercises.forEach((ex, idx) => {
        if (ex.type === selectedExerciseType) {
          filteredExercises.push({ name: ex.name, originalIndex: idx });
        }
      });
      return {
        ...week,
        filteredExercises
      };
    });
  }, [weeks, selectedExerciseType]);


  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <WelcomeModal type="coach" />

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-foreground">12-Session Season Plan</h3>
            <SyncStatusIndicator />
          </div>
          <Link
            href="/planner/stats"
            className="px-4 py-2 text-sm font-medium rounded-lg border border-divider text-foreground hover:bg-primary-light hover:border-primary transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            View Stats
          </Link>
        </div>

        {(catalogLoading || !hasHydrated || entitlementsLoading) ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
            <p className="text-foreground">Loading your season plan...</p>
            <p className="text-sm text-foreground opacity-60">Preparing your sessions and drills.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWeeks.map((week) => {
            const isLocked = week.week > entitlements.maxSessions;
            
            if (isLocked) {
              return (
                <div key={week.week} className="bg-card rounded shadow p-4 border border-divider opacity-60 relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-white/95 rounded z-10">
                    <div className="text-center p-6 max-w-[200px]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 mx-auto mb-3" style={{ color: '#A10115' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                      <p className="text-sm font-semibold mb-1" style={{ color: '#A10115' }}>
                        Session {week.week} Locked
                      </p>
                      <p className="text-xs mb-3" style={{ color: '#C0B2B5' }}>
                        Free plans include 1 session. Upgrade to plan all 12 sessions of your season.
                      </p>
                      <Link
                        href="/upgrade"
                        className="inline-block px-4 py-2 text-xs font-medium text-white rounded transition-colors"
                        style={{ backgroundColor: '#D72C16' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A10115'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D72C16'}
                      >
                        View Upgrade Options
                      </Link>
                    </div>
                  </div>
                  <h4 className="font-bold text-foreground mb-2">Session {week.week}</h4>
                  <p className="text-sm text-gray-400">Locked</p>
                </div>
              );
            }

            return (
              <div key={week.week} className="bg-card rounded shadow p-4 border border-divider">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-foreground">Session {week.week}</h4>

                  {selectedExerciseType === "eyeq" && (
                    <SessionCodeButton
                      exercises={week.filteredExercises.map(e => e.name)}
                      idByName={ID_BY_NAME}
                      weekLabel={`Session ${week.week}`}
                      buttonText="Generate Code"
                    />
                  )}
                </div>

                <p className="text-sm text-gray-500 mb-3">
                  {week.filteredExercises.length}/{maxExercisesPerWeek} exercises
                </p>

                <div className="space-y-2 mb-4">
                  {week.filteredExercises.length === 0 ? (
                    <div className="border border-dashed border-divider rounded p-4 text-center">
                      <p className="text-sm text-gray-400 mb-2">No drills added yet</p>
                      <Link
                        href="/catalog"
                        className="text-xs text-primary hover:underline"
                      >
                        Browse the catalog to add drills
                      </Link>
                    </div>
                  ) : (
                    Array.from({ length: maxExercisesPerWeek }).map((_, i) => {
                      const exercise = week.filteredExercises[i];
                      if (!exercise && i >= week.filteredExercises.length) {
                        return (
                          <div
                            key={i}
                            className="border p-2 text-sm rounded flex items-center gap-2 text-gray-400 border-divider border-dashed"
                          >
                            <span className="truncate flex-1 min-w-0">Empty slot</span>
                          </div>
                        );
                      }
                      return exercise ? (
                        <div
                          key={i}
                          className="border p-2 text-sm rounded flex items-center gap-2 bg-primary-light text-primary-dark border-divider"
                        >
                          <span className="truncate flex-1 min-w-0">{exercise.name}</span>
                          <button
                            className="text-xs text-primary hover:underline flex-shrink-0"
                            onClick={() => removeFromWeek(week.week, exercise.originalIndex)}
                          >
                            Remove
                          </button>
                        </div>
                      ) : null;
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}

        {accountType === "free" && isAuthenticated && (
          <div className="mt-8 bg-primary-light border border-primary rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-primary-dark mb-2">
              Unlock Your Full Season
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Free accounts can plan 1 session. Upgrade to plan your full 12-session season.
            </p>
            <Link
              href="/upgrade"
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover transition"
            >
              Upgrade Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}