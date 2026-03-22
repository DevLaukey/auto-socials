// src/lib/analytics.ts

export interface OverviewStats {
  total_posts: number;
  successful_posts: number;
  failed_posts: number;
  success_rate: number;
}

export interface PlatformBreakdownData {
  success: number;
  failed: number;
  success_rate: number;
}

export type PlatformBreakdown = Record<string, PlatformBreakdownData>;

export interface PostingActivityItem {
  date: string;
  count: number;
}

export interface EngagementStats {
  total_likes: number;
  total_comments: number;
  total_views: number;
  total_shares: number;
  engagement_rate: number;
}

export interface AccountHealth {
  score: number;
  status: string;
  issues: string[];
}

export interface AnalyticsResponse {
  overview: OverviewStats;
  platform_breakdown: PlatformBreakdown;
  posting_activity: PostingActivityItem[];
  engagement: EngagementStats;
  account_health: AccountHealth;
}

// =====================================================
// NEW TYPES FOR PHASE 3
// =====================================================

export interface CommentAnalytics {
  summary: {
    total: number;
    completed: number;
    pending: number;
    failed: number;
    processing: number;
    success_rate: number;
    avg_delay_minutes: number;
    last_executed: string | null;
    first_job: string | null;
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

export interface DMAnalytics {
  jobs: {
    total: number;
    completed: number;
    pending: number;
    failed: number;
    processing: number;
    success_rate: number;
    avg_delay_minutes: number;
    last_executed: string | null;
  };
  conversations: {
    total: number;
    active_7d: number;
    avg_messages: number;
    last_activity: string | null;
    avg_response_time_minutes: number;
  };
}

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

export interface TwitterMetrics {
  overview: {
    total_tweets: number;
    successful_tweets: number;
    tweets_with_ids: number;
    replies_made: number;
    quotes_made: number;
    success_rate: number;
  };
  engagement: {
    total_likes: number;
    total_retweets: number;
    total_replies: number;
    total_impressions: number;
    total_engagement: number;
    avg_engagement_per_tweet: number;
    engagement_rate: number;
    total_quotes?: number;
  };
  top_tweets: Array<{
    id: number;
    title: string;
    created_at: string;
    likes: number;
    retweets: number;
    replies: number;
    impressions: number;
    account: string;
    total_score: number;
  }>;
}

// =====================================================
// API FUNCTIONS
// =====================================================

import { apiFetch } from "@/src/lib/api";

export async function getAnalytics(): Promise<AnalyticsResponse> {
  const data = await apiFetch("/analytics/overview");
  if (!data) {
    throw new Error("Failed to fetch analytics overview");
  }
  return data;
}

export async function getCommentAnalytics(
  days: number = 30,
): Promise<CommentAnalytics> {
  return apiFetch(`/analytics/engagement/comments?days=${days}`);
}

export async function getDMAnalytics(days: number = 30): Promise<DMAnalytics> {
  return apiFetch(`/analytics/engagement/dms?days=${days}`);
}

export async function getConversations(
  days: number = 30,
): Promise<Conversation[]> {
  return apiFetch(`/analytics/conversations?days=${days}`);
}

export async function getTwitterMetrics(
  days: number = 30,
): Promise<TwitterMetrics> {
  return apiFetch(`/analytics/twitter/metrics?days=${days}`);
}
