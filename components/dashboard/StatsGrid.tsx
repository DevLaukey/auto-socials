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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          onClick={() => router.push(stat.href)}
          className="
            bg-white rounded-xl border p-3 md:p-4 cursor-pointer
            hover:shadow-md hover:border-slate-300 transition
          "
        >
          <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
          <p className="text-xl md:text-2xl font-semibold mt-1">{stat.value}</p>

          <p className="mt-2 md:mt-3 text-xs text-muted-foreground hidden sm:block">View details →</p>
        </div>
      ))}
    </div>
  );
}
