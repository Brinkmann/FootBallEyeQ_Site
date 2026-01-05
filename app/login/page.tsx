'use client';

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "@/Firebase/auth";
import { useAnalytics } from "@/app/components/AnalyticsProvider";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { trackEvent } = useAnalytics();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await login(email, password);
      const user = userCredential.user;
      const storedName = localStorage.getItem("name") || "Coach";

      localStorage.setItem(
        "user",
        JSON.stringify({ uid: user.uid, email: user.email, name: storedName })
      );

      trackEvent("login", {
        userId: user.uid,
      }).catch(() => {});

      const redirectTo = searchParams.get("redirect");
      const safeRedirect = redirectTo && redirectTo.startsWith("/") ? redirectTo : "/planner";
      router.push(safeRedirect);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Login failed:", err.message);
        setError(err.message);
        trackEvent("error", {
          label: "login",
          errorMessage: err.message,
        }).catch(() => {});
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with logo linking to home */}
      <header className="p-6">
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold hover:opacity-80 transition">
          <img src="/brand/logo-icon.png" alt="Football EyeQ" className="h-8 w-auto" />
          <span className="text-gray-900">Football EyeQ</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">

          {/* Left: Login Form */}
          <div className="bg-card rounded-2xl shadow-xl p-8 border border-divider">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
              <p className="text-sm text-gray-600">Sign in to access your training tools</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1" htmlFor="login-email">
                  Email address
                </label>
                <input
                  id="login-email"
                  className="w-full p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1" htmlFor="login-password">
                  Password
                </label>
                <input
                  id="login-password"
                  className="w-full p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                className="mt-2 bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-lg shadow transition"
                type="submit"
              >
                Log In
              </button>

              {error && (
                <div className="text-red-600 text-center text-sm" role="alert">
                  {error}
                </div>
              )}
            </form>

            {/* Sign up link */}
            <div className="mt-6 pt-6 border-t border-divider text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>

          {/* Right: Benefits & Quick Links */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Access Your Training Hub</h2>
              <p className="text-gray-600 mb-6">
                Plan sessions, organize drills, and track your coaching progress all in one place.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F0EFEA' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5" style={{ color: '#A10115' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Session Planner</h3>
                    <p className="text-sm text-gray-600">Plan your full 12-session season</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F0EFEA' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5" style={{ color: '#A10115' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Drill Catalogue</h3>
                    <p className="text-sm text-gray-600">100+ training exercises at your fingertips</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F0EFEA' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5" style={{ color: '#A10115' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Session Analytics</h3>
                    <p className="text-sm text-gray-600">Track progress and player development</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick access cards */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-divider">
              <Link href="/join-club" className="block p-4 rounded-lg border-2 hover:shadow-md transition" style={{ borderColor: '#F0EFEA' }}>
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5" style={{ color: '#A10115' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                  <h3 className="font-semibold text-sm">Have a Code?</h3>
                </div>
                <p className="text-xs text-gray-600">Join your club</p>
              </Link>

              <Link href="/club/signup" className="block p-4 rounded-lg border-2 hover:shadow-md transition" style={{ borderColor: '#F0EFEA' }}>
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5" style={{ color: '#A10115' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                  <h3 className="font-semibold text-sm">Club Admin?</h3>
                </div>
                <p className="text-xs text-gray-600">Register your club</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
      <LoginForm />
    </Suspense>
  );
}

