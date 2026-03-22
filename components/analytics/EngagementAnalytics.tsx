// components/analytics/EngagementAnalytics.tsx

"use client";

import { CommentAnalytics, DMAnalytics } from "@/src/lib/analytics";

interface EngagementAnalyticsProps {
  commentStats: CommentAnalytics | null;
  dmStats: DMAnalytics | null;
  days: number;
}

export default function EngagementAnalytics({
  commentStats,
  dmStats,
  days,
}: EngagementAnalyticsProps) {
  const hasData =
    (commentStats && commentStats.summary.total > 0) ||
    (dmStats && dmStats.jobs.total > 0);

  if (!hasData) {
    return (
      <div className="bg-white border rounded-xl p-8 text-center">
        <p className="text-muted-foreground">
          No AI engagement data in the last {days} days.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Enable AI comments or DMs when creating posts to see analytics here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comments Section */}
      {commentStats && commentStats.summary.total > 0 && (
        <div className="bg-white border rounded-xl p-4">
          <h3 className="font-semibold mb-4">AI Comments Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Comments</p>
              <p className="text-2xl font-semibold">
                {commentStats.summary.total}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-semibold text-green-600">
                {commentStats.summary.completed}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-semibold text-red-600">
                {commentStats.summary.failed}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-semibold">
                {commentStats.summary.success_rate}%
              </p>
            </div>
          </div>

          {/* Platform Breakdown */}
          {commentStats.platform_breakdown &&
            commentStats.platform_breakdown.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">By Platform</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commentStats.platform_breakdown.map((platform) => (
                    <div
                      key={platform.platform}
                      className="bg-gray-50 rounded-lg p-3"
                    >
                      <p className="font-medium capitalize">
                        {platform.platform}
                      </p>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Total: {platform.total}</span>
                        <span className="text-green-600">
                          ✓ {platform.completed}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Success: {platform.success_rate}% | Avg delay:{" "}
                        {platform.avg_delay_minutes}m
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* DMs Section */}
      {dmStats && dmStats.jobs.total > 0 && (
        <div className="bg-white border rounded-xl p-4">
          <h3 className="font-semibold mb-4">AI Direct Messages</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Total DMs</p>
              <p className="text-2xl font-semibold">{dmStats.jobs.total}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sent</p>
              <p className="text-2xl font-semibold text-green-600">
                {dmStats.jobs.completed}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Active Conversations
              </p>
              <p className="text-2xl font-semibold">
                {dmStats.conversations.active_7d}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-semibold">
                {dmStats.conversations.avg_response_time_minutes}m
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
