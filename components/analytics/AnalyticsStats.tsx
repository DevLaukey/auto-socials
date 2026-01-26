const stats = [
  { label: "Total Views", value: "128,430" },
  { label: "Engagement Rate", value: "6.4%" },
  { label: "Followers Gained", value: "+1,284" },
  { label: "Posts Published", value: "312" },
];

export default function AnalyticsStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          <p className="text-2xl font-semibold mt-1">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
