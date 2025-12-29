"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { auth, db } from "@/Firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEntitlements } from "./EntitlementProvider";
import { useExerciseType } from "./ExerciseTypeProvider";
import { aboutLinks, coreLinks, learnLinks, pricingLink, supportLinks } from "./navigation";
import { useTranslations } from "./LocalizationProvider";
import LanguageSwitcher from "./LanguageSwitcher";

const extraLinks = [...aboutLinks, ...supportLinks, pricingLink];

export default function NavBar() {
  const pathname = usePathname();
  const { t } = useTranslations();
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

  const [moreOpen, setMoreOpen] = useState(false);

  let tabs = [...coreLinks];

  if (isClubAdmin) {
    tabs = [...tabs, { labelKey: "navbar.myClub", fallback: "My Club", href: "/club/dashboard" }];
  }

  if (isSuperAdmin) {
    tabs = [...tabs, { labelKey: "navbar.adminHub", fallback: "Admin Hub", href: "/admin" }];
  }

  const getLinkLabel = (link: { labelKey: string; fallback: string }) => t(link.labelKey, link.fallback);

  return (
    <div className="bg-white px-6 pt-4 shadow-sm">
      <header className="flex justify-between items-center mb-4">
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold hover:opacity-80 transition text-gray-900 focus:outline-none">
          <img src="/brand/logo-icon.png" alt={t("common.siteName")}
            className="h-8 w-auto" />
          <span>{t("common.siteName")}</span>
        </Link>
        {userName ? (
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center gap-2">
              {isSuperAdmin && (
                <span className="px-2 py-1 text-xs font-medium bg-gray-900 text-white rounded">
                  {t("common.admin")}
                </span>
              )}
              {!isSuperAdmin && accountType === "free" ? (
                <Link
                  href="/upgrade"
                  className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded hover:bg-primary-light hover:text-primary transition"
                >
                  {t("common.free")}
                </Link>
              ) : !isSuperAdmin && accountType === "clubCoach" ? (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded truncate max-w-[80px] sm:max-w-none">
                  {clubName || t("common.club")}
                </span>
              ) : !isSuperAdmin && (
                <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded">
                  {t("common.pro")}
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
              {t("common.logout")}
            </button>
            <LanguageSwitcher />
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="text-[#e63946] font-semibold hover:underline text-sm"
            >
              {t("common.login")}
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-[#e63946] text-white font-semibold rounded-lg hover:bg-[#c5303c] transition text-sm"
            >
              {t("common.signup")}
            </Link>
            <LanguageSwitcher />
          </div>
        )}
      </header>

      {userName && (
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{t("navbar.welcomeBack", "Welcome back, {name}", { name: userName })}</h2>
            <p className="text-gray-600 text-sm">
              {isSuperAdmin
                ? t("navbar.superAdmin", "Platform administration and management")
                : isClubAdmin
                  ? t("navbar.clubAdmin", "Manage your club and coaching team")
                  : t("navbar.defaultWelcome", "Plan your training sessions and manage your exercise library")}
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
                {t("navbar.eyeq", "EyeQ")}
              </button>
              <button
                onClick={() => setSelectedExerciseType("plastic")}
                className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                  selectedExerciseType === "plastic"
                    ? "bg-[#e63946] text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t("navbar.plastic", "Plastic")}
              </button>
            </div>
          ) : enforcedExerciseType && (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                {enforcedExerciseType === "eyeq"
                  ? t("navbar.eyeqCones", "EyeQ Cones")
                  : t("navbar.plasticCones", "Plastic Cones")}
              </span>
              <span className="text-xs text-gray-400" title={t("navbar.clubSet", "Set by your club")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <span className="sr-only">{t("navbar.clubSet", "Set by your club")}</span>
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
            const label = getLinkLabel(tab);
            const shortLabel =
              tab.labelKey === "nav.drillCatalogue"
                ? t("nav.catalogue", "Catalogue")
                : tab.labelKey === "nav.sessionPlanner"
                  ? t("nav.planner", "Planner")
                  : label;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  isActive
                    ? "border-[#e63946] text-[#e63946]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {shortLabel}
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
              {t("common.more", "More")}
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
                    {getLinkLabel(tab)}
                  </Link>
                ))}
                <div className="border-t border-gray-100 my-1"></div>
                <div className="px-4 py-1 text-xs font-medium text-gray-400 uppercase">{t("nav.learn", "Learn")}</div>
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
                    {getLinkLabel(link)}
                  </Link>
                ))}
                <div className="border-t border-gray-100 my-1"></div>
                <div className="px-4 py-1 text-xs font-medium text-gray-400 uppercase">{t("common.more", "More")}</div>
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
                    {getLinkLabel(link)}
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
                key={tab.href}
                href={tab.href}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  isActive
                    ? "border-[#e63946] text-[#e63946]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {getLinkLabel(tab)}
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
              {t("nav.learn", "Learn")}
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
                    {getLinkLabel(link)}
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
                {getLinkLabel(link)}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
