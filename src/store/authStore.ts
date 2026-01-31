import { create } from "zustand";
import { apiFetch } from "@/src/lib/api";

type Subscription = {
  is_active: boolean;
  plan_name: string;
  end_date: string;
};

type User = {
  id: number;
  email: string;
  is_admin?: boolean;
  subscription?: Subscription | null;
};

interface AuthState {
  user: User | null;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  /**
   * LOGIN
   * Cookie-based authentication
   */
  login: async (email, password) => {
    set({ loading: true });

    // Create session cookie
    await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Read authenticated user
    const user = await apiFetch("/auth/me");

    // Defensive: should never be null after login, but stay safe
    if (!user) {
      set({ user: null, loading: false });
      return;
    }

    set({
      user: {
        ...user,
        subscription: user.subscription ?? null,
      },
      loading: false,
    });
  },

  /**
   * REGISTER
   * ✅ Auto-login after successful registration
   */
  register: async (email, password) => {
    set({ loading: true });

    // 1️⃣ Create account
    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // 2️⃣ Auto-login (create session cookie)
    await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // 3️⃣ Fetch authenticated user
    const user = await apiFetch("/auth/me");

    if (!user) {
      // Extremely unlikely, but safe fallback
      set({ user: null, loading: false });
      return;
    }

    set({
      user: {
        ...user,
        subscription: user.subscription ?? null,
      },
      loading: false,
    });
  },

  /**
   * CHECK AUTH
   * Safe session revalidation
   * - 401 is NORMAL → user = null
   */
  checkAuth: async () => {
    set({ loading: true });

    const user = await apiFetch("/auth/me");

    if (!user) {
      set({
        user: null,
        loading: false,
      });
      return;
    }

    set({
      user: {
        ...user,
        subscription: user.subscription ?? null,
      },
      loading: false,
    });
  },

  /**
   * LOGOUT
   * Clears cookie-based session
   */
  logout: async () => {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
      });
    } catch {
      // Ignore backend logout errors
    }

    set({
      user: null,
      loading: false,
    });
  },
}));
