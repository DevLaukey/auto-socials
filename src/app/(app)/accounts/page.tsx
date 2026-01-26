"use client";

import { useState } from "react";
import ConnectedAccountsView from "@/components/accounts/views/ConnectedAccountsView";
import SelectPlatformView from "@/components/accounts/views/SelectPlatformView";
import AddAccountView from "@/components/accounts/views/AddAccountView";
import AccountGroupsLayout from "@/components/accounts/AccountGroupsLayout";
import { SocialAccount } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function SocialAccountsPage() {
  const [view, setView] = useState<
    "CONNECTED" | "SELECT_PLATFORM" | "ADD_ACCOUNT" | "GROUPS"
  >("CONNECTED");

  const [selectedPlatform, setSelectedPlatform] = useState<
    SocialAccount["platform"] | null
  >(null);

  function resetToConnected() {
    setSelectedPlatform(null);
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
          onConnect={() => setView("SELECT_PLATFORM")}
          onGroups={() => setView("GROUPS")}
        />
      )}

      {view === "SELECT_PLATFORM" && (
        <SelectPlatformView
          onSelect={(platform) => {
            setSelectedPlatform(platform);
            setView("ADD_ACCOUNT");
          }}
          onBack={resetToConnected}
        />
      )}

      {view === "ADD_ACCOUNT" && selectedPlatform && (
        <AddAccountView
          platform={selectedPlatform}
          onDone={resetToConnected}
          onClose={resetToConnected} // ✅ FIX
        />
      )}

      {view === "GROUPS" && <AccountGroupsLayout />}
    </div>
  );
}
