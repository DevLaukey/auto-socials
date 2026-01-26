"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

interface Post {
  id: number;
  scheduled_time: string;
  title: string | null;
  description: string | null;
  status: "scheduled";
}

export default function ScheduledPostsModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScheduled() {
      try {
        const res = await api.get("/posts");
        const scheduled = res.data.filter((p: any) => p.status === "scheduled");
        setPosts(scheduled);
      } finally {
        setLoading(false);
      }
    }

    loadScheduled();
  }, []);

  function formatDate(value: string) {
    return new Date(value).toLocaleString();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4">
        <h2 className="text-lg font-semibold">Scheduled Posts</h2>

        {loading && (
          <p className="text-sm text-muted-foreground">
            Loading scheduled posts…
          </p>
        )}

        {!loading && posts.length === 0 && (
          <p className="text-sm text-muted-foreground">No scheduled posts</p>
        )}

        {!loading && posts.length > 0 && (
          <div className="space-y-2 text-sm">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border rounded-md p-3 flex justify-between"
              >
                <div>
                  <div className="font-medium">
                    {post.title || post.description || "Untitled post"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Scheduled for {formatDate(post.scheduled_time)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
