'use client';

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/Firebase/auth";
import { db } from "../../Firebase/firebaseConfig"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [password, setPassword] = useState("");
  const [hasClubCode, setHasClubCode] = useState(false);
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

      if (hasClubCode) {
        router.push("/upgrade?welcome=true");
      } else {
        router.push("/planner?welcome=true");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Signup failed:", err.message);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" role="main">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <img src="/brand/logo-full.png" alt="Football EyeQ" className="h-14 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Create Your Coach Account</h1>
          <p className="text-gray-600 mt-1">Start free and upgrade anytime</p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl p-6 border border-divider">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-5">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Free plan:</span> Full drill catalog, 1 session planner, 10 favorites
            </p>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1" htmlFor="signup-first-name">
                  First Name
                </label>
                <input
                  id="signup-first-name"
                  type="text"
                  placeholder="First Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="given-name"
                  className="w-full p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1" htmlFor="signup-last-name">
                  Last Name
                </label>
                <input
                  id="signup-last-name"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                  className="w-full p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1" htmlFor="signup-email">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1" htmlFor="signup-organization">
                Organization <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="signup-organization"
                type="text"
                placeholder="Your club or team"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1" htmlFor="signup-password">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <label className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition">
              <input
                type="checkbox"
                checked={hasClubCode}
                onChange={(e) => setHasClubCode(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <div>
                <span className="text-sm font-medium text-blue-800">I have a club access code</span>
                <p className="text-xs text-blue-600 mt-0.5">You&apos;ll enter your code after signup to unlock full access</p>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 bg-primary hover:bg-primary-hover text-button font-semibold py-3 rounded-lg shadow transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Free Account"}
            </button>

            {error && <div className="text-red-500 text-center text-sm">{error}</div>}
          </form>
        </div>

        <div className="mt-6 bg-card border border-divider rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Setting up a club?</p>
              <p className="text-xs text-gray-500">Register as a club admin to invite and manage coaches</p>
            </div>
            <Link
              href="/club/signup"
              className="text-sm text-primary font-medium hover:underline whitespace-nowrap"
            >
              Register club
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
