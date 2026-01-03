"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../../components/Navbar";
import Breadcrumbs from "../../components/Breadcrumbs";
import WelcomeModal from "../../components/WelcomeModal";
import { auth, db } from "@/Firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ExerciseTypePolicy } from "../../types/account";

interface ClubMember {
  id: string;
  email: string;
  role: "admin" | "coach";
  status: string;
  joinedAt: Date | null;
}

interface ClubInvite {
  id: string;
  code: string;
  email?: string;
  createdAt: Date;
  expiresAt: Date;
  usedBy?: string;
}

export default function ClubDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [clubId, setClubId] = useState<string | null>(null);
  const [clubName, setClubName] = useState<string>("");
  const [isClubAdmin, setIsClubAdmin] = useState(false);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [invites, setInvites] = useState<ClubInvite[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [exerciseTypePolicy, setExerciseTypePolicy] = useState<ExerciseTypePolicy>("coach-choice");
  const [policyLoading, setPolicyLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const signupsQuery = query(
          collection(db, "signups"),
          where("uid", "==", user.uid)
        );
        const signupSnap = await getDocs(signupsQuery);

        if (signupSnap.empty) {
          router.push("/upgrade");
          return;
        }

        const userData = signupSnap.docs[0].data();
        if (!userData.clubId || userData.clubRole !== "admin") {
          router.push("/planner");
          return;
        }

        setClubId(userData.clubId);
        setIsClubAdmin(true);

        const clubQuery = query(
          collection(db, "clubs"),
          where("__name__", "==", userData.clubId)
        );
        const clubSnap = await getDocs(clubQuery);
        if (!clubSnap.empty) {
          const clubData = clubSnap.docs[0].data();
          setClubName(clubData.name || "Your Club");
          setExerciseTypePolicy(clubData.exerciseTypePolicy || "coach-choice");
        }

        const membersSnap = await getDocs(
          collection(db, `clubs/${userData.clubId}/members`)
        );
        const membersList: ClubMember[] = membersSnap.docs.map((doc) => ({
          id: doc.id,
          email: doc.data().email,
          role: doc.data().role,
          status: doc.data().status,
          joinedAt: doc.data().joinedAt?.toDate() || null,
        }));
        setMembers(membersList);

        const invitesQuery = query(
          collection(db, "clubInvites"),
          where("clubId", "==", userData.clubId)
        );
        const invitesSnap = await getDocs(invitesQuery);
        const invitesList: ClubInvite[] = invitesSnap.docs.map((doc) => ({
          id: doc.id,
          code: doc.data().code,
          email: doc.data().email,
          createdAt: doc.data().createdAt?.toDate(),
          expiresAt: doc.data().expiresAt?.toDate(),
          usedBy: doc.data().usedBy,
        }));
        setInvites(invitesList);
      } catch (error) {
        console.error("Failed to load club data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const generateInviteCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreateInvite = async () => {
    if (!clubId || !inviteEmail.trim()) return;
    setInviteLoading(true);

    try {
      const normalizedEmail = inviteEmail.trim().toLowerCase();
      const code = generateInviteCode();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const inviteDoc = await addDoc(collection(db, "clubInvites"), {
        clubId,
        clubName,
        code,
        email: normalizedEmail,
        createdAt: serverTimestamp(),
        expiresAt,
      });

      setInvites([
        ...invites,
        {
          id: inviteDoc.id,
          code,
          email: normalizedEmail,
          createdAt: new Date(),
          expiresAt,
        },
      ]);

      setInviteEmail("");
      setShowInviteForm(false);
    } catch (error) {
      console.error("Failed to create invite:", error);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleDeleteInvite = async (inviteId: string) => {
    try {
      await deleteDoc(doc(db, "clubInvites", inviteId));
      setInvites(invites.filter((i) => i.id !== inviteId));
    } catch (error) {
      console.error("Failed to delete invite:", error);
    }
  };

  const handlePolicyChange = async (newPolicy: ExerciseTypePolicy) => {
    if (!clubId || policyLoading) return;
    setPolicyLoading(true);
    const oldPolicy = exerciseTypePolicy;
    setExerciseTypePolicy(newPolicy);

    try {
      await updateDoc(doc(db, "clubs", clubId), {
        exerciseTypePolicy: newPolicy,
      });
    } catch (error) {
      console.error("Failed to update exercise policy:", error);
      setExerciseTypePolicy(oldPolicy);
    } finally {
      setPolicyLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberEmail: string) => {
    if (!clubId) return;

    const confirmed = window.confirm(
      `Are you sure you want to remove ${memberEmail} from the club? They will lose access to club features and their account will be downgraded to Free.`
    );

    if (!confirmed) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please log in again.");
        return;
      }

      const idToken = await user.getIdToken();
      const response = await fetch("/api/club/remove-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ clubId, memberId, memberEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setMembers(members.filter((m) => m.id !== memberId));
      } else {
        alert(data.error || "Failed to remove member. Please try again.");
      }
    } catch (error) {
      console.error("Failed to remove member:", error);
      alert("Failed to remove member. Please try again.");
    }
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
      alert('Failed to copy code. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <Breadcrumbs />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isClubAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <Breadcrumbs />
      <WelcomeModal type="clubAdmin" clubName={clubName} />

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{clubName}</h1>
            <p className="text-sm text-gray-500">Club Administration</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Trial
          </span>
        </div>

        <div className="bg-card border border-divider rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Team Roster</h2>
              <p className="text-sm text-gray-500">
                {members.length} active {members.length === 1 ? "coach" : "coaches"}
                {invites.length > 0 && ` + ${invites.length} pending`}
              </p>
            </div>
            <button
              onClick={() => setShowInviteForm(true)}
              className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-hover transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Invite Coach
            </button>
          </div>

          {showInviteForm && (
            <div className="mb-6 p-4 bg-primary-light rounded-lg border border-primary/20">
              <h3 className="font-medium text-foreground mb-3">Create invite for new coach</h3>
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">Coach email address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="coach@example.com"
                  className="w-full p-3 rounded-lg border border-divider bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">The access code will only work for this email</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateInvite}
                  disabled={inviteLoading || !inviteEmail.trim()}
                  className="flex-1 bg-primary text-white text-sm py-2.5 rounded-lg hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {inviteLoading ? "Creating..." : "Generate Access Code"}
                </button>
                <button
                  onClick={() => {
                    setShowInviteForm(false);
                    setInviteEmail("");
                  }}
                  className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 border border-divider rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {(() => {
              const pendingInvites = invites.filter((i) => 
                !i.usedBy && (!i.expiresAt || i.expiresAt > new Date())
              );
              const inviteByEmail = new Map<string, ClubInvite>();
              invites.forEach((inv) => {
                if (inv.email) inviteByEmail.set(inv.email.toLowerCase(), inv);
              });

              if (members.length === 0 && pendingInvites.length === 0) {
                return (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No coaches yet. Click &quot;Invite Coach&quot; to add your first team member.
                  </p>
                );
              }

              return (
                <>
                  {members.map((member) => {
                    const memberInvite = inviteByEmail.get(member.email?.toLowerCase() || "");
                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 bg-background rounded-lg border border-divider"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{member.email}</p>
                            {memberInvite ? (
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded border border-gray-300 text-primary font-bold">
                                  {memberInvite.code}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(memberInvite.code)}
                                  className="text-xs text-blue-600 hover:text-blue-800 font-medium transition"
                                  title="Copy code to clipboard"
                                >
                                  {copiedCode === memberInvite.code ? '✓ Copied!' : 'Copy'}
                                </button>
                                <span className="text-xs text-gray-500 capitalize">{member.role}</span>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                            Active
                          </span>
                          {member.role !== "admin" && (
                            <button
                              onClick={() => handleRemoveMember(member.id, member.email)}
                              className="text-xs text-red-500 hover:text-red-700 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {pendingInvites.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{invite.email || "No email"}</p>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-amber-300 text-primary font-bold">
                              {invite.code}
                            </span>
                            <button
                              onClick={() => copyToClipboard(invite.code)}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium transition"
                              title="Copy code to clipboard"
                            >
                              {copiedCode === invite.code ? '✓ Copied!' : 'Copy'}
                            </button>
                            <span className="text-xs text-amber-600">
                              Expires {invite.expiresAt?.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteInvite(invite.id)}
                        className="text-xs text-red-500 hover:text-red-700 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
                </>
              );
            })()}
          </div>
        </div>

        <div className="mt-6 bg-card border border-divider rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">Exercise Access Mode</h2>
          <p className="text-sm text-gray-500 mb-4">
            Choose which type of exercises your coaches can access. EyeQ exercises use smart LED cones, while Plastic exercises use traditional cones.
          </p>
          
          <div className="space-y-3">
            <label 
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition ${
                exerciseTypePolicy === "eyeq-only" 
                  ? "border-[#e63946] bg-red-50" 
                  : "border-divider hover:border-gray-300"
              } ${policyLoading ? "opacity-50 cursor-wait" : ""}`}
            >
              <input
                type="radio"
                name="exercisePolicy"
                checked={exerciseTypePolicy === "eyeq-only"}
                onChange={() => handlePolicyChange("eyeq-only")}
                disabled={policyLoading}
                className="mt-1 accent-[#e63946]"
              />
              <div>
                <p className="font-medium text-foreground">EyeQ Only</p>
                <p className="text-sm text-gray-500">Coaches only see smart LED cone exercises</p>
              </div>
            </label>

            <label 
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition ${
                exerciseTypePolicy === "plastic-only" 
                  ? "border-[#e63946] bg-red-50" 
                  : "border-divider hover:border-gray-300"
              } ${policyLoading ? "opacity-50 cursor-wait" : ""}`}
            >
              <input
                type="radio"
                name="exercisePolicy"
                checked={exerciseTypePolicy === "plastic-only"}
                onChange={() => handlePolicyChange("plastic-only")}
                disabled={policyLoading}
                className="mt-1 accent-[#e63946]"
              />
              <div>
                <p className="font-medium text-foreground">Plastic Cones Only</p>
                <p className="text-sm text-gray-500">Coaches only see traditional cone exercises</p>
              </div>
            </label>

            <label 
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition ${
                exerciseTypePolicy === "coach-choice" 
                  ? "border-[#e63946] bg-red-50" 
                  : "border-divider hover:border-gray-300"
              } ${policyLoading ? "opacity-50 cursor-wait" : ""}`}
            >
              <input
                type="radio"
                name="exercisePolicy"
                checked={exerciseTypePolicy === "coach-choice"}
                onChange={() => handlePolicyChange("coach-choice")}
                disabled={policyLoading}
                className="mt-1 accent-[#e63946]"
              />
              <div>
                <p className="font-medium text-foreground">Coach Choice</p>
                <p className="text-sm text-gray-500">Each coach can toggle between EyeQ and Plastic exercises</p>
              </div>
            </label>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-1">How to invite coaches</h3>
          <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
            <li>Click &quot;Invite Coach&quot; and enter their email address</li>
            <li>Share the generated access code with them</li>
            <li>They sign up using the same email, then enter the code</li>
          </ol>
          <p className="text-xs text-blue-600 mt-2">Each code is single-use and only works for the assigned email.</p>
        </div>
      </div>
    </div>
  );
}
