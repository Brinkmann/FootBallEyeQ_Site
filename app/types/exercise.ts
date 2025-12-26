// types/exercise.ts
export type ExerciseType = 'eyeq' | 'plastic';

export interface Exercise {
  id: string;
  title: string;
  ageGroup: string;
  decisionTheme: string;
  playerInvolvement: string;
  gameMoment: string;
  difficulty: string;
  practiceFormat: string;
  overview: string;
  description: string;
  exerciseBreakdownDesc?: string;
  image: string;
  exerciseType: ExerciseType;
}
