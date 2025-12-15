"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

export default function TestimonialsPage() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <Link href="/" className="flex items-center space-x-2 font-bold text-lg text-gray-900">
          <img src="/brand/logo-icon.png" alt="Football EyeQ" className="h-8 w-auto" />
          <span>Football EyeQ</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-5 text-sm font-medium text-gray-700">
          <Link href="/catalog" className="hover:text-[#e63946] transition font-semibold">Drill Catalogue</Link>
          <Link href="/planner" className="hover:text-[#e63946] transition font-semibold">Session Planner</Link>
          <div className="relative group">
            <span className="hover:text-[#e63946] transition cursor-pointer">Learn ▾</span>
            <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-lg py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <Link href="/why-scanning" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#e63946]">Why Scanning</Link>
              <Link href="/how-it-works" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#e63946]">How It Works</Link>
              <Link href="/ecosystem" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#e63946]">Ecosystem</Link>
              <Link href="/use-cases" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#e63946]">Use Cases</Link>
            </div>
          </div>
          <Link href="/resources" className="hover:text-[#e63946] transition">Resources</Link>
          <Link href="/testimonials" className="text-[#e63946] font-semibold">Testimonials</Link>
          <Link href="/contact" className="hover:text-[#e63946] transition">Contact</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-[#faf8f5]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6" data-aos="fade-up">
            What Coaches Are <span className="text-[#2a9d8f]">Saying</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Hear from coaches and clubs who are developing smarter players with Football EyeQ.
          </p>
        </div>
      </section>

      {/* Coming Soon Placeholder */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div 
            data-aos="fade-up" 
            className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300"
          >
            <div className="text-6xl mb-6">💬</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Testimonials Coming Soon
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
              We&apos;re collecting feedback from our early adopters. Check back soon to see 
              what coaches and clubs are saying about Football EyeQ.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 bg-[#2a9d8f] text-white font-semibold rounded-lg hover:bg-[#238b7e] transition"
              >
                Share Your Experience
              </Link>
              <Link
                href="/catalog"
                className="px-6 py-3 border-2 border-[#e63946] text-[#e63946] font-semibold rounded-lg hover:bg-[#e63946] hover:text-white transition"
              >
                Try It Yourself
              </Link>
            </div>
          </div>

          {/* Preview Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="bg-gray-100 rounded-xl p-6 opacity-50"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-200 rounded"></div>
                  <div className="h-3 w-full bg-gray-200 rounded"></div>
                  <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#2a9d8f]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4" data-aos="fade-up">
            Be Part of the Story
          </h2>
          <p className="text-xl opacity-90 mb-8" data-aos="fade-up" data-aos-delay="100">
            Start using Football EyeQ and share your experience with us.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-[#2a9d8f] font-bold rounded-lg hover:bg-gray-100 transition"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-gray-400 text-center text-sm">
        &copy; {new Date().getFullYear()} Football EyeQ. All rights reserved.
      </footer>
    </div>
  );
}
