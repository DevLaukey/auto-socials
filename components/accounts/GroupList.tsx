export default function GroupList({
  groups,
  groupAccounts = {},
  activeGroupId,
  onSelect,
}: {
  groups: { id: number; name: string }[];
  groupAccounts?: Record<number, { id: number }[]>;
  activeGroupId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="bg-white border rounded-xl p-3 space-y-1">
      {groups.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No groups yet. Create one to get started.
        </p>
      )}
      {groups.map((group) => {
        const count = groupAccounts[group.id]?.length ?? 0;

        return (
          <button
            key={group.id}
            onClick={() => onSelect(group.id)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              activeGroupId === group.id
                ? "bg-slate-100 font-medium"
                : "hover:bg-slate-50"
            }`}
          >
            {group.name}
            <span className="float-right text-xs text-muted-foreground">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
