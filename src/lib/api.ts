import api from "@/lib/api";

// Ensure HTTPS in production to avoid mixed content errors
function getApiBase() {
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

const API_BASE = getApiBase();

// For JSON requests (your existing function)
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

// NEW: For FormData requests (file uploads) - don't set Content-Type header
export async function apiFetchFormData(path: string, formData: FormData) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: "include",
    body: formData,
    // Don't set Content-Type header - browser will set it with boundary
  });

  if (!res.ok) {
    let errorMessage = "Request failed";
    try {
      const text = await res.text();
      errorMessage = text || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return res.json();
}

export function getFullVideoUrl(videoUrl: string): string {
  if (!videoUrl) return "";
  if (videoUrl.startsWith("http")) return videoUrl;
  return `${API_BASE}${videoUrl}`;
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
  apiFetch("/social-accounts/create", {
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
