import React from "react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#eaf6ff] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full flex flex-col gap-6 border border-blue-100"> 
        <div className="flex flex-col items-center gap-3"> 
          <img src="../images/logo.png" alt="Logo" className="h-14 mb-2 drop-shadow" /> 
      <h1 className="text-3xl font-bold mb-6">About Football EyeQ</h1>
</div>
      <section className="text-gray-700 text-sm flex flex-col gap-4">
        <p className="text-gray-700 mb-4">
          <strong>Football EyeQ</strong> is an innovative coaching platform designed to simplify session planning, player development, and team management.
        </p>
        <p className="text-gray-700 mb-4">
          Built by football enthusiasts, our goal is to make coaching smarter — not harder. We empower coaches with tools to organize drills, plan seasons, and track progress all in one place.
        </p>
        <p className="text-gray-700">
          Whether you are coaching grassroots, academy, or elite-level teams, Football EyeQ helps you deliver better sessions and grow your players effectively.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
        <p className="text-gray-700 mb-6">
          To elevate coaching through technology — helping every coach build smarter, more engaging football experiences.
        </p>

        {/* Button linking to external website */}
        <a
          href="https://www.football-eyeq.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-md hover:bg-blue-50"
        >
          Learn More
        </a>
      </section>
      </div>
    </main>
  );
}
