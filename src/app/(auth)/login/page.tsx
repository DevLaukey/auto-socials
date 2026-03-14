"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "../../../../components/auth/AuthForm";
import { useAuthStore } from "@/src/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading, error, clearError } = useAuthStore();

  // Log error changes
  useEffect(() => {
    console.log("LoginPage - error changed:", error);
  }, [error]);

  useEffect(() => {
    console.log("LoginPage render - error:", error);
  });

  useEffect(() => {
    // Clear any previous errors when component mounts
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
  };

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      buttonText="Sign in"
      onSubmit={handleLogin}
      linkDescription="Don't have an account?"
      linkText="Create one"
      linkHref="/register"
      forgotPasswordHref="/forgot-password"
      error={error}
      onErrorClear={clearError}
    />
  );
}
