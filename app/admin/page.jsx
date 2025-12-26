"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { db } from "../../Firebase/firebaseConfig";
import { doc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";

// Normalising
const normalizeTag = (tag) => {
    if (!tag || typeof tag !== "string") return "General / Unspecified";
    if (tag === "General / Unspecified") return tag;
    return tag.trim().toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

export default function AdminPage() {
    // Form fields
    const [customId, setCustomId] = useState(""); // for Firestore doc ID
    const [title, setTitle] = useState("");
    const [ageGroup, setAgeGroup] = useState("General / Unspecified");
    const [decisionTheme, setDecisionTheme] = useState("General / Unspecified");
    const [playerInvolvement, setPlayerInvolvement] = useState("General / Unspecified");
    const [gameMoment, setGameMoment] = useState("General / Unspecified");
    const [difficulty, setDifficulty] = useState("General / Unspecified");
    const [practiceFormat, setPracticeFormat] = useState("General / Mixed");
    const [overview, setOverview] = useState("");
    const [exerciseBreakdownDesc, setExerciseBreakdownDesc] = useState("");

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
        setAgeGroup("General / Unspecified");
        setDecisionTheme("General / Unspecified");
        setPlayerInvolvement("General / Unspecified");
        setGameMoment("General / Unspecified");
        setDifficulty("General / Unspecified");
        setPracticeFormat("General / Mixed");
        setOverview("");
        setExerciseBreakdownDesc("");
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
                    decisionTheme,
                    playerInvolvement,
                    gameMoment,
                    difficulty,
                    practiceFormat,
                    overview,
                    description,
                    exerciseBreakdownDesc,
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
        setAgeGroup(exercise.ageGroup || "General / Unspecified");
        setDecisionTheme(exercise.decisionTheme || "General / Unspecified");
        setPlayerInvolvement(exercise.playerInvolvement || "General / Unspecified");
        setGameMoment(exercise.gameMoment || "General / Unspecified");
        setDifficulty(exercise.difficulty || "General / Unspecified");
        setPracticeFormat(exercise.practiceFormat || "General / Mixed");
        setOverview(exercise.overview || "");
        setExerciseBreakdownDesc(exercise.exerciseBreakdownDesc || "");
        setDescription(exercise.description);
        setImageFile(null); // Do not pre-fill image
        setPreviewImage(exercise.image || null);
    };

    const ageGroups = [
        "General / Unspecified",
        "Foundation Phase (U7-U10)",
        "Youth Development Phase (U11-U14)",
        "Game Training Phase (U15-U18)",
        "Performance Phase (U19-Senior)"
    ];

    const decisionThemes = [
        "General / Unspecified",
        "Pass or Dribble",
        "Attack or Hold",
        "Shoot or Pass"
    ];

    const playerInvolvements = [
        "General / Unspecified",
        "Individual",
        "1v1 / 2v2",
        "Small Group (3-4 players)",
        "Team Unit (5+ players)"
    ];

    const gameMoments = [
        "General / Unspecified",
        "Build-Up",
        "Final Third Decision",
        "Defensive Shape",
        "Counter Attack",
        "Transition (Attack to Defend)",
        "Switch of Play"
    ];

    const difficulties = [
        "General / Unspecified",
        "Basic",
        "Moderate",
        "Advanced",
        "Elite"
    ];

    const practiceFormats = [
        "General / Mixed",
        "Warm-Up / Ball Mastery",
        "Fun Game / Physical",
        "Finishing / Shooting Pattern",
        "Positional Possession Game",
        "Rondo / Tight Possession",
        "Directional Small-Sided Game"
    ];

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
                                Stats Page Summary
                            </label>
                            <textarea
                                placeholder="One-line summary for the stats page breakdown (e.g., 'A passing drill in a square with color cue scanning.')"
                                value={exerciseBreakdownDesc}
                                onChange={(e) => setExerciseBreakdownDesc(e.target.value)}
                                className="w-full border px-3 py-2"
                                rows={2}
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
                                {ageGroups.map((g) => (
                                    <option key={`age-${g}`} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Decision Theme
                            </label>
                            <select
                                value={decisionTheme}
                                onChange={(e) => setDecisionTheme(e.target.value)}
                                className="w-full border px-3 py-2"
                            >
                                {decisionThemes.map((d) => (
                                    <option key={`decision-${d}`} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Player Involvement
                            </label>
                            <select
                                value={playerInvolvement}
                                onChange={(e) => setPlayerInvolvement(e.target.value)}
                                className="w-full border px-3 py-2"
                            >
                                {playerInvolvements.map((p) => (
                                    <option key={`player-${p}`} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Game Moment Simulated
                            </label>
                            <select
                                value={gameMoment}
                                onChange={(e) => setGameMoment(e.target.value)}
                                className="w-full border px-3 py-2"
                            >
                                {gameMoments.map((gm) => (
                                    <option key={`moment-${gm}`} value={gm}>{gm}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Difficulty Level
                            </label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full border px-3 py-2"
                            >
                                {difficulties.map((d) => (
                                    <option key={`difficulty-${d}`} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Practice Format
                            </label>
                            <select
                                value={practiceFormat}
                                onChange={(e) => setPracticeFormat(e.target.value)}
                                className="w-full border px-3 py-2"
                            >
                                {practiceFormats.map((pf) => (
                                    <option key={`format-${pf}`} value={pf}>{pf}</option>
                                ))}
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
                                            {exercise.ageGroup}, {exercise.decisionTheme}, {exercise.playerInvolvement}, {exercise.gameMoment}, {exercise.difficulty}
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
