"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAccountsStore, type Account } from "@/src/store/accountsStore";

type Props = {
  group: { id: number; name: string };
  accounts?: Account[];
  onAddAccount: () => void;
  onGroupDeleted: () => void;
};

export default function GroupAccounts({
  group,
  accounts = [],
  onAddAccount,
  onGroupDeleted,
}: Props) {
  const { renameGroup, deleteGroup, removeAccountFromGroup } =
    useAccountsStore();

  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(group.name);
  const [deleting, setDeleting] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  async function handleRename() {
    if (!newName.trim() || newName === group.name) {
      setIsRenaming(false);
      return;
    }
    await renameGroup(group.id, newName.trim());
    setIsRenaming(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete group "${group.name}"? Accounts will not be deleted.`))
      return;
    setDeleting(true);
    try {
      await deleteGroup(group.id);
      onGroupDeleted();
    } finally {
      setDeleting(false);
    }
  }

  async function handleRemoveAccount(accountId: number) {
    setRemovingId(accountId);
    try {
      await removeAccountFromGroup(group.id, accountId);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="md:col-span-3 bg-white border rounded-xl p-4 space-y-4">
      <div className="flex justify-between items-center gap-2">
        {isRenaming ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              className="border rounded-md px-3 py-1 text-sm flex-1"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") {
                  setNewName(group.name);
                  setIsRenaming(false);
                }
              }}
              autoFocus
            />
            <Button size="sm" onClick={handleRename}>
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setNewName(group.name);
                setIsRenaming(false);
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <h3 className="font-semibold">{group.name} Accounts</h3>
        )}

        <div className="flex gap-2 shrink-0">
          {!isRenaming && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setNewName(group.name);
                  setIsRenaming(true);
                }}
              >
                Rename
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={deleting}
                onClick={handleDelete}
              >
                {deleting ? "Deleting..." : "Delete Group"}
              </Button>
            </>
          )}
          <Button size="sm" onClick={onAddAccount}>
            Connect Account
          </Button>
        </div>
      </div>

      {accounts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No accounts connected to this group yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <div key={account.id} className="border rounded-xl p-4 space-y-2">
              <h3 className="font-semibold">{account.platform}</h3>
              <p className="text-sm">{account.username}</p>
              {account.status && (
                <p className="text-xs text-muted-foreground">
                  Status: {account.status}
                </p>
              )}
              <Button
                size="sm"
                variant="outline"
                disabled={removingId === account.id}
                onClick={() => handleRemoveAccount(account.id)}
              >
                {removingId === account.id
                  ? "Removing..."
                  : "Remove from Group"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
