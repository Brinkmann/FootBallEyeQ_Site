import React from "react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-card rounded-2xl shadow-xl p-8 max-w-lg w-full flex flex-col gap-6 border border-divider"> 
        <div className="flex flex-col items-center gap-3"> 
          <img src="/brand/logo-full.png" alt="Football EyeQ" className="h-16 mb-4 drop-shadow" /> 
      <h1 className="text-3xl font-bold mb-6 text-foreground">About Football EyeQ</h1>
</div>
      <section className="text-gray-700 text-sm flex flex-col gap-4">
        <p className="text-foreground mb-4">
          <strong>Football EyeQ</strong> is an innovative coaching platform designed to simplify session planning, player development, and team management.
        </p>
        <p className="text-foreground mb-4">
          Built by football enthusiasts, our goal is to make coaching smarter — not harder. We empower coaches with tools to organize drills, plan seasons, and develop cognitive skills all in one place.
        </p>
        <p className="text-foreground">
          Whether you are coaching grassroots, academy, or elite-level teams, Football EyeQ helps you deliver better sessions and grow your players effectively.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2 text-foreground">Our Vision</h2>
        <p className="text-foreground mb-6">
          To elevate coaching through technology — helping every coach build smarter, more engaging football experiences.
        </p>

        {/* Button linking to external website */}
        <a
          href="https://www.football-eyeq.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 border border-primary text-primary font-semibold rounded-md hover:bg-primary-light transition"
        >
          Learn More
        </a>
      </section>
      </div>
    </main>
  );
}