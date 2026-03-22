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

// Update this to match the store's Conversation type
export interface Conversation {
  conversation_id: number;
  recipient: string;
  message_count: number;
  last_message: string;
  last_message_at: string;
  ai_percentage: number;
  our_messages?: number;
  ai_messages?: number;
}

// Keep DMConversation for backward compatibility
export interface DMConversation {
  conversation_id: number;
  recipient: string;
  message_count: number;
  last_message: string;
  last_message_at: string;
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
    last_executed?: string | null;
  };
  conversations: {
    total: number;
    active_7d: number;
    avg_messages: number;
    avg_response_time_minutes: number;
    last_activity?: string | null;
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
export const cancelDMJob = async (
  jobId: number,
): Promise<{ message: string }> => {
  return apiFetch(`/posts/dms/${jobId}`, {
    method: "DELETE",
  });
};

/**
 * Get DM analytics
 */
export const getDMAnalytics = async (
  days: number = 30,
  status?: string,
): Promise<DMAnalytics> => {
  let url = `/analytics/engagement/dms?days=${days}`;
  if (status) url += `&status=${status}`;
  return apiFetch(url);
};

/**
 * Get active conversations (returns array with last_message_at property)
 */
export const getConversations = async (
  days: number = 30,
): Promise<Conversation[]> => {
  return apiFetch(`/analytics/conversations?days=${days}`);
};

/**
 * Send an AI-powered DM reply
 */
export const sendAIReply = async (
  conversationId: number,
  context?: Record<string, any>,
): Promise<{ success: boolean; message?: string }> => {
  return apiFetch(`/api/dms/conversations/${conversationId}/ai-reply`, {
    method: "POST",
    body: JSON.stringify({ context }),
  });
};

/**
 * Retry a failed DM job
 */
export const retryDMJob = async (
  jobId: number,
): Promise<{ message: string }> => {
  return apiFetch(`/dms/${jobId}/retry`, {
    method: "POST",
  });
};
