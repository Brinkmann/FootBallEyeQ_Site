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
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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
  const fetchUserDataByEmail = async (currentUser: any) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "signups"),
        where("email", "==", currentUser.email)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Use the first matching document
        const userDoc = querySnapshot.docs[0];
        const data = userDoc.data();

        setFname(data.fname || "");
        setLname(data.lname || "");
        setOrganization(data.organization || "");
        setEmail(data.email || currentUser.email || "");
        setCreatedAt(
          data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : new Date()
        );

        // Optional: save docRef for updates
        setUser((prev: any) => ({ ...prev, docId: userDoc.id }));
      } else {
        console.warn("No Firestore document found for this email!");
        // Optionally, create a new document if you want
        const newUserRef = doc(collection(db, "signups"));
        const newUserData = {
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

        setUser((prev: any) => ({ ...prev, docId: newUserRef.id }));
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
      const updatedData: any = { fname, lname, organization };

      await setDoc(userRef, updatedData, { merge: true });
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("Error updating profile.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-3xl text-blue-500 font-bold mb-6">My Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="First Name"
          value={fname}
          readOnly
          className="p-3 rounded-lg border border-gray-300 bg-gray-100 text-blue-500"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lname}
          readOnly
          className="p-3 rounded-lg border border-gray-300 bg-gray-100 text-blue-500"
        />
        <input
          type="text"
          placeholder="Organization"
          value={organization}
          readOnly
          className="p-3 rounded-lg border border-gray-300 bg-gray-100 text-blue-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          readOnly
          className="p-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-600"
        />
        <input
          type="text"
          placeholder="Account Created"
          value={createdAt ? createdAt.toLocaleString() : ""}
          readOnly
          className="p-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-600"
        />

        <button
          type="submit"
          className="mt-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition"
        >
          Save Changes
        </button>

        {message && <p className="text-center text-gray-700">{message}</p>}
      </form>
    </div>
  );
}
