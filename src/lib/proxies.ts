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

export interface Proxy {
  id: number;
  proxy_address: string;
  proxy_type: string;
  username?: string; // Added for authenticated proxies
  is_active: boolean;
  created_at?: string;
}

export interface CreateProxyData {
  proxy_address: string; // Combined host:port format
  proxy_type: string; // http, https, socks5
  username?: string; // Optional username for authenticated proxies
  password?: string; // Optional password for authenticated proxies
}

async function proxyFetch(path: string, options: RequestInit = {}) {
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

export async function listProxies(): Promise<Proxy[]> {
  return proxyFetch("/proxies/proxy");
}

export async function createProxy(
  data: CreateProxyData,
): Promise<{ message: string }> {
  return proxyFetch("/proxies/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function activateProxy(
  proxyId: number,
): Promise<{ message: string }> {
  return proxyFetch(`/proxies/${proxyId}/activate`, {
    method: "PATCH",
  });
}

export async function deactivateProxy(
  proxyId: number,
): Promise<{ message: string }> {
  return proxyFetch(`/proxies/${proxyId}/deactivate`, {
    method: "PATCH",
  });
}

export async function removeProxy(proxyId: number): Promise<void> {
  await proxyFetch(`/proxies/${proxyId}`, {
    method: "DELETE",
  });
}
