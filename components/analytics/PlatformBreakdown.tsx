"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: Record<string, number>;
}

export default function PlatformBreakdown({ data }: Props) {
  // Convert object -> array for Recharts
  const chartData = data
    ? Object.entries(data).map(([platform, count]) => ({
        platform,
        count,
      }))
    : [];

  if (chartData.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-semibold mb-4">Posts by Platform</h2>
        <p className="text-gray-500 text-sm">
          No platform breakdown data available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl p-4">
      <h2 className="font-semibold mb-4">Posts by Platform</h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="platform" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
