"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, db } from "@/Firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  AccountType,
  Entitlements,
  FREE_ENTITLEMENTS,
  PREMIUM_ENTITLEMENTS,
} from "../types/account";

interface EntitlementContextType {
  accountType: AccountType;
  entitlements: Entitlements;
  clubName: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const EntitlementContext = createContext<EntitlementContextType | null>(null);

export function EntitlementProvider({ children }: { children: ReactNode }) {
  const [accountType, setAccountType] = useState<AccountType>("free");
  const [clubName, setClubName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAccountType("free");
        setClubName(null);
        setIsLoading(false);
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(true);

      try {
        const signupsQuery = query(
          collection(db, "signups"),
          where("uid", "==", user.uid)
        );
        const snapshot = await getDocs(signupsQuery);

        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          const userAccountType = (userData.accountType as AccountType) || "free";
          setAccountType(userAccountType);

          if (userAccountType === "clubCoach" && userData.clubId) {
            const clubQuery = query(
              collection(db, "clubs"),
              where("__name__", "==", userData.clubId)
            );
            const clubSnapshot = await getDocs(clubQuery);
            if (!clubSnapshot.empty) {
              setClubName(clubSnapshot.docs[0].data().name || null);
            }
          }
        } else {
          setAccountType("free");
        }
      } catch (error) {
        console.error("Failed to load user entitlements:", error);
        setAccountType("free");
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubAuth();
  }, []);

  const entitlements: Entitlements =
    accountType === "free" ? FREE_ENTITLEMENTS : PREMIUM_ENTITLEMENTS;

  return (
    <EntitlementContext.Provider
      value={{
        accountType,
        entitlements,
        clubName,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </EntitlementContext.Provider>
  );
}

export function useEntitlements() {
  const context = useContext(EntitlementContext);
  if (!context) {
    throw new Error("useEntitlements must be used within an EntitlementProvider");
  }
  return context;
}
