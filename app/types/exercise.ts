// types/exercise.ts
export interface Exercise {
  id: string;         // I'd recommend keeping id as string to match Firestore
  title: string;
  ageGroup: string;
  duration: string;
  difficulty: string;
  description: string;
  tags: string[];
}
