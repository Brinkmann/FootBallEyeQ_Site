import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const EN_DASH = "–";
const HYPHEN = "-";

function replaceEnDash(value: string): string {
  return value.replace(new RegExp(EN_DASH, "g"), HYPHEN);
}

async function fixExercises() {
  const snap = await getDocs(collection(db, "exercises"));
  const fieldsToFix = ["ageGroup", "decisionTheme", "playerInvolvement", "gameMoment", "difficulty"];
  
  let totalUpdates = 0;
  let docsUpdated = 0;

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    const updates: Record<string, string | string[]> = {};
    let hasChanges = false;

    fieldsToFix.forEach((field) => {
      const value = data[field];
      if (typeof value === "string" && value.includes(EN_DASH)) {
        updates[field] = replaceEnDash(value);
        hasChanges = true;
        totalUpdates++;
      }
    });

    if (Array.isArray(data.tags)) {
      const newTags = data.tags.map((tag: string) => {
        if (typeof tag === "string" && tag.includes(EN_DASH)) {
          totalUpdates++;
          return replaceEnDash(tag);
        }
        return tag;
      });
      
      if (JSON.stringify(newTags) !== JSON.stringify(data.tags)) {
        updates.tags = newTags;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      console.log(`Updating ${docSnap.id}:`, Object.keys(updates).join(", "));
      await updateDoc(doc(db, "exercises", docSnap.id), updates);
      docsUpdated++;
    }
  }

  console.log(`\n=== Fix Complete ===`);
  console.log(`Documents updated: ${docsUpdated}`);
  console.log(`Total field updates: ${totalUpdates}`);
  
  process.exit(0);
}

fixExercises().catch((err) => {
  console.error("Error fixing exercises:", err);
  process.exit(1);
});
