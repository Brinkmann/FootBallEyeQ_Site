import { validateExercises, type ValidatedExercise } from "./schemas";

const rawFallbackExercises = [
  {
    id: "fallback-eyeq-001",
    title: "001 Warm-Up Rondo",
    ageGroup: "General / Unspecified",
    decisionTheme: "Pass or Dribble",
    playerInvolvement: "Small Group (3-4 players)",
    gameMoment: "Build-Up",
    difficulty: "Basic",
    practiceFormat: "Rondo / Tight Possession",
    overview: "Quick touches in a tight space to encourage scanning and body orientation before passing.",
    description:
      "Create a 12x12 box with one defender. Attackers play one-touch if possible, checking shoulders before every receive. Rotate defender every 60 seconds.",
    exerciseBreakdownDesc: "Focus on half-turn receives, quick support angles, and calling out available passing lanes before the ball arrives.",
    image: "",
    exerciseType: "eyeq",
  },
  {
    id: "fallback-eyeq-002",
    title: "002 Directional Finishing",
    ageGroup: "Youth Development Phase (U11-U14)",
    decisionTheme: "Attack or Hold",
    playerInvolvement: "Small Group (3-4 players)",
    gameMoment: "Final Third Decision",
    difficulty: "Moderate",
    practiceFormat: "Directional Small-Sided Game",
    overview: "Numbers-up finishing with colour cues that change the available goal to attack.",
    description:
      "Play 4v3 to two mini-goals. Coach flashes a cone colour to activate the left or right goal. Team must scan before receiving to attack the open side quickly.",
    exerciseBreakdownDesc: "Coach the first touch into space when the cue appears, supporting runs to the active side, and quick finishing with minimal touches.",
    image: "",
    exerciseType: "eyeq",
  },
  {
    id: "fallback-plastic-003",
    title: "003 Cone Change-of-Direction",
    ageGroup: "Foundation Phase (U7-U10)",
    decisionTheme: "General / Unspecified",
    playerInvolvement: "Individual",
    gameMoment: "Transition (Attack to Defend)",
    difficulty: "Basic",
    practiceFormat: "Warm-Up / Ball Mastery",
    overview: "Ball mastery pattern with reactive turns when the coach calls a colour.",
    description:
      "Set four coloured cones in a diamond. Player dribbles to the top, coach calls a colour, player turns sharply to that cone and accelerates away. Repeat for 45 seconds.",
    exerciseBreakdownDesc: "Emphasise close control, head-up scanning, and explosive change of direction immediately after the colour call.",
    image: "",
    exerciseType: "plastic",
  },
];

export const fallbackExercises: ValidatedExercise[] = validateExercises(rawFallbackExercises);
