"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import ecosystemImage from "@/attached_assets/Gemini_Generated_Image_hhfqpghhfqpghhfq2_1765753298899.png";

export default function EcosystemPage() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-[#F0EFEA]">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <Link href="/" className="flex items-center space-x-2 font-bold text-lg text-gray-900">
          <img src="/brand/logo-icon.png" alt="Football EyeQ" className="h-8 w-auto" />
          <span>Football EyeQ</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-5 text-sm font-medium text-gray-700">
          <Link href="/catalog" className="hover:text-[#A10115] transition font-semibold">Drill Catalogue</Link>
          <Link href="/planner" className="hover:text-[#A10115] transition font-semibold">Session Planner</Link>
          <div className="relative group">
            <span className="text-[#A10115] cursor-pointer">Learn ▾</span>
            <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-lg py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <Link href="/why-scanning" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#A10115]">Why Scanning</Link>
              <Link href="/how-it-works" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#A10115]">How It Works</Link>
              <Link href="/ecosystem" className="block px-4 py-2 bg-gray-50 text-[#A10115] font-semibold">Ecosystem</Link>
              <Link href="/use-cases" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#A10115]">Use Cases</Link>
            </div>
          </div>
          <Link href="/resources" className="hover:text-[#A10115] transition">Resources</Link>
          <Link href="/testimonials" className="hover:text-[#A10115] transition">Testimonials</Link>
          <Link href="/contact" className="hover:text-[#A10115] transition">Contact</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-[#F0EFEA]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6" data-aos="fade-up">
            The Football EyeQ <span className="text-[#D72C16]">Ecosystem</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            A complete cycle for developing smarter players—from planning to performance to continuous improvement.
          </p>
        </div>
      </section>

      {/* Main Ecosystem Image */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto" data-aos="zoom-in">
          <img 
            src={ecosystemImage.src} 
            alt="Plan Train Enjoy - Football EyeQ Ecosystem" 
            className="w-full rounded-2xl shadow-xl"
          />
        </div>
      </section>

      {/* Three Phases */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16" data-aos="fade-up">
            The Continuous Improvement Cycle
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                phase: "Plan",
                icon: "📋",
                color: "#A10115",
                desc: "Design training sessions using our comprehensive drill catalogue. Select exercises that target specific cognitive skills and match your team's development goals.",
                features: [
                  "Access 100+ cognitive drills",
                  "Filter by age, difficulty, game moment",
                  "Build complete session plans",
                  "Save and reuse templates"
                ]
              },
              {
                phase: "Train",
                icon: "⚽",
                color: "#D72C16",
                desc: "Execute sessions on the pitch with smart cone technology. Players engage with dynamic, reactive drills that develop scanning habits and decision-making.",
                features: [
                  "Smart cone integration",
                  "Real-time drill adjustments",
                  "Progressive difficulty scaling",
                  "Immediate feedback loops"
                ]
              },
              {
                phase: "Enjoy",
                icon: "🎯",
                color: "#D72C16",
                desc: "Watch players develop game intelligence and confidence. The skills trained transfer directly to match situations, making the game more enjoyable for everyone.",
                features: [
                  "Visible skill development",
                  "Increased player confidence",
                  "Better match performance",
                  "More engaged training sessions"
                ]
              }
            ].map((item, i) => (
              <div 
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="p-8 rounded-2xl border-2 bg-[#F0EFEA]"
                style={{ borderColor: item.color }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: item.color }}>{item.phase}</h3>
                <p className="text-gray-600 mb-6">{item.desc}</p>
                <ul className="space-y-2">
                  {item.features.map((feature, j) => (
                    <li key={j} className="flex items-center text-gray-700 text-sm">
                      <span 
                        className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs mr-2"
                        style={{ backgroundColor: item.color }}
                      >
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Connects */}
      <section className="py-20 px-6 bg-[#F0EFEA]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8" data-aos="fade-up">
            Everything Connected
          </h2>
          <p className="text-lg text-gray-600 mb-12" data-aos="fade-up" data-aos-delay="100">
            Football EyeQ brings together planning, technology, and player development in one seamless platform.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div data-aos="fade-right" className="bg-white p-8 rounded-xl shadow-md text-left">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#A10115] rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                  📚
                </div>
                <h3 className="text-xl font-bold text-gray-900">Drill Catalogue</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Your source for cognitive training exercises. Filter, search, and find the perfect drills for your team.
              </p>
              <Link href="/catalog" className="text-[#A10115] font-semibold hover:underline">
                Explore Drills →
              </Link>
            </div>

            <div data-aos="fade-left" className="bg-white p-8 rounded-xl shadow-md text-left">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#D72C16] rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                  📋
                </div>
                <h3 className="text-xl font-bold text-gray-900">Session Planner</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Organize your training with our drag-and-drop planner. Plan sessions, track your season, stay organized.
              </p>
              <Link href="/planner" className="text-[#D72C16] font-semibold hover:underline">
                Start Planning →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#D72C16]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4" data-aos="fade-up">
            Join the Football EyeQ Ecosystem
          </h2>
          <p className="text-xl opacity-90 mb-8" data-aos="fade-up" data-aos-delay="100">
            Start developing smarter players today.
          </p>
          <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-[#D72C16] font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Get Started Free
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#D72C16] transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-gray-400 text-center text-sm">
        &copy; {new Date().getFullYear()} Football EyeQ. All rights reserved.
      </footer>
    </div>
  );
}
