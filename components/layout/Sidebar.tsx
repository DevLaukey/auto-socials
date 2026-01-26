"use client";

import {
  LayoutDashboard,
  MessageSquare,
  Bell,
  Share2,
  BarChart3,
  Settings,
  Scissors,
  Users,
  Send,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Accounts", href: "/accounts", icon: Share2 },
  { label: "Posts", href: "/posts", icon: Send },
  { label: "AI Clips", href: "/clips", icon: Scissors },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col">
      <div className="px-6 py-4 text-xl font-semibold">AutoPlatform</div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm
                ${active ? "bg-slate-800 text-white" : "hover:bg-slate-800"}`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator className="my-2 bg-slate-700" />

      {/* Admin Section */}
      <div className="px-4 pb-4 space-y-1">
        <p className="text-xs text-slate-400 px-3">Admin</p>
        <Link
          href="/admin/users"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-sm"
        >
          <Users size={18} />
          Users
        </Link>
        <Link
          href="/admin/logs"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 text-sm"
        >
          <FileText size={18} />
          System Logs
        </Link>
      </div>
    </aside>
  );
}
