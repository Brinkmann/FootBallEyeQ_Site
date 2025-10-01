"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { db } from "../../Firebase/firebaseConfig";
import { doc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";

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
    const [overview, setOverview] = useState("");

    const descriptionTemplate = `    Overview
    -
    -

    Setup
    -
    -
    
    Description
    -
    -
    
    Coaching Points
    -
    -`;

    const [description, setDescription] = useState(descriptionTemplate);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

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
        setOverview("");
        setDescription(descriptionTemplate);
        setImageFile(null);
        setPreviewImage(null);
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
            let imageBase64 = null;

            if (imageFile && previewImage) {
                imageBase64 = previewImage;
            } else if (editingId && previewImage) {
                imageBase64 = previewImage; // Keep existing image if editing and no new image selected
            }

            const exerciseRef = doc(db, "exercises", exerciseId);

            await setDoc(
                exerciseRef, 
                {
                    title,
                    ageGroup,
                    duration,
                    difficulty,
                    purpose,
                    overview,
                    description,
                    tags: tagsArray,
                    image: imageBase64,
                },
                { merge: true }
            );

            alert(editingId ? "Exercise updated!" : "Exercise added!");

            resetForm();
            fetchExercises();
        } catch (error) {
            console.error("Error adding exercise:", error);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this exercise?"
        );
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
        setOverview(exercise.overview || "");
        setDescription(exercise.description);
        setImageFile(null); // Do not pre-fill image
        setPreviewImage(exercise.image || null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">
                    {editingId ? "Edit Exercise" : "Add New Exercise"}
                </h1>
                <div className="bg-white rounded shadow p-4">
                    {/* Exercise Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div >
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Unique ID
                            </label>
                            <input
                                type="text"
                                placeholder="E.g., 001"
                                value={customId}
                                onChange={(e) => setCustomId(e.target.value)}
                                className="w-full border px-3 py-2"
                                required
                                disabled={!!editingId}  // Disable ID field when editing
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border px-3 py-2"
                                placeholder="Enter exercise title"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration
                            </label>
                            <input
                                type="text"
                                placeholder="E.g., 10 mins"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full border px-3 py-2"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Blurb
                            </label>
                            <textarea
                                placeholder="A short summary of the exercise"
                                value={overview}
                                onChange={(e) => setOverview(e.target.value)}
                                className="w-full border px-3 py-2"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border px-3 py-2"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Age Group
                            </label>
                            <select
                                value={ageGroup}
                                onChange={(e) => setAgeGroup(e.target.value)}
                                className="w-full border px-3 py-2"
                            >
                                <option value="U10">U10</option>
                                <option value="U12">U12</option>
                                <option value="U14">U14</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Difficulty
                            </label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full border px-3 py-2"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Purpose
                            </label>
                            <select
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                className="w-full border px-3 py-2"
                            >
                                <option value="Passing">Passing</option>
                                <option value="Dribbling">Dribbling</option>
                                <option value="Shooting">Shooting</option>
                            </select>
                        </div>

                        {/* Image Upload */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                            <div className="flex items-center space-x-4">
                                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-blue-600 hover:bg-gray-100 transition">
                                    <svg
                                        className="h-5 w-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M4 12l4-4m0 0l4 4m-4-4v12"
                                        />
                                    </svg>
                                    Upload Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setImageFile(file);
                                                
                                                // Convert to base64 for preview
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setPreviewImage(reader.result);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        className="hidden"
                                    />
                                </label>
                                <span className="text-sm text-gray-600">
                                    {imageFile ? imageFile.name : "No file chosen"}
                                </span>
                            </div>

                            {previewImage && (
                                <div className="mt-4 relative inline-block">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="max-w-xs rounded border border-gray-300 shadow"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null);
                                            setPreviewImage(null);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition"
                                    >
                                        Remove
                                    </button>    
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4">
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
                        </div>
                    </form>
                </div>

                
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
                                        <p className="text-sm text-gray-600">{exercise.overview}</p>
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
