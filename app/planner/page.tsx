"use client";
import Link from "next/link";
import NavBar from "../components/Navbar";
import SessionCodeButton from "../components/SessionCodeButton";
import { usePlanStore } from "../store/usePlanStore";
import { db } from "../../Firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

export default function SeasonPlanningPage() {
  const weeks = usePlanStore((s) => s.weeks);
  const maxExercisesPerWeek = usePlanStore((s) => s.maxPerWeek);
  const removeFromWeek = usePlanStore((s) => s.removeFromWeek);

  // Fetch exercises catalog from Firestore
  const [catalog, setCatalog] = useState<{ id: number; title: string }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "exercises"));
        const list = snap.docs.map((d) => {
          const data = d.data() as { id?: number; title?: string };
          const id =
            typeof data.id === "number"
              ? data.id
              : Number.isNaN(Number(d.id))
              ? 0
              : Number(d.id);
          const title = data.title ?? d.id;
          return { id, title };
        });
        setCatalog(list);
      } catch (error) {
        console.error("Failed to load exercise catalog for planner:", error);
      }
    })();
  }, []);

  // Build name → id map for SessionCodeButton
  const ID_BY_NAME = useMemo(() => {
    const m: Record<string, number> = {};
    for (const ex of catalog) {
      if (typeof ex.id === "number" && !Number.isNaN(ex.id)) {
        m[ex.title] = ex.id;
      }
    }
    return m;
  }, [catalog]);


  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-foreground">12-Session Season Plan</h3>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {weeks.map((week) => (
            <div key={week.week} className="bg-card rounded shadow p-4 border border-divider">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-foreground">Session {week.week}</h4>

                <SessionCodeButton
                  exercises={week.exercises}
                  idByName={ID_BY_NAME}
                  weekLabel={`Session ${week.week}`}
                  buttonText="Generate Code"
                />
              </div>

              <p className="text-sm text-gray-500 mb-3">
                {week.exercises.length}/{maxExercisesPerWeek} exercises
              </p>

              <div className="space-y-2 mb-4">
                {Array.from({ length: maxExercisesPerWeek }).map((_, i) => {
                  const name = week.exercises[i];
                  return (
                    <div
                      key={i}
                      className={`border p-2 text-sm rounded flex items-center justify-between ${
                        name ? "bg-primary-light text-primary-dark border-divider" : "text-gray-400 border-divider"
                      }`}
                    >
                      <span>{name || "Empty slot"}</span>
                      {name && (
                        <button
                          className="text-xs text-primary hover:underline"
                          onClick={() => removeFromWeek(week.week, i)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}