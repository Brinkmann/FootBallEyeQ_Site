"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../../components/Navbar";
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
  serverTimestamp,
} from "firebase/firestore";

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
          setClubName(clubSnap.docs[0].data().name || "Your Club");
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
        }));
        setInvites(invitesList.filter((i) => !i.expiresAt || i.expiresAt > new Date()));
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
    if (!clubId) return;
    setInviteLoading(true);

    try {
      const code = generateInviteCode();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const inviteDoc = await addDoc(collection(db, "clubInvites"), {
        clubId,
        clubName,
        code,
        email: inviteEmail || null,
        createdAt: serverTimestamp(),
        expiresAt,
      });

      setInvites([
        ...invites,
        {
          id: inviteDoc.id,
          code,
          email: inviteEmail || undefined,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
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

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-divider rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Coaches</h2>
              <span className="text-sm text-gray-500">{members.length} members</span>
            </div>

            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-background rounded-lg border border-divider"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{member.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      member.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-divider rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Invite Codes</h2>
              <button
                onClick={() => setShowInviteForm(true)}
                className="text-sm text-primary hover:underline"
              >
                + Create Invite
              </button>
            </div>

            {showInviteForm && (
              <div className="mb-4 p-4 bg-primary-light rounded-lg">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Coach email (optional)"
                  className="w-full p-2 rounded border border-divider bg-background text-sm mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateInvite}
                    disabled={inviteLoading}
                    className="flex-1 bg-primary text-white text-sm py-2 rounded hover:bg-primary-hover transition"
                  >
                    {inviteLoading ? "..." : "Generate Code"}
                  </button>
                  <button
                    onClick={() => setShowInviteForm(false)}
                    className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {invites.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No active invite codes
                </p>
              ) : (
                invites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between p-3 bg-background rounded-lg border border-divider"
                  >
                    <div>
                      <p className="font-mono text-lg font-bold text-primary">
                        {invite.code}
                      </p>
                      {invite.email && (
                        <p className="text-xs text-gray-500">For: {invite.email}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        Expires: {invite.expiresAt?.toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteInvite(invite.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-1">How to invite coaches</h3>
          <p className="text-sm text-blue-700">
            Generate an invite code and share it with your coaches. They can enter the code on
            the upgrade page to join your club and get full access.
          </p>
        </div>
      </div>
    </div>
  );
}
