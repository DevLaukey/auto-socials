"use client";

import { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import { useMessagesStore } from "@/src/store/messagesStore";
import { MessageWebSocket } from "@/src/lib/messages";
import { useAuthStore } from "@/src/store/authStore";
import { formatDistanceToNow } from "date-fns";

export default function ChatWindow({
  conversationId,
}: {
  conversationId: number | null;
}) {
  const [ws, setWs] = useState<MessageWebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loadMessages, addMessage, currentConversation } =
    useMessagesStore();
  const { user } = useAuthStore();

  const conversationMessages = conversationId
    ? messages[conversationId] || []
    : [];

  useEffect(() => {
    if (!conversationId || !user) return;

    // Load messages immediately
    loadMessages(conversationId);

    // Setup WebSocket with minimal delay
    const websocket = new MessageWebSocket(conversationId);

    websocket.onMessage((message) => {
      addMessage(conversationId, message);
    });

    // Connect immediately
    websocket.connect();
    setWs(websocket);

    return () => {
      websocket.disconnect();
    };
  }, [conversationId, user, loadMessages, addMessage]);

  // Scroll to bottom only when new messages arrive
  useEffect(() => {
    if (conversationMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationMessages.length]);

  const handleSendMessage = (content: string) => {
    if (ws?.isConnected() && content.trim() && user) {
      ws.sendMessage(content);
    }
  };

  if (!user) {
    return (
      <div className="col-span-2 flex items-center justify-center text-muted-foreground bg-white">
        <p>Please log in to view messages</p>
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="col-span-2 flex items-center justify-center text-muted-foreground bg-white">
        <p>Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="col-span-2 flex flex-col bg-white h-full">
      {/* Header - minimal */}
      <div className="border-b p-3 flex-shrink-0">
        <p className="font-medium text-sm">
          {currentConversation?.title ||
            currentConversation?.participants
              ?.filter((p) => p.id !== user?.id)
              .map((p) => p.email.split("@")[0]) // Show only username part for brevity
              .join(", ")}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        {conversationMessages.length === 0 ? (
          <div className="text-center text-muted-foreground py-6 text-sm">
            <p>No messages yet</p>
            <p className="text-xs mt-1">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          [...conversationMessages].reverse().map((message) => {
            const isOwn = message.sender_id === user?.id;

            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-1.5 ${
                    isOwn ? "bg-black text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm break-words">{message.content}</p>
                  <p
                    className={`text-[10px] mt-0.5 ${
                      isOwn ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {formatDistanceToNow(new Date(message.created_at), {
                      addSuffix: true,
                    })}
                    {message.is_read && isOwn && (
                      <span className="ml-1">✓</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - always ready */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
