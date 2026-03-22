import { create } from "zustand";
import { apiFetch } from "@/src/lib/api";

/* =======================
   TYPES (BACKEND ALIGNED)
======================= */

export interface Account {
  id: number;
  platform: string;
  username: string;
  account_username?: string;
  status?: string;
  group_id?: number;
  group_name?: string;
  
  // Twitter/X specific fields
  twitter_connected?: boolean;
  twitter_auth_url?: string;
  twitter_token_expires_at?: string;
  
  // Account health metrics
  health_score?: number;
  health_status?: string;
}

export interface Group {
  id: number;
  name: string;
}

export interface TwitterAuthStatus {
  authenticated: boolean;
  account_id: number;
  auth_url?: string;
  error?: string;
}

export interface CommentJob {
  job_id: number;
  account_id: number;
  target_url: string;
  comment: string;
  scheduled_time: string | null;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
}

export interface DMJob {
  job_id: number;
  account_id: number;
  recipient: string;
  message: string;
  scheduled_time: string | null;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
}

export interface Conversation {
  conversation_id: number;
  recipient: string;
  message_count: number;
  last_message: string;
  last_message_at: string;
  ai_percentage: number;
}

/* =======================
   STORE
======================= */

interface AccountsState {
  // core data
  groups: Group[];
  accounts: Account[];
  groupAccounts: Record<number, Account[]>;
  
  // Twitter/X specific data
  twitterAuthStatus: Record<number, TwitterAuthStatus>;
  
  // Engagement jobs
  commentJobs: Record<number, CommentJob[]>; // keyed by post_id
  dmJobs: Record<number, DMJob[]>; // keyed by post_id
  conversations: Conversation[];

  // loading flags
  loadingGroups: boolean;
  loadingAccounts: boolean;
  loadingTwitterAuth: Record<number, boolean>;
  loadingCommentJobs: Record<number, boolean>;
  loadingDMJobs: boolean;
  loadingConversations: boolean;
  
  error: string | null;

  /* ---------- LOADERS ---------- */
  loadGroups: () => Promise<void>;
  loadAccounts: () => Promise<void>;
  loadGroupAccounts: (groupId: number) => Promise<void>;
  
  /* ---------- TWITTER/X ---------- */
  checkTwitterAuth: (accountId: number) => Promise<boolean>;
  refreshTwitterToken: (accountId: number) => Promise<void>;
  connectTwitter: (accountId: number, redirectPath?: string) => void;
  
  /* ---------- COMMENTS ---------- */
  loadPostComments: (postId: number) => Promise<CommentJob[]>;
  cancelCommentJob: (jobId: number) => Promise<void>;
  retryCommentJob: (jobId: number) => Promise<void>;
  
  /* ---------- DMS ---------- */
  loadPostDMs: (postId: number) => Promise<DMJob[]>;
  cancelDMJob: (jobId: number) => Promise<void>;
  retryDMJob: (jobId: number) => Promise<void>;
  loadConversations: (days?: number) => Promise<Conversation[]>;
  
  /* ---------- MUTATIONS ---------- */
  addAccountToGroup: (groupId: number, accountId: number) => Promise<void>;
  removeAccountFromGroup: (groupId: number, accountId: number) => Promise<void>;
  renameGroup: (groupId: number, newName: string) => Promise<void>;
  deleteGroup: (groupId: number) => Promise<void>;
  disconnectAccount: (accountId: number) => Promise<void>;
  
  /* ---------- UTILS ---------- */
  clearError: () => void;
  getAccountsByPlatform: (platform: string) => Account[];
  getTwitterConnectedAccounts: () => Account[];
}

