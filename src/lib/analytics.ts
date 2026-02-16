export interface OverviewStats {
  total_posts: number;
  successful_posts: number;
  failed_posts: number;
  success_rate: number;
}

export type PlatformBreakdown = Record<string, number>;

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
  platform_breakdown: PlatformBreakdown; // <-- object, not array
  posting_activity: PostingActivityItem[];
  engagement: EngagementStats;
  account_health: AccountHealth;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getAnalytics(): Promise<AnalyticsResponse> {
  const res = await fetch(`${API_BASE}/analytics/overview`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch analytics overview");
  }

  return res.json();
}
