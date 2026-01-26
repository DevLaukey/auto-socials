"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AuthFormProps {
  title: string;
  buttonText: string;
  onSubmit: (email: string, password: string) => Promise<void>;
}

export default function AuthForm({
  title,
  buttonText,
  onSubmit,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (submitting) return;

    setError(null);
    setSubmitting(true);

    try {
      // 🔑 Delegate logic (login / register / auto-login) to parent
      await onSubmit(email, password);
    } catch (err: any) {
      // ✅ Surface backend / auth errors cleanly
      setError(
        typeof err?.message === "string" ? err.message : "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border bg-white p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">{title}</h1>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <Button
          type="submit" // ✅ REQUIRED
          className="w-full"
          disabled={submitting}
        >
          {submitting ? "Please wait…" : buttonText}
        </Button>
      </form>
      {/* register link */}
      <p className="absolute bottom-4 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-500 hover:underline">
          Register
        </a>
      </p>
    </div>
  );
}
