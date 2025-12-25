"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/Firebase/auth";
import { db } from "@/Firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import NavBar from "../../components/Navbar";

export default function ClubSignupPage() {
  const [clubName, setClubName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        clubId: clubDoc.id,
        clubRole: "admin",
        createdAt: serverTimestamp(),
      });

      await addDoc(collection(db, `clubs/${clubDoc.id}/members`), {
        odometer: userCredential.user.uid,
        coachUid: userCredential.user.uid,
        email: contactEmail,
        role: "admin",
        status: "active",
        joinedAt: serverTimestamp(),
      });

      router.push("/club/dashboard");
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
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="max-w-lg mx-auto p-6">
        <div className="bg-card rounded-2xl shadow-xl p-8 border border-divider">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Register Your Club</h1>
            <p className="text-sm text-gray-600 mt-2">
              Create your club account and start managing your coaching staff
            </p>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
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

            <div className="border-t border-divider pt-4 mt-2">
              <p className="text-sm font-medium text-gray-500 mb-3">Club Administrator Details</p>
            </div>

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

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-primary hover:bg-primary-hover text-button font-semibold py-3 rounded-lg shadow transition disabled:opacity-50"
            >
              {loading ? "Creating Club..." : "Create Club Account"}
            </button>

            {error && <div className="text-red-500 text-center text-sm">{error}</div>}
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
