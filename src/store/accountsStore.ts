import { create } from "zustand";
import { apiFetch } from "@/src/lib/api";

/* =======================
   TYPES (BACKEND ALIGNED)
======================= */

export interface Account {
  id: number;
  platform: string;
  username?: string;
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

  // groupId -> accounts[]
  groupAccounts: Record<number, Account[]>;

  // loading flags
  loadingGroups: boolean;
  loadingAccounts: boolean;

  /* ---------- LOADERS ---------- */
  loadGroups: () => Promise<void>;
  loadAccounts: () => Promise<void>;
  loadGroupAccounts: (groupId: number) => Promise<void>;

  /* ---------- MUTATIONS ---------- */
  addAccountToGroup: (groupId: number, accountId: number) => Promise<void>;
  removeAccountFromGroup: (groupId: number, accountId: number) => Promise<void>;

  /** ✅ ADDED (REQUIRED BY UI) */
  disconnectAccount: (accountId: number) => Promise<void>;
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

  /* =======================
     LOADERS
  ======================= */

  loadGroups: async () => {
    set({ loadingGroups: true });

    try {
      const data = await apiFetch("/groups/");
      set({ groups: data });
    } finally {
      set({ loadingGroups: false });
    }
  },

  loadAccounts: async () => {
    set({ loadingAccounts: true });

    try {
      const data = await apiFetch("/social-accounts/");

      // normalize backend response
      const normalized: Account[] = data.map((a: any) => ({
        id: a.id,
        platform: a.platform,
        username: a.account_username,
        status: a.status,
      }));

      set({ accounts: normalized });
    } finally {
      set({ loadingAccounts: false });
    }
  },

  loadGroupAccounts: async (groupId: number) => {
    const data = await apiFetch(`/groups/${groupId}/accounts`);

    const normalized: Account[] = data.map((a: any) => ({
      id: a.id,
      platform: a.platform,
      username: a.accountUsername,
      status: "connected",
    }));

    set((state) => ({
      groupAccounts: {
        ...state.groupAccounts,
        [groupId]: normalized,
      },
    }));
  },

  /* =======================
     MUTATIONS
  ======================= */

  addAccountToGroup: async (groupId: number, accountId: number) => {
    await apiFetch(`/groups/${groupId}/accounts/${accountId}`, {
      method: "POST",
    });

    // refresh group accounts
    await get().loadGroupAccounts(groupId);
  },

  removeAccountFromGroup: async (groupId: number, accountId: number) => {
    await apiFetch(`/groups/${groupId}/accounts/${accountId}`, {
      method: "DELETE",
    });

    // refresh group accounts
    await get().loadGroupAccounts(groupId);
  },

  /** =======================
   *  DISCONNECT ACCOUNT
   *  ======================= */
  disconnectAccount: async (accountId: number) => {
    await apiFetch(`/social-accounts/${accountId}`, {
      method: "DELETE",
    });

    // refresh global accounts list
    await get().loadAccounts();

    // refresh all loaded group accounts (safe + consistent)
    const groupIds = Object.keys(get().groupAccounts).map(Number);
    for (const groupId of groupIds) {
      await get().loadGroupAccounts(groupId);
    }
  },
}));
