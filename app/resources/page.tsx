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
            <span className="hover:text-[#A10115] transition cursor-pointer">Learn ▾</span>
            <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-lg py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <Link href="/why-scanning" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#A10115]">Why Scanning</Link>
              <Link href="/how-it-works" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#A10115]">How It Works</Link>
              <Link href="/ecosystem" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#A10115]">Ecosystem</Link>
              <Link href="/use-cases" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#A10115]">Use Cases</Link>
            </div>
          </div>
          <Link href="/resources" className="text-[#A10115] font-semibold">Resources</Link>
          <Link href="/testimonials" className="hover:text-[#A10115] transition">Testimonials</Link>
          <Link href="/contact" className="hover:text-[#A10115] transition">Contact</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-[#F0EFEA]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6" data-aos="fade-up">
            <span className="text-[#D72C16]">Resources</span> & Guides
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Educational materials, guides, and downloads to help you get the most from Football EyeQ.
          </p>
        </div>
      </section>

      {/* Getting Started Journeys */}
      <section id="getting-started" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-[#A10115] font-semibold">Fast onboarding</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">Coach-ready journeys</h2>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Follow the steps that match your role. Each path links directly to the page you need so you can move from sign up
                to on-field delivery without hunting through the FAQ.
              </p>
            </div>
            <Link
              href="#getting-started"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#A10115] text-[#A10115] font-semibold hover:bg-[#A10115] hover:text-white transition"
            >
              Return to Getting Started
              <span aria-hidden>↺</span>
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {[ 
              {
                title: "Individual Coach",
                badge: "Free → Premium ready",
                color: "#A10115",
                summary: "Plan sessions with plastic cones now; unlock smart EyeQ cones next.",
                steps: [
                  <>
                    Sign up free at <Link href="/signup" className="text-[#A10115] font-semibold hover:underline">football-eyeq.com/signup</Link> to access the drill catalogue, one session planner, and up to 10 favourites.
                  </>,
                  <>
                    Build your first session in the <Link href="/planner" className="text-[#A10115] font-semibold hover:underline">Session Planner</Link> and run it with plastic cones—this teaches the same scanning principles as EyeQ hardware.
                  </>,
                  <>
                    To preview Premium during early access, email <a href="mailto:obrinkmann@gmail.com" className="text-[#A10115] font-semibold hover:underline">obrinkmann@gmail.com</a> for a free upgrade. Premium unlocks the full 12-session planner, unlimited favourites, and <Link href="/planner/stats" className="text-[#A10115] font-semibold hover:underline">stats</Link>.
                  </>,
                  <>
                    When EyeQ cones arrive, switch exercise type in the <Link href="/catalog" className="text-[#A10115] font-semibold hover:underline">Drill Catalogue</Link> to EyeQ to add smart-light progressions; plastic drills remain available anytime.
                  </>
                ],
                notes: "EyeQ exercises need the smart LED cones; Plastic exercises mirror the same cognitive demands using standard cones."
              },
              {
                title: "Club Coach (with code)",
                badge: "Club-managed premium",
                color: "#D72C16",
                summary: "Use your club access code to unlock full-season tools immediately.",
                steps: [
                  <>
                    Create a free coach account at <Link href="/signup" className="text-[#A10115] font-semibold hover:underline">football-eyeq.com/signup</Link> and tick the club box during signup.
                  </>,
                  <>
                    Redeem your access code on the <Link href="/join-club" className="text-[#A10115] font-semibold hover:underline">Join Club</Link> page; the code typically arrives from your club admin by email.
                  </>,
                  <>
                    After redemption, head to the <Link href="/planner" className="text-[#A10115] font-semibold hover:underline">Session Planner</Link> for full 12-week planning, <Link href="/catalog" className="text-[#A10115] font-semibold hover:underline">Drill Catalogue</Link> for EyeQ and Plastic drills, and <Link href="/planner/stats" className="text-[#A10115] font-semibold hover:underline">Stats</Link> for usage insights.
                  </>
                ],
                notes: "Your club admin controls who receives codes and can adjust drill permissions across the staff."
              },
              {
                title: "Club Coach (without code)",
                badge: "Free until code arrives",
                color: "#A10115",
                summary: "Start free, request your club invite, then unlock premium once your code is issued.",
                steps: [
                  <>
                    Sign up free at <Link href="/signup" className="text-[#A10115] font-semibold hover:underline">football-eyeq.com/signup</Link> and begin with plastic drills and one session planner.
                  </>,
                  <>
                    Email your club admin the address you used to sign up so they can generate a matching code in their <Link href="/club/dashboard" className="text-[#A10115] font-semibold hover:underline">Club Dashboard</Link>.
                  </>,
                  <>
                    Once you receive the code, redeem it at <Link href="/join-club" className="text-[#A10115] font-semibold hover:underline">football-eyeq.com/join-club</Link> to unlock full club benefits and keep your existing sessions.
                  </>
                ],
                notes: "Codes are email-specific—share the exact signup email with your admin to avoid delays."
              },
              {
                title: "Club Admin",
                badge: "Manage coaches & access",
                color: "#D72C16",
                summary: "Create and distribute access codes, set drill permissions, and self-upgrade to review premium tools.",
                steps: [
                  <>
                    Register your club at <Link href="/club/signup" className="text-[#A10115] font-semibold hover:underline">football-eyeq.com/club/signup</Link> and log into the <Link href="/club/dashboard" className="text-[#A10115] font-semibold hover:underline">Club Dashboard</Link>.
                  </>,
                  <>
                    Generate invite codes per coach email inside the dashboard, then share codes via email; coaches redeem at <Link href="/join-club" className="text-[#A10115] font-semibold hover:underline">Join Club</Link>.
                  </>,
                  <>
                    Use the dashboard controls to manage memberships and decide if staff can access EyeQ drills or stick to team/Plastic content.
                  </>,
                  <>
                    Apply a self-upgrade to experience the premium journey yourself—start a sample season in the <Link href="/planner" className="text-[#A10115] font-semibold hover:underline">Planner</Link> and view <Link href="/planner/stats" className="text-[#A10115] font-semibold hover:underline">Stats</Link> to spot progression gaps.
                  </>
                ],
                notes: "Share codes promptly so coaches keep their plans synced; you can revoke or regenerate codes anytime in the dashboard."
              }
            ].map((journey, i) => (
              <div
                key={journey.title}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                <div className="p-6 flex items-center justify-between" style={{ backgroundColor: `${journey.color}10` }}>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">{journey.badge}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{journey.title}</h3>
                  </div>
                  <div className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: `${journey.color}20`, color: journey.color }}>
                    Start here
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-gray-700">{journey.summary}</p>
                  <ol className="space-y-3 text-gray-700">
                    {journey.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="font-bold text-[#A10115]">{idx + 1}.</span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="bg-[#F0EFEA] rounded-xl p-4 text-sm text-gray-700 border border-dashed border-gray-300">
                    <strong className="text-[#A10115]">Note:</strong> {journey.notes}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100" data-aos="fade-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#A10115] text-white flex items-center justify-center text-xl">★</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Using favourites</h3>
                  <p className="text-sm text-gray-600">Save drills you love so they are one tap away on the pitch.</p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li>Tap the heart in the <Link href="/catalog" className="text-[#A10115] font-semibold hover:underline">Drill Catalogue</Link> to favourite any exercise.</li>
                <li>Free accounts store up to 10; Premium and club coaches get unlimited favourites for full-season libraries.</li>
                <li>Filter to your favourites inside the catalogue for quick on-field access.</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100" data-aos="fade-up" data-aos-delay="100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#D72C16] text-white flex items-center justify-center text-xl">📊</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Checking stats</h3>
                  <p className="text-sm text-gray-600">Premium and club plans show how balanced your season plan is.</p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li>Open <Link href="/planner/stats" className="text-[#A10115] font-semibold hover:underline">Planner &gt; Stats</Link> to view drill usage, game moments, and difficulty mix.</li>
                <li>Remove or swap drills straight from the stats view to even out decision themes.</li>
                <li>Revisit <Link href="#getting-started" className="text-[#A10115] font-semibold hover:underline">Getting Started</Link> anytime to onboard new staff with the same flow.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Training Guides",
                icon: "📘",
                color: "#D72C16",
                desc: "Deep dives into training methodology, drill categories, and session planning.",
                items: ["Scanning Fundamentals", "Age-Group Progressions", "Position-Specific Training"],
                status: "Coming Soon"
              },
              {
                title: "Blog & Articles",
                icon: "📰",
                color: "#D72C16",
                desc: "Latest articles on cognitive training, player development, and Football EyeQ updates.",
                items: ["Why Scanning Matters", "Science of Decision Making", "Coach Interviews"],
                status: "Coming Soon"
              },
              {
                title: "Platform Updates",
                icon: "🚀",
                color: "#A10115",
                desc: "What\'s new across the platform plus upcoming features and release notes.",
                items: ["New drill drops", "Feature walkthroughs", "Release timelines"],
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
            className="bg-[#F0EFEA] rounded-2xl p-12 border-2 border-dashed border-gray-300"
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
      <section className="py-16 px-6 bg-[#F0EFEA]">
        <div className="max-w-4xl mx-auto">
          <div 
            data-aos="fade-up"
            className="bg-gradient-to-r from-[#A10115] to-[#c5303c] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between"
          >
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Tag Explanation Guide</h3>
              <p className="opacity-90">
                Understand our drill coding system, labels, and categories
              </p>
            </div>
            <Link
              href="/explanation"
              className="px-6 py-3 bg-white text-[#A10115] font-bold rounded-lg hover:bg-gray-100 transition"
            >
              View Guide →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#A10115]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4" data-aos="fade-up">
            Stay Updated
          </h2>
          <p className="text-xl opacity-90 mb-8" data-aos="fade-up" data-aos-delay="100">
            Get notified when new resources are available.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-[#A10115] font-bold rounded-lg hover:bg-gray-100 transition"
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
