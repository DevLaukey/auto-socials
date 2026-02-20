import { create } from "zustand";
import {
  getConversations,
  getMessages,
  sendMessage,
  getUnreadCounts,
  markConversationAsRead,
  searchUsers,
  createConversation,
  Conversation,
  Message,
  UnreadCounts,
  User,
} from "@/src/lib/messages";
import { useAuthStore } from "./authStore";

interface MessagesState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Record<number, Message[]>;
  unreadCounts: UnreadCounts | null;
  loading: boolean;
  error: string | null;
  searchResults: User[];
  searchLoading: boolean;

  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: number) => Promise<void>;
  sendNewMessage: (
    conversationId: number,
    content: string,
  ) => Promise<Message | null>;
  markAsRead: (conversationId: number) => Promise<void>;
  loadUnreadCounts: () => Promise<void>;
  setCurrentConversation: (conversation: Conversation | null) => void;
  addMessage: (conversationId: number, message: Message) => void;
  searchForUsers: (query: string) => Promise<void>;
  startConversation: (userId: number) => Promise<number | null>;
  refreshConversations: () => Promise<void>;
  reset: () => void;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: {},
  unreadCounts: null,
  loading: false,
  error: null,
  searchResults: [],
  searchLoading: false,

  loadConversations: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ conversations: [], loading: false });
      return;
    }

    try {
      const conversations = await getConversations();
      set({ conversations, loading: false });
      await get().loadUnreadCounts();
    } catch (error: any) {
      console.error("Failed to load conversations:", error);
      if (error.message?.includes("401")) {
        set({ conversations: [], loading: false });
      } else {
        set({ error: error.message, loading: false });
      }
    }
  },

  loadMessages: async (conversationId: number) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      const messages = await getMessages(conversationId);
      set((state) => ({
        messages: { ...state.messages, [conversationId]: messages },
      }));
      // Mark as read when loading messages
      await get().markAsRead(conversationId);
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  sendNewMessage: async (conversationId: number, content: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return null;

    try {
      const message = await sendMessage(conversationId, content);
      get().addMessage(conversationId, message);
      return message;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  markAsRead: async (conversationId: number) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      await markConversationAsRead(conversationId);

      // Update local state immediately
      set((state) => {
        // Update conversations unread count
        const updatedConversations = state.conversations.map((c) =>
          c.id === conversationId ? { ...c, unread_count: 0 } : c,
        );

        // Update unreadCounts
        if (!state.unreadCounts) return { conversations: updatedConversations };

        const updatedUnreadConversations = state.unreadCounts.conversations.map(
          (c) =>
            c.conversation_id === conversationId
              ? { ...c, unread_count: 0 }
              : c,
        );

        const totalUnread = updatedUnreadConversations.reduce(
          (sum, c) => sum + c.unread_count,
          0,
        );

        return {
          conversations: updatedConversations,
          unreadCounts: {
            total_unread: totalUnread,
            conversations: updatedUnreadConversations,
          },
        };
      });
    } catch (error: any) {
      console.error("Failed to mark as read:", error);
    }
  },

  loadUnreadCounts: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ unreadCounts: { total_unread: 0, conversations: [] } });
      return;
    }

    try {
      const unreadCounts = await getUnreadCounts();
      set({ unreadCounts });
    } catch (error: any) {
      console.error("Failed to load unread counts:", error);
    }
  },

  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation });
    // Mark as read when conversation is opened
    if (conversation) {
      get().markAsRead(conversation.id);
    }
  },

  addMessage: (conversationId: number, message: Message) => {
    set((state) => {
      const currentMessages = state.messages[conversationId] || [];
      const currentUser = useAuthStore.getState().user;

      if (currentMessages.some((m) => m.id === message.id)) {
        return state;
      }

      const isOwn = message.sender_id === currentUser?.id;
      const isCurrentConversation =
        state.currentConversation?.id === conversationId;

      // Update conversations list
      const updatedConversations = state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              last_message: message,
              last_message_at: message.created_at,
              // Only increment unread if it's not own message and not currently viewed
              unread_count:
                !isOwn && !isCurrentConversation
                  ? c.unread_count + 1
                  : c.unread_count,
            }
          : c,
      );

      // If this is the current conversation and message is not own, mark as read
      if (isCurrentConversation && !isOwn) {
        get().markAsRead(conversationId);
      }

      return {
        messages: {
          ...state.messages,
          [conversationId]: [message, ...currentMessages],
        },
        conversations: updatedConversations,
      };
    });
  },

  searchForUsers: async (query: string) => {
    const { user } = useAuthStore.getState();
    if (!user || !query.trim()) {
      set({ searchResults: [] });
      return;
    }

    set({ searchLoading: true });
    try {
      const results = await searchUsers(query);
      set({ searchResults: results, searchLoading: false });
    } catch (error) {
      console.error("Failed to search users:", error);
      set({ searchResults: [], searchLoading: false });
    }
  },

  startConversation: async (userId: number) => {
    const { user } = useAuthStore.getState();
    if (!user) return null;

    try {
      const result = await createConversation([userId]);
      if (result.success) {
        await get().loadConversations();
        return result.conversation_id;
      }
      return null;
    } catch (error) {
      console.error("Failed to start conversation:", error);
      return null;
    }
  },

  refreshConversations: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      const conversations = await getConversations();
      set({ conversations });
      await get().loadUnreadCounts();
    } catch (error) {
      console.error("Failed to refresh conversations:", error);
    }
  },

  reset: () => {
    set({
      conversations: [],
      currentConversation: null,
      messages: {},
      unreadCounts: null,
      loading: false,
      error: null,
      searchResults: [],
      searchLoading: false,
    });
  },
}));
