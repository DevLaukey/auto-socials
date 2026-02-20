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

import { apiFetch } from "@/src/lib/api";

export async function getAnalytics(): Promise<AnalyticsResponse> {
  const data = await apiFetch("/analytics/overview");
  if (!data) {
    throw new Error("Failed to fetch analytics overview");
  }
  return data;
}
