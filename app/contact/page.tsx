"use client";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

export default function ContactPage() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
          <Link href="/resources" className="hover:text-[#A10115] transition">Resources</Link>
          <Link href="/testimonials" className="hover:text-[#A10115] transition">Testimonials</Link>
          <Link href="/contact" className="text-[#A10115] font-semibold">Contact</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-[#F0EFEA]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6" data-aos="fade-up">
            Get in <span className="text-[#A10115]">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Have questions about Football EyeQ? Want to learn how we can help your club? 
            We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          {!submitted ? (
            <form 
              onSubmit={handleSubmit}
              data-aos="fade-up"
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A10115] focus:border-transparent transition"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A10115] focus:border-transparent transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                    Club / Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A10115] focus:border-transparent transition"
                    placeholder="FC Example"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A10115] focus:border-transparent transition"
                  >
                    <option value="">Select your role</option>
                    <option value="head-coach">Head Coach</option>
                    <option value="assistant-coach">Assistant Coach</option>
                    <option value="academy-director">Academy Director</option>
                    <option value="club-manager">Club Manager</option>
                    <option value="player">Player</option>
                    <option value="parent">Parent</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A10115] focus:border-transparent transition resize-none"
                  placeholder="Tell us about your club and how we can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-[#A10115] text-white font-bold rounded-lg hover:bg-[#c5303c] transition"
              >
                Send Message
              </button>
            </form>
          ) : (
            <div 
              data-aos="fade-up"
              className="bg-white rounded-2xl shadow-lg p-12 text-center"
            >
              <div className="text-6xl mb-6">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Message Sent!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Thank you for reaching out. We&apos;ll get back to you as soon as possible.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-[#A10115] text-white font-semibold rounded-lg hover:bg-[#c5303c] transition"
              >
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12" data-aos="fade-up">
            Explore While You Wait
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Browse Drills",
                desc: "Explore our cognitive training catalogue",
                href: "/catalog",
                color: "#A10115"
              },
              {
                title: "Learn the Method",
                desc: "Understand our training approach",
                href: "/why-scanning",
                color: "#D72C16"
              },
              {
                title: "Plan a Session",
                desc: "Start building your training plan",
                href: "/planner",
                color: "#C0B2B5"
              }
            ].map((link, i) => (
              <Link
                key={i}
                href={link.href}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="p-6 bg-[#F0EFEA] rounded-xl hover:shadow-md transition text-center group"
              >
                <h3 
                  className="text-lg font-bold mb-2 group-hover:underline"
                  style={{ color: link.color }}
                >
                  {link.title}
                </h3>
                <p className="text-gray-600 text-sm">{link.desc}</p>
              </Link>
            ))}
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
