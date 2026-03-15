"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/src/lib/api";
import { useAccountsStore } from "@/src/store/accountsStore";

export default function CreateGroupModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchGroups = useAccountsStore((state) => state.loadGroups);

  async function createGroup() {
    if (!name.trim()) {
      setError("Group name is required");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await apiFetch("/groups/create", {
        method: "POST",
        body: JSON.stringify({
          group_name: name.trim(),
        }),
      });

      await fetchGroups();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold">Create Account Group</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <input
          className="border rounded-md px-3 py-2 w-full"
          placeholder="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          autoFocus
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={createGroup} disabled={!name.trim() || loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
