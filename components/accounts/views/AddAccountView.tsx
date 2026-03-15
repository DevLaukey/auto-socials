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
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await apiFetch("/social-accounts/connect", {
        method: "POST",
        body: JSON.stringify({
          platform,
          account_username: accountUsername,
          password,
        }),
      });

      await loadAccounts();
      setSuccess(`${platform} account "${accountUsername}" connected successfully!`);

      setTimeout(() => {
        if (typeof onClose === "function") onClose();
      }, 1500);
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
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Platform</label>
          <select
            value={platform}
            onChange={(e) => { setPlatform(e.target.value); setError(null); }}
            className="w-full rounded border px-3 py-2"
            disabled={loading || !!success}
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
            onChange={(e) => { setAccountUsername(e.target.value); setError(null); }}
            className="w-full rounded border px-3 py-2"
            required
            disabled={loading || !!success}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              className="w-full rounded border px-3 py-2 pr-10"
              required
              disabled={loading || !!success}
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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

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
            disabled={loading || !!success}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Connecting..." : success ? "Connected!" : "Connect"}
          </button>
        </div>
      </form>
    </div>
  );
}
