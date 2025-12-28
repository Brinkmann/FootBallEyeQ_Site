"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, db } from "@/Firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEntitlements } from "./EntitlementProvider";
import { ExerciseType } from "../types/exercise";

interface ExerciseTypeContextType {
  selectedExerciseType: ExerciseType;
  setSelectedExerciseType: (type: ExerciseType) => void;
  canChoose: boolean;
  isLoading: boolean;
}

const ExerciseTypeContext = createContext<ExerciseTypeContextType | null>(null);

export function ExerciseTypeProvider({ children }: { children: ReactNode }) {
  const { canChooseExerciseType, enforcedExerciseType, isAuthenticated, isLoading: entitlementsLoading } = useEntitlements();
  const [selectedType, setSelectedType] = useState<ExerciseType>("eyeq");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (entitlementsLoading) return;

    if (enforcedExerciseType) {
      setSelectedType(enforcedExerciseType);
      setIsLoading(false);
      return;
    }

    const loadPreference = async () => {
      if (isAuthenticated && auth.currentUser) {
        try {
          const prefDoc = await getDoc(doc(db, "userPreferences", auth.currentUser.uid));
          if (prefDoc.exists() && prefDoc.data().exerciseType) {
            setSelectedType(prefDoc.data().exerciseType as ExerciseType);
          } else {
            const stored = localStorage.getItem("exerciseType");
            if (stored === "eyeq" || stored === "plastic") {
              setSelectedType(stored);
            }
          }
        } catch (error) {
          console.error("Failed to load exercise type preference:", error);
          const stored = localStorage.getItem("exerciseType");
          if (stored === "eyeq" || stored === "plastic") {
            setSelectedType(stored);
          }
        }
      } else {
        const stored = localStorage.getItem("exerciseType");
        if (stored === "eyeq" || stored === "plastic") {
          setSelectedType(stored);
        }
      }
      setIsLoading(false);
    };

    loadPreference();
  }, [entitlementsLoading, enforcedExerciseType, isAuthenticated]);

  const handleSetType = async (type: ExerciseType) => {
    if (!canChooseExerciseType) return;
    
    setSelectedType(type);
    localStorage.setItem("exerciseType", type);

    if (isAuthenticated && auth.currentUser) {
      try {
        await setDoc(doc(db, "userPreferences", auth.currentUser.uid), {
          exerciseType: type,
          updatedAt: new Date(),
        }, { merge: true });
      } catch (error) {
        console.error("Failed to save exercise type preference:", error);
      }
    }
  };

  return (
    <ExerciseTypeContext.Provider
      value={{
        selectedExerciseType: selectedType,
        setSelectedExerciseType: handleSetType,
        canChoose: canChooseExerciseType,
        isLoading,
      }}
    >
      {children}
    </ExerciseTypeContext.Provider>
  );
}

export function useExerciseType() {
  const context = useContext(ExerciseTypeContext);
  if (!context) {
    throw new Error("useExerciseType must be used within an ExerciseTypeProvider");
  }
  return context;
}
