"use client";

import { useEffect } from "react";
import AccountCard from "../AccountCard";
import { Button } from "@/components/ui/button";
import { useAccountsStore } from "@/src/store/accountsStore";

export default function ConnectedAccountsView({
  onConnect,
  onGroups,
}: {
  onConnect: () => void;
  onGroups: () => void;
}) {
  const { accounts, loadingAccounts, loadAccounts } = useAccountsStore();

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Connected Accounts
          {!loadingAccounts && accounts.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({accounts.length})
            </span>
          )}
        </h2>

        <div className="flex gap-2">
          <Button
            onClick={onGroups}
            className="bg-slate-800 hover:bg-slate-700"
          >
            Account Groups
          </Button>

          <Button onClick={onConnect}>Connect Account</Button>
        </div>
      </div>

      {loadingAccounts ? (
        <p className="text-sm text-muted-foreground">Loading accounts...</p>
      ) : accounts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No accounts connected yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <AccountCard key={acc.id} account={acc} />
          ))}
        </div>
      )}
    </div>
  );
}
