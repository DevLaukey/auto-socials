"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccountsStore } from "@/src/store/accountsStore";
import { listPosts, Post } from "@/src/lib/posts";

export default function StatsGrid() {
  const router = useRouter();
  const { accounts, loadAccounts } = useAccountsStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        await loadAccounts();
        const allPosts = await listPosts();
        setPosts(allPosts ?? []);
      } catch {
        // silently handle errors — stats will show 0
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [loadAccounts]);

  const scheduledCount = posts.filter(
    (p) => p.status === "scheduled" || p.status === "pending"
  ).length;

  const publishedCount = posts.filter(
    (p) => p.status === "published" || p.status === "executed" || p.status === "success"
  ).length;

  const stats = [
    {
      label: "Connected Accounts",
      value: loading ? "—" : String(accounts.length),
      href: "/accounts",
    },
    {
      label: "Scheduled Posts",
      value: loading ? "—" : String(scheduledCount),
      href: "/posts",
    },
    {
      label: "Published Posts",
      value: loading ? "—" : String(publishedCount),
      href: "/posts",
    },
    {
      label: "Total Posts",
      value: loading ? "—" : String(posts.length),
      href: "/posts",
    },
  ];

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
