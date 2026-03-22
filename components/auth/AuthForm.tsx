"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AuthFormProps {
  title: string;
  subtitle?: string;
  buttonText: string;
  onSubmit: (
    email: string,
    password: string,
    confirmPassword?: string,
  ) => Promise<void>;
  linkText: string;
  linkHref: string;
  linkDescription: string;
  showConfirmPassword?: boolean;
  forgotPasswordHref?: string;
  error?: string | null;
  onErrorClear?: () => void;
}

export default function AuthForm({
  title,
  subtitle,
  buttonText,
  onSubmit,
  linkText,
  linkHref,
  linkDescription,
  showConfirmPassword = false,
  forgotPasswordHref,
  error,
  onErrorClear,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPasswordField, setShowConfirmPasswordField] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (error && onErrorClear) onErrorClear();
  }, [email, password, confirmPassword]);

  useEffect(() => {
    if (validationErrors.email)
      setValidationErrors((p) => ({ ...p, email: undefined }));
  }, [email]);

  useEffect(() => {
    if (validationErrors.password)
      setValidationErrors((p) => ({ ...p, password: undefined }));
  }, [password]);

  useEffect(() => {
    if (validationErrors.confirmPassword)
      setValidationErrors((p) => ({ ...p, confirmPassword: undefined }));
  }, [confirmPassword]);

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    if (showConfirmPassword) {
      if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || !validateForm()) return;
    setSubmitting(true);
    try {
      await onSubmit(email, password, showConfirmPassword ? confirmPassword : undefined);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-2">
          <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email address
          </label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={submitting}
            className={`w-full h-11 ${validationErrors.email ? "border-red-400 focus:ring-red-400" : ""}`}
            autoComplete="email"
          />
          {validationErrors.email && (
            <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            {forgotPasswordHref && !showConfirmPassword && (
              <Link
                href={forgotPasswordHref}
                className="text-xs text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting}
              className={`w-full h-11 pr-10 ${validationErrors.password ? "border-red-400 focus:ring-red-400" : ""}`}
              autoComplete={showConfirmPassword ? "new-password" : "current-password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        {showConfirmPassword && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                type={showConfirmPasswordField ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={submitting}
                className={`w-full h-11 pr-10 ${validationErrors.confirmPassword ? "border-red-400 focus:ring-red-400" : ""}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPasswordField(!showConfirmPasswordField)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPasswordField ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.confirmPassword}</p>
            )}
          </div>
        )}

        <Button type="submit" className="w-full h-11 text-sm font-medium" disabled={submitting}>
          {submitting ? "Please wait…" : buttonText}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        {linkDescription}{" "}
        <Link href={linkHref} className="font-medium text-blue-600 hover:text-blue-500">
          {linkText}
        </Link>
      </p>
    </div>
  );
}
