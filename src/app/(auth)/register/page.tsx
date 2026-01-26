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
      router.replace("/login");
    }
  }, [loading, user, router]);

  return (
    <AuthForm
      title="Create an account"
      buttonText="Register"
      onSubmit={async (email: string, password: string) => {
        await register(email, password);
      }}
    />
  );
}
