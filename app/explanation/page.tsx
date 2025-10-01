"use client";
import NavBar from "../components/Navbar";
/**
 * ExplanationGuide 
 * @returns Guide explaining each tag used in Football EyeQ.
 */
export default function ExplanationGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Football EyeQ Tag Explanation Guide</h1>
        <p className="text-gray-700 mb-8">
          Each tag below is listed with its code, label, and a short description of when or why to use it.
        </p>
        
        {/* Age Group */}
        <Section title="Age Group">
          <Item code="1.0" label="General / Unspecified" desc="Use when the drill fits a wide range of age groups or hasn't been age-assigned yet." />
          <Item code="1.1" label="Foundation Phase (U7–U10)" desc="Early-stage players focusing on fun, basic awareness, and developing movement habits." />
          <Item code="1.2" label="Youth Development Phase (U11–U14)" desc="Players learning structured play and beginning to process scanning and decision cues." />
          <Item code="1.3" label="Game Training Phase (U15–U18)" desc="Players working on applying tactical decisions and reacting under pressure." />
          <Item code="1.4" label="Performance Phase (U19–Senior)" desc="Advanced or elite players refining scanning, decision-making, and tactical execution." />
        </Section>

        {/* Decision Theme */}
        <Section title="Decision Theme">
          <Item code="2.0" label="General / Unspecified" desc="Use when the decision type is mixed or doesn’t clearly match a single category." />
          <Item code="2.1" label="Pass or Dribble" desc="Player must choose between distributing the ball or advancing with it under pressure." />
          <Item code="2.2" label="Attack or Hold" desc="Decision whether to break forward or maintain possession based on field conditions." />
          <Item code="2.3" label="Shoot or Pass" desc="Final-third decision between taking a shot or playing in a teammate." />
        </Section>

        {/* Player Involvement */}
        <Section title="Player Involvement">
          <Item code="3.0" label="General / Unspecified" desc="Use when group size is flexible or not central to the drill." />
          <Item code="3.1" label="Individual" desc="One player reacting to cues or completing movement/technical tasks alone." />
          <Item code="3.2" label="1v1 / 2v2" desc="Competitive small-sided setups, often used for dual decision-making." />
          <Item code="3.3" label="Small Group (3–4)" desc="Cooperative or competitive group scenarios, often for passing, rotations, or decisions." />
          <Item code="3.4" label="Team Unit (5+)" desc="Larger formations or positional units reacting together to game scenarios." />
        </Section>

        {/* Game Moment Simulated */}
        <Section title="Game Moment Simulated">
          <Item code="4.0" label="General / Unspecified" desc="Use when the drill doesn’t mimic a specific game phase or covers multiple moments." />
          <Item code="4.1" label="Build-Up" desc="Drills that focus on progressing the ball from the back or through midfield." />
          <Item code="4.2" label="Final Third Decision" desc="Emphasis on attacking outcomes like shooting, through balls, or last passes." />
          <Item code="4.3" label="Defensive Shape" desc="Players focus on positioning, pressing, or regrouping defensively." />
          <Item code="4.4" label="Counter Attack" desc="Exercises that simulate fast transitions from defence to attack." />
          <Item code="4.5" label="Transition (Attack to Defend)" desc="When possession is lost, players must react and recover into defensive shape." />
          <Item code="4.6" label="Switch of Play" desc="Drills that simulate changing the point of attack across the pitch." />
        </Section>

        {/* Difficulty Level */}
        <Section title="Difficulty Level">
          <Item code="5.0" label="General / Unspecified" desc="Use when difficulty varies or hasn’t been defined." />
          <Item code="5.1" label="Basic" desc="Slow-paced cues, simple responses, ideal for learning mechanics." />
          <Item code="5.2" label="Moderate" desc="Moderate tempo and scanning, 1–2 cue types, manageable complexity." />
          <Item code="5.3" label="Advanced" desc="Fast-paced, multi-cue, requires layered decision-making under pressure." />
          <Item code="5.4" label="Elite" desc="Unpredictable cues, intense mental load, constant scanning and tactical adjustment." />
        </Section>
      </div>
    </div>
  );
}

// Reusable Section Component
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

// Reusable Item Component
function Item({ code, label, desc }: { code: string; label: string; desc: string }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <p className="font-medium text-blue-700">{code} - {label}</p>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}
