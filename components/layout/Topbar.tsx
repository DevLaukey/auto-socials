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
    return "U";
  };

  return (
    <header className="h-14 md:h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger menu - visible only on mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-md hover:bg-slate-100"
        >
          <Menu size={20} />
        </button>

        {/* Logo for mobile (when sidebar is hidden) */}
        <Link href="/" className="lg:hidden flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-[#1D4ED8] to-purple-600 flex items-center justify-center">
            <Image
              src="/images/Logo.jpeg"
              alt="ClipperKiller Logo"
              width={32}
              height={32}
              className="object-contain p-0.5"
            />
          </div>
          <span className="font-semibold text-sm text-slate-800">
            CLIPPER KILLER
          </span>
        </Link>

        {/* Page title - hidden on mobile when showing logo */}
        <h1 className="text-base md:text-lg font-medium truncate hidden lg:block">
          {title}
        </h1>
        <h1 className="text-base md:text-lg font-medium truncate lg:hidden">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* User info - optional */}
        {user?.name && (
          <span className="text-sm text-gray-600 hidden md:block">
            {user.name}
          </span>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-8 w-8 md:h-10 md:w-10 bg-gradient-to-br from-[#1D4ED8] to-purple-600">
              <AvatarFallback className="text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await logout();
                router.replace("/login");
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
