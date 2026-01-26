const activities = [
  "Posted video to YouTube (Channel A)",
  "Scheduled Instagram post",
  "Connected Twitter account",
  "Generated AI clip from video",
];

export default function ActivityFeed() {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl border p-4">
      <h2 className="font-semibold mb-4">Recent Activity</h2>

      <ul className="space-y-3">
        {activities.map((activity, index) => (
          <li key={index} className="text-sm text-muted-foreground">
            {activity}
          </li>
        ))}
      </ul>
    </div>
  );
}
