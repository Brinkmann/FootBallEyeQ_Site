"use client";
import { useEffect, useRef } from "react";
import { usePlanStore, PlannedExercise } from "../store/usePlanStore";
import { auth, db } from "@/Firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function PlanSyncProvider({ children }: { children: React.ReactNode }) {
  const weeks = usePlanStore((s) => s.weeks);
  const maxPerWeek = usePlanStore((s) => s.maxPerWeek);
  const setAll = usePlanStore((s) => s.setAll);
  const reset = usePlanStore((s) => s.reset);
  const setHydrated = usePlanStore((s) => s.setHydrated);

  const loadedUserRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false);
  const lastSavedRef = useRef<string>("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        loadedUserRef.current = null;
        lastSavedRef.current = "";
        reset();
        setHydrated();
        return;
      }

      if (loadedUserRef.current === user.uid) {
        setHydrated();
        return;
      }

      isLoadingRef.current = true;
      const ref = doc(db, "planners", user.uid);

      try {
        const snap = await getDoc(ref);

        const empty = Array.from({ length: 12 }, (_, i) => ({
          week: i + 1,
          exercises: [] as PlannedExercise[],
        }));

        if (snap.exists()) {
          const data = snap.data() as {
            weeks?: { week: number; exercises: (PlannedExercise | string)[] }[];
            maxPerWeek?: number;
          };
          
          // Normalize legacy string-based exercises to new {name, type} format
          const normalizedWeeks = Array.isArray(data.weeks) 
            ? data.weeks.map(w => ({
                week: w.week,
                exercises: w.exercises.map(ex => 
                  typeof ex === "string" 
                    ? { name: ex, type: "eyeq" as const }  // Legacy data defaults to eyeq
                    : ex
                ) as PlannedExercise[]
              }))
            : empty;
          
          const loadedMax = typeof data.maxPerWeek === "number" ? data.maxPerWeek : 5;
          
          setAll({ weeks: normalizedWeeks, maxPerWeek: loadedMax });
          lastSavedRef.current = JSON.stringify({ weeks: normalizedWeeks, maxPerWeek: loadedMax });
        } else {
          await setDoc(ref, { weeks: empty, maxPerWeek: 5, updatedAt: serverTimestamp() });
          setAll({ weeks: empty, maxPerWeek: 5 });
          lastSavedRef.current = JSON.stringify({ weeks: empty, maxPerWeek: 5 });
        }

        loadedUserRef.current = user.uid;
      } catch (error) {
        console.error("Failed to load planner:", error);
      } finally {
        isLoadingRef.current = false;
        setHydrated();
      }
    });

    return () => unsub();
  }, [setAll, reset, setHydrated]);

  useEffect(() => {
    if (!loadedUserRef.current || isLoadingRef.current) return;

    const user = auth.currentUser;
    if (!user) return;

    const currentData = JSON.stringify({ weeks, maxPerWeek });
    if (currentData === lastSavedRef.current) return;

    lastSavedRef.current = currentData;
    const ref = doc(db, "planners", user.uid);
    
    setDoc(ref, { weeks, maxPerWeek, updatedAt: serverTimestamp() }, { merge: true }).catch(
      (error) => {
        console.error("Failed to save planner:", error);
      }
    );
  }, [weeks, maxPerWeek]);

  return <>{children}</>;
}
