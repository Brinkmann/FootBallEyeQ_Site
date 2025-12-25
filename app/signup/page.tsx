'use client';

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/Firebase/auth";
import { db } from "../../Firebase/firebaseConfig"; 
import { collection, addDoc, serverTimestamp

 } from "firebase/firestore";
import Link from "next/link";

type SignupMode = "choice" | "coach" | "invite";

export default function SignupPage() {
  const [mode, setMode] = useState<SignupMode>("choice");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await register(email, password);

      await addDoc(collection(db, "signups"), {
        uid: userCredential.user.uid,
        fname: name,
        lname: lastName,
        email: email,
        admin: false,
        organization: organization || null,
        accountType: "free",
        createdAt: serverTimestamp(),
      });

      router.push("/planner?welcome=true");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Signup failed:", err.message);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (mode === "choice") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-8">
            <img src="/brand/logo-full.png" alt="Football EyeQ" className="h-16 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Join Football EyeQ</h1>
            <p className="text-gray-600">Choose how you want to get started</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => setMode("coach")}
              className="bg-card border-2 border-divider rounded-2xl p-6 text-left hover:border-primary hover:shadow-lg transition group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Individual Coach</h2>
                  <p className="text-sm text-gray-500">For coaches training on their own</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Start free - no credit card required</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>1 session planner + 10 favorites</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Join a club later for full access</span>
                </li>
              </ul>
              <div className="text-primary font-medium flex items-center gap-1">
                Get started free
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </button>

            <Link
              href="/club/signup"
              className="bg-card border-2 border-divider rounded-2xl p-6 text-left hover:border-primary hover:shadow-lg transition group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center group-hover:bg-red-200 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Club Account</h2>
                  <p className="text-sm text-gray-500">For club admins who manage coaches</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>You become the club admin</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Invite your coaches with access codes</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>All coaches get full access (12 sessions, stats)</span>
                </li>
              </ul>
              <div className="text-primary font-medium flex items-center gap-1">
                Register your club
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </Link>
          </div>

          <div className="bg-card border border-divider rounded-xl p-6 text-center">
            <p className="text-gray-600 mb-3">Already a coach at a registered club?</p>
            <Link
              href="/login?redirect=/upgrade"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
              Enter your club access code
            </Link>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl p-8 max-w-md w-full border border-divider">
        <button
          onClick={() => setMode("choice")}
          className="flex items-center gap-1 text-gray-500 hover:text-primary mb-4 text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to options
        </button>

        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground text-center">
            Create Coach Account
          </h1>
          <p className="text-sm text-gray-600 text-center">
            Start with free access - upgrade anytime
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Free plan includes:</span> 1 session planner, 10 favorites, full drill catalog
          </p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
              <input
                type="text"
                placeholder="First Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Organization <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Your club or team"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-primary hover:bg-primary-hover text-button font-semibold py-3 rounded-lg shadow transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Free Account"}
          </button>

          {error && <div className="text-red-500 text-center text-sm">{error}</div>}
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
