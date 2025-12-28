"use client";

import Link from "next/link";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import NavBar from "@/app/components/Navbar";
import { useAnalytics } from "@/app/components/AnalyticsProvider";

export default function CheckoutPage() {
  const { trackEvent } = useAnalytics();

  const handlePurchaseIntent = async () => {
    await trackEvent("purchase", {
      plan: "pro_monthly",
      entryPoint: "upgrade_checkout",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <Breadcrumbs />

      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-card border border-divider rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
              <p className="text-gray-600">Confirm your Football EyeQ upgrade and get instant access.</p>
            </div>
            <span className="px-3 py-1 bg-red-50 text-[#e63946] rounded-full text-sm font-semibold">Secure</span>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Plan</p>
                <p className="text-lg font-semibold text-foreground">Pro Access</p>
              </div>
              <p className="text-lg font-semibold text-foreground">$29 / month</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Users</p>
              <p className="text-sm text-foreground">1 coach (upgrade later for teams)</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Activation</p>
              <p className="text-sm text-foreground">Immediate upon confirmation</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-600">✔</span>
              <span>Full session planner and analytics</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-600">✔</span>
              <span>Unlimited favorites and drill library access</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-600">✔</span>
              <span>Club-ready sharing and invites</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/signup"
              onClick={handlePurchaseIntent}
              className="flex-1 text-center bg-[#e63946] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#c5303c] transition"
            >
              Complete Checkout
            </Link>
            <Link
              href="/upgrade"
              className="flex-1 text-center border border-divider px-4 py-3 rounded-lg font-semibold text-foreground hover:border-[#e63946] hover:text-[#e63946] transition"
            >
              Back to Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
