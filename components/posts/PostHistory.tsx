"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import ScheduleModal from "./modals/ScheduleModal";

interface Account {
  id: number;
  platform: string;
  username: string;
}

interface Post {
  id: number;
  title?: string;
  description?: string;
  status: string;
  scheduled_time?: string | null;
  created_at: string;
  accounts?: Account[];
}

export default function PostHistory() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [viewPost, setViewPost] = useState<Post | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const executeNow = async (postId: number) => {
    await api.post(`/posts/${postId}/execute`);
    loadPosts();
  };

  const cancelSchedule = async (postId: number) => {
    await api.patch(`/posts/${postId}/cancel`);
    loadPosts();
  };

  const renderActions = (post: Post) => {
    const status = post.status.toLowerCase();

    if (status === "scheduled") {
      return (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              executeNow(post.id);
            }}
            className="px-2 py-1 text-xs bg-green-600 text-white rounded"
          >
            Post now
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingPost(post);
            }}
            className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
          >
            Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              cancelSchedule(post.id);
            }}
            className="px-2 py-1 text-xs bg-red-600 text-white rounded"
          >
            Cancel
          </button>
        </div>
      );
    }

    if (status === "pending") {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            executeNow(post.id);
          }}
          className="px-2 py-1 text-xs bg-orange-600 text-white rounded"
        >
          Retry
        </button>
      );
    }
    const repostNow = async (postId: number) => {
      await api.post(`/posts/${postId}/repost`);
      loadPosts();
    };

    if (status === "failed") {
      return (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              repostNow(post.id);
            }}
            className="px-2 py-1 text-xs bg-orange-600 text-white rounded"
          >
            Repost
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingPost(post);
            }}
            className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
          >
            Reschedule
          </button>
        </div>
      );
    }

    return <span className="text-muted-foreground">—</span>;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Post History</h2>

      {loading && <p>Loading...</p>}

      <table className="w-full border">
        <thead>
          <tr className="bg-muted text-left text-sm">
            <th className="p-2">Title</th>
            <th className="p-2">Status</th>
            <th className="p-2">Scheduled</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {posts.map((post) => (
            <tr
              key={post.id}
              className="border-t cursor-pointer hover:bg-muted/50"
              onClick={() => setViewPost(post)}
            >
              <td className="p-2">{post.title || "—"}</td>
              <td className="p-2 capitalize">{post.status}</td>
              <td className="p-2">
                {post.scheduled_time
                  ? new Date(post.scheduled_time).toLocaleString()
                  : "—"}
              </td>
              <td className="p-2">{renderActions(post)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* DETAILS MODAL */}
      {viewPost && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Post Details</h3>
              <button
                onClick={() => setViewPost(null)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="text-sm space-y-2">
              <div>
                <strong>Title:</strong>
                <div>{viewPost.title || "—"}</div>
              </div>

              <div>
                <strong>Description:</strong>
                <div className="whitespace-pre-wrap">
                  {viewPost.description || "—"}
                </div>
              </div>

              <div>
                <strong>Status:</strong> {viewPost.status}
              </div>

              <div>
                <strong>Created:</strong>{" "}
                {new Date(viewPost.created_at).toLocaleString()}
              </div>

              <div>
                <strong>Scheduled:</strong>{" "}
                {viewPost.scheduled_time
                  ? new Date(viewPost.scheduled_time).toLocaleString()
                  : "—"}
              </div>

              <div>
                <strong>Accounts:</strong>
                <ul className="list-disc list-inside">
                  {viewPost.accounts?.length ? (
                    viewPost.accounts.map((acc) => (
                      <li key={acc.id}>
                        {acc.platform} — {acc.username}
                      </li>
                    ))
                  ) : (
                    <li>—</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingPost && (
        <ScheduleModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onUpdated={loadPosts}
        />
      )}
    </div>
  );
}
