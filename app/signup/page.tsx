'use client';

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/Firebase/auth";
export default function SignupPage() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

   const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, password);
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#eaf6ff] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full flex flex-col gap-6 border border-blue-100">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.svg" alt="Logo" className="h-14 mb-2 drop-shadow" />
          <h1 className="text-3xl font-extrabold text-blue-400 mb-2 tracking-tight text-center">
            Sign Up
          </h1>
          <p className="text-1xl font-extrabold text-blue-300 mb-2 tracking-tight text-center">
            Create your EyeQVision account.
          </p>
        </div>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            className="p-3 rounded-lg border border-blue-200 bg-[#eaf6ff] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
            type="text"
            placeholder="First Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="p-3 rounded-lg border border-blue-200 bg-[#eaf6ff] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            className="p-3 rounded-lg border border-blue-200 bg-[#eaf6ff] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="p-3 rounded-lg border border-blue-200 bg-[#eaf6ff] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
            type="text"
            placeholder="Organization"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
          />
          <input
            className="p-3 rounded-lg border border-blue-200 bg-[#eaf6ff] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="mt-2 bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg shadow transition"
            type="submit"
          >
            Sign Up
          </button>
          {error && <div className="text-red-400 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
}
