"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const tabs = [
  { label: "Exercise Library", href: "/catalog" },
  { label: "Season Planning", href: "/planner" },
  { label: "Session Codes", href: "/placeholder" },
  { label: "Admin", href: "/placeholder" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ uid: string; name: string } | null>(null);

  // On mount, read user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Optional: listen to storage events to update navbar across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "user") {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="bg-gray-50 px-6 pt-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold">⚽ Football EyeQ</div>

        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user.name}</span>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
              🧑‍🏫
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-blue-500 font-semibold hover:underline"
          >
            Login
          </Link>
        )}
      </header>

      {user && (
        <>
          {/* Welcome Message */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Welcome back, {user.name}</h2>
            <p className="text-gray-600">
              Plan your training sessions and manage your exercise library
            </p>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-4 border-b border-gray-200 mb-6">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={`px-4 py-2 border-b-2 text-base ${
                    isActive
                      ? "border-black font-semibold text-black"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </div>
  );
}
