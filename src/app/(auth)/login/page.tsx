"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "../../../../components/auth/AuthForm";
import { useAuthStore } from "@/src/store/authStore";
import Image from "next/image";

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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Logo Section */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-3">
          <Image
            src="/images/Logo.jpeg"
            alt="ClipperKiller Logo"
            width={160}
            height={160}
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      </div>

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
    </div>
  );
}