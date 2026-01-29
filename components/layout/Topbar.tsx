"use client";

import { useRouter } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useAuthStore } from "@/src/store/authStore";

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
}

export default function Topbar({ title, onMenuClick }: TopbarProps) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

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

        <h1 className="text-base md:text-lg font-medium truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 rounded-md hover:bg-slate-100">
          <Bell size={18} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-8 w-8 md:h-10 md:w-10">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Account Settings</DropdownMenuItem>
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
