"use client";

import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export default function Topbar({ title }: { title: string }) {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-medium">{title}</h1>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-md hover:bg-slate-100">
          <Bell size={18} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Account Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