export const useAccountsStore = create<AccountsState>((set, get) => ({
  /* =======================
     STATE
  ======================= */

  groups: [],
  accounts: [],
  groupAccounts: {},
  twitterAuthStatus: {},
  commentJobs: {},
  dmJobs: {},
  conversations: [],
  
  loadingGroups: false,
  loadingAccounts: false,
  loadingTwitterAuth: {},
  loadingCommentJobs: {},
  loadingDMJobs: false,
  loadingConversations: false,
  
  error: null,

  /* =======================
     LOADERS
  ======================= */

  loadGroups: async () => {
    set({ loadingGroups: true, error: null });
    try {
      const data = await apiFetch("/groups/");
      set({ groups: data });
    } catch (error: any) {
      set({ error: error.message || "Failed to load groups" });
    } finally {
      set({ loadingGroups: false });
    }
  },

  loadAccounts: async () => {
    set({ loadingAccounts: true, error: null });
    try {
      const data = await apiFetch("/social-accounts/");
      const normalized: Account[] = data.map((a: any) => ({
        id: a.id,
        platform: a.platform,
        username: a.account_username || a.username || "",
        status: a.status,
      }));
      set({ accounts: normalized });
      
      // Check Twitter auth for all Twitter accounts
      const twitterAccounts = normalized.filter(
        (a) => a.platform.toLowerCase() === "twitter"
      );
      for (const acc of twitterAccounts) {
        get().checkTwitterAuth(acc.id);
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to load accounts" });
    } finally {
      set({ loadingAccounts: false });
    }
  },

  loadGroupAccounts: async (groupId: number) => {
    try {
      const data = await apiFetch(`/groups/${groupId}/accounts`);
      const normalized: Account[] = data.map((a: any) => ({
        id: a.id,
        platform: a.platform,
        username: a.accountUsername || a.account_username || a.username || "",
        status: "connected",
      }));
      set((state) => ({
        groupAccounts: {
          ...state.groupAccounts,
          [groupId]: normalized,
        },
      }));
    } catch (error: any) {
      set({
        error: error.message || `Failed to load accounts for group ${groupId}`,
      });
    }
  },

  /* =======================
     TWITTER/X
  ======================= */

  checkTwitterAuth: async (accountId: number) => {
    set((state) => ({
      loadingTwitterAuth: { ...state.loadingTwitterAuth, [accountId]: true },
    }));
    
    try {
      const { checkTwitterStatus } = await import("@/src/lib/twitter");
      const status = await checkTwitterStatus(accountId);
      
      set((state) => ({
        twitterAuthStatus: {
          ...state.twitterAuthStatus,
          [accountId]: status,
        },
        accounts: state.accounts.map((acc) =>
          acc.id === accountId
            ? {
                ...acc,
                twitter_connected: status.authenticated,
                twitter_auth_url: status.auth_url,
              }
            : acc
        ),
      }));
      
      return status.authenticated;
    } catch (error: any) {
      set({ error: error.message || "Failed to check Twitter auth" });
      return false;
    } finally {
      set((state) => ({
        loadingTwitterAuth: { ...state.loadingTwitterAuth, [accountId]: false },
      }));
    }
  },

  refreshTwitterToken: async (accountId: number) => {
    try {
      const { refreshTwitterToken } = await import("@/src/lib/twitter");
      await refreshTwitterToken(accountId);
      
      // Re-check auth status after refresh
      await get().checkTwitterAuth(accountId);
      
      set({ error: null });
    } catch (error: any) {
      set({ error: error.message || "Failed to refresh Twitter token" });
      throw error;
    }
  },

  connectTwitter: (accountId: number, redirectPath: string = "/") => {
    const { connectTwitter } = require("@/src/lib/twitter");
    connectTwitter(accountId, redirectPath);
  },

  /* =======================
     COMMENTS
  ======================= */

  loadPostComments: async (postId: number) => {
    set((state) => ({
      loadingCommentJobs: { ...state.loadingCommentJobs, [postId]: true },
    }));
    
    try {
      const { getPostComments } = await import("@/src/lib/comments");
      const comments = await getPostComments(postId);
      
      set((state) => ({
        commentJobs: {
          ...state.commentJobs,
          [postId]: comments,
        },
      }));
      
      return comments;
    } catch (error: any) {
      set({ error: error.message || "Failed to load comment jobs" });
      return [];
    } finally {
      set((state) => ({
        loadingCommentJobs: { ...state.loadingCommentJobs, [postId]: false },
      }));
    }
  },

  cancelCommentJob: async (jobId: number) => {
    try {
      const { cancelCommentJob } = await import("@/src/lib/comments");
      await cancelCommentJob(jobId);
      
      // Refresh all comment jobs (find which post this job belongs to)
      const state = get();
      for (const [postId, jobs] of Object.entries(state.commentJobs)) {
        if (jobs.some((j) => j.job_id === jobId)) {
          await get().loadPostComments(parseInt(postId));
          break;
        }
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to cancel comment job" });
      throw error;
    }
  },

  retryCommentJob: async (jobId: number) => {
    try {
      const { retryCommentJob } = await import("@/src/lib/comments");
      await retryCommentJob(jobId);
      
      // Refresh after retry
      const state = get();
      for (const [postId, jobs] of Object.entries(state.commentJobs)) {
        if (jobs.some((j) => j.job_id === jobId)) {
          await get().loadPostComments(parseInt(postId));
          break;
        }
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to retry comment job" });
      throw error;
    }
  },

  /* =======================
     DMS
  ======================= */

  loadPostDMs: async (postId: number) => {
    try {
      const { getPostDMs } = await import("@/src/lib/dms");
      const dms = await getPostDMs(postId);
      
      set((state) => ({
        dmJobs: {
          ...state.dmJobs,
          [postId]: dms,
        },
      }));
      
      return dms;
    } catch (error: any) {
      set({ error: error.message || "Failed to load DM jobs" });
      return [];
    }
  },

  cancelDMJob: async (jobId: number) => {
    try {
      const { cancelDMJob } = await import("@/src/lib/dms");
      await cancelDMJob(jobId);
      
      // Refresh all DM jobs
      const state = get();
      for (const [postId, jobs] of Object.entries(state.dmJobs)) {
        if (jobs.some((j) => j.job_id === jobId)) {
          await get().loadPostDMs(parseInt(postId));
          break;
        }
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to cancel DM job" });
      throw error;
    }
  },

  retryDMJob: async (jobId: number) => {
    try {
      const { retryDMJob } = await import("@/src/lib/dms");
      await retryDMJob(jobId);
      
      // Refresh after retry
      const state = get();
      for (const [postId, jobs] of Object.entries(state.dmJobs)) {
        if (jobs.some((j) => j.job_id === jobId)) {
          await get().loadPostDMs(parseInt(postId));
          break;
        }
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to retry DM job" });
      throw error;
    }
  },

  loadConversations: async (days: number = 30) => {
    set({ loadingConversations: true });
    try {
      const { getConversations } = await import("@/src/lib/dms");
      const conversations = await getConversations(days);
      set({ conversations });
      return conversations;
    } catch (error: any) {
      set({ error: error.message || "Failed to load conversations" });
      return [];
    } finally {
      set({ loadingConversations: false });
    }
  },

  /* =======================
     MUTATIONS
  ======================= */

  addAccountToGroup: async (groupId: number, accountId: number) => {
    try {
      await apiFetch(`/groups/${groupId}/accounts/${accountId}`, {
        method: "POST",
      });
      await get().loadGroupAccounts(groupId);
    } catch (error: any) {
      set({ error: error.message || "Failed to add account to group" });
      throw error;
    }
  },

  removeAccountFromGroup: async (groupId: number, accountId: number) => {
    try {
      await apiFetch(`/groups/${groupId}/accounts/${accountId}`, {
        method: "DELETE",
      });
      await get().loadGroupAccounts(groupId);
    } catch (error: any) {
      set({ error: error.message || "Failed to remove account from group" });
      throw error;
    }
  },

  renameGroup: async (groupId: number, newName: string) => {
    try {
      await apiFetch(`/groups/${groupId}`, {
        method: "PATCH",
        body: JSON.stringify({ group_name: newName }),
      });
      await get().loadGroups();
    } catch (error: any) {
      set({ error: error.message || "Failed to rename group" });
      throw error;
    }
  },

  deleteGroup: async (groupId: number) => {
    try {
      await apiFetch(`/groups/${groupId}`, {
        method: "DELETE",
      });
      set((state) => {
        const { [groupId]: _, ...rest } = state.groupAccounts;
        return { groupAccounts: rest };
      });
      await get().loadGroups();
    } catch (error: any) {
      set({ error: error.message || "Failed to delete group" });
      throw error;
    }
  },

  disconnectAccount: async (accountId: number) => {
    try {
      await apiFetch(`/social-accounts/${accountId}`, {
        method: "DELETE",
      });
      await get().loadAccounts();
      
      // Update group accounts
      const groupIds = Object.keys(get().groupAccounts).map(Number);
      for (const groupId of groupIds) {
        await get().loadGroupAccounts(groupId);
      }
      
      // Clear Twitter auth status if it was a Twitter account
      set((state) => {
        const { [accountId]: _, ...rest } = state.twitterAuthStatus;
        return { twitterAuthStatus: rest };
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to disconnect account" });
      throw error;
    }
  },

  /* =======================
     UTILS
  ======================= */

  clearError: () => {
    set({ error: null });
  },

  getAccountsByPlatform: (platform: string) => {
    const normalizedPlatform = platform.toLowerCase();
    return get().accounts.filter(
      (a) => a.platform.toLowerCase() === normalizedPlatform
    );
  },

  getTwitterConnectedAccounts: () => {
    return get().accounts.filter(
      (a) =>
        a.platform.toLowerCase() === "twitter" && a.twitter_connected === true
    );
  },
}));