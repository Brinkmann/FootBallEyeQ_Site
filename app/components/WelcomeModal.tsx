"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface WelcomeModalProps {
  type: "coach" | "clubAdmin";
  userName?: string;
  clubName?: string;
}

export default function WelcomeModal({ type, userName, clubName }: WelcomeModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("welcome") === "true") {
      setShow(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  if (!show) return null;

  const handleClose = () => setShow(false);

  if (type === "coach") {
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
            <h3 className="font-medium text-gray-900 mb-3">Here's what you can do:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Browse the Drill Catalog - 100+ training exercises</span>
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
              <span className="font-medium">Want more?</span> Join a club with an invite code to unlock all 12 sessions, unlimited favorites, and stats.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/catalog"
              className="flex-1 py-3 border border-divider rounded-lg text-center text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Browse Drills
            </Link>
            <button
              onClick={handleClose}
              className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition font-medium"
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
            You're now the admin. Let's get your team set up.
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
