import eyeqFallback from "./eyeqFallback.json";
import { validateExercises, type ValidatedExercise } from "./schemas";

const plasticFallbackExercises = [
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

const rawFallbackExercises = [...eyeqFallback, ...plasticFallbackExercises];

export const fallbackExercises: ValidatedExercise[] = validateExercises(rawFallbackExercises as unknown[]);
