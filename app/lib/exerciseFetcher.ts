import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { initializeApp, getApps as getClientApps } from "firebase/app";
import { getAdminDb } from "@/app/utils/firebaseAdmin";
import { parseExerciseFromFirestore, ValidatedExercise } from "@/app/lib/schemas";

function normalizeExerciseType(exerciseType: string | null): "eyeq" | "plastic" | null {
  if (!exerciseType) return null;
  const normalized = exerciseType.trim().toLowerCase();
  return normalized === "plastic" ? "plastic" : normalized === "eyeq" ? "eyeq" : null;
}

function sortExercises(exercises: ValidatedExercise[]): ValidatedExercise[] {
  return exercises.sort((a, b) => {
    const numA = a.title.match(/^(\d+)/);
    const numB = b.title.match(/^(\d+)/);
    return (numA ? parseInt(numA[1], 10) : 9999) - (numB ? parseInt(numB[1], 10) : 9999);
  });
}

async function fetchWithAdmin(exerciseType: string | null): Promise<ValidatedExercise[]> {
  const db = getAdminDb();
  const normalizedType = normalizeExerciseType(exerciseType);
  let collectionRef = db.collection("exercises");

  if (normalizedType) {
    collectionRef = collectionRef.where("exerciseType", "==", normalizedType) as typeof collectionRef;
  }

  const snapshot = await collectionRef.get();

  const exercises: ValidatedExercise[] = snapshot.docs
    .map((doc) => parseExerciseFromFirestore(doc.id, doc.data() as Record<string, unknown>))
    .filter((ex): ex is ValidatedExercise => ex !== null);

  return sortExercises(exercises);
}

function getClientDb() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error("Missing client Firebase config for fallback fetch");
  }

  if (getClientApps().length === 0) {
    initializeApp(firebaseConfig);
  }

  return getFirestore();
}

async function fetchWithClient(exerciseType: string | null): Promise<ValidatedExercise[]> {
  const db = getClientDb();
  const normalizedType = normalizeExerciseType(exerciseType);

  const baseCollection = collection(db, "exercises");
  const q = normalizedType ? query(baseCollection, where("exerciseType", "==", normalizedType)) : baseCollection;

  const snapshot = await getDocs(q);

  const exercises: ValidatedExercise[] = snapshot.docs
    .map((doc) => parseExerciseFromFirestore(doc.id, doc.data() as Record<string, unknown>))
    .filter((ex): ex is ValidatedExercise => ex !== null);

  return sortExercises(exercises);
}

export async function fetchExercisesFromSources(exerciseType: string | null): Promise<ValidatedExercise[]> {
  try {
    return await fetchWithAdmin(exerciseType);
  } catch (adminError) {
    console.warn("Admin fetch failed, attempting client fallback:", adminError);
  }

  return fetchWithClient(exerciseType);
}
