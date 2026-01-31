"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listPosts, Post } from "@/src/lib/posts";

export default function UpcomingPosts() {
  const router = useRouter();
  const [upcoming, setUpcoming] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpcoming() {
      try {
        const allPosts = await listPosts();
        const now = new Date();
        const scheduled = (allPosts ?? [])
          .filter(
            (p) =>
              (p.status === "scheduled" || p.status === "pending") &&
              p.scheduled_time &&
              new Date(p.scheduled_time) > now
          )
          .sort(
            (a, b) =>
              new Date(a.scheduled_time!).getTime() -
              new Date(b.scheduled_time!).getTime()
          )
          .slice(0, 5);
        setUpcoming(scheduled);
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    }
    fetchUpcoming();
  }, []);

  function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div
      onClick={() => router.push("/posts")}
      className="
        bg-white rounded-xl border p-3 md:p-4 cursor-pointer
        hover:shadow-md hover:border-slate-300 transition
      "
    >
      <h2 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Upcoming Posts</h2>

      {loading ? (
        <p className="text-xs text-muted-foreground">Loading...</p>
      ) : upcoming.length === 0 ? (
        <p className="text-xs text-muted-foreground">No upcoming posts scheduled.</p>
      ) : (
        <ul className="space-y-2 md:space-y-3">
          {upcoming.map((post) => (
            <li key={post.id} className="text-xs md:text-sm">
              <span className="font-medium">
                {post.title || post.accounts?.[0]?.platform || "Post"}
              </span>
              <span className="text-muted-foreground">
                {" "}
                — {formatTime(post.scheduled_time!)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 md:mt-4 text-xs text-muted-foreground">
        View scheduled posts →
      </p>
    </div>
  );
}
