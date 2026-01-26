export default function NotificationItem({
  notification,
}: {
  notification: {
    title: string;
    message: string;
    time: string;
  };
}) {
  return (
    <div className="p-4 hover:bg-slate-50">
      <div className="flex justify-between">
        <p className="font-medium">{notification.title}</p>
        <span className="text-xs text-muted-foreground">
          {notification.time}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        {notification.message}
      </p>
    </div>
  );
}
