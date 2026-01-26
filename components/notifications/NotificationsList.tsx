import NotificationItem from "./NotificationItem";

const notifications = [
  {
    id: 1,
    title: "Post Scheduled",
    message: "Your Instagram post is scheduled for 6:00 PM.",
    time: "5 mins ago",
  },
  {
    id: 2,
    title: "AI Clip Ready",
    message: "Your YouTube clip has been generated.",
    time: "1 hour ago",
  },
];

export default function NotificationsList() {
  return (
    <div className="bg-white border rounded-xl divide-y">
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  );
}
