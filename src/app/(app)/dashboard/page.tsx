"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsGrid from "@/components/dashboard/StatsGrid";
import UpcomingPosts from "@/components/dashboard/UpcomingPosts";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

export default function DashboardPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <DashboardHeader />

      {/* Stats */}
      <StatsGrid />

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left side: Upcoming posts */}
        <UpcomingPosts />

        {/* Right side: Activity feed */}
        <ActivityFeed />
      </div>
    </div>
  );
}
