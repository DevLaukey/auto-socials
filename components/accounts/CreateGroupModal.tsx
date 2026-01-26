"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/src/lib/api";
import { useAccountsStore } from "@/src/store/accountsStore";

export default function CreateGroupModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const fetchGroups = useAccountsStore((state) => state.loadGroups);

  async function createGroup() {
    await apiFetch("/groups/", {
      method: "POST",
      body: JSON.stringify({
        group_name: name,
      }),
    });

    await fetchGroups();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold">Create Account Group</h2>

        <input
          className="border rounded-md px-3 py-2 w-full"
          placeholder="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!name} onClick={createGroup}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
