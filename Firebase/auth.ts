// /firebase/auth.ts
import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential } from "firebase/auth";

async function createServerSession(user: UserCredential["user"]): Promise<void> {
  try {
    const idToken = await user.getIdToken();
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      console.warn("Failed to create server session:", await response.text());
    }
  } catch (error) {
    console.warn("Error creating server session:", error);
  }
}

async function clearServerSession(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch (error) {
    console.warn("Error clearing server session:", error);
  }
}

// Register new user
export const register = async (email: string, password: string): Promise<UserCredential> => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await createServerSession(credential.user);
  return credential;
};

// Login existing user
export const login = async (email: string, password: string): Promise<UserCredential> => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await createServerSession(credential.user);
  return credential;
};

// Logout
export const logout = async (): Promise<void> => {
  await clearServerSession();
  return await signOut(auth);
};

// Helper to sync session when auth state changes (for page refresh scenarios)
export const syncServerSession = async (): Promise<void> => {
  const user = auth.currentUser;
  if (user) {
    await createServerSession(user);
  }
};
