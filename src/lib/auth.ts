// automation-frontend/src/lib/auth.ts

// Ensure HTTPS in production to avoid mixed content errors
function getApiUrl() {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    url.startsWith("http://")
  ) {
    return url.replace("http://", "https://");
  }
  return url;
}

const API_URL = getApiUrl();

/* =======================
   Types
======================= */

export interface LoginResponse {
  email: string;
  message?: string;
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

export interface ApiError {
  detail?: string;
  message?: string;
  error?: string;
}

/* =======================
   API Calls
======================= */

export async function loginRequest(
  email: string,
  password: string,
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
    // Try to get detailed error message from response
    let errorMessage = "Invalid email or password";
    try {
      const data: ApiError = await res.json();
      // Handle different possible error response formats
      errorMessage = data.detail || data.message || data.error || errorMessage;
    } catch {
      // If response isn't JSON, use status text
      errorMessage = res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
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
    let errorMessage = "Registration failed";
    try {
      const data: ApiError = await res.json();
      errorMessage = data.detail || data.message || data.error || errorMessage;
    } catch {
      errorMessage = res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
}

export async function meRequest(): Promise<MeResponse> {
  const res = await fetch(`${API_URL}/auth/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    let errorMessage = "Unauthorized";
    try {
      const data: ApiError = await res.json();
      errorMessage = data.detail || data.message || data.error || errorMessage;
    } catch {
      errorMessage = res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
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
  const res = await fetch(`${API_URL}/auth/password-reset/request`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    let errorMessage = "Failed to send reset email";
    try {
      const data: ApiError = await res.json();
      errorMessage = data.detail || data.message || data.error || errorMessage;
    } catch {
      errorMessage = res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
}

export async function resetPasswordRequest(
  token: string,
  password: string,
): Promise<void> {
  const res = await fetch(`${API_URL}/auth/password-reset/confirm`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password }),
  });

  if (!res.ok) {
    let errorMessage = "Failed to reset password";
    try {
      const data: ApiError = await res.json();
      errorMessage = data.detail || data.message || data.error || errorMessage;
    } catch {
      errorMessage = res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
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
