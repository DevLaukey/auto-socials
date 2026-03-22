"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Eye, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Post,
  PostStatus,
  CommentJob,
  DMJob,
  listPosts,
  getPost,
  getPostStatus,
  executePost,
  cancelPost,
  reschedulePost,
  repostPost,
  getPostComments,
  cancelCommentJob,
  getPostDMs,
  cancelDMJob,
  formatCommentJobStatus,
  formatDMJobStatus,
} from "@/src/lib/posts";

export default function PostHistory() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // View post details dialog
  const [viewPost, setViewPost] = useState<Post | null>(null);
  const [postStatus, setPostStatus] = useState<PostStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // Engagement jobs
  const [commentJobs, setCommentJobs] = useState<CommentJob[]>([]);
  const [dmJobs, setDmJobs] = useState<DMJob[]>([]);
  const [jobActionLoading, setJobActionLoading] = useState<number | null>(null);

  // Reschedule dialog
  const [rescheduleDialog, setRescheduleDialog] = useState<Post | null>(null);
  const [newScheduleTime, setNewScheduleTime] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    setError(null);
    try {
      const data = await listPosts();
      const sorted = (data ?? []).sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setPosts(sorted);
    } catch (err: any) {
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }

  async function handleViewPost(post: Post) {
    setViewPost(post);
    setStatusLoading(true);
    setPostStatus(null);
    setCommentJobs([]);
    setDmJobs([]);
    try {
      const [fullPost, status, comments, dms] = await Promise.all([
        getPost(post.id),
        getPostStatus(post.id),
        getPostComments(post.id).catch(() => []),
        getPostDMs(post.id).catch(() => []),
      ]);
      setViewPost(fullPost);
      setPostStatus(status);
      setCommentJobs(comments ?? []);
      setDmJobs(dms ?? []);
    } catch (err: any) {
      console.error("Failed to load post details:", err);
    } finally {
      setStatusLoading(false);
    }
  }

  async function handleCancelComment(jobId: number) {
    if (!viewPost) return;
    setJobActionLoading(jobId);
    try {
      await cancelCommentJob(jobId);
      const updated = await getPostComments(viewPost.id).catch(() => []);
      setCommentJobs(updated ?? []);
    } catch (err: any) {
      alert(err.message || "Failed to cancel comment job");
    } finally {
      setJobActionLoading(null);
    }
  }

  async function handleCancelDM(jobId: number) {
    if (!viewPost) return;
    setJobActionLoading(jobId);
    try {
      await cancelDMJob(jobId);
      const updated = await getPostDMs(viewPost.id).catch(() => []);
      setDmJobs(updated ?? []);
    } catch (err: any) {
      alert(err.message || "Failed to cancel DM job");
    } finally {
      setJobActionLoading(null);
    }
  }

  async function handleExecute(postId: number) {
    setActionLoading(postId);
    try {
      await executePost(postId);
      await loadPosts();
    } catch (err: any) {
      alert(err.message || "Failed to execute post");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCancel(postId: number) {
    if (!confirm("Cancel this scheduled post?")) return;
    setActionLoading(postId);
    try {
      await cancelPost(postId);
      await loadPosts();
    } catch (err: any) {
      alert(err.message || "Failed to cancel post");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReschedule() {
    if (!rescheduleDialog || !newScheduleTime) return;
    setActionLoading(rescheduleDialog.id);
    try {
      await reschedulePost(rescheduleDialog.id, newScheduleTime);
      await loadPosts();
      setRescheduleDialog(null);
      setNewScheduleTime("");
    } catch (err: any) {
      alert(err.message || "Failed to reschedule post");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRepost(postId: number) {
    setActionLoading(postId);
    try {
      await repostPost(postId);
      await loadPosts();
    } catch (err: any) {
      alert(err.message || "Failed to repost");
    } finally {
      setActionLoading(null);
    }
  }

  function openRescheduleDialog(post: Post) {
    setRescheduleDialog(post);
    setNewScheduleTime(
      post.scheduled_time ? post.scheduled_time.slice(0, 16) : ""
    );
  }

  function getStatusBadge(status: string) {
    const s = status.toLowerCase();
    switch (s) {
      case "scheduled":
        return <Badge variant="info">Scheduled</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "executing":
        return <Badge variant="warning">Executing</Badge>;
      case "completed":
      case "success":
        return <Badge variant="success">Completed</Badge>;
      case "failed":
        return <Badge variant="danger">Failed</Badge>;
      case "cancelled":
        return <Badge variant="default">Cancelled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  }

  function renderActions(post: Post) {
    const status = post.status.toLowerCase();
    const isLoading = actionLoading === post.id;

    if (status === "scheduled") {
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleExecute(post.id);
            }}
            disabled={isLoading}
          >
            Post Now
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              openRescheduleDialog(post);
            }}
            disabled={isLoading}
          >
            Reschedule
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              handleCancel(post.id);
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      );
    }

    if (status === "pending") {
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleRepost(post.id);
            }}
            disabled={isLoading}
          >
            Repost
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              openRescheduleDialog(post);
            }}
            disabled={isLoading}
          >
            Reschedule
          </Button>
        </div>
      );
    }

    if (status === "failed") {
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleRepost(post.id);
            }}
            disabled={isLoading}
          >
            Retry
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              openRescheduleDialog(post);
            }}
            disabled={isLoading}
          >
            Reschedule
          </Button>
        </div>
      );
    }

    return <span className="text-gray-400">-</span>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Post History</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={loadPosts}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Platform
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Scheduled
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  AI Jobs
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Created
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Loading posts...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No posts found. Create your first post to get started.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewPost(post)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {post.title || "Untitled"}
                        </span>
                        <Eye
                          size={14}
                          className="text-gray-400 hover:text-gray-600"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {post.accounts && post.accounts.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {post.accounts.map((acc) => (
                            <Badge key={acc.id} variant="default">
                              {acc.platform}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(post.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {post.scheduled_time ? (
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(post.scheduled_time).toLocaleString()}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {(post.comment_jobs_count ?? 0) > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">
                            💬 {post.comment_jobs_count}
                          </span>
                        )}
                        {(post.dm_jobs_count ?? 0) > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
                            ✉️ {post.dm_jobs_count}
                          </span>
                        )}
                        {!post.comment_jobs_count && !post.dm_jobs_count && (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {renderActions(post)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Post Details Dialog */}
      <Dialog open={!!viewPost} onOpenChange={() => setViewPost(null)}>
        <DialogClose onClose={() => setViewPost(null)} />
        <DialogHeader>
          <DialogTitle>Post Details</DialogTitle>
        </DialogHeader>
        <DialogContent>
          {viewPost && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Title</label>
                <p className="text-gray-900">{viewPost.title || "Untitled"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Description
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {viewPost.description || "-"}
                </p>
              </div>

              {viewPost.hashtags && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Hashtags
                  </label>
                  <p className="text-gray-900">{viewPost.hashtags}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <div className="mt-1">{getStatusBadge(viewPost.status)}</div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Created
                  </label>
                  <p className="text-gray-900">
                    {new Date(viewPost.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {viewPost.scheduled_time && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Scheduled For
                  </label>
                  <p className="text-gray-900">
                    {new Date(viewPost.scheduled_time).toLocaleString()}
                  </p>
                </div>
              )}

              {viewPost.accounts && viewPost.accounts.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Accounts
                  </label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {viewPost.accounts.map((acc) => (
                      <Badge key={acc.id} variant="default">
                        {acc.platform} - {acc.username}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {statusLoading ? (
                <div className="text-gray-500 text-sm">Loading status...</div>
              ) : postStatus?.error_message ? (
                <div className="rounded-md bg-red-50 border border-red-200 p-3">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle size={16} />
                    <span className="font-medium">Error</span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">
                    {postStatus.error_message}
                  </p>
                </div>
              ) : null}

              {postStatus?.executed_at && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Executed At
                  </label>
                  <p className="text-gray-900">
                    {new Date(postStatus.executed_at).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Scheduled Comment Jobs */}
              {commentJobs.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">
                    AI Comment Jobs ({commentJobs.length})
                  </label>
                  <div className="space-y-2">
                    {commentJobs.map((job) => {
                      const s = formatCommentJobStatus(job.status);
                      return (
                        <div
                          key={job.job_id}
                          className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-800 truncate">{job.comment}</p>
                            {job.scheduled_time && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {new Date(job.scheduled_time).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>
                              {s.label}
                            </span>
                            {job.status === "pending" && (
                              <button
                                onClick={() => handleCancelComment(job.job_id)}
                                disabled={jobActionLoading === job.job_id}
                                className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40"
                              >
                                {jobActionLoading === job.job_id ? "…" : "Cancel"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Scheduled DM Jobs */}
              {dmJobs.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">
                    AI DM Jobs ({dmJobs.length})
                  </label>
                  <div className="space-y-2">
                    {dmJobs.map((job) => {
                      const s = formatDMJobStatus(job.status);
                      return (
                        <div
                          key={job.job_id}
                          className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 mb-0.5">
                              To: <span className="font-medium text-gray-600">@{job.recipient}</span>
                            </p>
                            <p className="text-gray-800 truncate">{job.message}</p>
                            {job.scheduled_time && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {new Date(job.scheduled_time).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>
                              {s.label}
                            </span>
                            {job.status === "pending" && (
                              <button
                                onClick={() => handleCancelDM(job.job_id)}
                                disabled={jobActionLoading === job.job_id}
                                className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40"
                              >
                                {jobActionLoading === job.job_id ? "…" : "Cancel"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogFooter>
          <Button onClick={() => setViewPost(null)}>Close</Button>
        </DialogFooter>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog
        open={!!rescheduleDialog}
        onOpenChange={() => setRescheduleDialog(null)}
      >
        <DialogClose onClose={() => setRescheduleDialog(null)} />
        <DialogHeader>
          <DialogTitle>Reschedule Post</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Schedule Time
          </label>
          <Input
            type="datetime-local"
            value={newScheduleTime}
            onChange={(e) => setNewScheduleTime(e.target.value)}
          />
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setRescheduleDialog(null)}>
            Cancel
          </Button>
          <Button
            onClick={handleReschedule}
            disabled={!newScheduleTime || actionLoading !== null}
          >
            {actionLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
