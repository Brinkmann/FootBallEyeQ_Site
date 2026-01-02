"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from "react";
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
  getDocs,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { FREE_ENTITLEMENTS, PREMIUM_ENTITLEMENTS, AccountType } from "../types/account";
import { ExerciseType } from "../types/exercise";
import { useExerciseType } from "./ExerciseTypeProvider";
import { AccountTypeSchema } from "../lib/schemas";

interface FavoriteData {
  exerciseId: string;
  exerciseType: ExerciseType;
}

interface FavoritesContextType {
  favorites: Set<string>;
  favoritesByType: Map<ExerciseType, Set<string>>;
  toggleFavorite: (exerciseId: string, exerciseType: ExerciseType) => Promise<void>;
  isFavorite: (exerciseId: string) => boolean;
  isAuthenticated: boolean;
  loading: boolean;
  hasHydrated: boolean;
  favoritesCount: number;
  favoritesCountForType: number;
  getFavoritesCountForType: (type: ExerciseType) => number;
  maxFavorites: number;
  isAtLimitForType: (type: ExerciseType) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoritesData, setFavoritesData] = useState<FavoriteData[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>("free");
  
  const { selectedExerciseType } = useExerciseType();

  const maxFavorites = accountType === "free" ? FREE_ENTITLEMENTS.maxFavorites : PREMIUM_ENTITLEMENTS.maxFavorites;
  
  const favorites = useMemo(() => {
    return new Set(favoritesData.map(f => f.exerciseId));
  }, [favoritesData]);

  const favoritesByType = useMemo(() => {
    const map = new Map<ExerciseType, Set<string>>();
    map.set("eyeq", new Set());
    map.set("plastic", new Set());
    
    favoritesData.forEach(f => {
      const typeSet = map.get(f.exerciseType);
      if (typeSet) {
        typeSet.add(f.exerciseId);
      }
    });
    
    return map;
  }, [favoritesData]);

  const favoritesCount = favorites.size;
  
  const favoritesCountForType = useMemo(() => {
    return favoritesByType.get(selectedExerciseType)?.size ?? 0;
  }, [favoritesByType, selectedExerciseType]);

  const getFavoritesCountForType = useCallback((type: ExerciseType) => {
    return favoritesByType.get(type)?.size ?? 0;
  }, [favoritesByType]);

  const isAtLimitForType = useCallback((type: ExerciseType) => {
    if (accountType !== "free") return false;
    const count = favoritesByType.get(type)?.size ?? 0;
    return count >= maxFavorites;
  }, [accountType, favoritesByType, maxFavorites]);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setUserId(user?.uid || null);
      if (!user) {
        setFavoritesData([]);
        setAccountType("free");
        setLoading(false);
        setHasHydrated(true);
        return;
      }

      try {
        const signupDocRef = doc(db, "signups", user.uid);
        const snapshot = await getDoc(signupDocRef);
        if (snapshot.exists()) {
          const userData = snapshot.data();
          const accountTypeParsed = AccountTypeSchema.safeParse(userData.accountType);
          if (!accountTypeParsed.success) {
            console.warn(`Invalid accountType for user ${user.uid}:`, accountTypeParsed.error.flatten());
          }
          setAccountType(accountTypeParsed.success ? accountTypeParsed.data : "free");
        }
      } catch (error) {
        console.error("Failed to load account type:", error);
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

    const unsubSnap = onSnapshot(
      q, 
      (snapshot) => {
        const favs: FavoriteData[] = [];
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.exerciseId) {
            favs.push({
              exerciseId: data.exerciseId,
              exerciseType: data.exerciseType || "eyeq",
            });
          }
        });
        setFavoritesData(favs);
        setLoading(false);
        setHasHydrated(true);
      },
      (error) => {
        console.error("Favorites listener error:", error);
        setLoading(false);
        setHasHydrated(true);
      }
    );

    return () => unsubSnap();
  }, [userId]);

  const toggleFavorite = useCallback(
    async (exerciseId: string, exerciseType: ExerciseType) => {
      if (!userId) return;

      const docId = `${userId}_${exerciseId}`;
      const ref = doc(db, "favorites", docId);

      if (favorites.has(exerciseId)) {
        await deleteDoc(ref);
      } else {
        const typeCount = favoritesByType.get(exerciseType)?.size ?? 0;
        if (accountType === "free" && typeCount >= FREE_ENTITLEMENTS.maxFavorites) {
          return;
        }
        await setDoc(ref, {
          userId,
          exerciseId,
          exerciseType,
          createdAt: serverTimestamp(),
        });
      }
    },
    [userId, favorites, favoritesByType, accountType]
  );

  const isFavorite = useCallback(
    (exerciseId: string) => favorites.has(exerciseId),
    [favorites]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesByType,
        toggleFavorite,
        isFavorite,
        isAuthenticated: !!userId,
        loading,
        hasHydrated,
        favoritesCount,
        favoritesCountForType,
        getFavoritesCountForType,
        maxFavorites,
        isAtLimitForType,
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
