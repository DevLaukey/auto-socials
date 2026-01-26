export default function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your automation activity
        </p>
      </div>
    </div>
  );
}
