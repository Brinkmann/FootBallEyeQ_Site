export type AccountType = "free" | "clubCoach" | "individualPremium";

export type AccountStatus = "active" | "suspended";

export interface UserProfile {
  uid: string;
  email: string;
  fname: string;
  lname: string;
  organization?: string;
  accountType: AccountType;
  clubId?: string;
  clubRole?: "admin" | "coach";
  admin: boolean;
  createdAt: Date;
  accountStatus?: AccountStatus;
  suspendedAt?: Date;
  suspendedReason?: string;
}

export interface Club {
  id: string;
  name: string;
  contactEmail: string;
  createdAt: Date;
  subscriptionStatus: "active" | "inactive" | "trial";
  status?: AccountStatus;
  suspendedAt?: Date;
  suspendedReason?: string;
}

export interface ClubMember {
  userId: string;
  coachUid: string;
  email: string;
  role: "admin" | "coach";
  status: "active" | "pending" | "removed";
  joinedAt: Date;
}

export interface ClubInvite {
  id: string;
  clubId: string;
  clubName: string;
  code: string;
  email?: string;
  createdAt: Date;
  expiresAt: Date;
  usedBy?: string;
}

export interface Entitlements {
  maxSessions: number;
  maxFavorites: number;
  canAccessStats: boolean;
  canExport: boolean;
}

export const FREE_ENTITLEMENTS: Entitlements = {
  maxSessions: 1,
  maxFavorites: 10,
  canAccessStats: false,
  canExport: false,
};

export const PREMIUM_ENTITLEMENTS: Entitlements = {
  maxSessions: 12,
  maxFavorites: Infinity,
  canAccessStats: true,
  canExport: true,
};
