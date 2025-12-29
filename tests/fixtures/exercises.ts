export const exerciseFixtures = [
  {
    id: "ex1",
    title: "001 - Rondo Awareness",
    ageGroup: "Youth Development Phase (U11-U14)",
    decisionTheme: "Pass or Dribble",
    playerInvolvement: "Small Group (3-4 players)",
    gameMoment: "Build-Up",
    difficulty: "Moderate",
    practiceFormat: "Rondo / Tight Possession",
    overview: "Scanning rondo with directional triggers.",
    description: "Players scan for pressure cues before playing out of the grid.",
    exerciseBreakdownDesc: "Coach flashes cone colors to trigger switches.",
    image: null,
    exerciseType: "eyeq"
  },
  {
    id: "ex2",
    title: "014 - Counter-Press Sprint",
    ageGroup: "Performance Phase (U19-Senior)",
    decisionTheme: "Attack or Hold",
    playerInvolvement: "Team Unit (5+ players)",
    gameMoment: "Counter Attack",
    difficulty: "Advanced",
    practiceFormat: "Directional Small-Sided Game",
    overview: "Sprint to counter-press within three seconds of loss.",
    description: "Trigger run patterns off colored cone cues to collapse space.",
    exerciseBreakdownDesc: "Lanes unlock based on cone flashes.",
    image: null,
    exerciseType: "eyeq"
  },
  {
    id: "ex3",
    title: "102 - First-Touch Finishing",
    ageGroup: "Game Training Phase (U15-U18)",
    decisionTheme: "Shoot or Pass",
    playerInvolvement: "1v1 / 2v2",
    gameMoment: "Final Third Decision",
    difficulty: "Basic",
    practiceFormat: "Finishing / Shooting Pattern",
    overview: "First-touch decisions on bounce passes.",
    description: "Coach sets color cue to choose near-post or cut-back run.",
    exerciseBreakdownDesc: "Progress to weak-foot finishes.",
    image: null,
    exerciseType: "plastic"
  }
];

export const firestoreRunQueryResponse = (collection: string) => {
  if (collection === "exercises") {
    return exerciseFixtures.map((exercise) => ({
      document: {
        name: `projects/demo/databases/(default)/documents/exercises/${exercise.id}`,
        fields: Object.fromEntries(
          Object.entries(exercise).map(([key, value]) => [
            key,
            typeof value === "string"
              ? { stringValue: value }
              : value === null
              ? { nullValue: null }
              : { stringValue: String(value) },
          ])
        ),
      },
    }));
  }

  // Empty collection response for reviews/favorites/etc.
  return [];
};
