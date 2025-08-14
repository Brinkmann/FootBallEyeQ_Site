import React from "react";

export default function AboutPage() {
  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About Football EyeQ</h1>

      <section className="mb-6">
        <p className="text-gray-700 mb-4">
          <strong>Football EyeQ</strong> is an innovative coaching platform designed to simplify session planning, player development, and team management.
        </p>
        <p className="text-gray-700 mb-4">
          Built by football enthusiasts, our goal is to make coaching smarter — not harder. We empower coaches with tools to organize drills, plan seasons, and track progress all in one place.
        </p>
        <p className="text-gray-700">
          Whether you're coaching grassroots, academy, or elite-level teams, Football EyeQ helps you deliver better sessions and grow your players effectively.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
        <p className="text-gray-700 mb-6">
          To elevate coaching through technology — helping every coach build smarter, more engaging football experiences.
        </p>

        {/* Button linking to external website */}
        <a
          href="https://football-eyeq.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-md hover:bg-blue-50"
        >
          Learn More
        </a>
      </section>
    </main>
  );
}
