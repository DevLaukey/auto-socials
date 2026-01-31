import api from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // ✅ Allow auth endpoints to return 401 safely
  if (!res.ok) {
    if (res.status === 401) {
      return null;
    }

    let errorMessage = "Request failed";
    try {
      const text = await res.text();
      errorMessage = text || errorMessage;
    } catch {}

    throw new Error(errorMessage);
  }

  // 204 No Content
  if (res.status === 204) {
    return null;
  }

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return null;
  }

  return res.json();
}

// --------------------------------------------------
// GET accounts
// --------------------------------------------------

export async function fetchSocialAccounts() {
  const res = await apiFetch("/social-accounts/", {
    method: "GET",
  });

  return res;
}

// --------------------------------------------------
// ADD account
// --------------------------------------------------

export const createAccount = (data: {
  platform: string;
  account_username: string;
  password?: string;
  group_name?: string;
}) =>
  apiFetch("/social-accounts", {
    method: "POST",
    body: JSON.stringify(data),
  });

// --------------------------------------------------
// DELETE account
// --------------------------------------------------

export const deleteAccount = (accountId: number) =>
  apiFetch(`/social-accounts/${accountId}`, {
    method: "DELETE",
  });

// --------------------------------------------------
// POSTS (axios-based, untouched)
// --------------------------------------------------

export const executePost = (id: number) => api.post(`/posts/${id}/execute`);

export const cancelPost = (id: number) => api.post(`/posts/${id}/cancel`);

export const reschedulePost = (id: number, scheduled_time: string) =>
  api.post(`/posts/${id}/reschedule`, { scheduled_time });
