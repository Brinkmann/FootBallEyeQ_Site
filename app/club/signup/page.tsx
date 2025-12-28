"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/Firebase/auth";
import { db } from "@/Firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import Breadcrumbs from "@/app/components/Breadcrumbs";

type Step = 1 | 2;

export default function ClubSignupPage() {
  const [step, setStep] = useState<Step>(1);
  const [clubName, setClubName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNext = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (clubName.trim()) {
      setStep(2);
    }
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await register(contactEmail, password);

      const clubDoc = await addDoc(collection(db, "clubs"), {
        name: clubName,
        contactEmail: contactEmail,
        subscriptionStatus: "trial",
        status: "active",
        createdAt: serverTimestamp(),
        createdBy: userCredential.user.uid,
      });

      await addDoc(collection(db, "signups"), {
        uid: userCredential.user.uid,
        fname: adminFirstName,
        lname: adminLastName,
        email: contactEmail,
        admin: false,
        organization: clubName,
        accountType: "clubCoach",
        accountStatus: "active",
        clubId: clubDoc.id,
        clubRole: "admin",
        createdAt: serverTimestamp(),
      });

      await addDoc(collection(db, `clubs/${clubDoc.id}/members`), {
        userId: userCredential.user.uid,
        coachUid: userCredential.user.uid,
        email: contactEmail,
        role: "admin",
        status: "active",
        joinedAt: serverTimestamp(),
      });

      router.push("/club/dashboard?welcome=true");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Club signup failed:", err.message);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Breadcrumbs />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-xl w-full">
          <div className="text-center mb-6">
            <Link href="/signup" className="inline-flex items-center gap-1 text-gray-500 hover:text-primary text-sm mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back to signup options
            </Link>
            <img src="/brand/logo-full.png" alt="Football EyeQ" className="h-12 mx-auto mb-4" />
          </div>

        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
          </div>
        </div>

        {step === 1 ? (
          <div className="bg-card rounded-2xl shadow-xl p-8 border border-divider">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Register Your Club</h1>
              <p className="text-sm text-gray-600 mt-2">
                Give your coaching staff full access to Football EyeQ
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-green-800 mb-2">What you get:</h3>
              <ul className="space-y-1 text-sm text-green-700">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Full 12-session season planner for all coaches
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Unlimited favorites and session stats
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Easy invite system - coaches join with a code
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Admin dashboard to manage your team
                </li>
              </ul>
            </div>

            <form onSubmit={handleNext} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Club Name</label>
                <input
                  type="text"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  placeholder="e.g., City FC Youth Academy"
                  required
                  className="w-full p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                className="mt-2 bg-primary hover:bg-primary-hover text-button font-semibold py-3 rounded-lg shadow transition"
              >
                Continue
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">Log in</Link>
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl shadow-xl p-8 border border-divider">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">Create Admin Account</h1>
              <p className="text-sm text-gray-600 mt-1">
                for <span className="font-medium">{clubName}</span>
              </p>
            </div>

            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
                  <input
                    type="text"
                    value={adminFirstName}
                    onChange={(e) => setAdminFirstName(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
                  <input
                    type="text"
                    value={adminLastName}
                    onChange={(e) => setAdminLastName(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="admin@club.com"
                  required
                  className="w-full p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  required
                  minLength={6}
                  className="w-full p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-divider rounded-lg text-gray-600 hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary-hover text-button font-semibold py-3 rounded-lg shadow transition disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Club"}
                </button>
              </div>

              {error && <div className="text-red-500 text-center text-sm">{error}</div>}
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">Log in</Link>
            </p>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>After registration, you&apos;ll be taken to your club dashboard where you can invite coaches.</p>
        </div>
      </div>
      </div>
    </div>
  );
}
