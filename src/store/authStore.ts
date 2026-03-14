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
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  /**
   * LOGIN
   */
  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      // Attempt to login
      const loginResponse = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Small delay to ensure cookie is properly set
      await new Promise((resolve) => setTimeout(resolve, 100));

      const user = await apiFetch("/auth/me");

      if (user) {
        set({
          user: {
            ...user,
            subscription: user.subscription ?? null,
          },
          loading: false,
          error: null,
        });
        return;
      }
    } catch (error: any) {
      console.error("Login error:", error);

      const errorMessage = error.message || "Invalid email or password";

      set({
        user: null,
        loading: false,
        error: errorMessage,
      });
    }
  },

  /**
   * REGISTER
   */
  register: async (email, password) => {
    set({ loading: true, error: null });

    try {
      // 1️⃣ Create account
      const registerResponse = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // 2️⃣ Auto-login
      const loginResponse = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Small delay to ensure cookie is properly set
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 3️⃣ Fetch authenticated user
      const user = await apiFetch("/auth/me");

      if (user) {
        set({
          user: {
            ...user,
            subscription: user.subscription ?? null,
          },
          loading: false,
          error: null,
        });
        return;
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      let errorMessage = error.message || "Registration failed";

      if (
        errorMessage.toLowerCase().includes("already exists") ||
        errorMessage.toLowerCase().includes("duplicate") ||
        errorMessage.toLowerCase().includes("already registered")
      ) {
        errorMessage =
          "An account with this email already exists. Please sign in instead.";
      }

      set({
        user: null,
        loading: false,
        error: errorMessage,
      });
    }
  },

  /**
   * CHECK AUTH
   */
  checkAuth: async () => {
    set({ loading: true, error: null });

    try {
      const user = await apiFetch("/auth/me");

      if (!user) {
        // User is not authenticated - this is normal
        set({
          user: null,
          loading: false,
          error: null, // Don't show error for unauthenticated state
        });
        return;
      }

      set({
        user: {
          ...user,
          subscription: user.subscription ?? null,
        },
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("CheckAuth error:", error);

      // Any other error (not 401) should be shown
      set({
        user: null,
        loading: false,
        error: error.message || "Failed to verify authentication status",
      });
    }
  },

  /**
   * LOGOUT
   */
  logout: async () => {
    set({ loading: true, error: null });

    try {
      await apiFetch("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({
        user: null,
        loading: false,
        error: null,
      });
    }
  },

  /**
   * CLEAR ERROR
   */
  clearError: () => {
    set({ error: null });
  },
}));
