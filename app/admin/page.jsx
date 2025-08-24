"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import { db } from "../../Firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// Normalising
const normalizeTag = (tag) =>
    tag.trim().toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

export default function AdminPage() {
  const [customId, setCustomId] = useState(""); // for Firestore doc ID
  const [title, setTitle] = useState("");
  const [ageGroup, setAgeGroup] = useState("U10");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [purpose, setPurpose] = useState("Passing");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customId) {
      alert("Please enter an ID for the exercise!");
      return;
    }

    const tagsArray = [ageGroup, difficulty, purpose].map(normalizeTag);

    try {
      const exerciseRef = doc(db, "exercises", customId);

      await setDoc(exerciseRef, {
        title,
        ageGroup,
        duration,
        difficulty,
        purpose,
        description,
        tags: tagsArray,
      });

      alert("Exercise added!");

      setCustomId("");
      setTitle("");
      setAgeGroup("U10");
      setDuration("");
      setDifficulty("Beginner");
      setPurpose("Passing");
      setDescription("");
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Add New Exercise</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Unique ID (e.g., 001)"
                    value={customId}
                    onChange={(e) => setCustomId(e.target.value)}
                    className="w-full border px-3 py-2"
                    required
                />
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border px-3 py-2"
                    required
                />
                <input
                    type="text"
                    placeholder="Duration (e.g., 10 mins)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full border px-3 py-2"
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border px-3 py-2"
                    required
                />
                <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full border px-3 py-2"
                >
                    <option value="U10">U10</option>
                    <option value="U12">U12</option>
                    <option value="U14">U14</option>
                </select>
                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full border px-3 py-2"
                >
                    <option value="Beginner">Beginner</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
                <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full border px-3 py-2"
                >
                    <option value="Passing">Passing</option>
                    <option value="Dribbling">Dribbling</option>
                    <option value="Shooting">Shooting</option>
                </select>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add Exercise
                </button>
            </form>
        </div>
    </div>
  );
}
