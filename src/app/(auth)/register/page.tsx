"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "../../../../components/auth/AuthForm";
import { useAuthStore } from "@/src/store/authStore";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const { register, user, loading } = useAuthStore();

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
    </div>
  );
}
