"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/Firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";

const SUPER_ADMIN_EMAIL = "obrinkmann@gmail.com";

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

export default function SuperAdminPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"clubs" | "coaches">("clubs");
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const [coaches, setCoaches] = useState<CoachData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: "suspend" | "delete" | "unsuspend";
    target: "club" | "coach";
    id: string;
    name: string;
  } | null>(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email === SUPER_ADMIN_EMAIL) {
        setAuthorized(true);
        fetchData();
      } else {
        setAuthorized(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
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
      const coachesData: CoachData[] = coachesSnap.docs.map((d) => {
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
      });
      setCoaches(coachesData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
    setLoading(false);
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

      const membersSnap = await getDocs(
        collection(db, `clubs/${clubId}/members`)
      );
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
      await fetchData();
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

      const membersSnap = await getDocs(
        collection(db, `clubs/${clubId}/members`)
      );
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
      await fetchData();
    } catch (err) {
      console.error("Failed to unsuspend club:", err);
    }
    setActionLoading(null);
  };

  const deleteClub = async (clubId: string) => {
    setActionLoading(clubId);
    try {
      const membersSnap = await getDocs(
        collection(db, `clubs/${clubId}/members`)
      );
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

      const invitesQuery = query(
        collection(db, "clubInvites"),
        where("clubId", "==", clubId)
      );
      const invitesSnap = await getDocs(invitesQuery);
      for (const inviteDoc of invitesSnap.docs) {
        await deleteDoc(inviteDoc.ref);
      }

      await deleteDoc(doc(db, "clubs", clubId));

      setConfirmAction(null);
      setReason("");
      await fetchData();
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
      await fetchData();
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
      await fetchData();
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
      await fetchData();
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
          <p className="text-gray-600">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white py-4 px-6">
        <h1 className="text-xl font-bold">System Administration</h1>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("clubs")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "clubs"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 border"
            }`}
          >
            Clubs ({clubs.length})
          </button>
          <button
            onClick={() => setActiveTab("coaches")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "coaches"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 border"
            }`}
          >
            Coaches ({coaches.length})
          </button>
          <button
            onClick={fetchData}
            className="ml-auto px-4 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
                      No clubs registered yet
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
                      No coaches registered yet
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
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
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
