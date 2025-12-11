import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";

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

async function scanExercises() {
  const snap = await getDocs(collection(db, "exercises"));
  const issues: { docId: string; field: string; value: string }[] = [];

  snap.docs.forEach((doc) => {
    const data = doc.data();
    const fieldsToCheck = ["ageGroup", "decisionTheme", "playerInvolvement", "gameMoment", "difficulty"];
    
    fieldsToCheck.forEach((field) => {
      const value = data[field];
      if (typeof value === "string" && value.includes(EN_DASH)) {
        issues.push({ docId: doc.id, field, value });
      }
    });

    if (Array.isArray(data.tags)) {
      data.tags.forEach((tag: string, idx: number) => {
        if (typeof tag === "string" && tag.includes(EN_DASH)) {
          issues.push({ docId: doc.id, field: `tags[${idx}]`, value: tag });
        }
      });
    }
  });

  console.log(`\n=== En-dash (–) Scan Results ===\n`);
  console.log(`Total exercises scanned: ${snap.docs.length}`);
  console.log(`Issues found: ${issues.length}\n`);

  if (issues.length > 0) {
    console.log("Documents with en-dash characters:\n");
    issues.forEach(({ docId, field, value }) => {
      console.log(`  Doc: ${docId}`);
      console.log(`  Field: ${field}`);
      console.log(`  Value: "${value}"`);
      console.log(`  Fixed: "${value.replace(new RegExp(EN_DASH, "g"), HYPHEN)}"`);
      console.log("");
    });
  } else {
    console.log("No en-dash characters found in filter fields.");
  }

  process.exit(0);
}

scanExercises().catch((err) => {
  console.error("Error scanning exercises:", err);
  process.exit(1);
});
