"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAccountsStore, type Account } from "@/src/store/accountsStore";
import { apiFetch } from "@/src/lib/api";

interface AddAccountModalProps {
  groupId: number;
  onClose: () => void;
}

export default function AddAccountModal({
  groupId,
  onClose,
}: AddAccountModalProps) {
  const {
    accounts,
    groupAccounts,
    addAccountToGroup,
    loadAccounts,
    loadGroupAccounts,
  } = useAccountsStore();

  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null,
  );

  const [platform, setPlatform] = useState("YouTube");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* -------------------------------------------
   * Ensure global accounts are loaded
   * ------------------------------------------- */
  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  /* -------------------------------------------
   * Accounts NOT already in this group
   * ------------------------------------------- */
  const availableAccounts: Account[] = useMemo(() => {
    const existingIds = new Set(
      (groupAccounts[groupId] ?? []).map((a) => a.id),
    );

    return accounts.filter((acc) => !existingIds.has(acc.id));
  }, [accounts, groupAccounts, groupId]);

  /* -------------------------------------------
   * EXISTING ACCOUNT
   * ------------------------------------------- */
  async function handleAddExisting() {
    if (selectedAccountId === null) return;

    setSubmitting(true);
    try {
      await addAccountToGroup(groupId, selectedAccountId);
      await loadGroupAccounts(groupId);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  /* -------------------------------------------
   * NEW ACCOUNT - FIXED: Single request with group assignment
   * ------------------------------------------- */
  async function handleAddNew() {
    if (!username || !password) return;

    setSubmitting(true);
    try {
      // ✅ SINGLE REQUEST - Create account AND assign to group
      const newAccount = await apiFetch("/social-accounts/connect", {
        method: "POST",
        body: JSON.stringify({
          platform,
          account_username: username,
          password,
          group_id: groupId, // Send group_id to backend for immediate assignment
        }),
      });

      // ✅ Refresh data
      await loadAccounts();
      await loadGroupAccounts(groupId);

      // ✅ Close modal
      onClose();
    } catch (err) {
      console.error("Failed to connect account", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold">Connect Account</h2>

        {/* MODE TOGGLE */}
        <div className="flex gap-2">
          <Button
            variant={mode === "existing" ? "default" : "outline"}
            onClick={() => setMode("existing")}
          >
            Existing
          </Button>
          <Button
            variant={mode === "new" ? "default" : "outline"}
            onClick={() => setMode("new")}
          >
            New
          </Button>
        </div>

        {/* EXISTING ACCOUNT */}
        {mode === "existing" && (
          <>
            {availableAccounts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No available accounts to add.
              </p>
            ) : (
              <select
                className="border rounded-md px-3 py-2 w-full"
                value={selectedAccountId ?? ""}
                onChange={(e) =>
                  setSelectedAccountId(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
              >
                <option value="" disabled>
                  Select an account
                </option>
                {availableAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.platform} — {acc.username}
                  </option>
                ))}
              </select>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                disabled={selectedAccountId === null || submitting}
                onClick={handleAddExisting}
              >
                Add to Group
              </Button>
            </div>
          </>
        )}

        {/* NEW ACCOUNT */}
        {mode === "new" && (
          <>
            <select
              className="border rounded-md px-3 py-2 w-full"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="YouTube">YouTube</option>
              <option value="Instagram">Instagram</option>
              <option value="Twitter/X">Twitter/X</option>
            </select>

            <input
              className="border rounded-md px-3 py-2 w-full"
              placeholder="Account username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              className="border rounded-md px-3 py-2 w-full"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                disabled={!username || !password || submitting}
                onClick={handleAddNew}
              >
                Connect
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
