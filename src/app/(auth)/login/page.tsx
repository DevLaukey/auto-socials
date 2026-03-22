"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "../../../../components/auth/AuthForm";
import { useAuthStore } from "@/src/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading, error, clearError } = useAuthStore();

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      buttonText="Sign in"
      onSubmit={login}
      linkDescription="Don't have an account?"
      linkText="Create one"
      linkHref="/register"
      forgotPasswordHref="/forgot-password"
      error={error}
      onErrorClear={clearError}
    />
  );
}
