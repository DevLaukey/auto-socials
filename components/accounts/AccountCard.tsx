import { useState, useEffect } from "react";
import { useAccountsStore, type Account } from "@/src/store/accountsStore";
import { Button } from "@/components/ui/button";
import TwitterConnectButton from "../twitter/TwitterConnectButton";

export default function AccountCard({ account }: { account: Account }) {
  const { 
    disconnectAccount, 
    loadAccounts, 
    checkTwitterAuth,
    refreshTwitterToken,
    loadingTwitterAuth 
  } = useAccountsStore();
  
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showHealthDetails, setShowHealthDetails] = useState(false);

  // Check Twitter auth on mount for Twitter accounts
  useEffect(() => {
    if (account.platform.toLowerCase() === "twitter" && !account.twitter_connected) {
      checkTwitterAuth(account.id);
    }
  }, [account.id, account.platform, account.twitter_connected, checkTwitterAuth]);

  const handleDisconnect = async () => {
    if (!confirm(`Disconnect ${account.platform} account "${account.username}"?`))
      return;
    setError(null);
    try {
      await disconnectAccount(account.id);
      await loadAccounts();
    } catch (err: any) {
      setError(err?.message || "Failed to disconnect account");
    }
  };

  const handleRefreshToken = async () => {
    setRefreshing(true);
    setError(null);
    try {
      await refreshTwitterToken(account.id);
      await checkTwitterAuth(account.id);
    } catch (err: any) {
      setError(err?.message || "Failed to refresh token");
    } finally {
      setRefreshing(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "youtube":
        return "🎬";
      case "instagram":
        return "📷";
      case "twitter":
        return "🐦";
      case "tiktok":
        return "🎵";
      case "facebook":
        return "👤";
      default:
        return "🔌";
    }
  };

  const getHealthColor = (score?: number) => {
    if (!score) return "text-gray-400";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getHealthLabel = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-green-50 text-green-700";
      case "fair":
        return "bg-yellow-50 text-yellow-700";
      case "poor":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const isLoading = account.platform.toLowerCase() === "twitter" && 
    loadingTwitterAuth[account.id];

  return (
    <div className="border rounded-xl p-4 space-y-3 hover:shadow-md transition-shadow">
      {/* Header with platform icon and name */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getPlatformIcon(account.platform)}</span>
          <h3 className="font-semibold">{account.platform}</h3>
        </div>
        
        {/* Health score indicator */}
        {account.health_score !== undefined && (
          <button
            onClick={() => setShowHealthDetails(!showHealthDetails)}
            className={`text-xs font-medium px-2 py-1 rounded-full ${getHealthLabel(account.health_status)}`}
          >
            {account.health_score} • {account.health_status}
          </button>
        )}
      </div>

      {/* Username */}
      <p className="text-sm text-gray-600 break-all">{account.username}</p>

      {/* Health details */}
      {showHealthDetails && account.health_score !== undefined && (
        <div className="text-xs bg-gray-50 p-3 rounded-lg space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Health Score:</span>
            <span className={getHealthColor(account.health_score)}>
              {account.health_score}%
            </span>
          </div>
          {account.health_status && (
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span>{account.health_status}</span>
            </div>
          )}
        </div>
      )}

      {/* Status badge */}
      {account.status && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Status:</span>
          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
            {account.status}
          </span>
        </div>
      )}

      {/* Twitter-specific authentication status */}
      {account.platform.toLowerCase() === "twitter" && (
        <div className="mt-2">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
              <span>Checking authentication...</span>
            </div>
          ) : account.twitter_connected ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-600">✓</span>
                <span className="text-green-600 font-medium">Twitter Connected</span>
                {account.twitter_token_expires_at && (
                  <span className="text-xs text-gray-500">
                    (Expires: {new Date(account.twitter_token_expires_at).toLocaleDateString()})
                  </span>
                )}
              </div>
              
              {/* Token refresh button */}
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefreshToken}
                disabled={refreshing}
                className="text-xs"
              >
                {refreshing ? "Refreshing..." : "Refresh Token"}
              </Button>
            </div>
          ) : (
            <TwitterConnectButton
              accountId={account.id}
              accountUsername={account.username}
              onConnected={() => checkTwitterAuth(account.id)}
            />
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-xs">
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={loadAccounts}
          className="flex-1"
        >
          Refresh
        </Button>

        <Button 
          size="sm" 
          variant="destructive" 
          onClick={handleDisconnect}
          className="flex-1"
          disabled={isLoading || refreshing}
        >
          Disconnect
        </Button>
      </div>

      {/* Group info if applicable */}
      {account.group_name && (
        <div className="text-xs text-gray-500 border-t pt-2 mt-2">
          <span className="font-medium">Group:</span> {account.group_name}
        </div>
      )}
    </div>
  );
}