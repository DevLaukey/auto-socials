"use client";

import { useEffect, useState } from "react";
import AccountCard from "./AccountCard";
import { fetchSocialAccounts } from "@/src/lib/api";

type SocialAccount = {
  id: number;
  platform: string;
  username: string;
  status: string;
};

export default function ConnectedAccounts() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await fetchSocialAccounts();
        setAccounts(data);
      } catch (err) {
        setError("Failed to load connected accounts");
      } finally {
        setLoading(false);
      }
    };

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
            <AccountCard
              key={account.id}
              account={account}
              onUpdated={() => {
                // reload after delete / refresh later
                setLoading(true);
                fetchSocialAccounts().then((data) => {
                  setAccounts(data);
                  setLoading(false);
                });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
