const conversations = [
  { id: "admin", name: "Admin", lastMessage: "Welcome!" },
  { id: "support", name: "Support", lastMessage: "How can we help?" },
];

export default function ConversationList({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  return (
    <div className="border-r">
      {conversations.map((c) => (
        <div
          key={c.id}
          onClick={() => onSelect(c.id)}
          className="p-4 cursor-pointer hover:bg-slate-50"
        >
          <p className="font-medium">{c.name}</p>
          <p className="text-sm text-muted-foreground truncate">
            {c.lastMessage}
          </p>
        </div>
      ))}
    </div>
  );
}
