"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";


export default function HomePage() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-sans">
      {/* Top Bar */}
      <header className="flex justify-between items-center px-8 py-4 bg-transparent">
        <div className="flex items-center space-x-2 font-bold text-lg text-gray-900">
          ⚽Football EyeQ
        </div>
        <div className="space-x-4">
          <Link href="/signup">
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-500">
            Sign Up
          </button></Link>
          <Link href="/login">
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-500">
            Log In
          </button></Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center mt-24 px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Smart Training <br />
          <span className="text-blue-600">Made Simple</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Plan, organize, and execute professional football training sessions
          with our intelligent coaching platform. Connect seamlessly with smart
          cone technology for next-level training experiences.
        </p>

        <div className="mt-8 flex justify-center space-x-4">
          <button className="px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-md hover:bg-blue-50">
            About Us
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-32 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          {
            title: "Browse Exercises",
            desc: "Access 100+ football drills with powerful search and filtering.",
            link: "/catalog"
          },
          {
            title: "Plan Sessions",
            desc: "Easily create, save, and edit your weekly training plans.",
            link: "/planner"
          },
          {
            title: "Control Smart Cones",
            desc: "Trigger LED patterns directly from your device in real time.",
            link: null
          }
        ].map((feature, i) => {
    const content = (
      <div
        data-aos="fade-up"
        data-aos-delay={i * 150}
        className="p-8 bg-white rounded-xl shadow hover:shadow-lg transition text-center cursor-pointer"
      >
        <div className="text-4xl mb-4">⚽</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
        <p className="text-gray-600">{feature.desc}</p>
      </div>
    );

    return feature.link ? (
      <Link key={i} href={feature.link}>
        {content}
      </Link>
    ) : (
      <div key={i}>{content}</div>
    );
  })}
</section>

      {/* Animated Second Section */}
      <section className="mt-40 px-6 max-w-6xl mx-auto space-y-32">
        {[
          {
            title: "Plan Like a Pro",
            desc: "Design sessions with drag-and-drop simplicity. Our platform allows you to create structured, professional training plans that are always at your fingertips.",
            img: "/images/homepage1.png",
            reverse: false
          },
          {
            title: "Control On The Field",
            desc: "Use any device to control your smart LED cones in real time. Seamlessly switch exercises and run your training without delays.",
            img: "/images/homepage2.png",
            reverse: true
          },
          {
            title: "Track & Improve",
            desc: "Analyze your sessions and get insights on drill usage to continuously improve your team’s performance.",
            img: "/images/homepage3.png",
            reverse: false
          }
        ].map((section, i) => (
          <div
            key={i}
            className={`flex flex-col items-center md:flex-row ${
              section.reverse ? "md:flex-row-reverse" : ""
            } gap-12`}
          >
            <div
              data-aos={section.reverse ? "fade-left" : "fade-right"}
              className="flex-1"
            >
              <img
                src={section.img}
                alt={section.title}
                className="rounded-xl shadow-lg"
              />
            </div>
            <div
              data-aos={section.reverse ? "fade-right" : "fade-left"}
              className="flex-1 text-center md:text-left"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
              <p className="text-gray-600 text-lg">{section.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-40 py-10 text-center text-gray-500 text-sm border-t border-gray-200">
        &copy; {new Date().getFullYear()} Football EyeQ. All rights reserved.
      </footer>
    </div>
  );
}
