"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function MessageInput({
  onSendMessage,
}: {
  onSendMessage: (message: string) => void;
}) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(message);
    setMessage("");
    // Keep focus on input after sending
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-2 flex gap-2 bg-white">
      <input
        ref={inputRef}
        className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black/20"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        type="submit"
        size="sm"
        disabled={!message.trim()}
        className="px-3"
      >
        <Send size={16} />
      </Button>
    </form>
  );
}
