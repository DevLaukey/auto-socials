// src/lib/dms.ts

import { apiFetch } from "./api";

export interface DMJob {
  job_id: number;
  account_id: number;
  recipient: string;
  message: string;
  scheduled_time: string | null;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
}

export interface DMJobDetails extends DMJob {
  post_id?: number;
  attempts: number;
  max_attempts: number;
  error_message?: string;
  created_at: string;
  executed_time?: string;
}

export interface Conversation {
  id: number;
  recipient: string;
  last_message_at: string;
  message_count: number;
  ai_generated_count: number;
}

export interface DMConversation {
  conversation_id: number;
  recipient: string;
  message_count: number;
  last_message: string;
  ai_percentage: number;
}

export interface DMAnalytics {
  jobs: {
    total: number;
    completed: number;
    pending: number;
    failed: number;
    processing: number;
    success_rate: number;
    avg_delay_minutes: number;
  };
  conversations: {
    total: number;
    active_7d: number;
    avg_messages: number;
    avg_response_time_minutes: number;
  };
}

/**
 * Get all DM jobs for a post
 */
export const getPostDMs = async (postId: number): Promise<DMJob[]> => {
  return apiFetch(`/posts/${postId}/dms`);
};

/**
 * Cancel a scheduled DM job
 */
export const cancelDMJob = async (jobId: number): Promise<{ message: string }> => {
  return apiFetch(`/posts/dms/${jobId}`, {
    method: "DELETE",
  });
};

/**
 * Get DM analytics
 */
export const getDMAnalytics = async (
  days: number = 30,
  status?: string
): Promise<DMAnalytics> => {
  let url = `/analytics/engagement/dms?days=${days}`;
  if (status) url += `&status=${status}`;
  return apiFetch(url);
};

/**
 * Get active conversations
 */
export const getConversations = async (days: number = 30): Promise<DMConversation[]> => {
  return apiFetch(`/analytics/conversations?days=${days}`);
};

/**
 * Send an AI-powered DM reply
 */
export const sendAIReply = async (
  conversationId: number,
  context?: Record<string, any>
): Promise<{ success: boolean; message?: string }> => {
  return apiFetch(`/api/dms/conversations/${conversationId}/ai-reply`, {
    method: "POST",
    body: JSON.stringify({ context }),
  });
};
