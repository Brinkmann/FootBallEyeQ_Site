"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { auth } from "@/Firebase/firebaseConfig";
import { User } from "firebase/auth";

const pillars = [
  {
    title: "Improved scanning & awareness",
    description: "Teach players to scan 360° before receiving so they arrive on the ball already knowing the picture.",
  },
  {
    title: "Quicker decisions",
    description: "See more options, choose faster, and keep tempo high under pressure with repeatable cognitive reps.",
  },
  {
    title: "Better positioning",
    description: "Anticipate the next action, create space, and play forward with purpose before the first touch.",
  },
];

const productTiles = [
  {
    title: "Drill Catalogue",
    description: "Browse 100+ scanning, first-touch, and decision-speed drills with filters for age, equipment, and duration.",
    link: "/catalog",
  },
  {
    title: "Season & Session Planner",
    description: "Drag, drop, and save complete sessions in minutes with ready-made templates you can customize.",
    link: "/planner",
  },
  {
    title: "EyeQ Cones & App",
    description: "Trigger random light cues from your phone to create unpredictable, game-realistic scanning reps.",
    link: "/cones",
  },
];

const scanningBullets = [
  "Elite players scan 6-8x in 10 seconds before receiving.",
  "0.5s scan rhythm builds calm, proactive decision-making.",
  "More scanning = more time to see pressure, teammates, and space.",
];

const useCases = [
  {
    title: "Youth Academy",
    body: "Build scanning-first habits early with guided progressions and short, repeatable blocks.",
  },
  {
    title: "Semi-Pro & Senior",
    body: "Accelerate tempo and decision speed with high-pressure, game-realistic cues and competitive races.",
  },
  {
    title: "Rehab / Return-to-Play",
    body: "Rebuild game intelligence safely with light, controlled scanning work before full contact.",
  },
];

const packages = [
  {
    title: "Starter",
    price: "Planner + Core Drills",
    details: ["Best for single teams", "Guided session templates", "Scanning warm-ups"],
  },
  {
    title: "Pro",
    price: "Planner + Full Drill Set + Cones",
    details: ["EyeQ cone control app", "Progressive scanning blocks", "Session save & share"],
  },
  {
    title: "Club",
    price: "Multi-team + Support",
    details: ["Coach onboarding", "Club-wide templates", "Priority support"],
  },
];

