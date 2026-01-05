"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { auth, db } from "@/Firebase/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  AccountType,
  AccountStatus,
  Entitlements,
  FREE_ENTITLEMENTS,
  PREMIUM_ENTITLEMENTS,
  ExerciseTypePolicy,
} from "../types/account";
import { ExerciseType } from "../types/exercise";
import { AccountTypeSchema, AccountStatusSchema, ClubRoleSchema, ExerciseTypePolicySchema, SubscriptionStatusSchema } from "../lib/schemas";

const SUPER_ADMIN_EMAIL = "obrinkmann@gmail.com";

interface EntitlementContextType {
  accountType: AccountType;
  accountStatus: AccountStatus;
  entitlements: Entitlements;
  clubName: string | null;
  clubId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSuspended: boolean;
  isSuperAdmin: boolean;
  isClubAdmin: boolean;
  userEmail: string | null;
  clubExerciseTypePolicy: ExerciseTypePolicy | null;
  canChooseExerciseType: boolean;
  enforcedExerciseType: ExerciseType | null;
  refreshEntitlements: () => Promise<void>;
}

const EntitlementContext = createContext<EntitlementContextType | null>(null);

export function EntitlementProvider({ children }: { children: ReactNode }) {
  const [accountType, setAccountType] = useState<AccountType>("free");
  const [accountStatus, setAccountStatus] = useState<AccountStatus>("active");
  const [clubName, setClubName] = useState<string | null>(null);
  const [clubId, setClubId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isClubAdmin, setIsClubAdmin] = useState(false);
  const [clubExerciseTypePolicy, setClubExerciseTypePolicy] = useState<ExerciseTypePolicy | null>(null);

  const fetchEntitlements = useCallback(async (user: User) => {
    setIsLoading(true);
    try {
      const signupsQuery = query(
        collection(db, "signups"),
        where("uid", "==", user.uid)
      );
      const snapshot = await getDocs(signupsQuery);

      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();

        const normalizedAccountType =
          userData.accountType === "club_admin" ? "clubCoach" : userData.accountType;
        const accountTypeParsed = AccountTypeSchema.safeParse(normalizedAccountType);
        const userAccountType = accountTypeParsed.success ? accountTypeParsed.data : "free";
        
        const accountStatusParsed = AccountStatusSchema.safeParse(userData.accountStatus);
        const userAccountStatus = accountStatusParsed.success ? accountStatusParsed.data : "active";
        
        const clubRoleParsed = ClubRoleSchema.safeParse(userData.clubRole);
        const isAdmin = clubRoleParsed.success && clubRoleParsed.data === "admin";
        
        setAccountType(userAccountType);
        setAccountStatus(userAccountStatus);
        setIsClubAdmin(isAdmin);

        if (userAccountType === "clubCoach" && userData.clubId) {
          setClubId(userData.clubId as string);
          const clubQuery = query(
            collection(db, "clubs"),
            where("__name__", "==", userData.clubId)
          );
          const clubSnapshot = await getDocs(clubQuery);
          if (!clubSnapshot.empty) {
            const clubData = clubSnapshot.docs[0].data();
            setClubName(typeof clubData.name === "string" ? clubData.name : null);
            
            const policyParsed = ExerciseTypePolicySchema.safeParse(clubData.exerciseTypePolicy);
            setClubExerciseTypePolicy(policyParsed.success ? policyParsed.data : "coach-choice");
            
            const clubStatusParsed = AccountStatusSchema.safeParse(clubData.status);
            if (clubStatusParsed.success && clubStatusParsed.data === "suspended") {
              setAccountStatus("suspended");
            }
            
            const subscriptionParsed = SubscriptionStatusSchema.safeParse(clubData.subscriptionStatus);
            if (subscriptionParsed.success && subscriptionParsed.data === "inactive") {
              setAccountStatus("suspended");
            }
          }
        } else {
          setClubId(null);
          setClubExerciseTypePolicy(null);
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
  }, []);

  const refreshEntitlements = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      await fetchEntitlements(user);
    }
  }, [fetchEntitlements]);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAccountType("free");
        setAccountStatus("active");
        setClubName(null);
        setClubId(null);
        setIsLoading(false);
        setIsAuthenticated(false);
        setUserEmail(null);
        setIsClubAdmin(false);
        setClubExerciseTypePolicy(null);
        return;
      }

      setIsAuthenticated(true);
      setUserEmail(user.email || null);
      await fetchEntitlements(user);
    });

    return () => unsubAuth();
  }, [fetchEntitlements]);

  const isSuspended = accountStatus === "suspended";
  const isSuperAdmin = userEmail === SUPER_ADMIN_EMAIL;
  
  const entitlements: Entitlements =
    isSuspended || accountType === "free" ? FREE_ENTITLEMENTS : PREMIUM_ENTITLEMENTS;

  const canChooseExerciseType = 
    accountType !== "clubCoach" || 
    clubExerciseTypePolicy === "coach-choice" || 
    clubExerciseTypePolicy === null;

  const enforcedExerciseType: ExerciseType | null = 
    accountType === "clubCoach" && clubExerciseTypePolicy === "eyeq-only" ? "eyeq" :
    accountType === "clubCoach" && clubExerciseTypePolicy === "plastic-only" ? "plastic" :
    null;

  return (
    <EntitlementContext.Provider
      value={{
        accountType,
        accountStatus,
        entitlements,
        clubName,
        clubId,
        isLoading,
        isAuthenticated,
        isSuspended,
        isSuperAdmin,
        isClubAdmin,
        userEmail,
        clubExerciseTypePolicy,
        canChooseExerciseType,
        enforcedExerciseType,
        refreshEntitlements,
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
