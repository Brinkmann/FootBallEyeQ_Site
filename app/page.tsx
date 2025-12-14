"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { auth } from "@/Firebase/firebaseConfig";
import { useState } from "react";
import { User } from "firebase/auth";
import heroImage from "@/attached_assets/Gemini_Generated_Image_4hnpph4hnpph4hnp_1765697926151.png";
import seeThinkDoImage from "@/attached_assets/Gemini_Generated_Image_9lqcy9lqcy9lqcy9_1765697892905.png";
import ecosystemImage from "@/attached_assets/Gemini_Generated_Image_uzmoi1uzmoi1uzmo_(1)_1765697926152.png";
import playersConesImage from "@/attached_assets/Gemini_Generated_Image_civasucivasuciva_1765697892906.png";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    
    const unsubscribe = auth.onAuthStateChanged((currentUser: User | null) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans">
      {/* Top Bar */}
      <header className="flex justify-between items-center px-8 py-4 bg-transparent">
        <div className="flex items-center space-x-2 font-bold text-lg text-foreground">
          <img src="/brand/logo-icon.png" alt="Football EyeQ" className="h-8 w-auto" />
          <span>Football EyeQ</span>
        </div>
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
          <Link href="/testimonials" className="hover:text-[#e63946] transition">Testimonials</Link>
          <Link href="/contact" className="hover:text-[#e63946] transition">Contact</Link>
        </nav>
        {!user && (
          <div className="space-x-3">
            <Link href="/login">
              <button className="px-4 py-2 rounded-md border border-[#e63946] text-[#e63946] font-semibold hover:bg-[#e63946] hover:text-white transition">
                Log In
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-4 py-2 rounded-md bg-[#e63946] text-white font-semibold hover:bg-[#c5303c] transition">
                Sign Up
              </button>
            </Link>
          </div>
        )}
        {user && (
          <div className="space-x-4 flex items-center">
            <Link href="/profile">
              <div className="w-8 h-8 bg-[#e63946] rounded-full flex items-center justify-center text-white text-sm">
                🧑‍🏫
              </div>
            </Link>
            <button
              onClick={() => auth.signOut()}
              className="px-4 py-2 rounded-md bg-gray-600 text-white font-semibold hover:bg-gray-500 transition"
            >
              Sign Out
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Train Smarter with<br />
              <span className="text-[#e63946]">Game Intelligence</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Football EyeQ transforms training with cognitive drills that develop scanning, 
              decision-making, and game awareness. Build smarter players who see the game before it happens.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="px-6 py-3 bg-[#e63946] text-white font-semibold rounded-lg hover:bg-[#c5303c] transition shadow-lg"
              >
                Explore Drills
              </Link>
              <Link
                href="/planner"
                className="px-6 py-3 border-2 border-[#2a9d8f] text-[#2a9d8f] font-semibold rounded-lg hover:bg-[#2a9d8f] hover:text-white transition"
              >
                Plan a Session
              </Link>
            </div>
          </div>
          <div data-aos="fade-left" className="flex justify-center">
            <img 
              src={heroImage.src} 
              alt="Game Intelligence - Football EyeQ" 
              className="rounded-2xl shadow-xl max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-aos="fade-up">
            The Football EyeQ Method
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Our approach combines cognitive training with smart technology to develop complete players
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: "See",
              desc: "Train players to constantly scan the field and gather visual information about teammates, opponents, and space.",
              color: "#e63946",
              icon: "👁️"
            },
            {
              title: "Think",
              desc: "Develop rapid decision-making by processing information and identifying the best options under pressure.",
              color: "#2a9d8f",
              icon: "🧠"
            },
            {
              title: "Do",
              desc: "Execute with precision and confidence, turning smart decisions into effective actions on the pitch.",
              color: "#457b9d",
              icon: "⚽"
            }
          ].map((pillar, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 150}
              className="p-8 bg-[#faf8f5] rounded-xl border-2 border-gray-100 hover:border-opacity-50 transition text-center"
              style={{ borderColor: pillar.color }}
            >
              <div className="text-5xl mb-4">{pillar.icon}</div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: pillar.color }}>{pillar.title}</h3>
              <p className="text-gray-600">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* See-Think-Do Visual Strip */}
      <section className="py-16 px-6 bg-[#faf8f5]">
        <div className="max-w-5xl mx-auto" data-aos="zoom-in">
          <img 
            src={seeThinkDoImage.src} 
            alt="See Think Do - Player Development" 
            className="w-full rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* Product Highlights - Drill Catalogue & Session Planner */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16" data-aos="fade-up">
            Your Complete Training Platform
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Drill Catalogue Card */}
            <div 
              data-aos="fade-right" 
              className="bg-gradient-to-br from-[#e63946]/10 to-[#e63946]/5 rounded-2xl p-8 border border-[#e63946]/20"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#e63946] rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                  📚
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Drill Catalogue</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Access 100+ cognitive football drills designed to develop scanning habits and game intelligence. 
                Filter by age group, difficulty, game moment, and more.
              </p>
              <ul className="space-y-3 mb-8">
                {["Smart filtering & search", "Detailed drill breakdowns", "Video demonstrations", "Cone setup diagrams"].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <span className="w-5 h-5 bg-[#e63946] rounded-full flex items-center justify-center text-white text-xs mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/catalog"
                className="inline-block px-6 py-3 bg-[#e63946] text-white font-semibold rounded-lg hover:bg-[#c5303c] transition"
              >
                Browse Drills →
              </Link>
            </div>

            {/* Session Planner Card */}
            <div 
              data-aos="fade-left" 
              className="bg-gradient-to-br from-[#2a9d8f]/10 to-[#2a9d8f]/5 rounded-2xl p-8 border border-[#2a9d8f]/20"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#2a9d8f] rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                  📋
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Session Planner</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Build complete training sessions with drag-and-drop simplicity. 
                Plan your entire season and keep everything organized in one place.
              </p>
              <ul className="space-y-3 mb-8">
                {["12-week season overview", "Drag & drop drill planning", "Save & share sessions", "Cloud sync across devices"].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <span className="w-5 h-5 bg-[#2a9d8f] rounded-full flex items-center justify-center text-white text-xs mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/planner"
                className="inline-block px-6 py-3 bg-[#2a9d8f] text-white font-semibold rounded-lg hover:bg-[#238b7e] transition"
              >
                Start Planning →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Preview */}
      <section className="py-20 px-6 bg-[#faf8f5]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <img 
              src={ecosystemImage.src} 
              alt="Plan Train Enjoy Ecosystem" 
              className="rounded-2xl shadow-lg"
            />
          </div>
          <div data-aos="fade-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Plan. Train. <span className="text-[#2a9d8f]">Enjoy.</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Football EyeQ creates a complete ecosystem for developing smarter players. 
              From session planning to on-field execution, every step is designed to make 
              training more effective and enjoyable.
            </p>
            <Link
              href="/ecosystem"
              className="inline-flex items-center text-[#2a9d8f] font-semibold hover:underline"
            >
              Learn about our ecosystem →
            </Link>
          </div>
        </div>
      </section>

      {/* Smart Cones Preview */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right" className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Smart LED Cones for <span className="text-[#457b9d]">Interactive Training</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Our smart cone technology brings drills to life with dynamic light sequences 
              that challenge players to scan, react, and execute in real-time.
            </p>
            <Link
              href="/how-it-works"
              className="inline-flex items-center text-[#457b9d] font-semibold hover:underline"
            >
              See how it works →
            </Link>
          </div>
          <div data-aos="fade-left" className="order-1 md:order-2">
            <img 
              src={playersConesImage.src} 
              alt="Players with Smart LED Cones" 
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#e63946] to-[#c5303c]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" data-aos="fade-up">
            Ready to Transform Your Training?
          </h2>
          <p className="text-xl opacity-90 mb-8" data-aos="fade-up" data-aos-delay="100">
            Join coaches who are developing smarter, more aware players with Football EyeQ.
          </p>
          <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-[#e63946] font-bold rounded-lg hover:bg-gray-100 transition shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#e63946] transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 text-white font-bold text-lg mb-4">
                <img src="/brand/logo-icon.png" alt="Football EyeQ" className="h-6 w-auto" />
                <span>Football EyeQ</span>
              </div>
              <p className="text-sm">
                Smart training for smarter players.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/catalog" className="hover:text-white transition">Drill Catalogue</Link></li>
                <li><Link href="/planner" className="hover:text-white transition">Session Planner</Link></li>
                <li><Link href="/explanation" className="hover:text-white transition">Tag Guide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Learn</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/why-scanning" className="hover:text-white transition">Why Scanning</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
                <li><Link href="/ecosystem" className="hover:text-white transition">Ecosystem</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
                <li><Link href="/resources" className="hover:text-white transition">Resources</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            &copy; {new Date().getFullYear()} Football EyeQ. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
