"use client";

import { useState } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";

export default function MessagesLayout() {
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 border rounded-xl bg-white h-[70vh]">
      <ConversationList onSelect={setActiveConversation} />
      <ChatWindow conversationId={activeConversation} />
    </div>
  );
}
