"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { auth, db } from "@/Firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

/**
 * Navigation bar component with dynamic tabs based on user admin status.
 */
const baseTabs = [
  { label: "Tag Explanation Guide", href: "/explanation" },
  { label: "Exercise Library", href: "/catalog" },
  { label: "Season Planning", href: "/planner" },
];

/**
 * NavBar component that displays navigation tabs and user info.
 * @returns 
 */
export default function NavBar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  /**
   * Fetch user info from Firestore on auth state change
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Query Firestore for a document with matching uid
          const q = query(collection(db, "signups"), where("uid", "==", user.uid));
          const querySnapshot = await getDocs(q);
          // If user document found, set userName
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            setUserName(`${data.fname} ${data.lname}`);
            // check admin status
            setIsAdmin(data.admin === true);
          } else {
            setUserName(user.email ?? "User");
            setIsAdmin(false);
          }
        } catch (error) {
          // Handle errors and admin status
          console.error("Error fetching user:", error);
          setUserName(user.email ?? "User");
          setIsAdmin(false);
        }
      } else {
        setUserName(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Determine tabs to show based on admin status
  const tabs = isAdmin
    ? [...baseTabs, { label: "Admin", href: "/admin" }]
    : baseTabs;

  return (
    <div className="bg-background px-6 pt-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <Link href="/" className="flex items-center space-x-2 text-2xl font-bold hover:underline text-foreground">
          <img src="/color_logo_transparent.svg" alt="Football EyeQ" className="h-8 w-8" />
          <span>Football EyeQ</span>
        </Link>
        {userName ? (
          <div className="flex items-center space-x-4">
            <span className="text-foreground">{userName}</span>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
              🧑‍🏫
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-primary font-semibold hover:underline"
          >
            Login
          </Link>
        )}
      </header>

      {userName && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">Welcome back, {userName}</h2>
          <p className="text-gray-600">
            Plan your training sessions and manage your exercise library
          </p>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="flex space-x-4 border-b border-divider mb-6">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`px-4 py-2 border-b-2 text-base ${
                isActive
                  ? "border-primary font-semibold text-primary"
                  : "border-transparent text-gray-500"
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