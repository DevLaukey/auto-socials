"use client";

import { useEffect, useState } from "react";
import { listPosts, Post } from "@/src/lib/posts";

export default function ActivityFeed() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecent() {
      try {
        const allPosts = await listPosts();
        const sorted = (allPosts ?? [])
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          .slice(0, 5);
        setRecentPosts(sorted);
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    }
    fetchRecent();
  }, []);

  function formatActivity(post: Post): string {
    const title = post.title || "Untitled";
    const platforms = post.accounts?.map((a) => a.platform).join(", ") || "";
    const statusLabel =
      post.status === "published" || post.status === "executed" || post.status === "success"
        ? "Published"
        : post.status === "scheduled" || post.status === "pending"
        ? "Scheduled"
        : post.status === "failed"
        ? "Failed"
        : post.status === "cancelled"
        ? "Cancelled"
        : post.status;

    return `${statusLabel}: "${title}"${platforms ? ` on ${platforms}` : ""}`;
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className="lg:col-span-2 bg-white rounded-xl border p-3 md:p-4">
      <h2 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Recent Activity</h2>

      {loading ? (
        <p className="text-xs text-muted-foreground">Loading...</p>
      ) : recentPosts.length === 0 ? (
        <p className="text-xs text-muted-foreground">No recent activity.</p>
      ) : (
        <ul className="space-y-2 md:space-y-3">
          {recentPosts.map((post) => (
            <li key={post.id} className="text-xs md:text-sm text-muted-foreground">
              <span>{formatActivity(post)}</span>
              <span className="ml-2 text-xs opacity-70">
                {formatDate(post.created_at)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
