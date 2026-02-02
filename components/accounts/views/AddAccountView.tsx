"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { apiFetch } from "@/src/lib/api";
import { useAccountsStore } from "@/src/store/accountsStore";

type AddAccountViewProps = {
  onClose?: () => void; // ✅ optional
};

export default function AddAccountView({ onClose }: AddAccountViewProps) {
  const loadAccounts = useAccountsStore((s) => s.loadAccounts);
  const [platform, setPlatform] = useState("YouTube");
  const [accountUsername, setAccountUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiFetch("/social-accounts/connect", {
        method: "POST",
        body: JSON.stringify({
          platform,
          account_username: accountUsername,
          password,
        }),
      });

      // Refresh accounts store so list updates immediately
      await loadAccounts();

      if (typeof onClose === "function") {
        onClose();
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to connect account",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">Connect Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            <option value="YouTube">YouTube</option>
            <option value="Instagram">Instagram</option>
            <option value="Twitter/X">Twitter/X</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Account Username
          </label>
          <input
            type="text"
            value={accountUsername}
            onChange={(e) => setAccountUsername(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border px-3 py-2 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => typeof onClose === "function" && onClose()}
            className="rounded px-4 py-2 border"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Connecting..." : "Connect"}
          </button>
        </div>
      </form>
    </div>
  );
}
