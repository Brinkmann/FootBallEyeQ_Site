"use client";

import { useState } from "react";
import Link from "next/link";
import NavBar from "../components/Navbar";
import { useEntitlements } from "../components/EntitlementProvider";
import { auth, db } from "@/Firebase/firebaseConfig";
import { collection, query, where, getDocs, updateDoc, addDoc, doc, serverTimestamp } from "firebase/firestore";

export default function UpgradePage() {
  const { accountType, isAuthenticated, clubName } = useEntitlements();
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const inviteQuery = query(
        collection(db, "clubInvites"),
        where("code", "==", inviteCode.trim().toUpperCase())
      );
      const inviteSnap = await getDocs(inviteQuery);

      if (inviteSnap.empty) {
        setError("Invalid invite code. Please check and try again.");
        setLoading(false);
        return;
      }

      const invite = inviteSnap.docs[0].data();
      const now = new Date();
      const expiresAt = invite.expiresAt?.toDate();

      if (expiresAt && expiresAt < now) {
        setError("This invite code has expired.");
        setLoading(false);
        return;
      }

      if (invite.usedBy) {
        setError("This invite code has already been used.");
        setLoading(false);
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        setError("Please log in to join a club.");
        setLoading(false);
        return;
      }

      if (invite.email && user.email?.toLowerCase() !== invite.email.toLowerCase()) {
        setError(`This code was created for a different email address. Please log in with the email your club admin used when generating your invite.`);
        setLoading(false);
        return;
      }

      const signupsQuery = query(
        collection(db, "signups"),
        where("uid", "==", user.uid)
      );
      const signupsSnap = await getDocs(signupsQuery);

      if (!signupsSnap.empty) {
        const userDoc = signupsSnap.docs[0];
        await updateDoc(userDoc.ref, {
          accountType: "clubCoach",
          clubId: invite.clubId,
          clubRole: "coach",
        });
      }

      await addDoc(collection(db, `clubs/${invite.clubId}/members`), {
        userId: user.uid,
        coachUid: user.uid,
        email: user.email,
        role: "coach",
        status: "active",
        joinedAt: serverTimestamp(),
      });

      const inviteDocRef = doc(db, "clubInvites", inviteSnap.docs[0].id);
      await updateDoc(inviteDocRef, {
        usedBy: user.uid,
        usedAt: serverTimestamp(),
      });

      setSuccess(`Successfully joined ${invite.clubName || "the club"}! Refresh the page to see your updated access.`);
      setInviteCode("");
    } catch (err) {
      console.error("Failed to join club:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Upgrade Your Account</h1>
        <p className="text-gray-600 mb-8">
          Unlock the full power of Football EyeQ with a premium account.
        </p>

        <div className="bg-card border border-divider rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-gray-500">Current pricing</p>
              <h2 className="text-xl font-bold text-foreground">Pro Access</h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-foreground">$29</p>
              <p className="text-sm text-gray-500">per month for 1 coach</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Includes the full session planner, analytics, unlimited favorites, and club sharing tools. Cancel anytime.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <Link
            href="/upgrade/checkout"
            className="flex-1 text-center bg-[#e63946] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#c5303c] transition"
          >
            View Checkout
          </Link>
          {!isAuthenticated && (
            <Link
              href="/signup"
              className="flex-1 text-center border border-divider px-4 py-3 rounded-lg font-semibold text-foreground hover:border-[#e63946] hover:text-[#e63946] transition"
            >
              Create a Free Account
            </Link>
          )}
        </div>

        {accountType !== "free" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-800 font-medium">
                {accountType === "clubCoach" 
                  ? `You have full access through ${clubName || "your club"}`
                  : "You have a premium individual subscription"}
              </span>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-divider rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Join a Club</h2>
                <p className="text-sm text-gray-500">Get access through your organization</p>
              </div>
            </div>

            <ul className="space-y-2 mb-6 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Full 12-session season planner
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited favorites
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Session stats and analytics
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Paid by your club
              </li>
            </ul>

            {isAuthenticated ? (
              <form onSubmit={handleJoinClub}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="Enter invite code"
                    className="flex-1 p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={accountType !== "free"}
                  />
                  <button
                    type="submit"
                    disabled={loading || accountType !== "free"}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition disabled:opacity-50"
                  >
                    {loading ? "..." : "Join"}
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
              </form>
            ) : (
              <p className="text-sm text-gray-500">
                <a href="/login" className="text-primary hover:underline">Log in</a> to enter an invite code
              </p>
            )}
          </div>

          <div className="bg-card border border-divider rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Individual Premium</h2>
                <p className="text-sm text-gray-500">Personal subscription</p>
              </div>
            </div>

            <ul className="space-y-2 mb-6 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Full 12-session season planner
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited favorites
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Session stats and analytics
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Independent access
              </li>
            </ul>

            <div className="text-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-sm text-gray-500">Coming soon</p>
              <p className="text-xs text-gray-400 mt-1">Individual subscriptions will be available shortly</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Are you a club administrator?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Register your club and provide your coaches with full access.
          </p>
          <a
            href="/club/signup"
            className="inline-block border border-primary text-primary px-6 py-2 rounded-lg hover:bg-primary-light transition"
          >
            Register Your Club
          </a>
        </div>
      </div>
    </div>
  );
}
