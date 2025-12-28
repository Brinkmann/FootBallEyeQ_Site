"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/Firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import Link from "next/link";

const SUPER_ADMIN_EMAIL = "obrinkmann@gmail.com";

const normalizeTag = (tag: string) => {
  if (!tag || typeof tag !== "string") return "General / Unspecified";
  if (tag === "General / Unspecified") return tag;
  return tag.trim().toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
};

interface ExerciseData {
  id: string;
  title: string;
  ageGroup?: string;
  decisionTheme?: string;
  playerInvolvement?: string;
  gameMoment?: string;
  duration?: string;
  difficulty?: string;
  overview?: string;
  description?: string;
  image?: string;
}

interface ClubData {
  id: string;
  name: string;
  contactEmail: string;
  status?: string;
  suspendedAt?: Date;
  memberCount?: number;
}

interface CoachData {
  id: string;
  email: string;
  fname: string;
  lname: string;
  accountType: string;
  clubId?: string;
  clubName?: string;
  accountStatus?: string;
  suspendedAt?: Date;
}

type TabType = "exercises" | "clubs" | "coaches";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("exercises");
  
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const [coaches, setCoaches] = useState<CoachData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [customId, setCustomId] = useState("");
  const [title, setTitle] = useState("");
  const [ageGroup, setAgeGroup] = useState("General / Unspecified");
  const [decisionTheme, setDecisionTheme] = useState("General / Unspecified");
  const [playerInvolvement, setPlayerInvolvement] = useState("General / Unspecified");
  const [gameMoment, setGameMoment] = useState("General / Unspecified");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("General / Unspecified");
  const [overview, setOverview] = useState("");
  const [description, setDescription] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [confirmAction, setConfirmAction] = useState<{
    type: "suspend" | "delete" | "unsuspend";
    target: "club" | "coach";
    id: string;
    name: string;
  } | null>(null);
  const [reason, setReason] = useState("");

  const descriptionTemplate = `Overview
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

  const ageGroups = [
    "General / Unspecified",
    "Foundation Phase (U7-U10)",
    "Youth Development Phase (U11-U14)",
    "Game Training Phase (U15-U18)",
    "Performance Phase (U19-Senior)",
  ];

  const decisionThemes = [
    "General / Unspecified",
    "Pass or Dribble",
    "Attack or Hold",
    "Shoot or Pass",
  ];

  const playerInvolvements = [
    "General / Unspecified",
    "Individual",
    "1v1 / 2v2",
    "Small Group (3-4 players)",
    "Team Unit (5+ players)",
  ];

  const gameMoments = [
    "General / Unspecified",
    "Build-Up",
    "Final Third Decision",
    "Defensive Shape",
    "Counter Attack",
    "Transition (Attack to Defend)",
    "Switch of Play",
  ];

  const difficulties = [
    "General / Unspecified",
    "Basic",
    "Moderate",
    "Advanced",
    "Elite",
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email === SUPER_ADMIN_EMAIL) {
        setAuthorized(true);
        fetchAllData();
      } else {
        setAuthorized(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const exercisesSnap = await getDocs(collection(db, "exercises"));
      setExercises(
        exercisesSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as ExerciseData[]
      );

      const clubsSnap = await getDocs(collection(db, "clubs"));
      const clubsData: ClubData[] = [];
      for (const clubDoc of clubsSnap.docs) {
        const data = clubDoc.data();
        const membersSnap = await getDocs(
          collection(db, `clubs/${clubDoc.id}/members`)
        );
        clubsData.push({
          id: clubDoc.id,
          name: data.name,
          contactEmail: data.contactEmail,
          status: data.status || "active",
          suspendedAt: data.suspendedAt?.toDate(),
          memberCount: membersSnap.size,
        });
      }
      setClubs(clubsData);

      const coachesSnap = await getDocs(collection(db, "signups"));
      const clubMap = new Map(clubsData.map((c) => [c.id, c.name]));
      setCoaches(
        coachesSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            email: data.email,
            fname: data.fname || "",
            lname: data.lname || "",
            accountType: data.accountType || "free",
            clubId: data.clubId,
            clubName: data.clubId ? clubMap.get(data.clubId) : undefined,
            accountStatus: data.accountStatus || "active",
            suspendedAt: data.suspendedAt?.toDate(),
          };
        })
      );
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
    setLoading(false);
  };

  const scrollToExerciseForm = () => {
    document.getElementById("exercise-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetExerciseForm = () => {
    setCustomId("");
    setTitle("");
    setAgeGroup("General / Unspecified");
    setDecisionTheme("General / Unspecified");
    setPlayerInvolvement("General / Unspecified");
    setGameMoment("General / Unspecified");
    setDuration("");
    setDifficulty("General / Unspecified");
    setOverview("");
    setDescription(descriptionTemplate);
    setPreviewImage(null);
    setEditingId(null);
  };

  const handleExerciseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const exerciseId = (editingId || customId)?.trim();
    if (!exerciseId) {
      alert("Please enter an ID!");
      return;
    }

    const tagsArray = [ageGroup, decisionTheme, playerInvolvement, gameMoment, difficulty]
      .filter(Boolean)
      .map(normalizeTag);

    try {
      const exerciseRef = doc(db, "exercises", exerciseId);
      await setDoc(
        exerciseRef,
        {
          title,
          ageGroup,
          decisionTheme,
          playerInvolvement,
          gameMoment,
          duration,
          difficulty,
          overview,
          description,
          tags: tagsArray,
          image: previewImage,
        },
        { merge: true }
      );
      alert(editingId ? "Exercise updated!" : "Exercise added!");
      resetExerciseForm();
      fetchAllData();
    } catch (error) {
      console.error("Error saving exercise:", error);
    }
  };

  const handleExerciseDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this exercise?")) return;
    try {
      await deleteDoc(doc(db, "exercises", id));
      setExercises((prev) => prev.filter((ex) => ex.id !== id));
      if (editingId === id) resetExerciseForm();
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  };

  const startEditingExercise = (exercise: ExerciseData) => {
    setEditingId(exercise.id);
    setCustomId(exercise.id);
    setTitle(exercise.title);
    setAgeGroup(exercise.ageGroup || "General / Unspecified");
    setDecisionTheme(exercise.decisionTheme || "General / Unspecified");
    setPlayerInvolvement(exercise.playerInvolvement || "General / Unspecified");
    setGameMoment(exercise.gameMoment || "General / Unspecified");
    setDuration(exercise.duration || "");
    setDifficulty(exercise.difficulty || "General / Unspecified");
    setOverview(exercise.overview || "");
    setDescription(exercise.description || "");
    setPreviewImage(exercise.image || null);
  };

  const suspendClub = async (clubId: string) => {
    setActionLoading(clubId);
    try {
      const batch = writeBatch(db);
      batch.update(doc(db, "clubs", clubId), {
        status: "suspended",
        suspendedAt: serverTimestamp(),
        suspendedReason: reason,
      });

      const membersSnap = await getDocs(collection(db, `clubs/${clubId}/members`));
      for (const memberDoc of membersSnap.docs) {
        const memberData = memberDoc.data();
        const coachQuery = query(
          collection(db, "signups"),
          where("uid", "==", memberData.coachUid || memberData.userId)
        );
        const coachSnap = await getDocs(coachQuery);
        for (const coachDoc of coachSnap.docs) {
          batch.update(coachDoc.ref, {
            accountStatus: "suspended",
            suspendedAt: serverTimestamp(),
            suspendedReason: `Club suspended: ${reason}`,
          });
        }
      }

      await batch.commit();
      setConfirmAction(null);
      setReason("");
      await fetchAllData();
    } catch (err) {
      console.error("Failed to suspend club:", err);
    }
    setActionLoading(null);
  };

  const unsuspendClub = async (clubId: string) => {
    setActionLoading(clubId);
    try {
      const batch = writeBatch(db);
      batch.update(doc(db, "clubs", clubId), {
        status: "active",
        suspendedAt: null,
        suspendedReason: null,
      });

      const membersSnap = await getDocs(collection(db, `clubs/${clubId}/members`));
      for (const memberDoc of membersSnap.docs) {
        const memberData = memberDoc.data();
        const coachQuery = query(
          collection(db, "signups"),
          where("uid", "==", memberData.coachUid || memberData.userId)
        );
        const coachSnap = await getDocs(coachQuery);
        for (const coachDoc of coachSnap.docs) {
          batch.update(coachDoc.ref, {
            accountStatus: "active",
            suspendedAt: null,
            suspendedReason: null,
          });
        }
      }

      await batch.commit();
      setConfirmAction(null);
      await fetchAllData();
    } catch (err) {
      console.error("Failed to unsuspend club:", err);
    }
    setActionLoading(null);
  };

  const deleteClub = async (clubId: string) => {
    setActionLoading(clubId);
    try {
      const membersSnap = await getDocs(collection(db, `clubs/${clubId}/members`));
      for (const memberDoc of membersSnap.docs) {
        const memberData = memberDoc.data();
        const coachQuery = query(
          collection(db, "signups"),
          where("uid", "==", memberData.coachUid || memberData.userId)
        );
        const coachSnap = await getDocs(coachQuery);
        for (const coachDoc of coachSnap.docs) {
          await updateDoc(coachDoc.ref, {
            accountType: "free",
            clubId: null,
            clubRole: null,
          });
        }
        await deleteDoc(memberDoc.ref);
      }

      const invitesQuery = query(collection(db, "clubInvites"), where("clubId", "==", clubId));
      const invitesSnap = await getDocs(invitesQuery);
      for (const inviteDoc of invitesSnap.docs) {
        await deleteDoc(inviteDoc.ref);
      }

      await deleteDoc(doc(db, "clubs", clubId));
      setConfirmAction(null);
      setReason("");
      await fetchAllData();
    } catch (err) {
      console.error("Failed to delete club:", err);
    }
    setActionLoading(null);
  };

  const suspendCoach = async (coachDocId: string) => {
    setActionLoading(coachDocId);
    try {
      await updateDoc(doc(db, "signups", coachDocId), {
        accountStatus: "suspended",
        suspendedAt: serverTimestamp(),
        suspendedReason: reason,
      });
      setConfirmAction(null);
      setReason("");
      await fetchAllData();
    } catch (err) {
      console.error("Failed to suspend coach:", err);
    }
    setActionLoading(null);
  };

  const unsuspendCoach = async (coachDocId: string) => {
    setActionLoading(coachDocId);
    try {
      await updateDoc(doc(db, "signups", coachDocId), {
        accountStatus: "active",
        suspendedAt: null,
        suspendedReason: null,
      });
      setConfirmAction(null);
      await fetchAllData();
    } catch (err) {
      console.error("Failed to unsuspend coach:", err);
    }
    setActionLoading(null);
  };

  const deleteCoach = async (coachDocId: string) => {
    setActionLoading(coachDocId);
    try {
      await deleteDoc(doc(db, "signups", coachDocId));
      setConfirmAction(null);
      setReason("");
      await fetchAllData();
    } catch (err) {
      console.error("Failed to delete coach:", err);
    }
    setActionLoading(null);
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;
    const { type, target, id } = confirmAction;
    if (target === "club") {
      if (type === "suspend") suspendClub(id);
      else if (type === "unsuspend") unsuspendClub(id);
      else if (type === "delete") deleteClub(id);
    } else {
      if (type === "suspend") suspendCoach(id);
      else if (type === "unsuspend") unsuspendCoach(id);
      else if (type === "delete") deleteCoach(id);
    }
  };

  if (authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You do not have permission to view this page.</p>
          <Link href="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Platform Administration</h1>
            <p className="text-gray-400 text-sm">Manage exercises, clubs, and coaches</p>
          </div>
          <Link href="/" className="text-gray-400 hover:text-white text-sm">
            Back to Site
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => setActiveTab("exercises")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "exercises"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 border hover:bg-gray-50"
            }`}
          >
            Exercises ({exercises.length})
          </button>
          <button
            onClick={() => setActiveTab("clubs")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "clubs"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 border hover:bg-gray-50"
            }`}
          >
            Clubs ({clubs.length})
          </button>
          <button
            onClick={() => setActiveTab("coaches")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "coaches"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 border hover:bg-gray-50"
            }`}
          >
            Coaches ({coaches.length})
          </button>
          <button
            onClick={fetchAllData}
            className="ml-auto px-4 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : activeTab === "exercises" ? (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4">
                {editingId ? "Edit Exercise" : "Add New Exercise"}
              </h2>
              <form id="exercise-form" onSubmit={handleExerciseSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unique ID
                    </label>
                    <input
                      type="text"
                      placeholder="E.g., 001"
                      value={customId}
                      onChange={(e) => setCustomId(e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                      required
                      disabled={!!editingId}
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
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Enter exercise title"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age Group
                    </label>
                    <select
                      value={ageGroup}
                      onChange={(e) => setAgeGroup(e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                    >
                      {ageGroups.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                    >
                      {difficulties.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
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
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Decision Theme
                    </label>
                    <select
                      value={decisionTheme}
                      onChange={(e) => setDecisionTheme(e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                    >
                      {decisionThemes.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
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
                      className="w-full border px-3 py-2 rounded"
                    >
                      {playerInvolvements.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Game Moment
                    </label>
                    <select
                      value={gameMoment}
                      onChange={(e) => setGameMoment(e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                    >
                      {gameMoments.map((gm) => (
                        <option key={gm} value={gm}>
                          {gm}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overview
                  </label>
                  <textarea
                    placeholder="A short summary of the exercise"
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
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
                    className="w-full border px-3 py-2 rounded font-mono text-sm"
                    rows={8}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setPreviewImage(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    {previewImage && (
                      <button
                        type="button"
                        onClick={() => setPreviewImage(null)}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="mt-2 max-w-xs rounded border"
                    />
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover"
                  >
                    {editingId ? "Update Exercise" : "Add Exercise"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetExerciseForm}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-bold">Existing Exercises</h2>
              </div>
              {exercises.length === 0 ? (
                <div className="p-6 text-center space-y-3 text-gray-600">
                  <div className="text-4xl">📝</div>
                  <p className="font-medium text-gray-800">No exercises yet</p>
                  <p className="text-sm">
                    Add your first drill or refresh if you think the catalog should already be populated.
                  </p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <button
                      onClick={scrollToExerciseForm}
                      className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
                    >
                      Add a drill
                    </button>
                    <button
                      onClick={fetchAllData}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Refresh data
                    </button>
                  </div>
                </div>
              ) : (
                <div className="divide-y">
                  {exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="p-4 flex justify-between items-start hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">{exercise.title}</p>
                        <p className="text-sm text-gray-500">{exercise.overview}</p>
                        <div className="text-xs mt-1 text-gray-400">
                          {exercise.ageGroup} | {exercise.difficulty}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditingExercise(exercise)}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleExerciseDelete(exercise.id)}
                          className="text-red-600 text-sm hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === "clubs" ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Club Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Contact Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Members
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clubs.map((club) => (
                  <tr key={club.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {club.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {club.contactEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {club.memberCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          club.status === "suspended"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {club.status || "active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {club.status === "suspended" ? (
                        <button
                          onClick={() =>
                            setConfirmAction({
                              type: "unsuspend",
                              target: "club",
                              id: club.id,
                              name: club.name,
                            })
                          }
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Unsuspend
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            setConfirmAction({
                              type: "suspend",
                              target: "club",
                              id: club.id,
                              name: club.name,
                            })
                          }
                          className="text-yellow-600 hover:text-yellow-900 mr-3"
                        >
                          Suspend
                        </button>
                      )}
                      <button
                        onClick={() =>
                          setConfirmAction({
                            type: "delete",
                            target: "club",
                            id: club.id,
                            name: club.name,
                          })
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {clubs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="text-3xl">🏟️</div>
                        <p className="text-gray-800 font-medium">No clubs registered yet</p>
                        <p className="text-sm text-gray-600 max-w-lg">
                          Invite partners or refresh the list if you were expecting existing clubs to appear.
                        </p>
                        <div className="flex gap-3 justify-center flex-wrap">
                          <button
                            onClick={fetchAllData}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                          >
                            Refresh list
                          </button>
                          <a
                            href="/contact"
                            className="px-3 py-2 text-primary hover:underline"
                          >
                            Share a club invite
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Account Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Club
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coaches.map((coach) => (
                  <tr key={coach.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {coach.fname} {coach.lname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coach.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coach.accountType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coach.clubName || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          coach.accountStatus === "suspended"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {coach.accountStatus || "active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {coach.accountStatus === "suspended" ? (
                        <button
                          onClick={() =>
                            setConfirmAction({
                              type: "unsuspend",
                              target: "coach",
                              id: coach.id,
                              name: `${coach.fname} ${coach.lname}`,
                            })
                          }
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Unsuspend
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            setConfirmAction({
                              type: "suspend",
                              target: "coach",
                              id: coach.id,
                              name: `${coach.fname} ${coach.lname}`,
                            })
                          }
                          className="text-yellow-600 hover:text-yellow-900 mr-3"
                        >
                          Suspend
                        </button>
                      )}
                      <button
                        onClick={() =>
                          setConfirmAction({
                            type: "delete",
                            target: "coach",
                            id: coach.id,
                            name: `${coach.fname} ${coach.lname}`,
                          })
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {coaches.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="text-3xl">🎯</div>
                        <p className="text-gray-800 font-medium">No coaches registered yet</p>
                        <p className="text-sm text-gray-600 max-w-lg">
                          Invite coaches to join or refresh the roster if you already shared access links.
                        </p>
                        <div className="flex gap-3 justify-center flex-wrap">
                          <button
                            onClick={fetchAllData}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                          >
                            Refresh roster
                          </button>
                          <a
                            href="mailto:support@eyeqfootball.com"
                            className="px-3 py-2 text-primary hover:underline"
                          >
                            Request onboarding help
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {confirmAction.type === "delete"
                ? "Confirm Delete"
                : confirmAction.type === "suspend"
                ? "Confirm Suspend"
                : "Confirm Unsuspend"}
            </h3>
            <p className="text-gray-600 mb-4">
              {confirmAction.type === "delete"
                ? `Are you sure you want to permanently delete ${confirmAction.target} "${confirmAction.name}"? This action cannot be undone.`
                : confirmAction.type === "suspend"
                ? `Are you sure you want to suspend ${confirmAction.target} "${confirmAction.name}"? ${
                    confirmAction.target === "club"
                      ? "All associated coaches will also be suspended."
                      : ""
                  }`
                : `Are you sure you want to unsuspend ${confirmAction.target} "${confirmAction.name}"?`}
            </p>
            {(confirmAction.type === "suspend" || confirmAction.type === "delete") && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason (optional)
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setConfirmAction(null);
                  setReason("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={actionLoading === confirmAction.id}
                className={`px-4 py-2 rounded-lg text-white ${
                  confirmAction.type === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : confirmAction.type === "suspend"
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {actionLoading === confirmAction.id ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
