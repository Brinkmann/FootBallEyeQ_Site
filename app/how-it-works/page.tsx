"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import playersConesImage from "@/attached_assets/Gemini_Generated_Image_bwhz9zbwhz9zbwhz_1765753298898.png";
import methodImage from "@/attached_assets/Gemini_Generated_Image_hhfqpghhfqpghhfq_1765753298898.png";

export default function HowItWorksPage() {
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
              <Link href="/how-it-works" className="block px-4 py-2 bg-gray-50 text-[#A10115] font-semibold">How It Works</Link>
              <Link href="/ecosystem" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#A10115]">Ecosystem</Link>
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
            How <span className="text-[#D72C16]">Football EyeQ</span> Works
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Discover our training method and smart cone technology that brings cognitive 
            training to life on the pitch.
          </p>
        </div>
      </section>

      {/* The Method */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12" data-aos="fade-up">
            The Football EyeQ Method
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div data-aos="fade-right">
              <img 
                src={methodImage.src} 
                alt="Smart Training Revolution" 
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
            <div data-aos="fade-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Cognitive Training Embedded in Every Drill
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Our drills aren&apos;t just physical exercises—they&apos;re cognitive challenges that 
                force players to scan, process, and react. Using color-coded cues and dynamic 
                sequences, players develop the mental habits that transfer directly to match situations.
              </p>
              <ul className="space-y-3">
                {[
                  "Visual cue recognition and response",
                  "Split-second decision making",
                  "Pattern recognition under pressure",
                  "Multi-tasking and divided attention"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <span className="w-5 h-5 bg-[#D72C16] rounded-full flex items-center justify-center text-white text-xs mr-3">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Cone Technology */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4" data-aos="fade-up">
            Smart LED Cone Technology
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12" data-aos="fade-up" data-aos-delay="100">
            Our intelligent cones create dynamic, reactive training environments
          </p>

          <div className="max-w-3xl mx-auto mb-12" data-aos="zoom-in">
            <img 
              src={playersConesImage.src} 
              alt="Players training with smart cones" 
              className="rounded-2xl shadow-lg w-full"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔴🟢🔵",
                title: "Color-Coded Cues",
                desc: "Dynamic light sequences challenge players to scan and react to visual information"
              },
              {
                icon: "📱",
                title: "App Controlled",
                desc: "Control cone sequences from any device—switch drills instantly without interruption"
              },
              {
                icon: "🔀",
                title: "Varied Sequences",
                desc: "Unpredictable light patterns keep players scanning and mentally engaged throughout every drill"
              }
            ].map((feature, i) => (
              <div 
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="text-center p-6 bg-[#F0EFEA] rounded-xl"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Execute On Field */}
      <section className="py-20 px-6 bg-[#F0EFEA]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Execute <span className="text-[#A10115]">On-Field</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Football EyeQ bridges the gap between training and match performance. 
              Every drill is designed to create game-realistic cognitive demands, 
              so the skills players develop transfer directly to competitive situations.
            </p>
            <div className="space-y-4">
              {[
                { step: "1", text: "Plan your session using our drill catalogue" },
                { step: "2", text: "Set up cones and connect via the app" },
                { step: "3", text: "Run drills with dynamic light sequences" },
                { step: "4", text: "Players develop scanning habits automatically" }
              ].map((item, i) => (
                <div key={i} className="flex items-start">
                  <div className="w-8 h-8 bg-[#A10115] rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                    {item.step}
                  </div>
                  <p className="text-gray-700 pt-1">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div data-aos="fade-left">
            <img 
              src={playersConesImage.src} 
              alt="Execute On-Field Training" 
              className="rounded-2xl shadow-lg w-full"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#A10115]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4" data-aos="fade-up">
            Experience Football EyeQ
          </h2>
          <p className="text-xl opacity-90 mb-8" data-aos="fade-up" data-aos-delay="100">
            Start planning smarter training sessions today.
          </p>
          <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
            <Link
              href="/catalog"
              className="px-8 py-4 bg-white text-[#A10115] font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Browse Drills
            </Link>
            <Link
              href="/planner"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#A10115] transition"
            >
              Plan a Session
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
