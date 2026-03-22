// src/lib/comments.ts

import { apiFetch } from "./api";

export interface CommentJob {
  job_id: number;
  account_id: number;
  target_url: string;
  comment: string;
  scheduled_time: string | null;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
}

export interface CommentJobDetails extends CommentJob {
  post_id?: number;
  attempts: number;
  max_attempts: number;
  error_message?: string;
  created_at: string;
  executed_time?: string;
}

export interface CommentAnalytics {
  summary: {
    total: number;
    completed: number;
    pending: number;
    failed: number;
    processing: number;
    success_rate: number;
    avg_delay_minutes: number;
    last_executed?: string | null;
    first_job?: string | null;
  };
  platform_breakdown: Array<{
    platform: string;
    total: number;
    completed: number;
    success_rate: number;
    avg_delay_minutes: number;
  }>;
  daily_activity: Array<{
    date: string;
    total: number;
    successful: number;
  }>;
}

/**
 * Get all comment jobs for a post
 */
export const getPostComments = async (
  postId: number,
): Promise<CommentJob[]> => {
  return apiFetch(`/posts/${postId}/comments`);
};

/**
 * Cancel a scheduled comment job
 */
export const cancelCommentJob = async (
  jobId: number,
): Promise<{ message: string }> => {
  return apiFetch(`/posts/comments/${jobId}`, {
    method: "DELETE",
  });
};

/**
 * Get comment analytics
 */
export const getCommentAnalytics = async (
  days: number = 30,
  status?: string,
): Promise<CommentAnalytics> => {
  let url = `/analytics/engagement/comments?days=${days}`;
  if (status) url += `&status=${status}`;
  return apiFetch(url);
};

/**
 * Retry a failed comment job
 */
export const retryCommentJob = async (
  jobId: number,
): Promise<{ message: string }> => {
  return apiFetch(`/comments/${jobId}/retry`, {
    method: "POST",
  });
};
