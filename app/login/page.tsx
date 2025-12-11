'use client';

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/Firebase/auth";export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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

    router.push("/"); // redirect after login
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Login failed:", err.message);
      setError(err.message); // optional: show error in the UI
    }
  }
};


  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-card rounded-2xl shadow-xl p-8 max-w-sm w-full flex flex-col gap-6 border border-divider">
        <div className="flex flex-col items-center gap-3">
          <img src="/brand/logo-full.png" alt="Football EyeQ" className="h-16 mb-4 drop-shadow" />
          <h1 className="text-3xl font-extrabold text-primary mb-2 tracking-tight text-center">Log In</h1>
          <p className="text-sm text-gray-600 text-center">Welcome back! Sign in to continue.</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            className="p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="p-3 rounded-lg border border-divider bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            className="mt-2 bg-primary hover:bg-primary-hover text-button font-semibold py-2 rounded-lg shadow transition"
            type="submit"
          >
            Log In
          </button>
          {error && <div className="text-red-400 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
}