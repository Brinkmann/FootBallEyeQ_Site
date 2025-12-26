"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { auth, db } from "@/Firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEntitlements } from "./EntitlementProvider";

const coreTabs = [
  { label: "Drill Catalogue", href: "/catalog" },
  { label: "Session Planner", href: "/planner" },
  { label: "Tag Guide", href: "/explanation" },
];

const learnLinks = [
  { label: "Why Scanning", href: "/why-scanning" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Ecosystem", href: "/ecosystem" },
  { label: "Use Cases", href: "/use-cases" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);
  const { accountType, clubName, isSuperAdmin, isClubAdmin, isAuthenticated } = useEntitlements();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const q = query(collection(db, "signups"), where("uid", "==", user.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            setUserName(`${data.fname} ${data.lname}`);
          } else {
            setUserName(user.email ?? "User");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setUserName(user.email ?? "User");
        }
      } else {
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const [learnOpen, setLearnOpen] = useState(false);

  let tabs = [...coreTabs];
  
  if (isClubAdmin) {
    tabs = [...tabs, { label: "My Club", href: "/club/dashboard" }];
  }
  
  if (isSuperAdmin) {
    tabs = [...tabs, { label: "Admin Hub", href: "/admin" }];
  }

  return (
    <div className="bg-white px-6 pt-4 shadow-sm">
      <header className="flex justify-between items-center mb-4">
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold hover:opacity-80 transition text-gray-900 focus:outline-none">
          <img src="/brand/logo-icon.png" alt="Football EyeQ" className="h-8 w-auto" />
          <span>Football EyeQ</span>
        </Link>
        {userName ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2">
              {isSuperAdmin && (
                <span className="px-2 py-1 text-xs font-medium bg-gray-900 text-white rounded">
                  Admin
                </span>
              )}
              {!isSuperAdmin && accountType === "free" ? (
                <Link
                  href="/upgrade"
                  className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded hover:bg-primary-light hover:text-primary transition"
                >
                  Free Plan
                </Link>
              ) : !isSuperAdmin && accountType === "clubCoach" ? (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                  {clubName || "Club"}
                </span>
              ) : !isSuperAdmin && (
                <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded">
                  Premium
                </span>
              )}
              <span className="text-gray-700 text-sm">{userName}</span>
            </div>
            <Link href="/profile">
              <div className="w-8 h-8 bg-[#e63946] rounded-full flex items-center justify-center text-white hover:opacity-80 transition">
                {isSuperAdmin ? "⚙️" : "🧑‍🏫"}
              </div>
            </Link>
            <button
              onClick={() => signOut(auth)}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-[#e63946] transition"
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="text-[#e63946] font-semibold hover:underline text-sm"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-[#e63946] text-white font-semibold rounded-lg hover:bg-[#c5303c] transition text-sm"
            >
              Sign Up
            </Link>
          </div>
        )}
      </header>

      {userName && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Welcome back, {userName}</h2>
          <p className="text-gray-600 text-sm">
            {isSuperAdmin 
              ? "Platform administration and management" 
              : isClubAdmin 
                ? "Manage your club and coaching team" 
                : "Plan your training sessions and manage your exercise library"}
          </p>
        </div>
      )}

      <nav className="flex space-x-1 overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                isActive
                  ? "border-[#e63946] text-[#e63946]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
        
        <div className="relative">
          <button
            onClick={() => setLearnOpen(!learnOpen)}
            onBlur={() => setTimeout(() => setLearnOpen(false), 150)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition flex items-center gap-1 ${
              learnLinks.some(l => pathname === l.href)
                ? "border-[#e63946] text-[#e63946]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Learn
            <svg className={`w-4 h-4 transition-transform ${learnOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {learnOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[180px] z-50">
              {learnLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-2 text-sm transition ${
                    pathname === link.href
                      ? "text-[#e63946] bg-red-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
