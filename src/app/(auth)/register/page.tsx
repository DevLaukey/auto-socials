"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "../../../../components/auth/AuthForm";
import { useAuthStore } from "@/src/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const { register, user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  return (
    <AuthForm
      title="Create your account"
      subtitle="Get started with your free account today"
      buttonText="Create account"
      onSubmit={async (email: string, password: string) => {
        await register(email, password);
      }}
      linkDescription="Already have an account?"
      linkText="Sign in"
      linkHref="/login"
      showConfirmPassword
    />
  );
}
