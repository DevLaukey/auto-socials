"use client";

import { useAuthStore } from "@/src/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, checkAuth } = useAuthStore();
  const router = useRouter();

  // Re-check backend auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect only AFTER auth check completes
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // Block render while checking auth
  if (loading) return null;

  return <>{children}</>;
}
