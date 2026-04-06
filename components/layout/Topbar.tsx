"use client";

import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useAuthStore } from "@/src/store/authStore";
import Image from "next/image";
import Link from "next/link";

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
}

export default function Topbar({ title, onMenuClick }: TopbarProps) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  // Get user initials for avatar
  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Get display name
  const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  return (
    <header className="h-14 md:h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Hamburger menu - visible only on mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} className="text-gray-600" />
        </button>

        {/* Logo for mobile (when sidebar is hidden) */}
        <Link
          href="/dashboard"
          className="lg:hidden flex items-center gap-2 group"
        >
          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-[#1D4ED8] to-purple-600 flex items-center justify-center shadow-md">
            <Image
              src="/images/Logo.jpeg"
              alt="ClipperKiller Logo"
              width={32}
              height={32}
              className="object-contain p-0.5"
              priority
            />
          </div>
          <span className="font-semibold text-sm text-gray-800 group-hover:text-[#1D4ED8] transition-colors">
            CLIPPER KILLER
          </span>
        </Link>

        {/* Page title with icon - Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-[#1D4ED8] to-purple-600 rounded-full"></div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {title === "Dashboard"
                ? "Overview of your automation activity"
                : `Manage your ${title.toLowerCase()}`}
            </p>
          </div>
        </div>

        {/* Page title - Mobile */}
        <h1 className="text-base md:text-lg font-semibold text-gray-800 lg:hidden">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* User info - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              {getDisplayName()}
            </p>
            <p className="text-xs text-gray-400">User</p>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none group">
              <Avatar className="h-9 w-9 md:h-10 md:w-10 bg-gradient-to-br from-[#1D4ED8] to-purple-600 ring-2 ring-white shadow-md transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg">
                <AvatarFallback className="text-white text-sm font-medium">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-xs text-gray-400">Signed in as</p>
              <p className="text-sm font-semibold text-gray-800 truncate">
                {getDisplayName()}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <DropdownMenuItem
              onClick={() => router.push("/settings")}
              className="cursor-pointer py-2.5"
            >
              <svg
                className="w-4 h-4 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await logout();
                router.replace("/login");
              }}
              className="cursor-pointer py-2.5 text-red-600 focus:text-red-600"
            >
              <svg
                className="w-4 h-4 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
