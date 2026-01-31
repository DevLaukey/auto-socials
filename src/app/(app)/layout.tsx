"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { useAuthStore } from "@/src/store/authStore";

export default function AppLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const checkAuth = useAuthStore((s) => s.checkAuth);

  /**
   * Run auth check once on mount
   */
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Redirect only AFTER auth check completes
   * - Not logged in → /login
   */
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  /**
   * While redirecting, prevent protected UI from flashing
   * TEMPORARILY DISABLED: Subscription check removed
   */
  if (!user) {
    return null;
  }

  return <AppShell title={title || "Dashboard"}>{children}</AppShell>;
}
