"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { PlatformBreakdownData } from "@/src/lib/analytics";

interface ChartDataItem {
  platform: string;
  success: number;
  failed: number;
  success_rate: number;
}

interface Props {
  data: Record<string, PlatformBreakdownData>;
}

// Define our own props type for the custom tooltip
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number | string;
    name: string;
    color?: string;
    dataKey?: string;
    payload?: any;
  }>;
  label?: string;
}

// CustomTooltip defined outside component
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry, index) => {
          const value = entry.value as number;
          const name = entry.name as string;

          if (name === "success_rate") {
            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                Success Rate: {value}%
              </p>
            );
          }
          return (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {name.charAt(0).toUpperCase() + name.slice(1)}: {value}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

export default function PlatformBreakdown({ data }: Props) {
  // Convert object -> array for Recharts
  const chartData: ChartDataItem[] = data
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
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="success" fill="#4CAF50" name="Success" />
            <Bar dataKey="failed" fill="#F44336" name="Failed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
