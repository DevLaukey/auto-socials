"use client";

import { useRouter } from "next/navigation";

const stats = [
  {
    label: "Connected Accounts",
    value: "8",
    href: "/accounts",
  },
  {
    label: "Scheduled Posts",
    value: "24",
    href: "/posts",
  },
  {
    label: "Videos Processed",
    value: "112",
    href: "/clips",
  },
  {
    label: "Analytics",
    value: "5",
    href: "/analytics",
  },
];

export default function StatsGrid() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          onClick={() => router.push(stat.href)}
          className="
            bg-white rounded-xl border p-4 cursor-pointer
            hover:shadow-md hover:border-slate-300 transition
          "
        >
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          <p className="text-2xl font-semibold mt-1">{stat.value}</p>

          <p className="mt-3 text-xs text-muted-foreground">View details →</p>
        </div>
      ))}
    </div>
  );
}
