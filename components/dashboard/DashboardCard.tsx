"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function DashboardCard({
  title,
  value,
  icon,
  href,
  description,
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
  href: string;
  description?: string;
}) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(href)}
      className={cn(
        "cursor-pointer rounded-xl border bg-white p-3 md:p-5",
        "hover:shadow-md hover:border-slate-300 transition"
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm text-muted-foreground">{title}</p>
          <p className="text-xl md:text-2xl font-semibold">{value}</p>
        </div>
        <div className="text-muted-foreground hidden sm:block">{icon}</div>
      </div>

      {description && (
        <p className="mt-2 md:mt-3 text-xs md:text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
