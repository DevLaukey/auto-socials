"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send, Users } from "lucide-react";
import { useAuthStore } from "@/src/store/authStore";
import { useMessagesStore } from "@/src/store/messagesStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminBroadcast() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const { user } = useAuthStore();
  const { loadConversations } = useMessagesStore();

  const handleBroadcast = async () => {
    if (!content.trim() || !user?.is_admin) return;

    setSending(true);
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/api/messages/admin/broadcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          content: content.trim(),
          title: title.trim() || "Announcement",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({ success: true, message: data.message });
        setTitle("");
        setContent("");

        // Refresh conversations to show the new broadcast chats
        await loadConversations();
        console.log("Broadcast successful, conversations refreshed");
      } else {
        setResult({
          success: false,
          message: data.detail || "Failed to send broadcast",
        });
      }
    } catch (error) {
      console.error("Broadcast error:", error);
      setResult({ success: false, message: "Failed to send broadcast" });
    } finally {
      setSending(false);
    }
  };

  if (!user?.is_admin) return null;

  return (
    <div className="bg-white border rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Users size={20} className="text-blue-600" />
        <h3 className="text-lg font-semibold">Admin Broadcast</h3>
      </div>

      <p className="text-sm text-muted-foreground">
        Send a message to all users. This will create individual conversations
        with each user.
      </p>

      <div className="space-y-3">
        <Input
          placeholder="Announcement title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          placeholder="Type your broadcast message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />

        {result && (
          <div
            className={`text-sm p-2 rounded ${
              result.success
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {result.message}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleBroadcast}
            disabled={!content.trim() || sending}
          >
            <Send size={16} className="mr-2" />
            {sending ? "Sending..." : "Send Broadcast"}
          </Button>
        </div>
      </div>
    </div>
  );
}
