"use client";

import { useEffect, useState } from "react";
import AccountCard from "./AccountCard";
import { fetchSocialAccounts } from "@/src/lib/api";
import type { Account } from "@/src/store/accountsStore";

export default function ConnectedAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAccounts = async () => {
    try {
      const data = await fetchSocialAccounts();
      // Normalize the response to match Account type
      const normalized: Account[] = data.map((a: any) => ({
        id: a.id,
        platform: a.platform,
        username: a.account_username || a.username || "",
        status: a.status,
      }));
      setAccounts(normalized);
    } catch (err) {
      setError("Failed to load connected accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  if (loading) return <p>Loading accounts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Connected Accounts</h2>

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
