"use client";

import { useState } from "react";
import Link from "next/link";
import NavBar from "../components/Navbar";
import { useEntitlements } from "../components/EntitlementProvider";
import { auth } from "@/Firebase/firebaseConfig";

export default function UpgradePage() {
  const { accountType, isAuthenticated, clubName, refreshEntitlements } = useEntitlements();
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
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      await refreshEntitlements();
      setSuccess(data.message || `Successfully joined ${data.clubName || "the club"}! Your access has been updated.`);
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Unlock Full Access</h1>
        <p className="text-gray-600 mb-8">
          Upgrade to Premium and plan your entire 12-session season.
        </p>

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

        {/* HERO: Individual Premium */}
        <div className="rounded-2xl p-8 mb-8 shadow-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #D72C16 0%, #A10115 100%)' }}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Premium Individual</h2>
                <p className="text-white/90 text-lg">Perfect for independent coaches</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-extrabold text-white">$29</p>
                <p className="text-white/80 text-sm">per month</p>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F0EFEA' }}>
                  <svg className="w-4 h-4" style={{ color: '#A10115' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Full 12-session season planner</span>
              </li>
              <li className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F0EFEA' }}>
                  <svg className="w-4 h-4" style={{ color: '#A10115' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Unlimited favorites</span>
              </li>
              <li className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F0EFEA' }}>
                  <svg className="w-4 h-4" style={{ color: '#A10115' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Session stats and analytics</span>
              </li>
              <li className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F0EFEA' }}>
                  <svg className="w-4 h-4" style={{ color: '#A10115' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Export and share your plans</span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/upgrade/checkout"
                className="flex-1 text-center bg-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
                style={{ color: '#A10115' }}
              >
                Start Premium Now →
              </Link>
              {!isAuthenticated && (
                <Link
                  href="/signup"
                  className="text-center px-6 py-4 rounded-xl font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-all"
                >
                  Create Free Account
                </Link>
              )}
            </div>

            <p className="text-white/70 text-sm mt-4 text-center">Cancel anytime. No long-term commitment.</p>
          </div>
        </div>

        {/* Secondary Options */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 text-center mb-4">Other options</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Join a Club - De-emphasized */}
          <div className="rounded-lg p-5 border-2" style={{ backgroundColor: '#FAFAFA', borderColor: '#F0EFEA' }}>
            <h3 className="text-sm font-bold mb-2" style={{ color: '#6B7280' }}>Have a Club Code?</h3>
            <p className="text-xs mb-4" style={{ color: '#9CA3AF' }}>
              Join your club and get full access paid by your organization
            </p>

            {isAuthenticated ? (
              <form onSubmit={handleJoinClub}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    className="flex-1 p-2 text-sm rounded border bg-white text-foreground focus:outline-none focus:ring-1 disabled:opacity-50"
                    style={{ borderColor: '#F0EFEA' }}
                    disabled={accountType !== "free"}
                  />
                  <button
                    type="submit"
                    disabled={loading || accountType !== "free"}
                    className="px-3 py-2 text-xs font-medium text-white rounded transition disabled:opacity-50 flex items-center justify-center min-w-[50px]"
                    style={{ backgroundColor: '#6B7280' }}
                  >
                    {loading ? (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : "Join"}
                  </button>
                </div>
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                {success && <p className="text-green-600 text-xs mt-2">{success}</p>}
              </form>
            ) : (
              <p className="text-xs" style={{ color: '#9CA3AF' }}>
                <a href="/login" className="hover:underline" style={{ color: '#6B7280' }}>Log in</a> to enter a code
              </p>
            )}
          </div>

          {/* Register Club - De-emphasized */}
          <div className="rounded-lg p-5 border-2" style={{ backgroundColor: '#FAFAFA', borderColor: '#F0EFEA' }}>
            <h3 className="text-sm font-bold mb-2" style={{ color: '#6B7280' }}>Club Administrator?</h3>
            <p className="text-xs mb-4" style={{ color: '#9CA3AF' }}>
              Register your club and provide full access to your coaching staff
            </p>
            <a
              href="/club/signup"
              className="inline-block text-xs font-medium px-4 py-2 rounded border transition"
              style={{ color: '#6B7280', borderColor: '#F0EFEA' }}
            >
              Register Your Club →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
