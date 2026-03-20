"use client";

import { useEffect, useState } from "react";
import { getAnalytics, AnalyticsResponse } from "@/src/lib/analytics";
import {
  getCommentAnalytics,
  getDMAnalytics,
  getConversations,
  getTwitterMetrics,
  type CommentAnalytics,
  type DMAnalytics,
  type Conversation,
  type TwitterMetrics,
} from "@/src/lib/analytics";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import AnalyticsStats from "@/components/analytics/AnalyticsStats";
import EngagementChart from "@/components/analytics/EngagementChart";
import PlatformBreakdown from "@/components/analytics/PlatformBreakdown";
import EngagementAnalytics from "@/components/analytics/EngagementAnalytics";
import TwitterAnalytics from "@/components/analytics/TwitterAnalytics";
import ConversationList from "@/components/analytics/ConversationList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, RefreshCw } from "lucide-react";
import { format } from "date-fns";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [commentStats, setCommentStats] = useState<CommentAnalytics | null>(null);
  const [dmStats, setDMStats] = useState<DMAnalytics | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [twitterMetrics, setTwitterMetrics] = useState<TwitterMetrics | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [loadingEngagement, setLoadingEngagement] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadOverview();
  }, []);

  useEffect(() => {
    if (activeTab === "engagement" || activeTab === "twitter" || activeTab === "conversations") {
      loadEngagementData();
    }
  }, [activeTab, days]);

  const loadOverview = async () => {
    try {
      const res = await getAnalytics();
      setData(res);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const loadEngagementData = async () => {
    setLoadingEngagement(true);
    try {
      const [comments, dms, convs, twitter] = await Promise.all([
        getCommentAnalytics(days),
        getDMAnalytics(days),
        getConversations(days),
        getTwitterMetrics(days),
      ]);
      setCommentStats(comments);
      setDMStats(dms);
      setConversations(convs);
      setTwitterMetrics(twitter);
    } catch (err: any) {
      console.error("Failed to load engagement data:", err);
    } finally {
      setLoadingEngagement(false);
    }
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    if (range.from && range.to) {
      const diffDays = Math.ceil(
        (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)
      );
      setDays(diffDays);
      setDateRange({ from: range.from, to: range.to });
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    loadOverview();
    if (activeTab !== "overview") {
      loadEngagementData();
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={handleRefresh} variant="outline" className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header with date range picker */}
      <div className="flex justify-between items-center">
        <AnalyticsHeader />
        
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {dateRange.from && dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  "Select date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleDateRangeChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">AI Engagement</TabsTrigger>
          <TabsTrigger value="twitter">Twitter/X</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <AnalyticsStats
            overview={data.overview}
            engagement={data.engagement}
            accountHealth={data.account_health}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <EngagementChart data={data.posting_activity} />
            </div>
            <div>
              <PlatformBreakdown data={data.platform_breakdown} />
            </div>
          </div>

          {/* Quick engagement summary */}
          {commentStats && dmStats && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Quick Engagement Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Comments</p>
                  <p className="text-xl font-semibold">{commentStats.summary.total}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-xl font-semibold text-green-600">
                    {commentStats.summary.success_rate}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total DMs</p>
                  <p className="text-xl font-semibold">{dmStats.jobs.total}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Conversations</p>
                  <p className="text-xl font-semibold">{dmStats.conversations.active_7d}</p>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* AI Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          {loadingEngagement ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            <EngagementAnalytics
              commentStats={commentStats}
              dmStats={dmStats}
              days={days}
            />
          )}
        </TabsContent>

        {/* Twitter/X Analytics Tab */}
        <TabsContent value="twitter" className="space-y-6">
          {loadingEngagement ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            <TwitterAnalytics metrics={twitterMetrics} days={days} />
          )}
        </TabsContent>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="space-y-6">
          {loadingEngagement ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            <ConversationList conversations={conversations} />
          )}
        </TabsContent>
      </Tabs>

      {/* Period information */}
      <div className="text-xs text-muted-foreground text-right">
        Data for the last {days} days
      </div>
    </div>
  );
}