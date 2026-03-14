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
}

export interface Group {
  id: number;
  name: string;
}

/* =======================
   STORE
======================= */

interface AccountsState {
  // core data
  groups: Group[];
  accounts: Account[];
  groupAccounts: Record<number, Account[]>;

  // loading flags
  loadingGroups: boolean;
  loadingAccounts: boolean;
  error: string | null;

  /* ---------- LOADERS ---------- */
  loadGroups: () => Promise<void>;
  loadAccounts: () => Promise<void>;
  loadGroupAccounts: (groupId: number) => Promise<void>;

  /* ---------- MUTATIONS ---------- */
  addAccountToGroup: (groupId: number, accountId: number) => Promise<void>;
  removeAccountFromGroup: (groupId: number, accountId: number) => Promise<void>;
  renameGroup: (groupId: number, newName: string) => Promise<void>;
  deleteGroup: (groupId: number) => Promise<void>;
  disconnectAccount: (accountId: number) => Promise<void>;
  clearError: () => void;
}

export const useAccountsStore = create<AccountsState>((set, get) => ({
  /* =======================
     STATE
  ======================= */

  groups: [],
  accounts: [],
  groupAccounts: {},
  loadingGroups: false,
  loadingAccounts: false,
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
      const groupIds = Object.keys(get().groupAccounts).map(Number);
      for (const groupId of groupIds) {
        await get().loadGroupAccounts(groupId);
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to disconnect account" });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
