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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Logo Section */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#1D4ED8] to-purple-600 flex items-center justify-center shadow-lg">
            <Image
              src="/images/Logo.jpeg"
              alt="ClipperKiller Logo"
              width={64}
              height={64}
              className="object-contain p-1.5"
              priority
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white">CLIPPER KILLER</h1>
        <p className="text-xs text-gray-400 mt-1">
          SOCIAL MEDIA MANAGING SOFTWARE
        </p>
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
