import MessageInput from "./MessageInput";

export default function ChatWindow({
  conversationId,
}: {
  conversationId: string | null;
}) {
  if (!conversationId) {
    return (
      <div className="flex items-center justify-center col-span-2 text-muted-foreground">
        Select a conversation
      </div>
    );
  }

  return (
    <div className="col-span-2 flex flex-col">
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-sm">Hello! 👋</div>
        <div className="text-sm text-right">Hi!</div>
      </div>
      <MessageInput />
    </div>
  );
}
