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
  error?: string | null; // From store
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
  error, // Use directly from props, no localError
  onErrorClear,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPasswordField, setShowConfirmPasswordField] =
    useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const didMountRef = useRef(false);

  // Clear external error when user starts typing
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    if (error && onErrorClear) {
      onErrorClear();
    }
  }, [email, password, confirmPassword]);

  useEffect(() => {
    if (validationErrors.email) {
      setValidationErrors((prev) => ({ ...prev, email: undefined }));
    }
  }, [email]);

  useEffect(() => {
    if (validationErrors.password) {
      setValidationErrors((prev) => ({ ...prev, password: undefined }));
    }
  }, [password]);

  useEffect(() => {
    if (validationErrors.confirmPassword) {
      setValidationErrors((prev) => ({
        ...prev,
        confirmPassword: undefined,
      }));
    }
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

    if (submitting) return;

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      if (showConfirmPassword) {
        await onSubmit(email, password, confirmPassword);
      } else {
        await onSubmit(email, password);
      }
    } finally {
      setSubmitting(false);
    }
    // No catch - errors from store are passed via error prop
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
            )}
          </div>

          {/* Error Message Display - Use error directly from props */}
          {error && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-4">
              <div className="flex items-center gap-2 text-red-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitting}
                className={`w-full ${
                  validationErrors.email
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }`}
                autoComplete="email"
              />
              {validationErrors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={submitting}
                  className={`w-full pr-10 ${
                    validationErrors.password
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  autoComplete={
                    showConfirmPassword ? "new-password" : "current-password"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {validationErrors.password}
                </p>
              )}

              {forgotPasswordHref && !showConfirmPassword && (
                <div className="mt-1 text-right">
                  <Link
                    href={forgotPasswordHref}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}
            </div>

            {showConfirmPassword && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className={`w-full pr-10 ${
                      validationErrors.confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPasswordField(!showConfirmPasswordField)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPasswordField ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Please wait..." : buttonText}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          {linkDescription}{" "}
          <Link
            href={linkHref}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {linkText}
          </Link>
        </p>
      </div>
    </div>
  );
}
