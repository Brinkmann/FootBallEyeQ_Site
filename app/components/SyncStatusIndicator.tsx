"use client";
import { usePlanStore, SyncStatus } from "../store/usePlanStore";

const statusConfig: Record<SyncStatus, { label: string; icon: string; className: string }> = {
  idle: { label: "Saved", icon: "✓", className: "text-green-600" },
  syncing: { label: "Saving...", icon: "↻", className: "text-blue-600 animate-spin" },
  offline: { label: "Offline", icon: "⚠", className: "text-amber-600" },
  error: { label: "Save failed", icon: "✕", className: "text-red-600" },
};

export default function SyncStatusIndicator() {
  const syncStatus = usePlanStore((s) => s.syncStatus);
  const pendingSave = usePlanStore((s) => s.pendingSave);
  const isOnline = usePlanStore((s) => s.isOnline);

  const config = statusConfig[syncStatus];
  const showPending = pendingSave && syncStatus === "offline";

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium">
      <span className={`${config.className} text-base`}>{config.icon}</span>
      <span className={config.className}>
        {showPending ? "Changes pending" : config.label}
      </span>
      {!isOnline && (
        <span className="text-gray-500 ml-1">(will sync when online)</span>
      )}
    </div>
  );
}
