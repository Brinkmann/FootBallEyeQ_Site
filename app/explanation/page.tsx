"use client";
import NavBar from "../components/Navbar";

type Item = {
  code: string;
  label: string;
  description: string;
};

type Section = {
  title: string;
  intro: string;
  items: Item[];
};

const sections: Section[] = [
  {
    title: "Age Group Tag",
    intro:
      "Age Group Tag: General / Unspecified; Foundation Phase (U7–U10); Youth Development Phase (U11–U14); Game Training Phase (U15–U18); Performance Phase (U19–Senior). Use this tag to find practices that suit the stage and typical ability level of your players.",
    items: [
      {
        code: "1.0",
        label: "General / Unspecified",
        description:
          "Choose this when you’re happy to adapt an idea for most age groups or you coach a mixed-age group.",
      },
      {
        code: "1.1",
        label: "Foundation Phase (U7–U10)",
        description:
          "Choose this when you want fun, simple practices that build basic coordination, confidence on the ball and very simple scanning habits.",
      },
      {
        code: "1.2",
        label: "Youth Development Phase (U11–U14)",
        description:
          "Choose this when you want more structured practices where players start to read cues, combine with team-mates and make simple tactical decisions.",
      },
      {
        code: "1.3",
        label: "Game Training Phase (U15–U18)",
        description:
          "Choose this when you want realistic game moments with more pressure, where players must apply tactics and scan before every decision.",
      },
      {
        code: "1.4",
        label: "Performance Phase (U19–Senior)",
        description:
          "Choose this when you work with advanced players who can handle complex, high-intensity practices with demanding scanning and decision-making.",
      },
    ],
  },
  {
    title: "Decision Theme Tag",
    intro:
      "Decision Theme Tag: General / Unspecified; Pass or Dribble; Attack or Hold; Shoot or Pass. Use this tag to filter for the main on-the-ball decision you want players to practise.",
    items: [
      {
        code: "2.0",
        label: "General / Unspecified",
        description:
          "Choose this when you’re happy with any decision focus, or the practice mixes several decision types.",
      },
      {
        code: "2.1",
        label: "Pass or Dribble",
        description:
          "Choose this when you want players to read pressure and space, then decide whether to combine with a team-mate or carry the ball themselves.",
      },
      {
        code: "2.2",
        label: "Attack or Hold",
        description:
          "Choose this when you want players to judge whether to break forward quickly or keep the ball and recycle based on what they see.",
      },
      {
        code: "2.3",
        label: "Shoot or Pass",
        description:
          "Choose this when you want final-third decisions: when to finish, when to slip a team-mate in, and how scanning affects that choice.",
      },
    ],
  },
  {
    title: "Player Involvement Tag",
    intro:
      "Player Involvement Tag: General / Unspecified; Individual; 1v1 / 2v2; Small Group (3–4 players); Team Unit (5+ players). Use this tag to match the number of players you want actively involved in each practice.",
    items: [
      {
        code: "3.0",
        label: "General / Unspecified",
        description: "Choose this when group size is flexible or you’re happy to adapt numbers on the day.",
      },
      {
        code: "3.1",
        label: "Individual",
        description:
          "Choose this when you want one player at a time working on reactions, scanning, and technique (e.g. ball mastery with visual cues).",
      },
      {
        code: "3.2",
        label: "1v1 / 2v2",
        description:
          "Choose this when you want intense, small duels where decisions are personal and repeated often (attacker vs defender, pairs vs pairs).",
      },
      {
        code: "3.3",
        label: "Small Group (3–4)",
        description:
          "Choose this for quick combination play, rotations and shared decisions in tight areas.",
      },
      {
        code: "3.4",
        label: "Team Unit (5+)",
        description:
          "Choose this when you want larger units or near-team shapes working together on game-like problems.",
      },
    ],
  },
  {
    title: "Game Moment Tag",
    intro:
      "Game Moment Tag: General / Unspecified; Build-Up; Final Third Decision; Defensive Shape; Counter Attack; Transition (Attack to Defend); Switch of Play. Use this tag to match the part of the game you want the practice to feel like.",
    items: [
      {
        code: "4.0",
        label: "General / Unspecified",
        description:
          "Choose this when the practice isn’t tied to one clear game phase, or you’re happy with any moment.",
      },
      {
        code: "4.1",
        label: "Build-Up",
        description:
          "Choose this when you want practices that feel like playing out from the back or progressing through midfield.",
      },
      {
        code: "4.2",
        label: "Final Third Decision",
        description:
          "Choose this when you want attacking practices around the box – last pass, through balls, finishing choices.",
      },
      {
        code: "4.3",
        label: "Defensive Shape",
        description:
          "Choose this when you want your team to work mainly on pressing, compactness, covering and holding a strong defensive block.",
      },
      {
        code: "4.4",
        label: "Counter Attack",
        description:
          "Choose this when you want fast break situations, going from defending to creating a chance in a few passes.",
      },
      {
        code: "4.5",
        label: "Transition (Attack to Defend)",
        description:
          "Choose this when you want your players to react quickly after losing the ball, with recovery runs or counter-pressing.",
      },
      {
        code: "4.6",
        label: "Switch of Play",
        description:
          "Choose this when you want practices that focus on recognising the far side, changing the point of attack and using width.",
      },
    ],
  },
  {
    title: "Difficulty Level Tag",
    intro:
      "Difficulty Level Tag: General / Unspecified; Basic; Moderate; Advanced; Elite. Use this tag to match the mental and tactical load of the practice to your group.",
    items: [
      {
        code: "5.0",
        label: "General / Unspecified",
        description: "Choose this when any difficulty is fine or you plan to adjust on the pitch.",
      },
      {
        code: "5.1",
        label: "Basic",
        description:
          "Choose this for slower, simpler practices where players have plenty of time and space to notice the cue and respond.",
      },
      {
        code: "5.2",
        label: "Moderate",
        description:
          "Choose this when you want a quicker tempo, the same cue appearing more often or later, and some pressure or time limits.",
      },
      {
        code: "5.3",
        label: "Advanced",
        description:
          "Choose this for high-tempo practices where players must scan early, react quickly and make layered decisions under real pressure.",
      },
      {
        code: "5.4",
        label: "Elite",
        description:
          "Choose this when you work with very strong players who can handle unpredictable cue timings, constant scanning and intense tactical demands.",
      },
    ],
  },
  {
    title: "Practice Format Tag",
    intro:
      "Practice Format Tag: Warm-Up / Ball Mastery; Fun Game / Physical; Finishing / Shooting Pattern; Positional Possession Game; Rondo / Tight Possession; Directional Small-Sided Game; General / Mixed. Use this tag to filter by the overall shape and feel of the practice.",
    items: [
      {
        code: "6.0",
        label: "General / Mixed",
        description:
          "Choose this when you’re open to any format, or the practice blends several styles.",
      },
      {
        code: "6.1",
        label: "Warm-Up / Ball Mastery",
        description:
          "Choose this when you want lighter work with lots of touches, movement and simple scanning to get players ready.",
      },
      {
        code: "6.2",
        label: "Fun Game / Physical",
        description:
          "Choose this for tag-style games, races and physical challenges that build reactions, fitness and basic awareness in a playful way.",
      },
      {
        code: "6.3",
        label: "Finishing / Shooting Pattern",
        description:
          "Choose this when you want repeatable patterns leading to shots, with scanning before finishing or choosing a pass.",
      },
      {
        code: "6.4",
        label: "Positional Possession Game",
        description:
          "Choose this for structured keep-ball or overload games in zones that link to team shape, usually with possession as the main goal.",
      },
      {
        code: "6.5",
        label: "Rondo / Tight Possession",
        description:
          "Choose this when you’re after small, tight-area games where players must scan constantly for pressure, support and passing lanes.",
      },
      {
        code: "6.6",
        label: "Directional Small-Sided Game",
        description:
          "Choose this for mini-matches with goals or target zones, where teams attack one way and defend the other – closest to the real game.",
      },
    ],
  },
];

export default function ExplanationGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 text-slate-800">
      <NavBar />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700 mb-3">
            Football EyeQ
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Football EyeQ – Tag Explanation Guide
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Use these tags to <strong>filter the exercise library</strong>. Each practice has
            one value from every tag type so you can quickly find sessions that fit your
            team and your focus.
          </p>
        </div>

        <div className="space-y-10">
          {sections.map((section) => (
            <Section key={section.title} title={section.title} intro={section.intro} items={section.items} />
          ))}
        </div>
      </main>
    </div>
  );
}

function Section({ title, intro, items }: Section) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <p className="text-slate-600 leading-relaxed">{intro}</p>
        <div className="h-px bg-gradient-to-r from-blue-500 via-blue-300 to-transparent" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Item key={item.code} code={item.code} label={item.label} description={item.description} />
        ))}
      </div>
    </section>
  );
}

function Item({ code, label, description }: Item) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 shadow-inner">
      <p className="text-sm font-semibold text-blue-700">{code}</p>
      <p className="text-base font-medium text-slate-900">{label}</p>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
