"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PostingActivityItem {
  date: string;
  count: number;
}

interface Props {
  data: PostingActivityItem[];
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

// CustomTooltip defined outside component with our own props type
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-blue-600">Posts: {payload[0]?.value || 0}</p>
      </div>
    );
  }
  return null;
};

export default function EngagementChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-4 xl:col-span-2">
        <h2 className="font-semibold mb-4">Posting Activity</h2>
        <p className="text-gray-500 text-sm">
          No posting activity data available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl p-4 xl:col-span-2">
      <h2 className="font-semibold mb-4">Posting Activity</h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
