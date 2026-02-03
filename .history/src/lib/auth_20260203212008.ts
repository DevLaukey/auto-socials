// automation-frontend/src/lib/auth.ts

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

/* =======================
   Types
======================= */

export interface LoginResponse {
  email: string;
}

export interface MeResponse {
  id: number;
  email: string;
  username: string;
  subscription: {
    is_active: boolean;
    plan_id?: number;
    plan_name?: string;
    status?: string;
    end_date?: string;
  };
}

/* =======================
   Helpers
======================= */

// Auth is cookie-based, no need to store tokens in localStorage

/* =======================
   API Calls
======================= */

export async function loginRequest(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  return res.json();
}

export async function registerRequest(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Registration failed");
  }
}

export async function meRequest(): Promise<MeResponse> {
  const res = await fetch(`${API_URL}/auth/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json();
}

/* =======================
   Auth Controller
======================= */

export async function logoutRequest(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function forgotPasswordRequest(email: string): Promise<void> {
  const res = await fetch(`${API_URL}/auth/password-reset-request/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Failed to send reset email");
  }
}

export async function resetPasswordRequest(
  token: string,
  password: string
): Promise<void> {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Failed to reset password");
  }
}

export const auth = {
  async login(email: string, password: string) {
    return await loginRequest(email, password);
  },

  async register(email: string, password: string) {
    await registerRequest(email, password);
  },

  async restore() {
    return await meRequest();
  },

  async logout() {
    await logoutRequest();
    window.location.href = "/login";
  },
};
