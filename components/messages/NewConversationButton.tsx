"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import { User, Conversation } from "@/src/lib/messages"; // Import Conversation type
import { useMessagesStore } from "@/src/store/messagesStore";
import { useAuthStore } from "@/src/store/authStore";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function NewConversationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { user } = useAuthStore();
  const {
    conversations,
    loadConversations,
    setCurrentConversation,
  } = useMessagesStore(); // Fixed typo
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      loadAvailableUsers();
    }
  }, [isOpen]);

  const loadAvailableUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/messages/users/available`, {
        credentials: "include",
      });
      if (res.ok) {
        const users = await res.json();
        setAvailableUsers(users);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if there's an existing conversation with this user
  const findExistingConversation = (userId: number): Conversation | null => {
    if (!conversations.length) return null;

    for (const conv of conversations) {
      if (conv.participants.length === 2 && !conv.is_broadcast) {
        const otherParticipant = conv.participants.find(
          (p) => p.id !== user?.id,
        );
        if (otherParticipant && otherParticipant.id === userId) {
          return conv;
        }
      }
    }
    return null;
  };

  const handleSelectUser = (selectedUser: User) => {
    setSelectedUser(selectedUser);

    // Check for existing conversation
    const existingConv = findExistingConversation(selectedUser.id);

    if (existingConv) {
      // Found existing conversation - switch to it without page reload
      setCurrentConversation(existingConv); // Fixed typo
      // Update URL without page reload
      router.push(`/messages?conversation=${existingConv.id}`, {
        scroll: false,
      });
      setIsOpen(false);
      setSelectedUser(null);
    }
    // If no existing conversation, user will need to click "Start Conversation"
  };

  const handleStartConversation = async () => {
    if (!selectedUser) return;

    // Double-check for existing conversation before creating new one
    const existingConv = findExistingConversation(selectedUser.id);
    if (existingConv) {
      setCurrentConversation(existingConv); // Fixed typo
      router.push(`/messages?conversation=${existingConv.id}`, {
        scroll: false,
      });
      setIsOpen(false);
      setSelectedUser(null);
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/messages/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          participant_ids: [selectedUser.id],
          is_broadcast: false,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          await loadConversations();
          // Find the new conversation and set it
          const newConv = conversations.find(
            (c) => c.id === data.conversation_id,
          );
          if (newConv) {
            setCurrentConversation(newConv); // Fixed typo
          }
          router.push(`/messages?conversation=${data.conversation_id}`, {
            scroll: false,
          });
          setIsOpen(false);
          setSelectedUser(null);
        }
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (!user) return null;

  const buttonText = user.is_admin ? "New Conversation" : "Contact Admin";

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <MessageSquare size={16} className="mr-2" />
        {buttonText}
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {user.is_admin
              ? "Select User to Message"
              : "Select Admin to Contact"}
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Selected user */}
        {selectedUser && (
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <p className="font-medium">{selectedUser.email}</p>
              {selectedUser.is_admin && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* User list */}
        {!selectedUser && (
          <div className="space-y-2">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading users...</p>
            ) : (
              <div className="border rounded-md max-h-60 overflow-y-auto">
                {availableUsers.length === 0 ? (
                  <p className="p-3 text-sm text-muted-foreground">
                    {user.is_admin
                      ? "No users available"
                      : "No admins available"}
                  </p>
                ) : (
                  availableUsers.map((availableUser) => {
                    const existingConv = findExistingConversation(
                      availableUser.id,
                    );

                    return (
                      <div
                        key={availableUser.id}
                        onClick={() => handleSelectUser(availableUser)}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{availableUser.email}</p>
                            {availableUser.is_admin && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mt-1 inline-block">
                                Admin
                              </span>
                            )}
                          </div>
                          {existingConv && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              Existing Chat
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          {selectedUser && (
            <Button onClick={handleStartConversation} disabled={isCreating}>
              {isCreating
                ? "Creating..."
                : findExistingConversation(selectedUser.id)
                  ? "Open Chat"
                  : "Start Conversation"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
