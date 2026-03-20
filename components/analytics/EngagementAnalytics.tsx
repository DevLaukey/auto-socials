// components/analytics/EngagementAnalytics.tsx

import { useEffect, useState } from "react";
import { getCommentAnalytics, getDMAnalytics, getConversations } from "@/src/lib/comments";
import { getCommentAnalytics as getCommentStats, getDMAnalytics as getDMStats } from "@/src/lib/dms";

interface EngagementAnalyticsProps {
  days?: number;
}

export default function EngagementAnalytics({ days = 30 }: EngagementAnalyticsProps) {
  const [commentStats, setCommentStats] = useState<any>(null);
  const [dmStats, setDMStats] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [comments, dms, convs] = await Promise.all([
        getCommentStats(days),
        getDMStats(days),
        getConversations(days),
      ]);
      setCommentStats(comments);
      setDMStats(dms);
      setConversations(convs);
    } catch (error) {
      console.error("Failed to load engagement analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading engagement analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Comments Stats */}
      {commentStats && (
        <div className="bg-white border rounded-xl p-4">
          <h3 className="font-semibold mb-3">AI Comments Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-semibold">{commentStats.summary.total}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-semibold text-green-600">
                {commentStats.summary.completed}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-semibold">{commentStats.summary.success_rate}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Delay</p>
              <p className="text-2xl font-semibold">
                {commentStats.summary.avg_delay_minutes}m
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DMs Stats */}
      {dmStats && (
        <div className="bg-white border rounded-xl p-4">
          <h3 className="font-semibold mb-3">AI DMs Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total DMs</p>
              <p className="text-2xl font-semibold">{dmStats.jobs.total}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-semibold text-green-600">
                {dmStats.jobs.completed}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Conversations</p>
              <p className="text-2xl font-semibold">{dmStats.conversations.active_7d}</p>
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

      {/* Top Conversations */}
      {conversations.length > 0 && (
        <div className="bg-white border rounded-xl p-4">
          <h3 className="font-semibold mb-3">Active Conversations</h3>
          <div className="space-y-2">
            {conversations.slice(0, 5).map((conv) => (
              <div key={conv.conversation_id} className="flex justify-between text-sm">
                <span className="font-medium">{conv.recipient}</span>
                <span className="text-muted-foreground">
                  {conv.message_count} messages ({conv.ai_percentage}% AI)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}