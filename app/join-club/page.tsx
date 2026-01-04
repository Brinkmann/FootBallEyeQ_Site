"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavBar from "../components/Navbar";
import { useEntitlements } from "../components/EntitlementProvider";
import { auth } from "@/Firebase/firebaseConfig";

export default function JoinClubPage() {
  const router = useRouter();
  const { accountType, isAuthenticated, clubName, refreshEntitlements } = useEntitlements();
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleJoinClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Please log in to join a club.");
        setLoading(false);
        return;
      }

      const idToken = await user.getIdToken();

      const response = await fetch("/api/redeem-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({ inviteCode: inviteCode.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid code. Please check and try again.");
        setLoading(false);
        return;
      }

      const joinedClubName = data.clubName || "your club";
      setSuccess(joinedClubName);
      setRedirecting(true);
      
      await refreshEntitlements();
    } catch (err) {
      console.error("Failed to join club:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const alreadyInClub = accountType === "clubCoach" && !redirecting;

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="max-w-md mx-auto p-6 pt-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Join Your Club</h1>
          <p className="text-gray-600 mt-2">
            Enter the access code from your club admin to unlock full features
          </p>
        </div>

        {redirecting ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-green-600 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Welcome to {success}!
            </h2>
            <p className="text-green-700 mb-6">
              You now have <span className="font-semibold">full premium access</span> through your club.
            </p>
            
            <div className="bg-white border border-green-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-green-800 mb-2">What&apos;s unlocked:</h3>
              <ul className="space-y-1.5 text-sm text-green-700">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Full 12-session season planner
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Unlimited favorites
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Session stats and analytics
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  100+ training exercises
                </li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <Link
                href="/catalog"
                className="flex-1 py-3 bg-primary text-white rounded-lg text-center hover:bg-primary-hover transition font-medium"
              >
                Browse Drills
              </Link>
              <Link
                href="/planner"
                className="flex-1 py-3 bg-green-600 text-white rounded-lg text-center hover:bg-green-700 transition font-medium"
              >
                Start Planning
              </Link>
            </div>
          </div>
        ) : alreadyInClub ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-green-600 mx-auto mb-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-semibold text-green-800 mb-1">You&apos;re already a member!</h2>
            <p className="text-green-700 text-sm mb-4">
              You have full access through {clubName || "your club"}
            </p>
            <Link
              href="/planner"
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Go to Session Planner
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-card border border-divider rounded-xl p-6 mb-6">
              {!isAuthenticated ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">Please log in to enter your club code</p>
                  <Link
                    href="/login"
                    className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover transition"
                  >
                    Log In
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleJoinClub}>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Club Access Code
                  </label>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="e.g. ABC123"
                    className="w-full p-4 rounded-lg border border-divider bg-background text-foreground text-center text-xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                    maxLength={10}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={loading || !inviteCode.trim()}
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-hover transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Joining...
                      </>
                    ) : "Join Club"}
                  </button>
                  {error && (
                    <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
                  )}
                  {success && (
                    <p className="text-green-600 text-sm mt-3 text-center font-medium">{success}</p>
                  )}
                </form>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-800 mb-2">What you&apos;ll get:</h3>
              <ul className="space-y-1.5 text-sm text-blue-700">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Full 12-session season planner
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Unlimited favorites
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Session stats and analytics
                </li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                Don&apos;t have a code yet?
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm text-gray-700">
                <p className="font-medium">To get access through your club:</p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>Contact your club administrator and request an invite code</li>
                  <li>Make sure they have the email you used to sign up: <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-gray-200">{user?.email}</span></li>
                  <li>Your club admin can generate invite codes from their dashboard</li>
                  <li>Once you receive your code, <Link href="/join-club" className="text-primary hover:underline font-medium">enter it here</Link></li>
                </ol>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 mt-6">
              <p>
                <Link href="/planner" className="text-primary hover:underline">
                  Continue with free access
                </Link>
                {" "}or{" "}
                <Link href="/upgrade" className="text-primary hover:underline">
                  explore other options
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
