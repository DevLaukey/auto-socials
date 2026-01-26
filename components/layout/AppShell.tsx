import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar title={title} />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
