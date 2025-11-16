'use client';

import { useEffect, useState, FormEvent } from "react";
import { auth, db } from "@/Firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
  Timestamp,
  FieldValue 
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

interface UserData {
  fname: string;
  lname: string;
  organization: string;
  email: string;
  createdAt?: Timestamp | FieldValue;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User & { docId?: string } | null>(null);
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [organization, setOrganization] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserDataByEmail(currentUser);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch user data by email
  const fetchUserDataByEmail = async (currentUser: User) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "signups"),
        where("email", "==", currentUser.email)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const data = userDoc.data() as UserData;

        setFname(data.fname || "");
        setLname(data.lname || "");
        setOrganization(data.organization || "");
        setEmail(data.email || currentUser.email || "");
        setCreatedAt(
  data.createdAt && "toDate" in data.createdAt
    ? data.createdAt.toDate()
    : new Date()
);

        // Save Firestore doc ID for updates
        setUser((prev) => (prev ? { ...prev, docId: userDoc.id } : null));
      } else {
        console.warn("No Firestore document found for this email!");
        // Optional: create a new document if none exists
        const newUserRef = doc(collection(db, "signups"));
        const newUserData: UserData = {
          fname: "",
          lname: "",
          organization: "",
          email: currentUser.email || "",
          createdAt: serverTimestamp(),
        };
        await setDoc(newUserRef, newUserData);

        setFname(newUserData.fname);
        setLname(newUserData.lname);
        setOrganization(newUserData.organization);
        setEmail(newUserData.email);
        setCreatedAt(new Date());

        setUser((prev) => (prev ? { ...prev, docId: newUserRef.id } : null));
        console.log("Created new Firestore document for this user.");
      }
    } catch (err) {
      console.error("Error fetching user document:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile update
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.docId) return;

    setMessage("Updating...");
    try {
      const userRef = doc(db, "signups", user.docId);
      const updatedData: Partial<UserData> = { fname, lname, organization };

      await setDoc(userRef, updatedData, { merge: true });
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("Error updating profile.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-background">
      <h1 className="text-3xl text-primary font-bold mb-6">My Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-card p-8 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4 border border-divider"
      >
        <input
          type="text"
          placeholder="First Name"
          value={fname}
          readOnly
          className="p-3 rounded-lg border border-divider bg-background text-primary"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lname}
          readOnly
          className="p-3 rounded-lg border border-divider bg-background text-primary"
        />
        <input
          type="text"
          placeholder="Organization"
          value={organization}
          readOnly
          className="p-3 rounded-lg border border-divider bg-background text-primary"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          readOnly
          className="p-3 rounded-lg border border-divider bg-background text-gray-500"
        />
        <input
          type="text"
          placeholder="Account Created"
          value={createdAt ? createdAt.toLocaleString() : ""}
          readOnly
          className="p-3 rounded-lg border border-divider bg-background text-gray-500"
        />

        <button
          type="submit"
          className="mt-2 bg-primary hover:bg-primary-hover text-button font-semibold py-2 rounded-lg transition"
        >
          Save Changes
        </button>

        {message && <p className="text-center text-foreground">{message}</p>}
      </form>
    </div>
  );
}