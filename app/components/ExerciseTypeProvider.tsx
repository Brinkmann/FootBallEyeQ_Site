"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { auth, db } from "@/Firebase/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
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
  const { canChooseExerciseType, enforcedExerciseType, isLoading: entitlementsLoading } = useEntitlements();
  const [selectedType, setSelectedType] = useState<ExerciseType>("eyeq");
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const prevUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const prevUserId = prevUserIdRef.current;
      const currentUserId = user?.uid || null;
      
      if (prevUserId && !currentUserId) {
        localStorage.removeItem("exerciseType");
        setSelectedType("eyeq");
      }
      
      prevUserIdRef.current = currentUserId;
      setFirebaseUser(user);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authReady || entitlementsLoading) return;

    if (enforcedExerciseType) {
      setSelectedType(enforcedExerciseType);
      setIsLoading(false);
      return;
    }

    const loadPreference = async () => {
      if (firebaseUser) {
        try {
          const prefDoc = await getDoc(doc(db, "userPreferences", firebaseUser.uid));
          if (prefDoc.exists() && prefDoc.data().exerciseType) {
            const userPref = prefDoc.data().exerciseType as ExerciseType;
            setSelectedType(userPref);
            localStorage.setItem("exerciseType", userPref);
          }
        } catch (error) {
          console.error("Failed to load exercise type preference:", error);
        }
      }
      setIsLoading(false);
    };

    loadPreference();
  }, [authReady, entitlementsLoading, enforcedExerciseType, firebaseUser]);

  const handleSetType = async (type: ExerciseType) => {
    if (!canChooseExerciseType) return;
    
    setSelectedType(type);
    localStorage.setItem("exerciseType", type);

    if (firebaseUser) {
      try {
        await setDoc(doc(db, "userPreferences", firebaseUser.uid), {
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
