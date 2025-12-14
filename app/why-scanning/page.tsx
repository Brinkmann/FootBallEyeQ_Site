"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import architectImage from "@/attached_assets/Gemini_Generated_Image_tas8tdtas8tdtas8_1765697926152.png";
import scanningStepsImage from "@/attached_assets/Gemini_Generated_Image_equqq9equqq9equq_(1)_1765697892904.png";
import seeThinkDoImage from "@/attached_assets/Gemini_Generated_Image_9lqcy9lqcy9lqcy9_1765697892905.png";

export default function WhyScanningPage() {
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
              <Link href="/why-scanning" className="block px-4 py-2 bg-gray-50 text-[#e63946] font-semibold">Why Scanning</Link>
              <Link href="/how-it-works" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#e63946]">How It Works</Link>
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
            Why <span className="text-[#e63946]">Scanning</span> Matters
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Elite players don&apos;t just react faster—they see more. Scanning is the foundation 
            of game intelligence that separates good players from great ones.
          </p>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Traditional Training vs. <span className="text-[#2a9d8f]">EyeQ Training</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Traditional drills often focus on technical skills in isolation—passing, dribbling, 
                shooting—without the cognitive demands of a real match. Players become technically 
                proficient but struggle when they need to make quick decisions under pressure.
              </p>
              <p className="text-lg text-gray-600">
                Football EyeQ changes this by embedding cognitive challenges into every drill. 
                Players must constantly scan, process information, and make decisions—just like in a real game.
              </p>
            </div>
            <div data-aos="fade-left">
              <img 
                src={architectImage.src} 
                alt="Traditional vs EyeQ Training" 
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Data Points */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12" data-aos="fade-up">
            The Science Behind Scanning
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                stat: "0.5 sec",
                label: "Average decision time in elite football",
                desc: "Players have half a second or less to scan, decide, and act"
              },
              {
                stat: "8x",
                label: "More scans by elite players",
                desc: "Top players scan 8 times more than average before receiving the ball"
              },
              {
                stat: "23%",
                label: "Better pass accuracy",
                desc: "Players who scan more make significantly more accurate passes"
              }
            ].map((item, i) => (
              <div 
                key={i} 
                data-aos="fade-up" 
                data-aos-delay={i * 100}
                className="text-center p-8 bg-[#faf8f5] rounded-xl"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#e63946] mb-2">{item.stat}</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">{item.label}</div>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Power of Scanning */}
      <section className="py-20 px-6 bg-[#faf8f5]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12" data-aos="fade-up">
            The Power of Scanning
          </h2>
          <div data-aos="zoom-in">
            <img 
              src={scanningStepsImage.src} 
              alt="See Think Do - The Power of Scanning" 
              className="w-full rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* See Think Do Breakdown */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4" data-aos="fade-up">
            See. Think. Do.
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12" data-aos="fade-up" data-aos-delay="100">
            Our training method develops all three phases of game intelligence
          </p>
          
          <div className="mb-12" data-aos="zoom-in">
            <img 
              src={seeThinkDoImage.src} 
              alt="See Think Do Player Illustrations" 
              className="w-full rounded-2xl shadow-lg"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "See",
                color: "#e63946",
                points: [
                  "Develop scanning habits before receiving",
                  "Train peripheral vision awareness",
                  "Build automatic checking patterns"
                ]
              },
              {
                title: "Think",
                color: "#2a9d8f",
                points: [
                  "Process information rapidly",
                  "Identify optimal options",
                  "Anticipate movements and spaces"
                ]
              },
              {
                title: "Do",
                color: "#457b9d",
                points: [
                  "Execute with confidence",
                  "React instinctively to cues",
                  "Perform under cognitive load"
                ]
              }
            ].map((phase, i) => (
              <div 
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="p-6 rounded-xl border-2"
                style={{ borderColor: phase.color }}
              >
                <h3 className="text-2xl font-bold mb-4" style={{ color: phase.color }}>{phase.title}</h3>
                <ul className="space-y-3">
                  {phase.points.map((point, j) => (
                    <li key={j} className="flex items-start text-gray-700">
                      <span 
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs mr-3 mt-0.5 flex-shrink-0"
                        style={{ backgroundColor: phase.color }}
                      >
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#e63946]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4" data-aos="fade-up">
            Ready to develop smarter players?
          </h2>
          <p className="text-xl opacity-90 mb-8" data-aos="fade-up" data-aos-delay="100">
            Explore our drill catalogue and start training game intelligence today.
          </p>
          <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
            <Link
              href="/catalog"
              className="px-8 py-4 bg-white text-[#e63946] font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Browse Drills
            </Link>
            <Link
              href="/how-it-works"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#e63946] transition"
            >
              How It Works
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
