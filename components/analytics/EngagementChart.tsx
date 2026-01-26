"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", engagement: 400 },
  { day: "Tue", engagement: 800 },
  { day: "Wed", engagement: 650 },
  { day: "Thu", engagement: 900 },
  { day: "Fri", engagement: 1200 },
  { day: "Sat", engagement: 1500 },
  { day: "Sun", engagement: 1100 },
];

export default function EngagementChart() {
  return (
    <div className="bg-white border rounded-xl p-4 xl:col-span-2">
      <h2 className="font-semibold mb-4">Engagement Over Time</h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="engagement" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
