"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { platform: "YouTube", posts: 120 },
  { platform: "Instagram", posts: 95 },
  { platform: "Twitter/X", posts: 97 },
];

export default function PlatformBreakdown() {
  return (
    <div className="bg-white border rounded-xl p-4">
      <h2 className="font-semibold mb-4">Posts by Platform</h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="platform" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="posts" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
