"use client";

import { useState } from "react";
import ConnectedAccountsView from "@/components/accounts/views/ConnectedAccountsView";
import AddAccountView from "@/components/accounts/views/AddAccountView";
import AccountGroupsLayout from "@/components/accounts/AccountGroupsLayout";
import { Button } from "@/components/ui/button";

export default function SocialAccountsPage() {
  const [view, setView] = useState<
    "CONNECTED" | "ADD_ACCOUNT" | "GROUPS"
  >("CONNECTED");

  function resetToConnected() {
    setView("CONNECTED");
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Social Accounts</h1>

        {view !== "CONNECTED" && (
          <Button variant="outline" onClick={resetToConnected}>
            ← Back
          </Button>
        )}
      </div>

      {/* MAIN CONTENT */}
      {view === "CONNECTED" && (
        <ConnectedAccountsView
          onConnect={() => setView("ADD_ACCOUNT")}
          onGroups={() => setView("GROUPS")}
        />
      )}

      {view === "ADD_ACCOUNT" && (
        <AddAccountView onClose={resetToConnected} />
      )}

      {view === "GROUPS" && <AccountGroupsLayout />}
    </div>
  );
}
