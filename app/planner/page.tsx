"use client";
import NavBar from "../components/Navbar";
import SessionCodeButton from "../components/SessionCodeButton";
import { usePlanStore } from "../store/usePlanStore";
import { auth, db } from "../../Firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";

export default function SeasonPlanningPage() {
  const weeks = usePlanStore((s) => s.weeks);
  const maxExercisesPerWeek = usePlanStore((s) => s.maxPerWeek);
  const removeFromWeek = usePlanStore((s) => s.removeFromWeek);
  const setAll = usePlanStore((s) => s.setAll);

  const loadedUserRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false);

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

  // Stable save function
  const saveToFirestore = useCallback(async (weeksData: typeof weeks, maxPerWeek: number) => {
    const user = auth.currentUser;
    if (!user || isLoadingRef.current) return;
    
    const ref = doc(db, "planners", user.uid);
    try {
      await setDoc(ref, { weeks: weeksData, maxPerWeek, updatedAt: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.error("Failed to save planner:", error);
    }
  }, []);
  
  // Load user's plan once after login (or create a blank one)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        loadedUserRef.current = null;
        return;
      }

      // Skip if already loaded for this user
      if (loadedUserRef.current === user.uid) {
        return;
      }

      isLoadingRef.current = true;
      const ref = doc(db, "planners", user.uid);

      try {
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
        
        loadedUserRef.current = user.uid;
      } catch (error) {
        console.error("Failed to load or initialize planner:", error);
      } finally {
        isLoadingRef.current = false;
      }
    });
    return () => unsub();
  }, [setAll]);

  // Save whenever weeks/max change - only after data has been loaded for current user
  useEffect(() => {
    // Only save if we have loaded data for a user
    if (!loadedUserRef.current || isLoadingRef.current) return;
    
    saveToFirestore(weeks, maxExercisesPerWeek);
  }, [weeks, maxExercisesPerWeek, saveToFirestore]);


  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-foreground">12-Week Season Plan</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {weeks.map((week) => (
            <div key={week.week} className="bg-card rounded shadow p-4 border border-divider">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-foreground">Week {week.week}</h4>

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