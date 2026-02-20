const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface User {
  id: number;
  email: string;
  username: string;
  is_admin?: boolean;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface Conversation {
  id: number;
  title: string | null;
  created_at: string;
  last_message_at: string | null;
  unread_count: number;
  last_message: Message | null;
  participants: User[];
  is_broadcast?: boolean; // Add this optional property
}

export interface UnreadCounts {
  total_unread: number;
  conversations: { conversation_id: number; unread_count: number }[];
}

// =========================================================
// API Functions
// =========================================================

export async function getConversations(): Promise<Conversation[]> {
  const res = await fetch(`${API_URL}/api/messages/conversations`, {
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to fetch conversations: ${error}`);
  }

  return res.json();
}

export async function getMessages(
  conversationId: number,
  limit: number = 50,
  offset: number = 0,
): Promise<Message[]> {
  const res = await fetch(
    `${API_URL}/api/messages/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`,
    {
      credentials: "include",
    },
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to fetch messages: ${error}`);
  }

  return res.json();
}

export async function sendMessage(
  conversationId: number,
  content: string,
): Promise<Message> {
  const res = await fetch(
    `${API_URL}/api/messages/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        content,
        conversation_id: conversationId,
      }),
    },
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to send message: ${error}`);
  }

  return res.json();
}

export async function createConversation(
  participantIds: number[],
  title?: string,
): Promise<{ success: boolean; conversation_id: number; message: string }> {
  const res = await fetch(`${API_URL}/api/messages/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      participant_ids: participantIds,
      title,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create conversation: ${error}`);
  }

  return res.json();
}

export async function markConversationAsRead(
  conversationId: number,
): Promise<{ success: boolean; marked_read: number }> {
  const res = await fetch(
    `${API_URL}/api/messages/conversations/${conversationId}/read`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to mark as read: ${error}`);
  }

  return res.json();
}

export async function getUnreadCounts(): Promise<UnreadCounts> {
  const res = await fetch(`${API_URL}/api/messages/unread`, {
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to get unread counts: ${error}`);
  }

  return res.json();
}

export async function searchUsers(
  query: string,
  limit: number = 10,
): Promise<User[]> {
  const res = await fetch(
    `${API_URL}/api/messages/search/users?q=${encodeURIComponent(query)}&limit=${limit}`,
    {
      credentials: "include",
    },
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to search users: ${error}`);
  }

  return res.json();
}

// =========================================================
// WebSocket Connection - Using Cookies Only
// =========================================================

export class MessageWebSocket {
  private ws: WebSocket | null = null;
  private messageHandlers: ((message: Message) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 2; // Reduced from 3
  private reconnectTimeout = 1000; // Reduced from 2000
  private shouldReconnect = true;

  constructor(private conversationId: number) {}

  connect() {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("http", "ws") ||
      "ws://localhost:8000";
    const wsUrl = `${baseUrl}/api/messages/ws/${this.conversationId}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Skip ping messages silently
        if (data.type === "ping" || data.type === "connected") return;
        this.messageHandlers.forEach((handler) => handler(data));
      } catch (error) {
        // Silent fail
      }
    };

    this.ws.onclose = () => {
      if (
        this.shouldReconnect &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        this.reconnectAttempts++;
        setTimeout(() => this.connect(), this.reconnectTimeout);
      }
    };

    this.ws.onerror = () => {
      // Silent fail - errors are expected during reconnection
    };
  }

  sendMessage(content: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ content }));
    }
  }

  onMessage(handler: (message: Message) => void) {
    this.messageHandlers.push(handler);
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
