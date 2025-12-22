"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { auth, db } from "@/Firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

interface FavoritesContextType {
  favorites: Set<string>;
  toggleFavorite: (exerciseId: string) => Promise<void>;
  isFavorite: (exerciseId: string) => boolean;
  isAuthenticated: boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || null);
      if (!user) {
        setFavorites(new Set());
        setLoading(false);
      }
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    const q = query(
      collection(db, "favorites"),
      where("userId", "==", userId)
    );

    const unsubSnap = onSnapshot(q, (snapshot) => {
      const favs = new Set<string>();
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.exerciseId) {
          favs.add(data.exerciseId);
        }
      });
      setFavorites(favs);
      setLoading(false);
    });

    return () => unsubSnap();
  }, [userId]);

  const toggleFavorite = useCallback(
    async (exerciseId: string) => {
      if (!userId) return;

      const docId = `${userId}_${exerciseId}`;
      const ref = doc(db, "favorites", docId);

      if (favorites.has(exerciseId)) {
        await deleteDoc(ref);
      } else {
        await setDoc(ref, {
          userId,
          exerciseId,
          createdAt: serverTimestamp(),
        });
      }
    },
    [userId, favorites]
  );

  const isFavorite = useCallback(
    (exerciseId: string) => favorites.has(exerciseId),
    [favorites]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        isAuthenticated: !!userId,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavoritesContext must be used within a FavoritesProvider");
  }
  return context;
}
