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
  const { accounts, groupAccounts, addAccountToGroup, loadAccounts } =
    useAccountsStore();

  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null,
  );

  const [platform, setPlatform] = useState("YouTube");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load accounts when modal opens
  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  // Get accounts NOT already in this group
  const availableAccounts: Account[] = useMemo(() => {
    const existingIds = new Set(
      (groupAccounts[groupId] ?? []).map((a) => a.id),
    );
    return accounts.filter((acc) => !existingIds.has(acc.id));
  }, [accounts, groupAccounts, groupId]);

  // Get accounts ALREADY in this group (to prevent duplicates)
  const accountsInGroup = useMemo(() => {
    return groupAccounts[groupId] ?? [];
  }, [groupAccounts, groupId]);

  // Check if a username is already in the group
  const isUsernameInGroup = (usernameToCheck: string): boolean => {
    return accountsInGroup.some(
      (acc) => acc.username.toLowerCase() === usernameToCheck.toLowerCase(),
    );
  };

  async function handleAddExisting() {
    if (selectedAccountId === null) {
      setError("Please select an account");
      return;
    }

    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      // Use the store's method which already handles the API call and refresh
      await addAccountToGroup(groupId, selectedAccountId);

      // Show success message
      setSuccess("Account added to group successfully!");

      // Close after showing success briefly
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error("Failed to add account to group:", err);

      // Check for duplicate error
      if (
        err?.message?.toLowerCase().includes("already in this group") ||
        err?.message?.toLowerCase().includes("already exists")
      ) {
        setError("This account is already in the group");
      } else {
        setError(err?.message || "Failed to add account to group");
      }
      setSubmitting(false);
    }
  }

  async function handleAddNew() {
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    // Check if username already exists in this group
    if (isUsernameInGroup(username)) {
      setError(`Account "${username}" is already in this group`);
      return;
    }

    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const response = await apiFetch("/social-accounts/connect", {
        method: "POST",
        body: JSON.stringify({
          platform,
          account_username: username.trim(),
          password,
          group_id: groupId,
        }),
      });

      console.log("Account created response:", response);

      // Show success message immediately
      const message =
        response?.message || `Account "${username}" connected successfully!`;
      setSuccess(message);

      // Refresh accounts in the store
      await loadAccounts();

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error("Failed to connect account:", err);

      // Check for duplicate error from backend
      if (
        err?.message?.toLowerCase().includes("already exists") ||
        err?.message?.toLowerCase().includes("duplicate")
      ) {
        setError(`Account "${username}" already exists`);
      } else {
        setError(err?.message || "Failed to connect account");
      }
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Connect Account to Group</h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-start gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 flex-shrink-0 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm flex items-start gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 flex-shrink-0 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Mode Toggle */}
        <div className="flex gap-2 border-b pb-3">
          <Button
            variant={mode === "existing" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setMode("existing");
              setError(null);
              setSuccess(null);
            }}
            disabled={submitting}
          >
            Existing Account
          </Button>
          <Button
            variant={mode === "new" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setMode("new");
              setError(null);
              setSuccess(null);
            }}
            disabled={submitting}
          >
            New Account
          </Button>
        </div>

        {/* Existing Account Mode */}
        {mode === "existing" && (
          <>
            {availableAccounts.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500 mb-3">
                  No available accounts to add.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setMode("new")}
                  disabled={submitting}
                >
                  Create a new account instead
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Account
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedAccountId ?? ""}
                    onChange={(e) => {
                      setSelectedAccountId(
                        e.target.value ? Number(e.target.value) : null,
                      );
                      setError(null);
                    }}
                    disabled={submitting || !!success}
                  >
                    <option value="" disabled>
                      -- Choose an account --
                    </option>
                    {availableAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.platform} — {acc.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      selectedAccountId === null || submitting || !!success
                    }
                    onClick={handleAddExisting}
                  >
                    {submitting ? "Adding..." : "Add to Group"}
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        {/* New Account Mode */}
        {mode === "new" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={platform}
                onChange={(e) => {
                  setPlatform(e.target.value);
                  setError(null);
                }}
                disabled={submitting || !!success}
              >
                <option value="YouTube">YouTube</option>
                <option value="Instagram">Instagram</option>
                <option value="Twitter/X">Twitter/X</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Account username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(null);
                }}
                disabled={submitting || !!success}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Account password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                disabled={submitting || !!success}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button
                onClick={handleAddNew}
                disabled={
                  !username.trim() || !password || submitting || !!success
                }
              >
                {submitting ? "Connecting..." : "Connect Account"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
