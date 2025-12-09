"use client";
import { useEffect, useRef } from "react";
import { usePlanStore } from "../store/usePlanStore";
import { auth, db } from "@/Firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function PlanSyncProvider({ children }: { children: React.ReactNode }) {
  const weeks = usePlanStore((s) => s.weeks);
  const maxPerWeek = usePlanStore((s) => s.maxPerWeek);
  const setAll = usePlanStore((s) => s.setAll);

  const loadedUserRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false);
  const lastSavedRef = useRef<string>("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        loadedUserRef.current = null;
        return;
      }

      if (loadedUserRef.current === user.uid) {
        return;
      }

      isLoadingRef.current = true;
      const ref = doc(db, "planners", user.uid);

      try {
        const snap = await getDoc(ref);

        const empty = Array.from({ length: 12 }, (_, i) => ({
          week: i + 1,
          exercises: [] as string[],
        }));

        if (snap.exists()) {
          const data = snap.data() as {
            weeks?: { week: number; exercises: string[] }[];
            maxPerWeek?: number;
          };
          const loadedWeeks = Array.isArray(data.weeks) ? data.weeks : empty;
          const loadedMax = typeof data.maxPerWeek === "number" ? data.maxPerWeek : 5;
          
          setAll({ weeks: loadedWeeks, maxPerWeek: loadedMax });
          lastSavedRef.current = JSON.stringify({ weeks: loadedWeeks, maxPerWeek: loadedMax });
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
      }
    });

    return () => unsub();
  }, [setAll]);

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
