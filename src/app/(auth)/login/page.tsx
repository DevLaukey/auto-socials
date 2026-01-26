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
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  return (
    <AuthForm
      title="Sign in to your account"
      buttonText="Login"
      onSubmit={async (email: string, password: string) => {
        await login(email, password);
      }}
    />
  );
}
