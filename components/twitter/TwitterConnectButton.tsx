// components/twitter/TwitterConnectButton.tsx

import { useState } from "react";
import { connectTwitter, checkTwitterStatus } from "@/src/lib/twitter";
import { useAccountsStore } from "@/src/store/accountsStore";

interface TwitterConnectButtonProps {
  accountId: number;
  accountUsername: string;
  onConnected?: () => void;
}

export default function TwitterConnectButton({
  accountId,
  accountUsername,
  onConnected,
}: TwitterConnectButtonProps) {
  const [checking, setChecking] = useState(false);
  const [connected, setConnected] = useState(false);
  const { checkTwitterAuth } = useAccountsStore();

  const handleConnect = () => {
    connectTwitter(accountId, window.location.pathname);
  };

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      const isConnected = await checkTwitterAuth(accountId);
      setConnected(isConnected);
      if (isConnected && onConnected) {
        onConnected();
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {connected ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-green-600">✓ Twitter Connected</span>
          <button
            onClick={handleCheckStatus}
            disabled={checking}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            {checking ? "Checking..." : "Refresh"}
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
        >
          Connect Twitter/X
        </button>
      )}
    </div>
  );
}