"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { db } from "../../Firebase/firebaseConfig";
import { doc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { type } from "os";

// Normalising
const normalizeTag = (tag) =>
    tag.trim().toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

export default function AdminPage() {
    // Form fields
    const [customId, setCustomId] = useState(""); // for Firestore doc ID
    const [title, setTitle] = useState("");
    const [ageGroup, setAgeGroup] = useState("U10");
    const [duration, setDuration] = useState("");
    const [difficulty, setDifficulty] = useState("Beginner");
    const [purpose, setPurpose] = useState("Passing");
    const [description, setDescription] = useState("");

    // Exercise list
    const [exercises, setExercises] = useState([]);

    // For edit tracking
    const [editingId, setEditingId] = useState(null);

    // Fetch exercises on mount
    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            const snapshot = await getDocs(collection(db, "exercises"));
            const exercisesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setExercises(exercisesData);
        } catch (error) {
            console.error("Error fetching exercises:", error);
        }
    };

    const resetForm = () => {
        setCustomId("");
        setTitle("");
        setAgeGroup("U10");
        setDuration("");
        setDifficulty("Beginner");
        setPurpose("Passing");
        setDescription("");
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const exerciseId = (editingId || customId)?.trim();

        if (!exerciseId || typeof exerciseId !== "string") {
            alert("Please enter an ID!");
            return;
        }

        const tagsArray = [ageGroup, difficulty, purpose].map(normalizeTag);

        try {
            const exerciseRef = doc(db, "exercises", exerciseId);

            await setDoc(exerciseRef, {
                title,
                ageGroup,
                duration,
                difficulty,
                purpose,
                description,
                tags: tagsArray,
            });

            alert(editingId ? "Exercise updated!" : "Exercise added!");

            resetForm();
            fetchExercises();
        } catch (error) {
            console.error("Error adding exercise:", error);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this exercise?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, "exercises", id));
            setExercises((prev) => prev.filter((ex) => ex.id !== id));
            if (editingId === id) resetForm();
        } catch (error) {
            console.error("Error deleting exercise:", error);
        }
    };

    const startEditing = (exercise) => {
        setEditingId(exercise.id);
        setCustomId(exercise.id);
        setTitle(exercise.title);
        setAgeGroup(exercise.ageGroup);
        setDuration(exercise.duration);
        setDifficulty(exercise.difficulty);
        setPurpose(exercise.purpose);
        setDescription(exercise.description);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">
                    {editingId ? "Edit Exercise" : "Add New Exercise"}
                </h1>

                {/* Exercise Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Unique ID (e.g., 001)"
                        value={customId}
                        onChange={(e) => setCustomId(e.target.value)}
                        required
                        disabled={!!editingId}  // Disable ID field when editing
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
                        {editingId ? "Update Exercise" : "Add Exercise"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-gray-400 text-white px-4 py-2 rounded"
                        >
                            Cancel Edit
                        </button>
                    )}
                </form>

                {/* Exercise List */}
                <div className="mt-10">
                    <h2 className="text-xl font-bold mb-2">Existing Exercises</h2>
                    {exercises.length === 0 ? (
                        <p>No exercises found.</p>
                    ) : (
                        <ul className="space-y-4">
                            {exercises.map((exercise) => (
                                <li
                                    key={exercise.id}
                                    className="p-4 bg-white rounded shadow flex justify-between items-start"
                                >
                                    <div>
                                        <p className="font-semibold">{exercise.title}</p>
                                        <p className="text-sm text-gray-600">{exercise.description}</p>
                                        <div className="text-xs mt-1 text-gray-500">
                                            {exercise.ageGroup}, {exercise.difficulty}, {exercise.purpose}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => startEditing(exercise)}
                                            className="text-blue-600 underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exercise.id)}
                                            className="text-red-600 underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
