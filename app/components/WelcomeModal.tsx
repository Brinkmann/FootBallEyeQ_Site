"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface WelcomeModalProps {
  type: "coach" | "clubAdmin" | "clubCoach";
  userName?: string;
  clubName?: string;
}

export default function WelcomeModal({ type, userName, clubName }: WelcomeModalProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [modalType, setModalType] = useState(type);
  const [joinedClubName, setJoinedClubName] = useState(clubName);

  useEffect(() => {
    const clubJoined = searchParams.get("clubJoined");
    const welcome = searchParams.get("welcome");
    const clubNameParam = searchParams.get("clubName");
    
    if (clubJoined === "true") {
      setModalType("clubCoach");
      if (clubNameParam) setJoinedClubName(decodeURIComponent(clubNameParam));
      setShow(true);
      router.replace(pathname, { scroll: false });
    } else if (welcome === "true") {
      setModalType(type);
      setShow(true);
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, type, router, pathname]);

  if (!show) return null;

  const handleClose = () => setShow(false);

  if (modalType === "clubCoach") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome to {joinedClubName || "your club"}!
            </h2>
            <p className="text-gray-600 mt-2">
              You now have <span className="font-semibold text-green-600">full premium access</span> through your club.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-green-800 mb-3">What&apos;s unlocked for you:</h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Full 12-session season planner
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited favorites
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Session stats and analytics
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                100+ training exercises
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Link
              href="/catalog"
              className="flex-1 py-3 bg-primary text-white rounded-lg text-center hover:bg-primary-hover transition font-medium"
            >
              Browse Drills
            </Link>
            <button
              onClick={handleClose}
              className="flex-1 py-3 border border-divider rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Start Planning
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (modalType === "coach") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome to Football EyeQ!</h2>
            <p className="text-gray-600 mt-2">
              Your free coach account is ready{userName ? `, ${userName}` : ""}.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Here&apos;s what you can do:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Browse the Drill Catalogue - 100+ training exercises</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>Save up to 10 favorites for quick access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>Plan your first session right here!</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Want more?</span> Upgrade to premium or join a club to unlock all 12 sessions, unlimited favorites, and stats.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/catalog"
              className="flex-1 py-3 bg-primary text-white rounded-lg text-center hover:bg-primary-hover transition font-medium"
            >
              Browse Drills
            </Link>
            <button
              onClick={handleClose}
              className="flex-1 py-3 border border-divider rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Start Planning
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {clubName ? `${clubName} is ready!` : "Your club is ready!"}
          </h2>
          <p className="text-gray-600 mt-2">
            You&apos;re now the admin. Let&apos;s get your team set up.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Next steps:</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
              <span><span className="font-medium">Generate invite codes</span> for your coaches below</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
              <span><span className="font-medium">Share codes</span> with coaches - they sign up and enter the code</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
              <span><span className="font-medium">Manage your roster</span> here as coaches join</span>
            </li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-amber-800">
            <span className="font-medium">Tip:</span> Each invite code can only be used once for security. Generate one per coach.
          </p>
        </div>

        <button
          onClick={handleClose}
          className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition font-medium"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
