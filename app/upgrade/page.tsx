"use client";

import Link from "next/link";
import NavBar from "../components/Navbar";
import { useEntitlements } from "../components/EntitlementProvider";

export default function UpgradePage() {
  const { accountType, isAuthenticated, clubName } = useEntitlements();

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Unlock Full Access</h1>
        <p className="text-gray-600 mb-8">
          Upgrade to Premium and plan your entire 12-session season.
        </p>

        {accountType !== "free" && (
          <div className="rounded-xl p-6 mb-8 border-2" style={{ backgroundColor: '#F0EFEA', borderColor: '#A10115' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#A10115' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1" style={{ color: '#A10115' }}>
                  {accountType === "clubCoach"
                    ? `You're All Set!`
                    : "Premium Active"}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  {accountType === "clubCoach"
                    ? `You have full access to all premium features through ${clubName || "your club"}. No payment needed—everything is included in your club membership.`
                    : "You have an active premium individual subscription with full access to all features."}
                </p>
              </div>
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

        {/* Alternative Paths */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-4">Or choose another option:</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Join a Club */}
          <Link href="/join-club" className="block bg-white rounded-xl p-6 border-2 hover:shadow-lg transition-all" style={{ borderColor: '#F0EFEA' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F0EFEA' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5" style={{ color: '#A10115' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-foreground">Have a Club Code?</h3>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Join your organization and get full access
            </p>
            <div className="text-sm font-medium" style={{ color: '#D72C16' }}>
              Enter Code →
            </div>
          </Link>

          {/* Register Club */}
          <Link href="/club/signup" className="block bg-white rounded-xl p-6 border-2 hover:shadow-lg transition-all" style={{ borderColor: '#F0EFEA' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F0EFEA' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5" style={{ color: '#A10115' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-foreground">Club Administrator?</h3>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Equip your entire coaching staff with full access
            </p>
            <div className="text-sm font-medium" style={{ color: '#D72C16' }}>
              Register Your Club →
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
