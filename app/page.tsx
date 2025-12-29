"use client";
import { useEffect } from "react";
import "aos/dist/aos.css";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/Firebase/firebaseConfig";
import { useState } from "react";
import { User } from "firebase/auth";
import { aboutLinks, coreLinks, learnLinks, pricingLink, supportLinks } from "./components/navigation";
import heroImage from "@/attached_assets/Gemini_Generated_Image_4hnpph4hnpph4hnp_1765753298897.png";
import seeThinkDoImage from "@/attached_assets/Gemini_Generated_Image_2f9rfc2f9rfc2f9r_1765758694890.png";
import ecosystemImage from "@/attached_assets/Gemini_Generated_Image_uzmoi1uzmoi1uzmo1_1765753298901.png";
import playersConesImage from "@/attached_assets/Gemini_Generated_Image_bwhz9zbwhz9zbwhz_1765753298898.png";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const AOS = (await import("aos")).default;
      if (!isMounted) return;

      AOS.init({ duration: 800, once: true });
    })();

    const unsubscribe = auth.onAuthStateChanged((currentUser: User | null) => {
      setUser(currentUser);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Top Bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-10">
        <div className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Image src="/brand/logo-icon.png" alt="Football EyeQ" width={32} height={32} priority />
          <span>Football EyeQ</span>
        </div>
        <nav className="hidden items-center gap-5 text-sm font-medium text-foreground/80 md:flex">
          {coreLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-primary">
              {link.label}
            </Link>
          ))}
          <div className="relative group">
            <span className="cursor-pointer transition hover:text-primary">Learn ▾</span>
            <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-lg border border-divider bg-card p-2 text-left opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-1 group-hover:opacity-100">
              {learnLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-md px-4 py-2 text-foreground/80 transition hover:bg-primary-light hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {aboutLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-primary">
              {link.label}
            </Link>
          ))}
          {supportLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-primary">
              {link.label}
            </Link>
          ))}
          <Link href={pricingLink.href} className="font-semibold transition hover:text-primary">
            {pricingLink.label}
          </Link>
        </nav>
        {!user && (
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="rounded-lg px-4 py-2 text-sm font-semibold text-primary transition hover:text-primary-hover">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-button transition hover:bg-primary-hover">
                Sign Up
              </button>
            </Link>
          </div>
        )}
        {user && (
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm text-button">
                🧑‍🏫
              </div>
            </Link>
            <button
              onClick={() => auth.signOut()}
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-foreground/80"
            >
              Sign Out
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-16 md:px-10">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div data-aos="fade-right">
            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
              Train Smarter with<br />
              <span className="text-primary">Game Intelligence</span>
            </h1>
            <p className="mb-8 max-w-xl text-lg text-foreground/70">
              Football EyeQ transforms training with cognitive drills that develop scanning,
              decision-making, and game awareness. Build smarter players who see the game before it happens.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-button shadow-lg transition hover:bg-primary-hover"
              >
                Explore Drills
              </Link>
              <Link
                href="/planner"
                className="inline-flex items-center justify-center rounded-lg border-2 border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-button"
              >
                Plan a Session
              </Link>
            </div>
          </div>
          <div data-aos="fade-left" className="flex justify-center">
            <Image
              src={heroImage}
              alt="Game Intelligence - Football EyeQ"
              className="rounded-2xl shadow-xl h-auto"
              priority
              sizes="(min-width: 1024px) 540px, 100vw"
            />
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="bg-card px-6 py-20 md:px-10">
        <div className="mx-auto mb-12 max-w-6xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl" data-aos="fade-up">
            The Football EyeQ Method
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-foreground/70" data-aos="fade-up" data-aos-delay="100">
            Our approach combines cognitive training with smart technology to develop complete players
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {[
            {
              title: "See",
              desc: "Train players to constantly scan the field and gather visual information about teammates, opponents, and space.",
              color: "#A10115",
              icon: "👁️"
            },
            {
              title: "Think",
              desc: "Develop rapid decision-making by processing information and identifying the best options under pressure.",
              color: "#D72C16",
              icon: "🧠"
            },
            {
              title: "Do",
              desc: "Execute with precision and confidence, turning smart decisions into effective actions on the pitch.",
              color: "#D72C16",
              icon: "⚽"
            }
          ].map((pillar, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 150}
              className="text-center transition"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-3xl">
                {pillar.icon}
              </div>
              <h3 className="mb-3 text-2xl font-bold text-primary">{pillar.title}</h3>
              <p className="text-foreground/70">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* See-Think-Do Visual Strip */}
      <section className="bg-background px-6 py-16 md:px-10">
        <div className="mx-auto max-w-5xl" data-aos="zoom-in">
          <Image
            src={seeThinkDoImage}
            alt="See Think Do - Player Development"
            className="h-auto w-full rounded-2xl shadow-lg"
            sizes="(min-width: 1024px) 960px, 100vw"
          />
        </div>
      </section>

      {/* Product Highlights - Drill Catalogue & Session Planner */}
      <section className="bg-card px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-16 text-center text-3xl font-bold text-foreground md:text-4xl" data-aos="fade-up">
            Your Complete Training Platform
          </h2>

          <div className="grid gap-10 md:grid-cols-2">
            {/* Drill Catalogue Card */}
            <div
              data-aos="fade-right"
              className="rounded-2xl border border-divider bg-gradient-to-br from-primary-light to-primary-light/40 p-8 shadow-sm"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-2xl text-button">📚</div>
                <h3 className="text-2xl font-bold text-foreground">Drill Catalogue</h3>
              </div>
              <p className="mb-6 text-foreground/70">
                Access 100+ cognitive football drills designed to develop scanning habits and game intelligence.
                Filter by age group, difficulty, game moment, and more.
              </p>
              <ul className="mb-8 space-y-3">
                {["Smart filtering & search", "Detailed drill breakdowns", "Video demonstrations", "Cone setup diagrams"].map(
                  (feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground/90">
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-button">
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ),
                )}
              </ul>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-button transition hover:bg-primary-hover"
              >
                Browse Drills →
              </Link>
            </div>

            {/* Session Planner Card */}
            <div
              data-aos="fade-left"
              className="rounded-2xl border border-divider bg-gradient-to-br from-primary-light to-primary-light/40 p-8 shadow-sm"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-2xl text-button">📋</div>
                <h3 className="text-2xl font-bold text-foreground">Session Planner</h3>
              </div>
              <p className="mb-6 text-foreground/70">
                Build complete training sessions with drag-and-drop simplicity.
                Plan your entire season and keep everything organized in one place.
              </p>
              <ul className="mb-8 space-y-3">
                {[
                  "12-week season overview",
                  "Drag & drop drill planning",
                  "Save & share sessions",
                  "Cloud sync across devices",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground/90">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-button">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/planner"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-button transition hover:bg-primary-hover"
              >
                Start Planning →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Preview */}
      <section className="bg-background px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div data-aos="fade-right">
            <Image
              src={ecosystemImage}
              alt="Plan Train Enjoy Ecosystem"
              className="h-auto rounded-2xl shadow-lg"
              sizes="(min-width: 1024px) 540px, 100vw"
            />
          </div>
          <div data-aos="fade-left">
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
              Plan. Train. <span className="text-primary">Enjoy.</span>
            </h2>
            <p className="mb-6 text-lg text-foreground/70">
              Football EyeQ creates a complete ecosystem for developing smarter players.
              From session planning to on-field execution, every step is designed to make
              training more effective and enjoyable.
            </p>
            <Link
              href="/ecosystem"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-hover"
            >
              Learn about our ecosystem →
            </Link>
          </div>
        </div>
      </section>

      {/* Smart Cones Preview */}
      <section className="bg-card px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div data-aos="fade-right" className="order-2 md:order-1">
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
              Smart LED Cones for <span className="text-primary">Interactive Training</span>
            </h2>
            <p className="mb-6 text-lg text-foreground/70">
              Our smart cone technology brings drills to life with dynamic light sequences
              that challenge players to scan, react, and execute in real-time.
            </p>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-hover"
            >
              See how it works →
            </Link>
          </div>
          <div data-aos="fade-left" className="order-1 md:order-2">
            <Image
              src={playersConesImage}
              alt="Players with Smart LED Cones"
              className="h-auto rounded-2xl shadow-lg"
              sizes="(min-width: 1024px) 540px, 100vw"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary-hover px-6 py-20 text-button md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl" data-aos="fade-up">
            Ready to Transform Your Training?
          </h2>
          <p className="mb-8 text-xl opacity-90" data-aos="fade-up" data-aos-delay="100">
            Join coaches who are developing smarter, more aware players with Football EyeQ.
          </p>
          <div className="flex flex-wrap justify-center gap-3" data-aos="fade-up" data-aos-delay="200">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-card px-7 py-3 text-sm font-bold text-primary transition hover:brightness-95"
            >
              Get Started Free
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border-2 border-button px-7 py-3 text-sm font-bold text-button transition hover:bg-button hover:text-primary"
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
                <Image src="/brand/logo-icon.png" alt="Football EyeQ" width={24} height={24} />
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
