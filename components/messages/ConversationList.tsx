"use client";

import { useEffect } from "react";
import { useMessagesStore } from "@/src/store/messagesStore";
import { useAuthStore } from "@/src/store/authStore";
import { formatDistanceToNow } from "date-fns";

export default function ConversationList({
  onSelect,
  selectedId,
}: {
  onSelect: (id: number) => void;
  selectedId: number | null;
}) {
  const { conversations, loadConversations } = useMessagesStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, loadConversations]);

  if (!user) {
    return (
      <div className="border-r p-4 text-sm text-muted-foreground">
        Please log in
      </div>
    );
  }

  return (
    <div className="border-r overflow-y-auto">
      {conversations.length === 0 ? (
        <div className="p-4 text-center text-sm text-muted-foreground">
          <p>No conversations yet</p>
        </div>
      ) : (
        conversations.map((conversation) => {
          const otherParticipants = conversation.participants.filter(
            (p) => p.id !== user.id,
          );
          const title =
            conversation.title ||
            otherParticipants.map((p) => p.email.split("@")[0]).join(", ");

          return (
            <div
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={`p-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                selectedId === conversation.id ? "bg-slate-100" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <p className="font-medium text-sm truncate flex-1">{title}</p>
                {conversation.unread_count > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 min-w-[20px] text-center">
                    {conversation.unread_count}
                  </span>
                )}
              </div>

              {conversation.last_message && (
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground truncate flex-1">
                    {conversation.last_message.sender_id === user.id
                      ? `You: ${conversation.last_message.content.substring(0, 20)}${conversation.last_message.content.length > 20 ? "..." : ""}`
                      : conversation.last_message.content.substring(0, 20)}
                  </p>
                  <span className="text-[10px] text-muted-foreground ml-2">
                    {formatDistanceToNow(
                      new Date(conversation.last_message.created_at),
                      { addSuffix: true },
                    )}
                  </span>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
