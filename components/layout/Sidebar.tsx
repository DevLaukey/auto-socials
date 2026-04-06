"use client";

import {
  LayoutDashboard,
  MessageSquare,
  Share2,
  BarChart3,
  Settings,
  Scissors,
  Users,
  Send,
  FileText,
  X,
  CreditCard,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/src/store/authStore";
import Image from "next/image";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Accounts", href: "/accounts", icon: Share2 },
  { label: "Posts", href: "/posts", icon: Send },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "AI Clips", href: "/clips", icon: Scissors },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Header with logo */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-[#1D4ED8] to-purple-600 flex items-center justify-center">
            <Image
              src="/images/Logo.jpeg"
              alt="ClipperKiller Logo"
              width={40}
              height={40}
              className="object-contain p-1"
              priority
            />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-tight group-hover:text-[#1D4ED8] transition">
              CLIPPER KILLER
            </h1>
            <p className="text-[8px] text-gray-400 -mt-1">
              SOCIAL MEDIA MANAGING SOFTWARE
            </p>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md hover:bg-slate-800"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
                ${active ? "bg-slate-800 text-white" : "hover:bg-slate-800"}`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {user?.is_admin && (
        <>
          <Separator className="my-2 bg-slate-700" />

          {/* Admin Section */}
          <div className="px-4 pb-4 space-y-1">
            <p className="text-xs text-slate-400 px-3 mb-2">Admin</p>
            <Link
              href="/admin/users"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm
                ${pathname === "/admin/users" ? "bg-slate-800 text-white" : "hover:bg-slate-800"}`}
            >
              <Users size={18} />
              Users
            </Link>
            <Link
              href="/admin/tiers"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm
                ${pathname === "/admin/tiers" ? "bg-slate-800 text-white" : "hover:bg-slate-800"}`}
            >
              <Layers size={18} />
              Tiers
            </Link>
          </div>
        </>
      )}
    </aside>
  );
}
