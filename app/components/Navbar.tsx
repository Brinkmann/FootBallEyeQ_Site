"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { auth, db } from "@/Firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { AccountType } from "../types/account";

const baseTabs = [
  { label: "Drill Catalogue", href: "/catalog" },
  { label: "Session Planner", href: "/planner" },
  { label: "Why Scanning", href: "/why-scanning" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Ecosystem", href: "/ecosystem" },
  { label: "Use Cases", href: "/use-cases" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
  { label: "Tag Guide", href: "/explanation" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [accountType, setAccountType] = useState<AccountType>("free");
  const [clubName, setClubName] = useState<string | null>(null);
  const [isClubAdmin, setIsClubAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const q = query(collection(db, "signups"), where("uid", "==", user.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            setUserName(`${data.fname} ${data.lname}`);
            setIsAdmin(data.admin === true);
            setAccountType((data.accountType as AccountType) || "free");
            setIsClubAdmin(data.clubRole === "admin");
            
            if (data.clubId) {
              const clubQuery = query(
                collection(db, "clubs"),
                where("__name__", "==", data.clubId)
              );
              const clubSnap = await getDocs(clubQuery);
              if (!clubSnap.empty) {
                setClubName(clubSnap.docs[0].data().name || null);
              }
            }
          } else {
            setUserName(user.email ?? "User");
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setUserName(user.email ?? "User");
          setIsAdmin(false);
        }
      } else {
        setUserName(null);
        setIsAdmin(false);
        setAccountType("free");
        setClubName(null);
        setIsClubAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  let tabs = [...baseTabs];
  if (isClubAdmin) {
    tabs = [...tabs, { label: "Club Dashboard", href: "/club/dashboard" }];
  }
  if (isAdmin) {
    tabs = [...tabs, { label: "Admin", href: "/admin" }];
  }

  return (
    <div className="bg-white px-6 pt-4 shadow-sm">
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold hover:opacity-80 transition text-gray-900">
          <img src="/brand/logo-icon.png" alt="Football EyeQ" className="h-8 w-auto" />
          <span>Football EyeQ</span>
        </Link>
        {userName ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2">
              {accountType === "free" ? (
                <Link
                  href="/upgrade"
                  className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded hover:bg-primary-light hover:text-primary transition"
                >
                  Free Plan
                </Link>
              ) : accountType === "clubCoach" ? (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                  {clubName || "Club"}
                </span>
              ) : (
                <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded">
                  Premium
                </span>
              )}
              <span className="text-gray-700 text-sm">{userName}</span>
            </div>
            <Link href="/profile">
              <div className="w-8 h-8 bg-[#e63946] rounded-full flex items-center justify-center text-white hover:opacity-80 transition">
                🧑‍🏫
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
            Plan your training sessions and manage your exercise library
          </p>
        </div>
      )}

      {/* Navigation Tabs */}
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
      </nav>
    </div>
  );
}
