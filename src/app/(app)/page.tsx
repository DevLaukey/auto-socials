import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import StatsGrid from "../../../components/dashboard/StatsGrid";
import ActivityFeed from "../../../components/dashboard/ActivityFeed";
import UpcomingPosts from "../../../components/dashboard/UpcomingPosts";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />

      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityFeed />
        <UpcomingPosts />
      </div>
    </div>
  );
}
