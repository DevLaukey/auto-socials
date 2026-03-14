"use client";

import { useEffect } from "react";
import AccountCard from "./AccountCard";
import { useAccountsStore } from "@/src/store/accountsStore";

export default function ConnectedAccounts() {
  const { accounts, loadingAccounts, loadAccounts, error } = useAccountsStore();

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  if (loadingAccounts) return <p>Loading accounts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Connected Accounts ({accounts.length})
      </h2>

      {accounts.length === 0 ? (
        <p>No connected accounts</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      )}
    </div>
  );
}
