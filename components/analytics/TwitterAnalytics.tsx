"use client";

import { TwitterMetrics } from "@/src/lib/analytics";

interface TwitterAnalyticsProps {
  metrics: TwitterMetrics | null;
  days: number;
}

export default function TwitterAnalytics({
  metrics,
  days,
}: TwitterAnalyticsProps) {
  if (!metrics || metrics.overview.total_tweets === 0) {
    return (
      <div className="bg-white border rounded-xl p-8 text-center">
        <p className="text-muted-foreground">
          No Twitter activity in the last {days} days.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Connect a Twitter account and start posting to see analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Total Tweets</p>
          <p className="text-2xl font-semibold">
            {metrics.overview.total_tweets}
          </p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Success Rate</p>
          <p className="text-2xl font-semibold text-green-600">
            {metrics.overview.success_rate}%
          </p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Total Impressions</p>
          <p className="text-2xl font-semibold">
            {metrics.engagement.total_impressions.toLocaleString()}
          </p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Engagement Rate</p>
          <p className="text-2xl font-semibold text-blue-600">
            {metrics.engagement.engagement_rate}%
          </p>
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Likes</p>
          <p className="text-xl font-semibold">
            {metrics.engagement.total_likes.toLocaleString()}
          </p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Retweets</p>
          <p className="text-xl font-semibold">
            {metrics.engagement.total_retweets.toLocaleString()}
          </p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Replies</p>
          <p className="text-xl font-semibold">
            {metrics.engagement.total_replies.toLocaleString()}
          </p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Quotes</p>
          <p className="text-xl font-semibold">
            {metrics.engagement.total_quotes?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      {/* Top Tweets */}
      {metrics.top_tweets && metrics.top_tweets.length > 0 && (
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h3 className="font-semibold">Top Performing Tweets</h3>
          </div>
          <div className="divide-y">
            {metrics.top_tweets.map((tweet, idx) => (
              <div key={tweet.id} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-gray-500">
                    #{idx + 1}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(tweet.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-gray-400">
                    @{tweet.account}
                  </span>
                </div>
                <p className="text-sm mb-2">{tweet.title || "No title"}</p>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>❤️ {tweet.likes}</span>
                  <span>🔄 {tweet.retweets}</span>
                  <span>💬 {tweet.replies}</span>
                  <span>👁️ {tweet.impressions?.toLocaleString() || 0}</span>
                  <span className="font-medium text-blue-600">
                    Score: {tweet.total_score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
