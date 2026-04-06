"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { useAuthStore } from "@/src/store/authStore";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const checkAuth = useAuthStore((s) => s.checkAuth);

  // Get the page title based on the current path
  const getPageTitle = () => {
    const path = pathname;
    if (path === "/") return "Dashboard";
    if (path === "/accounts") return "Accounts";
    if (path === "/posts") return "Posts";
    if (path === "/payments") return "Payments";
    if (path === "/clips") return "AI Clips";
    if (path === "/messages") return "Messages";
    if (path === "/analytics") return "Analytics";
    if (path === "/settings") return "Settings";
    if (path?.startsWith("/admin")) return "Admin Panel";
    return "CLIPPER KILLER";
  };

  /**
   * Run auth check once on mount
   */
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (!user) {
    return null;
  }

  const title = getPageTitle();

  return <AppShell title={title}>{children}</AppShell>;
}
