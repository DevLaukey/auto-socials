"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "../../../../components/auth/AuthForm";
import { useAuthStore } from "@/src/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      buttonText="Sign in"
      onSubmit={async (email: string, password: string) => {
        await login(email, password);
      }}
      linkDescription="Don't have an account?"
      linkText="Create one"
      linkHref="/register"
    />
  );
}
