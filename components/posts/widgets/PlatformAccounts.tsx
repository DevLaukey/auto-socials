"use client";

import { Button } from "@/components/ui/button";
import { useAccountsStore } from "@/src/store/accountsStore";
import type { Account } from "@/src/store/accountsStore";
import { useEffect, useState } from "react";

interface PlatformAccountsProps {
  platform: string;
  selectedAccountIds: number[];
  selectedGroupIds: number[];
  onAccountsChange: (accountIds: number[]) => void;
  onGroupsChange: (groupIds: number[]) => void;
}

export default function PlatformAccounts({
  platform,
  selectedAccountIds,
  selectedGroupIds,
  onAccountsChange,
  onGroupsChange,
}: PlatformAccountsProps) {
  const { accounts, groups, groupAccounts, loadGroupAccounts } =
    useAccountsStore();

  const [mode, setMode] = useState<"accounts" | "groups">("accounts");

  const normalizedPlatform = platform?.toLowerCase() ?? "";

  /* ============================
     ACCOUNTS (UNCHANGED BEHAVIOR)
  ============================ */
  const platformAccounts = accounts.filter(
    (a) => a.platform?.toLowerCase() === normalizedPlatform
  );

  /* ============================
     LOAD GROUP ACCOUNTS (SAME AS ACCOUNTS PAGE)
  ============================ */
  useEffect(() => {
    if (groups.length === 0) return;

    groups.forEach((group) => {
      if (!groupAccounts[group.id]) {
        loadGroupAccounts(group.id);
      }
    });
  }, [groups, groupAccounts, loadGroupAccounts]);

  /* ============================
     FILTER GROUPS BY PLATFORM
  ============================ */
  const platformGroups = groups.filter((group) => {
    const accountsInGroup = groupAccounts[group.id];
    if (!accountsInGroup) return false;

    return accountsInGroup.some(
      (acc) => acc.platform?.toLowerCase() === normalizedPlatform
    );
  });

  function toggleAccount(accountId: number) {
    if (selectedAccountIds.includes(accountId)) {
      onAccountsChange(selectedAccountIds.filter((id) => id !== accountId));
    } else {
      onAccountsChange([...selectedAccountIds, accountId]);
    }
  }

  function toggleGroup(groupId: number) {
    if (selectedGroupIds.includes(groupId)) {
      onGroupsChange(selectedGroupIds.filter((id) => id !== groupId));
    } else {
      onGroupsChange([...selectedGroupIds, groupId]);
    }
  }

  return (
    <div className="border rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{platform}</h3>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={mode === "accounts" ? "default" : "outline"}
            onClick={() => setMode("accounts")}
          >
            Accounts
          </Button>

          <Button
            size="sm"
            variant={mode === "groups" ? "default" : "outline"}
            onClick={() => setMode("groups")}
          >
            Groups
          </Button>
        </div>
      </div>

      {/* ACCOUNTS */}
      {mode === "accounts" && (
        <div className="space-y-1">
          {platformAccounts.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No {platform} accounts connected
            </p>
          )}

          {platformAccounts.map((acc) => (
            <label
              key={acc.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedAccountIds.includes(acc.id)}
                onChange={() => toggleAccount(acc.id)}
              />
              <span>{acc.username}</span>
            </label>
          ))}
        </div>
      )}

      {/* GROUPS */}
      {mode === "groups" && (
        <div className="space-y-1">
          {platformGroups.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No {platform} groups available
            </p>
          )}

          {platformGroups.map((group) => (
            <label
              key={group.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedGroupIds.includes(group.id)}
                onChange={() => toggleGroup(group.id)}
              />
              <span>{group.name}</span>
            </label>
          ))}
        </div>
      )}

      {platform === "Instagram" && (
        <p className="text-xs text-muted-foreground mt-2">
          Instagram options apply to all selected accounts
        </p>
      )}
    </div>
  );
}
