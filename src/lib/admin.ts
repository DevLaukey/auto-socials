const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export interface AdminUser {
  id: number;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  subscription?: {
    is_active: boolean;
    plan_name?: string;
    status?: string;
    end_date?: string;
  } | null;
}

export interface Payment {
  id: number;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  plan_name?: string;
}

async function adminFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let errorMessage = "Request failed";
    try {
      const data = await res.json();
      errorMessage = data.detail || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export async function listUsers(): Promise<AdminUser[]> {
  return adminFetch("/admin/users");
}

export async function setUserStatus(
  userId: number,
  isActive: boolean
): Promise<void> {
  await adminFetch(`/admin/users/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ is_active: isActive }),
  });
}

export async function extendSubscription(
  userId: number,
  days: number
): Promise<void> {
  await adminFetch(`/admin/users/${userId}/extend-subscription`, {
    method: "POST",
    body: JSON.stringify({ days }),
  });
}

export async function getUserPayments(userId: number): Promise<Payment[]> {
  return adminFetch(`/admin/users/${userId}/payments`);
}

export async function promoteToAdmin(userId: number): Promise<void> {
  await adminFetch(`/admin/users/${userId}/promote`, {
    method: "POST",
  });
}

export async function revokeAdmin(userId: number): Promise<void> {
  await adminFetch(`/admin/users/${userId}/revoke-admin`, {
    method: "POST",
  });
}
