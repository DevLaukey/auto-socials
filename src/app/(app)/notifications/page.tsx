import NotificationsList from "../../../../components/notifications/NotificationsList";

export default function NotificationsPage() {
  return (
    <>
      <div className="max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <NotificationsList />
      </div>
    </>
  );
}
