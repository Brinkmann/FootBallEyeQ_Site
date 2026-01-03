'use client';

import { useEffect, useState, FormEvent } from "react";
import { auth, db } from "@/Firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
  FieldValue 
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";

interface UserData {
  uid?: string;
  fname: string;
  lname: string;
  organization: string;
  email: string;
  accountType?: string;
  clubId?: string;
  clubRole?: string;
  createdAt?: Timestamp | FieldValue;
}

interface ClubData {
  name: string;
  exerciseTypePolicy?: 'eyeq' | 'plastic' | 'both';
}

const SUPER_ADMIN_EMAIL = "obrinkmann@gmail.com";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [organization, setOrganization] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [accountType, setAccountType] = useState<string>("free");
  const [clubId, setClubId] = useState<string | null>(null);
  const [clubRole, setClubRole] = useState<string | null>(null);
  const [clubData, setClubData] = useState<ClubData | null>(null);
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  
  const [inviteCode, setInviteCode] = useState<string>("");
  const [inviteLoading, setInviteLoading] = useState<boolean>(false);
  const [inviteMessage, setInviteMessage] = useState<string>("");
  const [inviteError, setInviteError] = useState<boolean>(false);

  const isSuperAdmin = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
  const isClubAdmin = clubRole === "admin";
  const isIndividualPremium = accountType === "individualPremium";
  const isClubCoach = accountType === "clubCoach";
  
  const showClubSection = !isSuperAdmin && !isClubAdmin && !isIndividualPremium;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserDataByUid(currentUser);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserDataByUid = async (currentUser: User) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "signups"),
        where("uid", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const data = userDoc.data() as UserData;

        setFname(data.fname || "");
        setLname(data.lname || "");
        setOrganization(data.organization || "");
        setEmail(data.email || currentUser.email || "");
        setAccountType(data.accountType || "free");
        setClubId(data.clubId || null);
        setClubRole(data.clubRole || null);
        setCreatedAt(
          data.createdAt && "toDate" in data.createdAt
            ? data.createdAt.toDate()
            : new Date()
        );

        setDocId(userDoc.id);

        if (data.clubId) {
          await fetchClubData(data.clubId);
        }
      } else {
        console.warn("No Firestore document found for this uid!");
        const newUserRef = doc(collection(db, "signups"));
        const newUserData: UserData = {
          uid: currentUser.uid,
          fname: "",
          lname: "",
          organization: "",
          email: currentUser.email || "",
          accountType: "free",
          createdAt: serverTimestamp(),
        };
        await setDoc(newUserRef, newUserData);

        setFname(newUserData.fname);
        setLname(newUserData.lname);
        setOrganization(newUserData.organization);
        setEmail(newUserData.email);
        setAccountType("free");
        setCreatedAt(new Date());

        setDocId(newUserRef.id);
      }
    } catch (err) {
      console.error("Error fetching user document:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubData = async (clubIdToFetch: string) => {
    try {
      const clubRef = doc(db, "clubs", clubIdToFetch);
      const clubSnap = await getDoc(clubRef);
      if (clubSnap.exists()) {
        setClubData(clubSnap.data() as ClubData);
      }
    } catch (err) {
      console.error("Error fetching club data:", err);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!docId) return;

    setMessage("Updating...");
    try {
      const userRef = doc(db, "signups", docId);
      const updatedData: Partial<UserData> = { fname, lname };

      await setDoc(userRef, updatedData, { merge: true });
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("Error updating profile.");
    }
  };

  const handleRedeemInvite = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inviteCode.trim() || !user) return;

    setInviteLoading(true);
    setInviteMessage("");
    setInviteError(false);

    try {
      const idToken = await user.getIdToken();
      const response = await fetch("/api/redeem-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ inviteCode: inviteCode.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setInviteMessage(data.message || "Successfully joined the club!");
        setInviteCode("");
        if (user) {
          fetchUserDataByUid(user);
        }
      } else {
        setInviteError(true);
        setInviteMessage(data.error || "Failed to redeem invite code.");
      }
    } catch (err) {
      console.error("Error redeeming invite:", err);
      setInviteError(true);
      setInviteMessage("Network error. Please try again.");
    } finally {
      setInviteLoading(false);
    }
  };

  const formatAccountType = (type: string): string => {
    switch (type) {
      case "clubCoach":
        return "Club Coach";
      case "individualPremium":
        return "Premium";
      case "free":
        return "Free";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const formatExercisePolicy = (policy?: string): string => {
    switch (policy) {
      case "eyeq":
        return "EyeQ Drills Only (Smart LED Cones)";
      case "plastic":
        return "Plastic Drills Only (Traditional Cones)";
      case "both":
      default:
        return "EyeQ & Plastic Drills";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-background px-4">
      <div className="w-full max-w-md mb-4">
        <Link 
          href="/planner" 
          className="text-accent hover:text-accent-hover flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Session Planner
        </Link>
      </div>

      <h1 className="text-3xl text-primary font-bold mb-6">My Profile</h1>

      <div className="bg-card p-6 rounded-xl shadow-md w-full max-w-md border border-divider mb-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Your Information</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-foreground-secondary mb-1">First Name</label>
            <input
              type="text"
              placeholder="First Name"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              className="w-full p-3 rounded-lg border border-divider bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground-secondary mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Last Name"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              className="w-full p-3 rounded-lg border border-divider bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-primary hover:bg-primary-hover text-button font-semibold py-2 rounded-lg transition"
          >
            Save Changes
          </button>

          {message && (
            <p className={`text-center ${message.includes("Error") ? "text-red-500" : "text-green-600"}`}>
              {message}
            </p>
          )}
        </form>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-md w-full max-w-md border border-divider mb-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Account Details</h2>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm text-foreground-secondary mb-1">Email</label>
            <p className="p-3 rounded-lg border border-divider bg-gray-50 text-gray-600">{email}</p>
          </div>
          <div>
            <label className="block text-sm text-foreground-secondary mb-1">Account Type</label>
            <p className="p-3 rounded-lg border border-divider bg-gray-50 text-gray-600">
              {formatAccountType(accountType)}
              {isSuperAdmin && " (Super Admin)"}
              {isClubAdmin && " (Club Admin)"}
            </p>
          </div>
          {organization && (
            <div>
              <label className="block text-sm text-foreground-secondary mb-1">Organization</label>
              <p className="p-3 rounded-lg border border-divider bg-gray-50 text-gray-600">{organization}</p>
            </div>
          )}
          <div>
            <label className="block text-sm text-foreground-secondary mb-1">Member Since</label>
            <p className="p-3 rounded-lg border border-divider bg-gray-50 text-gray-600">
              {createdAt ? createdAt.toLocaleDateString("en-US", { 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              }) : "Unknown"}
            </p>
          </div>
        </div>
      </div>

      {showClubSection && (
        <div className="bg-card p-6 rounded-xl shadow-md w-full max-w-md border border-divider">
          <h2 className="text-lg font-semibold text-primary mb-4">Club Membership</h2>
          
          {isClubCoach && clubId && clubData ? (
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm text-foreground-secondary mb-1">Club</label>
                <p className="p-3 rounded-lg border border-divider bg-gray-50 text-gray-600">
                  {clubData.name}
                </p>
              </div>
              <div>
                <label className="block text-sm text-foreground-secondary mb-1">Role</label>
                <p className="p-3 rounded-lg border border-divider bg-gray-50 text-gray-600 capitalize">
                  {clubRole || "Coach"}
                </p>
              </div>
              <div>
                <label className="block text-sm text-foreground-secondary mb-1">Available Drills</label>
                <p className="p-3 rounded-lg border border-divider bg-gray-50 text-gray-600">
                  {formatExercisePolicy(clubData.exerciseTypePolicy)}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRedeemInvite} className="flex flex-col gap-4">
              <p className="text-sm text-foreground-secondary">
                If you have an invite code from your club, enter it below to join.
              </p>
              <div>
                <label className="block text-sm text-foreground-secondary mb-1">Invite Code</label>
                <input
                  type="text"
                  placeholder="Enter invite code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="w-full p-3 rounded-lg border border-divider bg-background text-primary uppercase focus:outline-none focus:ring-2 focus:ring-accent"
                  disabled={inviteLoading}
                />
              </div>
              <button
                type="submit"
                disabled={inviteLoading || !inviteCode.trim()}
                className="bg-accent hover:bg-accent-hover text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {inviteLoading ? "Joining..." : "Join Club"}
              </button>
              {inviteMessage && (
                <p className={`text-center text-sm ${inviteError ? "text-red-500" : "text-green-600"}`}>
                  {inviteMessage}
                </p>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
