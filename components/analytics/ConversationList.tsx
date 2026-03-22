"use client";

import { Conversation } from "@/src/lib/analytics";

interface ConversationListProps {
  conversations: Conversation[];
}

export default function ConversationList({
  conversations,
}: ConversationListProps) {
  if (!conversations || conversations.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-6 text-center">
        <p className="text-muted-foreground">No active conversations found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b bg-gray-50">
        <h3 className="font-semibold">Active Conversations</h3>
      </div>
      <div className="divide-y">
        {conversations.map((conv) => (
          <div key={conv.conversation_id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{conv.recipient}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {conv.last_message}
                </p>
              </div>
              <div className="text-right text-sm">
                <p className="text-muted-foreground">
                  {new Date(conv.last_message_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {conv.message_count} messages ({conv.ai_percentage}% AI)
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
