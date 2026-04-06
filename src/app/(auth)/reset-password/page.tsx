"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPasswordRequest } from "@/src/lib/auth";
import Image from "next/image";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!token) {
      setError("Invalid reset link");
      return;
    }

    setSubmitting(true);
    try {
      await resetPasswordRequest(token, password);
      setSuccess(true);
    } catch (err: any) {
      setError(
        typeof err?.message === "string" ? err.message : "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#1D4ED8] to-purple-600 flex items-center justify-center shadow-lg">
                <Image
                  src="/images/Logo.jpeg"
                  alt="ClipperKiller Logo"
                  width={64}
                  height={64}
                  className="object-contain p-1.5"
                  priority
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">CLIPPER KILLER</h1>
            <p className="text-xs text-gray-400 mt-1">
              SOCIAL MEDIA MANAGING SOFTWARE
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6 sm:p-8 shadow-sm text-center">
            <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-red-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Invalid link</h1>
            <p className="text-sm text-gray-400 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link href="/forgot-password">
              <Button className="w-full h-11 bg-[#1D4ED8] hover:bg-[#2563EB]">
                Request a new link
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#1D4ED8] to-purple-600 flex items-center justify-center shadow-lg">
                <Image
                  src="/images/Logo.jpeg"
                  alt="ClipperKiller Logo"
                  width={64}
                  height={64}
                  className="object-contain p-1.5"
                  priority
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">CLIPPER KILLER</h1>
            <p className="text-xs text-gray-400 mt-1">
              SOCIAL MEDIA MANAGING SOFTWARE
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6 sm:p-8 shadow-sm text-center">
            <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-green-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Password reset!
            </h1>
            <p className="text-sm text-gray-400 mb-6">
              Your password has been successfully updated.
            </p>
            <Link href="/login">
              <Button className="w-full h-11 bg-[#1D4ED8] hover:bg-[#2563EB]">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#1D4ED8] to-purple-600 flex items-center justify-center shadow-lg">
              <Image
                src="/images/Logo.jpeg"
                alt="ClipperKiller Logo"
                width={64}
                height={64}
                className="object-contain p-1.5"
                priority
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">CLIPPER KILLER</h1>
          <p className="text-xs text-gray-400 mt-1">
            SOCIAL MEDIA MANAGING SOFTWARE
          </p>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6 sm:p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-white">Reset password</h1>
            <p className="mt-2 text-sm text-gray-400">
              Enter your new password below
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                New password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={submitting}
                  className="w-full h-11 pr-10 bg-slate-900 border-slate-700 text-white placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Confirm new password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={submitting}
                  className="w-full h-11 pr-10 bg-slate-900 border-slate-700 text-white placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-medium bg-[#1D4ED8] hover:bg-[#2563EB]"
              disabled={submitting}
            >
              {submitting ? "Resetting…" : "Reset password"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-medium text-[#1D4ED8] hover:text-[#2563EB]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#1D4ED8] to-purple-600 flex items-center justify-center shadow-lg">
                  <Image
                    src="/images/Logo.jpeg"
                    alt="ClipperKiller Logo"
                    width={64}
                    height={64}
                    className="object-contain p-1.5"
                    priority
                  />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white">CLIPPER KILLER</h1>
              <p className="text-xs text-gray-400 mt-1">
                SOCIAL MEDIA MANAGING SOFTWARE
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-8 shadow-sm flex justify-center">
              <div className="w-6 h-6 border-2 border-gray-500 border-t-[#1D4ED8] rounded-full animate-spin" />
            </div>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
