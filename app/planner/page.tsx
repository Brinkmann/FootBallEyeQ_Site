"use client";
import NavBar from "../components/Navbar";
import SessionCodeButton from "../components/SessionCodeButton";
import { usePlanStore } from "../store/usePlanStore";
import { exercises as CATALOG } from "../data/exercises";
import { auth, db } from "../../Firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useEffect } from "react";

// Create ID mapping from your exercises data
const ID_BY_NAME: Record<string, number> = CATALOG.reduce((acc, exercise) => {
  acc[exercise.title] = exercise.id;
  return acc;
}, {} as Record<string, number>);

export default function SeasonPlanningPage() {
  const weeks = usePlanStore((s) => s.weeks);
  const maxExercisesPerWeek = usePlanStore((s) => s.maxPerWeek);
  const removeFromWeek = usePlanStore((s) => s.removeFromWeek);
  const setAll = usePlanStore((s) => s.setAll);

  // 1) Load user's plan once after login (or create a blank one)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const ref = doc(db, "planners", user.uid);
      const snap = await getDoc(ref);

      const empty = Array.from({ length: 12 }, (_, i) => ({
        week: i + 1,
        exercises: [],
      }));

      if (snap.exists()) {
        const data = snap.data() as {
          weeks?: { week: number; exercises: string[] }[];
          maxPerWeek?: number;
        };
        setAll({
          weeks: Array.isArray(data.weeks) ? data.weeks : empty,
          maxPerWeek: typeof data.maxPerWeek === "number" ? data.maxPerWeek : 5,
        });
      } else {
        await setDoc(ref, { weeks: empty, maxPerWeek: 5, updatedAt: serverTimestamp() });
        setAll({ weeks: empty, maxPerWeek: 5 });
      }
    });
    return () => unsub();
  }, [setAll]);

  // 2) Save whenever weeks/max change (simple + reliable)
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const ref = doc(db, "planners", user.uid);
    setDoc(ref, { weeks, maxPerWeek: maxExercisesPerWeek, updatedAt: serverTimestamp() }, { merge: true });
  }, [weeks, maxExercisesPerWeek]);


  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">12-Week Season Plan</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
            + New Season Plan
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {weeks.map((week) => (
            <div key={week.week} className="bg-white rounded shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold">Week {week.week}</h4>

                <SessionCodeButton
                  exercises={week.exercises}
                  idByName={ID_BY_NAME}
                  weekLabel={`Week ${week.week}`}
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
                        name ? "bg-blue-50 text-blue-700" : "text-gray-400"
                      }`}
                    >
                      <span>{name || "Empty slot"}</span>
                      {name && (
                        <button
                          className="text-xs text-red-600 hover:underline"
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