"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { auth, db } from "@/Firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEntitlements } from "./EntitlementProvider";
import { useExerciseType } from "./ExerciseTypeProvider";
import { aboutLinks, coreLinks, learnLinks, pricingLink, supportLinks } from "./navigation";
import { z } from "zod";

const UserNameSchema = z.object({
  fname: z.string().min(1),
  lname: z.string().min(1),
});

const extraLinks = [...aboutLinks, ...supportLinks, pricingLink];

export default function NavBar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);
  const { accountType, clubName, isSuperAdmin, isClubAdmin, enforcedExerciseType } = useEntitlements();
  const { selectedExerciseType, setSelectedExerciseType, canChoose } = useExerciseType();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const q = query(collection(db, "signups"), where("uid", "==", user.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            const nameParsed = UserNameSchema.safeParse(data);
            if (nameParsed.success) {
              setUserName(`${nameParsed.data.fname} ${nameParsed.data.lname}`);
            } else {
              console.warn(`Invalid user name data for ${user.uid}:`, nameParsed.error.flatten());
              setUserName(user.email ?? "User");
            }
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

  const [moreOpen, setMoreOpen] = useState(false);

  let tabs = [...coreLinks];

  if (accountType === "free") {
    tabs = [...tabs, { label: "Enter Club Code", href: "/join-club" }];
  }

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
          <Image
            src="/brand/logo-icon.png"
            alt="Football EyeQ"
            width={114}
            height={114}
            className="h-8 w-auto"
            priority
          />
          <span>Football EyeQ</span>
        </Link>
        {userName ? (
          <div className="flex items-center space-x-2 sm:space-x-4">
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
                  Free
                </Link>
              ) : !isSuperAdmin && accountType === "clubCoach" ? (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded truncate max-w-[80px] sm:max-w-none">
                  {clubName || "Club"}
                </span>
              ) : !isSuperAdmin && (
                <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded">
                  Pro
                </span>
              )}
              <span className="hidden sm:inline text-gray-700 text-sm">{userName}</span>
            </div>
            <Link href="/profile">
              <div className="w-8 h-8 bg-[#e63946] rounded-full flex items-center justify-center text-white hover:opacity-80 transition">
                {isSuperAdmin ? "⚙️" : "🧑‍🏫"}
              </div>
            </Link>
            <button
              onClick={() => signOut(auth)}
              className="px-2 py-1 sm:px-3 sm:py-1.5 text-sm font-medium text-gray-600 hover:text-[#e63946] transition"
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
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Welcome back, {userName}</h2>
            <p className="text-gray-600 text-sm">
              {isSuperAdmin 
                ? "Platform administration and management" 
                : isClubAdmin 
                  ? "Manage your club and coaching team" 
                  : "Plan your training sessions and manage your exercise library"}
            </p>
          </div>
          
          {canChoose ? (
            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setSelectedExerciseType("eyeq")}
                className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                  selectedExerciseType === "eyeq"
                    ? "bg-[#e63946] text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                EyeQ
              </button>
              <button
                onClick={() => setSelectedExerciseType("plastic")}
                className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                  selectedExerciseType === "plastic"
                    ? "bg-[#e63946] text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Plastic
              </button>
            </div>
          ) : enforcedExerciseType && (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                {enforcedExerciseType === "eyeq" ? "EyeQ Cones" : "Plastic Cones"}
              </span>
              <span className="text-xs text-gray-400" title="Set by your club">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </span>
            </div>
          )}
        </div>
      )}

      <nav className="flex space-x-1 border-b border-gray-200">
        {/* Mobile: Only show first 2 tabs (Drill Catalogue, Session Planner) */}
        <div className="flex sm:hidden">
          {tabs.slice(0, 2).map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={`px-3 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  isActive
                    ? "border-[#e63946] text-[#e63946]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label === "Drill Catalogue" ? "Catalogue" : tab.label === "Session Planner" ? "Planner" : tab.label}
              </Link>
            );
          })}
          
          {/* Mobile "More" menu */}
          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
              className={`px-3 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition flex items-center gap-1 ${
                tabs.slice(2).some(t => pathname === t.href) ||
                learnLinks.some(l => pathname === l.href) ||
                extraLinks.some(link => pathname === link.href)
                  ? "border-[#e63946] text-[#e63946]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              More
              <svg className={`w-4 h-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {moreOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[180px] z-50">
                {tabs.slice(2).map((tab) => (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`block px-4 py-2 text-sm transition ${
                      pathname === tab.href
                        ? "text-[#e63946] bg-red-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                  </Link>
                ))}
                <div className="border-t border-gray-100 my-1"></div>
                <div className="px-4 py-1 text-xs font-medium text-gray-400 uppercase">Learn</div>
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
                <div className="border-t border-gray-100 my-1"></div>
                <div className="px-4 py-1 text-xs font-medium text-gray-400 uppercase">More</div>
                {extraLinks.map((link) => (
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
        </div>

        {/* Desktop: Show all tabs */}
        <div className="hidden sm:flex space-x-1">
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
          
          <div className="relative group">
            <button
              type="button"
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition flex items-center gap-1 ${
                learnLinks.some(l => pathname === l.href)
                  ? "border-[#e63946] text-[#e63946]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Learn
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[180px] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all">
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
          </div>

          {extraLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  isActive
                    ? "border-[#e63946] text-[#e63946]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
