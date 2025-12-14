"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

export default function ResourcesPage() {
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
          <Link href="/resources" className="text-[#e63946] font-semibold">Resources</Link>
          <Link href="/testimonials" className="hover:text-[#e63946] transition">Testimonials</Link>
          <Link href="/contact" className="hover:text-[#e63946] transition">Contact</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-[#faf8f5]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6" data-aos="fade-up">
            <span className="text-[#457b9d]">Resources</span> & Guides
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Educational materials, guides, and downloads to help you get the most from Football EyeQ.
          </p>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Getting Started",
                icon: "🚀",
                color: "#e63946",
                desc: "New to Football EyeQ? Start here with our beginner guides and setup tutorials.",
                items: ["Quick Start Guide", "Platform Overview", "First Session Tips"],
                status: "Coming Soon"
              },
              {
                title: "Training Guides",
                icon: "📘",
                color: "#2a9d8f",
                desc: "Deep dives into training methodology, drill categories, and session planning.",
                items: ["Scanning Fundamentals", "Age-Group Progressions", "Position-Specific Training"],
                status: "Coming Soon"
              },
              {
                title: "Blog & Articles",
                icon: "📰",
                color: "#457b9d",
                desc: "Latest articles on cognitive training, player development, and Football EyeQ updates.",
                items: ["Why Scanning Matters", "Science of Decision Making", "Coach Interviews"],
                status: "Coming Soon"
              }
            ].map((category, i) => (
              <div 
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div 
                  className="p-6 text-white"
                  style={{ backgroundColor: category.color }}
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="text-xl font-bold">{category.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6">{category.desc}</p>
                  <ul className="space-y-3 mb-6">
                    {category.items.map((item, j) => (
                      <li key={j} className="flex items-center text-gray-500">
                        <span className="w-2 h-2 bg-gray-300 rounded-full mr-3"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div 
                    className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                    {category.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Downloads Section Placeholder */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4" data-aos="fade-up">
            Downloads
          </h2>
          <p className="text-lg text-gray-600 mb-12" data-aos="fade-up" data-aos-delay="100">
            Printable resources and materials for on-field use
          </p>

          <div 
            data-aos="fade-up"
            data-aos-delay="200"
            className="bg-[#faf8f5] rounded-2xl p-12 border-2 border-dashed border-gray-300"
          >
            <div className="text-5xl mb-6">📥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Downloadable Resources Coming Soon
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We&apos;re preparing printable drill cards, session templates, and other 
              resources to support your training. Sign up to be notified when they&apos;re ready.
            </p>
          </div>
        </div>
      </section>

      {/* Tag Explanation Link */}
      <section className="py-16 px-6 bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto">
          <div 
            data-aos="fade-up"
            className="bg-gradient-to-r from-[#e63946] to-[#c5303c] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between"
          >
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Tag Explanation Guide</h3>
              <p className="opacity-90">
                Understand our drill coding system, labels, and categories
              </p>
            </div>
            <Link
              href="/explanation"
              className="px-6 py-3 bg-white text-[#e63946] font-bold rounded-lg hover:bg-gray-100 transition"
            >
              View Guide →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#457b9d]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4" data-aos="fade-up">
            Stay Updated
          </h2>
          <p className="text-xl opacity-90 mb-8" data-aos="fade-up" data-aos-delay="100">
            Get notified when new resources are available.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-[#457b9d] font-bold rounded-lg hover:bg-gray-100 transition"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Subscribe to Updates
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
