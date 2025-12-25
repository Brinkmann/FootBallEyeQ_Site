"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, db } from "@/Firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  AccountType,
  AccountStatus,
  Entitlements,
  FREE_ENTITLEMENTS,
  PREMIUM_ENTITLEMENTS,
} from "../types/account";

const SUPER_ADMIN_EMAIL = "obrinkmann@gmail.com";

interface EntitlementContextType {
  accountType: AccountType;
  accountStatus: AccountStatus;
  entitlements: Entitlements;
  clubName: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSuspended: boolean;
  isSuperAdmin: boolean;
  isClubAdmin: boolean;
  userEmail: string | null;
}

const EntitlementContext = createContext<EntitlementContextType | null>(null);

export function EntitlementProvider({ children }: { children: ReactNode }) {
  const [accountType, setAccountType] = useState<AccountType>("free");
  const [accountStatus, setAccountStatus] = useState<AccountStatus>("active");
  const [clubName, setClubName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isClubAdmin, setIsClubAdmin] = useState(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAccountType("free");
        setAccountStatus("active");
        setClubName(null);
        setIsLoading(false);
        setIsAuthenticated(false);
        setUserEmail(null);
        setIsClubAdmin(false);
        return;
      }

      setIsAuthenticated(true);
      setUserEmail(user.email || null);
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
          const userAccountStatus = (userData.accountStatus as AccountStatus) || "active";
          setAccountType(userAccountType);
          setAccountStatus(userAccountStatus);
          setIsClubAdmin(userData.clubRole === "admin");

          if (userAccountType === "clubCoach" && userData.clubId) {
            const clubQuery = query(
              collection(db, "clubs"),
              where("__name__", "==", userData.clubId)
            );
            const clubSnapshot = await getDocs(clubQuery);
            if (!clubSnapshot.empty) {
              const clubData = clubSnapshot.docs[0].data();
              setClubName(clubData.name || null);
              if (clubData.status === "suspended") {
                setAccountStatus("suspended");
              }
            }
          }
        } else {
          setAccountType("free");
          setAccountStatus("active");
          setIsClubAdmin(false);
        }
      } catch (error) {
        console.error("Failed to load user entitlements:", error);
        setAccountType("free");
        setAccountStatus("active");
        setIsClubAdmin(false);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubAuth();
  }, []);

  const isSuspended = accountStatus === "suspended";
  const isSuperAdmin = userEmail === SUPER_ADMIN_EMAIL;
  
  const entitlements: Entitlements =
    isSuspended || accountType === "free" ? FREE_ENTITLEMENTS : PREMIUM_ENTITLEMENTS;

  return (
    <EntitlementContext.Provider
      value={{
        accountType,
        accountStatus,
        entitlements,
        clubName,
        isLoading,
        isAuthenticated,
        isSuspended,
        isSuperAdmin,
        isClubAdmin,
        userEmail,
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
