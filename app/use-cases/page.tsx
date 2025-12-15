"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

export default function UseCasesPage() {
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
              <Link href="/ecosystem" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#A10115]">Ecosystem</Link>
              <Link href="/use-cases" className="block px-4 py-2 bg-gray-50 text-[#A10115] font-semibold">Use Cases</Link>
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
            Who Uses <span className="text-[#A10115]">Football EyeQ</span>?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            From youth academies to professional clubs, Football EyeQ develops game intelligence at every level.
          </p>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Youth Academies",
                icon: "🌱",
                color: "#D72C16",
                audience: "Ages 8-16",
                desc: "Build scanning habits early in a player's development. Our age-appropriate drills create the cognitive foundation for elite performance.",
                benefits: [
                  "Age-appropriate progression",
                  "Fun, engaging training",
                  "Early habit formation",
                  "Technical + cognitive development"
                ]
              },
              {
                title: "Amateur & Semi-Pro Clubs",
                icon: "⚽",
                color: "#A10115",
                audience: "Adult recreational to semi-professional",
                desc: "Elevate your club's training with professional-level cognitive exercises. Perfect for clubs looking to gain an edge without breaking the budget.",
                benefits: [
                  "Easy to implement",
                  "Works with limited training time",
                  "Noticeable performance gains",
                  "Team and individual exercises"
                ]
              },
              {
                title: "Professional Clubs",
                icon: "🏆",
                color: "#C0B2B5",
                audience: "Elite and professional",
                desc: "Integrate Football EyeQ into your existing training methodology. Our system complements top-level coaching with measurable cognitive training.",
                benefits: [
                  "Data-driven insights",
                  "Position-specific training",
                  "Injury prevention focus",
                  "Match scenario simulation"
                ]
              }
            ].map((useCase, i) => (
              <div 
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div 
                  className="p-6 text-white text-center"
                  style={{ backgroundColor: useCase.color }}
                >
                  <div className="text-4xl mb-2">{useCase.icon}</div>
                  <h3 className="text-xl font-bold">{useCase.title}</h3>
                  <p className="text-sm opacity-80">{useCase.audience}</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6">{useCase.desc}</p>
                  <ul className="space-y-2">
                    {useCase.benefits.map((benefit, j) => (
                      <li key={j} className="flex items-center text-gray-700 text-sm">
                        <span 
                          className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs mr-2"
                          style={{ backgroundColor: useCase.color }}
                        >
                          ✓
                        </span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Individual vs Team */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12" data-aos="fade-up">
            Training Formats
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div data-aos="fade-right" className="p-8 bg-[#F0EFEA] rounded-2xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#A10115] rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                  👤
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Individual Training</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Perfect for players who want to develop their cognitive skills independently. 
                Our individual drills can be done solo or with a training partner.
              </p>
              <ul className="space-y-3">
                {[
                  "Self-paced progression",
                  "Focus on personal weaknesses",
                  "Flexible scheduling",
                  "Track individual improvement"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <span className="w-5 h-5 bg-[#A10115] rounded-full flex items-center justify-center text-white text-xs mr-3">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div data-aos="fade-left" className="p-8 bg-[#F0EFEA] rounded-2xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#D72C16] rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                  👥
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Team Training</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Integrate cognitive training into your team sessions. Our drills work 
                with groups of any size and can be adapted to your existing training structure.
              </p>
              <ul className="space-y-3">
                {[
                  "Scalable for any team size",
                  "Competition elements",
                  "Develops team scanning",
                  "Integrates with existing plans"
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

      {/* Position Focus */}
      <section className="py-20 px-6 bg-[#F0EFEA]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4" data-aos="fade-up">
            Every Position Benefits
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12" data-aos="fade-up" data-aos-delay="100">
            Scanning and decision-making matter for every player on the pitch
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { position: "Goalkeepers", benefit: "Organize defense, read play", color: "#C0B2B5" },
              { position: "Defenders", benefit: "Track runners, anticipate", color: "#D72C16" },
              { position: "Midfielders", benefit: "Find space, link play", color: "#A10115" },
              { position: "Forwards", benefit: "Create chances, score", color: "#f4a261" }
            ].map((pos, i) => (
              <div 
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="text-center p-6 bg-white rounded-xl shadow-md"
              >
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: pos.color }}
                >
                  {pos.position.charAt(0)}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{pos.position}</h3>
                <p className="text-gray-600 text-sm">{pos.benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#A10115]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4" data-aos="fade-up">
            Find the right fit for your team
          </h2>
          <p className="text-xl opacity-90 mb-8" data-aos="fade-up" data-aos-delay="100">
            Get in touch to learn how Football EyeQ can work for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-[#A10115] font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Contact Us
            </Link>
            <Link
              href="/catalog"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#A10115] transition"
            >
              View Drills
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
