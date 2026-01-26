"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function MessageInput() {
  const [message, setMessage] = useState("");

  return (
    <div className="border-t p-3 flex gap-2">
      <input
        className="flex-1 border rounded-md px-3 py-2"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button>Send</Button>
    </div>
  );
}
