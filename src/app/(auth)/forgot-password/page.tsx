"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordRequest } from "@/src/lib/auth";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      await forgotPasswordRequest(email);
      setSuccess(true);
    } catch (err: any) {
      setError(
        typeof err?.message === "string" ? err.message : "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Check your email
            </h1>
            <p className="text-sm text-gray-400 mb-1">
              We&apos;ve sent a reset link to
            </p>
            <p className="text-sm font-medium text-white mb-6">{email}</p>
            <p className="text-xs text-gray-500 mb-6">
              Didn&apos;t receive it? Check your spam folder.
            </p>
            <Button
              onClick={() => setSuccess(false)}
              variant="outline"
              className="w-full h-11 border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
            >
              Try another email
            </Button>
            <p className="mt-5 text-center text-sm text-gray-500">
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
            <h1 className="text-2xl font-bold text-white">Forgot password?</h1>
            <p className="mt-2 text-sm text-gray-400">
              Enter your email and we&apos;ll send you a reset link
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
                Email address
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitting}
                className="w-full h-11 bg-slate-900 border-slate-700 text-white placeholder:text-gray-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-medium bg-[#1D4ED8] hover:bg-[#2563EB]"
              disabled={submitting}
            >
              {submitting ? "Sending…" : "Send reset link"}
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
