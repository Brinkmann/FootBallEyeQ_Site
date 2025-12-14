"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import playersConesImage from "@/attached_assets/Gemini_Generated_Image_civasucivasuciva_1765697892906.png";
import playersConesAltImage from "@/attached_assets/Gemini_Generated_Image_67o2kk67o2kk67o2_1765697892907.png";
import singlePlayerImage from "@/attached_assets/Gemini_Generated_Image_dpbastdpbastdpba_1765697892907.png";
import executeImage from "@/attached_assets/Gemini_Generated_Image_air0sqair0sqair0_1765697926152.png";

export default function HowItWorksPage() {
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
            <span className="text-[#e63946] cursor-pointer">Learn ▾</span>
            <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-lg py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <Link href="/why-scanning" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#e63946]">Why Scanning</Link>
              <Link href="/how-it-works" className="block px-4 py-2 bg-gray-50 text-[#e63946] font-semibold">How It Works</Link>
              <Link href="/ecosystem" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#e63946]">Ecosystem</Link>
              <Link href="/use-cases" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#e63946]">Use Cases</Link>
            </div>
          </div>
          <Link href="/resources" className="hover:text-[#e63946] transition">Resources</Link>
          <Link href="/testimonials" className="hover:text-[#e63946] transition">Testimonials</Link>
          <Link href="/contact" className="hover:text-[#e63946] transition">Contact</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-[#faf8f5]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6" data-aos="fade-up">
            How <span className="text-[#457b9d]">Football EyeQ</span> Works
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
                src={singlePlayerImage.src} 
                alt="Player Scanning" 
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
            <div data-aos="fade-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Cognitive Training Embedded in Every Drill
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Our drills aren't just physical exercises—they're cognitive challenges that 
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
                    <span className="w-5 h-5 bg-[#457b9d] rounded-full flex items-center justify-center text-white text-xs mr-3">✓</span>
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

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div data-aos="fade-right">
              <img 
                src={playersConesImage.src} 
                alt="Players training with smart cones" 
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
            <div data-aos="fade-left">
              <img 
                src={playersConesAltImage.src} 
                alt="Smart cone training setup" 
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
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
                icon: "⚡",
                title: "Real-Time Response",
                desc: "Cones respond instantly to player actions, creating truly interactive training"
              }
            ].map((feature, i) => (
              <div 
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="text-center p-6 bg-[#faf8f5] rounded-xl"
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
      <section className="py-20 px-6 bg-[#faf8f5]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Execute <span className="text-[#e63946]">On-Field</span>
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
                  <div className="w-8 h-8 bg-[#e63946] rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                    {item.step}
                  </div>
                  <p className="text-gray-700 pt-1">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div data-aos="fade-left">
            <img 
              src={executeImage.src} 
              alt="Execute On-Field" 
              className="rounded-2xl shadow-lg w-full"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#457b9d]">
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
              className="px-8 py-4 bg-white text-[#457b9d] font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Browse Drills
            </Link>
            <Link
              href="/planner"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#457b9d] transition"
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
