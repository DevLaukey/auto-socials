interface OverviewStats {
  total_posts: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
}

interface EngagementStats {
  average_likes: number;
  average_comments: number;
  engagement_rate: number;
}

interface AccountHealth {
  score: number;
  status: string;
}

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
        <p className="text-sm text-gray-500">Total Views</p>
        <p className="text-2xl font-semibold">{overview.total_views}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Total Likes</p>
        <p className="text-2xl font-semibold">{overview.total_likes}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Total Comments</p>
        <p className="text-2xl font-semibold">{overview.total_comments}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Avg Likes</p>
        <p className="text-2xl font-semibold">{engagement.average_likes}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Avg Comments</p>
        <p className="text-2xl font-semibold">{engagement.average_comments}</p>
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
