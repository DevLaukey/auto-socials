"use client";

import { useEffect, useState } from "react";
import { getAnalytics, AnalyticsResponse } from "@/src/lib/analytics";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import AnalyticsStats from "@/components/analytics/AnalyticsStats";
import EngagementChart from "@/components/analytics/EngagementChart";
import PlatformBreakdown from "@/components/analytics/PlatformBreakdown";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getAnalytics();
        setData(res);
      } catch (err: unknown) {
        setError((err as Error).message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div className="p-6">Loading analytics...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!data) return null;

  return (
    <div className="p-6 space-y-6">
      <AnalyticsHeader />

      <AnalyticsStats
        overview={data.overview}
        engagement={data.engagement}
        accountHealth={data.account_health}
      />

      <EngagementChart data={data.posting_activity} />

      <PlatformBreakdown data={data.platform_breakdown} />
    </div>
  );
}
