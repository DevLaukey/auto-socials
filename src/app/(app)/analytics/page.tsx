import AnalyticsHeader from "../../../../components/analytics/AnalyticsHeader";
import AnalyticsStats from "../../../../components/analytics/AnalyticsStats";
import EngagementChart from "../../../../components/analytics/EngagementChart";
import PlatformBreakdown from "../../../../components/analytics/PlatformBreakdown";

export default function AnalyticsPage() {
  return (
    <>
      <div className="space-y-6 max-w-6xl">
        <AnalyticsHeader />
        <AnalyticsStats />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <EngagementChart />
          <PlatformBreakdown />
        </div>
      </div>
    </>
  );
}
