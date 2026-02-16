import {
  OverviewStats,
  EngagementStats,
  AccountHealth,
} from "@/src/lib/analytics";

interface Props {
  overview: OverviewStats;
  engagement: EngagementStats;
  accountHealth: AccountHealth;
}

export default function AnalyticsStats({
  overview,
  engagement,
  accountHealth,
}: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Total Posts</p>
        <p className="text-2xl font-semibold">{overview.total_posts}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Successful Posts</p>
        <p className="text-2xl font-semibold">{overview.successful_posts}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Success Rate</p>
        <p className="text-2xl font-semibold">{overview.success_rate}%</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Total Views</p>
        <p className="text-2xl font-semibold">{engagement.total_views}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Total Likes</p>
        <p className="text-2xl font-semibold">{engagement.total_likes}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Engagement Rate</p>
        <p className="text-2xl font-semibold">{engagement.engagement_rate}%</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Account Health</p>
        <p className="text-2xl font-semibold">
          {accountHealth.score} ({accountHealth.status})
        </p>
      </div>
    </div>
  );
}
