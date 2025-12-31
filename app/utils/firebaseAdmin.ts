import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

let app: App | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

function getAdminApp(): App {
  if (app) return app;

  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
    return app;
  }

  const fromBundledJson = (() => {
    const jsonString = process.env.FIREBASE_SERVICE_ACCOUNT ?? process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (!jsonString) return null;

    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.project_id || !parsed.client_email || !parsed.private_key) return null;
      return {
        projectId: parsed.project_id as string,
        clientEmail: parsed.client_email as string,
        privateKey: parsed.private_key as string,
      };
    } catch (error) {
      console.warn("Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:", error);
      return null;
    }
  })();

  const fromBase64 = (() => {
    const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    if (!base64) return null;
    try {
      const decoded = Buffer.from(base64, "base64").toString("utf8");
      const parsed = JSON.parse(decoded);
      if (!parsed.project_id || !parsed.client_email || !parsed.private_key) return null;
      return {
        projectId: parsed.project_id as string,
        clientEmail: parsed.client_email as string,
        privateKey: parsed.private_key as string,
      };
    } catch (error) {
      console.warn("Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64:", error);
      return null;
    }
  })();

  const projectId = process.env.FIREBASE_PROJECT_ID ?? fromBundledJson?.projectId ?? fromBase64?.projectId;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL ?? fromBundledJson?.clientEmail ?? fromBase64?.clientEmail;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY ?? fromBundledJson?.privateKey ?? fromBase64?.privateKey;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Provide FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY or FIREBASE_SERVICE_ACCOUNT JSON."
    );
  }

  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }

  privateKey = privateKey
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "")
    .replace(/\r/g, "");

  if (!privateKey.includes("-----BEGIN")) {
    try {
      const parsed = JSON.parse(`"${privateKey}"`);
      privateKey = parsed;
    } catch {
      // leave as-is if it isn't JSON encoded
    }
  }

  app = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return app;
}

export function getAdminDb(): Firestore {
  if (db) return db;
  getAdminApp();
  db = getFirestore();
  return db;
}

export function getAdminAuth(): Auth {
  if (auth) return auth;
  getAdminApp();
  auth = getAuth();
  return auth;
}