const testimonials = [
  {
    quote: "Our scan rate doubled in six weeks. Players are calmer under pressure because they already know their next pass.",
    name: "Coach Lena, U17 Academy",
  },
  {
    quote: "The planner cut prep time in half. I can drop in EyeQ-compatible drills and run them instantly with the cones.",
    name: "Coach Malik, Semi-Pro",
  },
];

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
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="flex justify-between items-center px-8 py-5 bg-transparent">
        <div className="flex items-center space-x-3 font-bold text-lg text-foreground">
          <img src="/brand/logo-icon.png" alt="Football EyeQ" className="h-9 w-auto" />
          <span>Football EyeQ</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
          <Link href="#planner">Planner & Drills</Link>
          <Link href="#scanning">Why Scanning</Link>
          <Link href="#loop">Ecosystem</Link>
          <Link href="#packages">Packages</Link>
          <Link href="#contact">Contact</Link>
        </nav>
        {!user ? (
          <div className="space-x-3 flex items-center">
            <Link href="/signup">
              <button className="px-4 py-2 rounded-md bg-primary text-button font-semibold bg-primary-hover transition">
                Sign Up
              </button>
            </Link>
            <Link href="/login">
              <button className="px-4 py-2 rounded-md border border-primary text-primary font-semibold hover:bg-primary-light transition">
                Log In
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-x-4 flex items-center">
            <span className="text-gray-700">Welcome!</span>
            <Link href="/profile">
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white">🧑‍🏫</div>
            </Link>
            <button
              onClick={() => auth.signOut()}
              className="px-4 py-2 rounded-md bg-gray-700 text-white font-semibold hover:bg-gray-600"
            >
              Sign Out
            </button>
          </div>
        )}
      </header>

      <section className="px-6 md:px-12 lg:px-16 pt-10 pb-16 bg-gradient-to-b from-[rgba(161,1,21,0.08)] to-transparent">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6" data-aos="fade-right">
            <p className="text-sm uppercase tracking-widest text-primary font-semibold">See more. Think faster. Play better.</p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Unlock your game intelligence with Football EyeQ
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl">
              Train scanning and decision-making with a digital planner, smart drill catalogue, and EyeQ LED cones that
              keep players thinking before the ball arrives.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/planner">
                <button className="px-5 py-3 rounded-md bg-primary text-button font-semibold bg-primary-hover transition">
                  Start a Session Plan
                </button>
              </Link>
              <Link href="/catalog">
                <button className="px-5 py-3 rounded-md border border-primary text-primary font-semibold hover:bg-primary-light transition">
                  Browse Drills
                </button>
              </Link>
              <Link href="#contact">
                <button className="px-5 py-3 rounded-md border border-divider text-foreground font-semibold hover:bg-primary-light transition">
                  Book a Demo
                </button>
              </Link>
            </div>
            <div className="flex gap-5 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <span>Build sessions in minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <span>Apply SEE–THINK–DO today</span>
              </div>
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-divider bg-card">
              <img
                src="/images/homepage1.png"
                alt="Football EyeQ overview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-16 py-16">
        <div className="grid md:grid-cols-3 gap-8" data-aos="fade-up">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="p-6 bg-card rounded-xl shadow border border-divider space-y-3">
              <h3 className="text-xl font-bold">{pillar.title}</h3>
              <p className="text-gray-700 text-base leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="planner" className="px-6 md:px-12 lg:px-16 py-16 bg-card border-y border-divider">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6" data-aos="fade-right">
            <p className="text-sm uppercase tracking-widest text-primary font-semibold">Planner & Drill Catalogue</p>
            <h2 className="text-3xl md:text-4xl font-bold">Your command center for smarter sessions</h2>
            <p className="text-gray-700 text-lg">
              Plan, customize, and run full sessions in minutes. Filter drills by age group, objective, equipment, and duration
              and drop them straight into your plan with smart progressions for scanning and decision speed.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {productTiles.map((tile) => (
                <Link key={tile.title} href={tile.link}>
                  <div className="p-4 rounded-lg border border-divider hover:border-primary hover:shadow-lg transition bg-background">
                    <h3 className="font-semibold text-lg mb-2">{tile.title}</h3>
                    <p className="text-sm text-gray-700">{tile.description}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/planner">
                <button className="px-5 py-3 rounded-md bg-primary text-button font-semibold bg-primary-hover transition">
                  Plan a session now
                </button>
              </Link>
              <Link href="/catalog">
                <button className="px-5 py-3 rounded-md border border-primary text-primary font-semibold hover:bg-primary-light transition">
                  Browse all drills
                </button>
              </Link>
            </div>
          </div>
          <div className="space-y-6" data-aos="fade-left">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-divider bg-card">
              <img src="/images/homepage2.png" alt="Planner and drill ecosystem graphic" className="w-full" />
            </div>
            <div className="p-5 rounded-xl bg-primary-light border border-primary">
              <p className="font-semibold text-primary">Smart suggestions</p>
              <p className="text-gray-800 text-sm mt-2">
                We guide you from foundational scanning reps to pressure drills to game-realistic progressions so every session
                moves players closer to match intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="scanning" className="px-6 md:px-12 lg:px-16 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4" data-aos="fade-right">
            <p className="text-sm uppercase tracking-widest text-primary font-semibold">Why scanning</p>
            <h2 className="text-3xl md:text-4xl font-bold">See faster. Play smarter.</h2>
            <p className="text-gray-700 text-lg">
              Traditional drills offer limited cognitive reps. Football EyeQ forces constant head-up checks with random light cues
              so players build the SEE → THINK → DO habit before the ball arrives.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {scanningBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link href="/catalog?focus=scanning">
              <button className="mt-4 px-5 py-3 rounded-md bg-primary text-button font-semibold bg-primary-hover transition">
                Try the scanning drills
              </button>
            </Link>
          </div>
          <div className="space-y-4" data-aos="fade-left">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-divider bg-card">
              <img src="/images/homepage3.png" alt="SEE THINK DO infographic" className="w-full" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-divider bg-card">
              <img src="/images/8847419.png" alt="Power of scanning graphic" className="w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-16 py-16 bg-card border-y border-divider">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right" className="space-y-4">
            <p className="text-sm uppercase tracking-widest text-primary font-semibold">How Football EyeQ works</p>
            <h2 className="text-3xl md:text-4xl font-bold">Interactive, unpredictable, and game realistic</h2>
            <p className="text-gray-700 text-lg">
              EyeQ cones fire random red/green/blue cues so players must check shoulders, decide, and execute under time pressure.
              Control everything from your phone, save drills, and keep training flowing.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-800">
              <div className="p-4 rounded-xl bg-primary-light border border-primary/50">
                <h4 className="font-semibold mb-2">Hardware & setup</h4>
                <p>Durable LED cones with long-life batteries. Charge, place, and run from the mobile app.</p>
              </div>
              <div className="p-4 rounded-xl bg-primary-light border border-primary/50">
                <h4 className="font-semibold mb-2">Game intelligence outcomes</h4>
                <p>Faster reads, calmer possession, and better off-ball movement because scanning becomes instinctive.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="#contact">
                <button className="px-5 py-3 rounded-md bg-primary text-button font-semibold bg-primary-hover transition">
                  See it live
                </button>
              </Link>
              <Link href="/catalog?hardware=eyeq">
                <button className="px-5 py-3 rounded-md border border-primary text-primary font-semibold hover:bg-primary-light transition">
                  Browse compatible drills
                </button>
              </Link>
            </div>
          </div>
          <div className="space-y-4" data-aos="fade-left">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-divider bg-card">
              <img src="/brand/color_logo_with_background.svg" alt="Football EyeQ branding" className="w-full" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-divider bg-card">
              <img src="/brand/color_logo_transparent.svg" alt="Training cones illustration" className="w-full" />
            </div>
          </div>
        </div>
      </section>

      <section id="loop" className="px-6 md:px-12 lg:px-16 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4" data-aos="fade-right">
            <p className="text-sm uppercase tracking-widest text-primary font-semibold">Ecosystem loop</p>
            <h2 className="text-3xl md:text-4xl font-bold">Plan → Train → Improve</h2>
            <p className="text-gray-700 text-lg">
              Every session starts in the planner, runs on the field with EyeQ cones, and feeds back into your notes and templates.
              Continuous cycles build game intelligence for coaches and players.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/planner">
                <button className="px-5 py-3 rounded-md bg-primary text-button font-semibold bg-primary-hover transition">
                  Start the loop
                </button>
              </Link>
              <Link href="/planner">
                <button className="px-5 py-3 rounded-md border border-primary text-primary font-semibold hover:bg-primary-light transition">
                  Open planner
                </button>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-divider bg-card" data-aos="fade-left">
            <img src="/brand/dark_logo_transparent.svg" alt="Ecosystem cycle graphic" className="w-full" />
          </div>
        </div>
      </section>

      <section id="packages" className="px-6 md:px-12 lg:px-16 py-16 bg-card border-y border-divider">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6" data-aos="fade-right">
            <p className="text-sm uppercase tracking-widest text-primary font-semibold">Use cases & packages</p>
            <h2 className="text-3xl md:text-4xl font-bold">Choose the path that fits your squad</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {useCases.map((useCase) => (
                <div key={useCase.title} className="p-4 rounded-lg border border-divider bg-background">
                  <h3 className="font-semibold text-lg mb-2">{useCase.title}</h3>
                  <p className="text-sm text-gray-700">{useCase.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4" data-aos="fade-left">
            {packages.map((pkg) => (
              <div key={pkg.title} className="p-5 rounded-xl border border-divider bg-background shadow-sm">
                <p className="text-sm uppercase tracking-wide text-primary font-semibold">{pkg.title}</p>
                <p className="text-xl font-bold mt-2">{pkg.price}</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-700 list-disc pl-4">
                  {pkg.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
                <Link href="#contact" className="inline-block mt-4 text-primary font-semibold hover:underline">
                  Talk to us
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-16 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4" data-aos="fade-right">
            <p className="text-sm uppercase tracking-widest text-primary font-semibold">Testimonials & proof</p>
            <h2 className="text-3xl md:text-4xl font-bold">Coaches see quicker decisions and calmer possession</h2>
            <div className="grid gap-4">
              {testimonials.map((testimonial) => (
                <div key={testimonial.name} className="p-5 rounded-xl bg-card border border-divider shadow-sm">
                  <p className="text-lg text-gray-800">“{testimonial.quote}”</p>
                  <p className="mt-3 font-semibold text-primary">{testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4" data-aos="fade-left">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-divider bg-card">
              <img src="/brand/color_logo_with_background.svg" alt="Smart training revolution infographic" className="w-full" />
            </div>
            <div className="p-5 rounded-xl bg-primary-light border border-primary">
              <p className="font-semibold text-primary">Stat spotlight</p>
              <p className="text-gray-800 mt-2 text-sm">Clubs report more shoulder checks, higher passing tempo, and better off-ball runs after four weeks of EyeQ scanning blocks.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="px-6 md:px-12 lg:px-16 py-16 bg-card border-t border-divider">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4" data-aos="fade-right">
            <p className="text-sm uppercase tracking-widest text-primary font-semibold">Stay in touch</p>
            <h2 className="text-3xl md:text-4xl font-bold">Plan a session, book a demo, or join early access</h2>
            <p className="text-gray-700 text-lg">
              Whether you coach a single team or a full club, we can help you roll out scanning-first training. Tell us about your
              goals and we’ll share the right planner template and drill set.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup">
                <button className="px-5 py-3 rounded-md bg-primary text-button font-semibold bg-primary-hover transition">
                  Create free account
                </button>
              </Link>
              <Link href="mailto:info@football-eyeq.com">
                <button className="px-5 py-3 rounded-md border border-primary text-primary font-semibold hover:bg-primary-light transition">
                  Email the team
                </button>
              </Link>
              <Link href="/catalog">
                <button className="px-5 py-3 rounded-md border border-divider text-foreground font-semibold hover:bg-primary-light transition">
                  Explore drills
                </button>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-divider bg-card" data-aos="fade-left">
            <img src="/images/logo.png" alt="Football EyeQ player with cones" className="w-full" />
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} Football EyeQ. Train the brain. Master the game.
      </footer>
    </div>
  );
}
