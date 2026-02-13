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
            <Tooltip />
            <Line type="monotone" dataKey="count" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
