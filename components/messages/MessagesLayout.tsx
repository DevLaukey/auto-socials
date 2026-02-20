"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import NewConversationButton from "./NewConversationButton";
import AdminBroadcast from "./AdminBroadcast";
import { useAuthStore } from "@/src/store/authStore";
import { useMessagesStore } from "@/src/store/messagesStore";

export default function MessagesLayout() {
  const [activeConversation, setActiveConversation] = useState<number | null>(
    null,
  );
  const { user } = useAuthStore();
  const { setCurrentConversation, conversations } = useMessagesStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle conversation ID from URL without page reload
  useEffect(() => {
    const conversationParam = searchParams.get("conversation");
    if (conversationParam) {
      const conversationId = parseInt(conversationParam);
      if (!isNaN(conversationId)) {
        setActiveConversation(conversationId);
        // Find and set the conversation in store
        const conversation = conversations.find((c) => c.id === conversationId);
        if (conversation) {
          setCurrentConversation(conversation);
        }
      }
    }
  }, [searchParams, conversations, setCurrentConversation]);

  const handleSelectConversation = (id: number) => {
    setActiveConversation(id);
    // Update URL without page reload
    router.push(`/messages?conversation=${id}`, { scroll: false });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Messages</h2>
        <NewConversationButton />
      </div>

      {/* Admin Broadcast component - only visible to admins */}
      {user?.is_admin && <AdminBroadcast />}

      <div className="grid grid-cols-1 md:grid-cols-3 border rounded-xl bg-white h-[70vh] overflow-hidden">
        <ConversationList
          onSelect={handleSelectConversation}
          selectedId={activeConversation}
        />
        <ChatWindow conversationId={activeConversation} />
      </div>
    </div>
  );
}
