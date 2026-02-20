"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PlatformData {
  success: number;
  failed: number;
  success_rate: number;
}

interface Props {
  data: Record<string, PlatformData>;
}

export default function PlatformBreakdown({ data }: Props) {
  // Convert object -> array for Recharts
  const chartData = data
    ? Object.entries(data).map(([platform, stats]) => ({
        platform,
        success: stats.success,
        failed: stats.failed,
        success_rate: stats.success_rate,
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
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === "success_rate")
                  return [`${value}%`, "Success Rate"];
                return [value, name.charAt(0).toUpperCase() + name.slice(1)];
              }}
            />
            <Bar dataKey="success" fill="#4CAF50" name="Success" />
            <Bar dataKey="failed" fill="#F44336" name="Failed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
