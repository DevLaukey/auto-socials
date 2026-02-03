// Ensure HTTPS in production to avoid mixed content errors
function getApiBase() {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  if (typeof window !== "undefined" && window.location.protocol === "https:" && url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  return url;
}

const API_BASE = getApiBase();

export async function loginRequest(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  return res.json();
}

export async function registerRequest(email: string, password: string) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Registration failed");
  }

  return response.json();
}

export async function meRequest() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json();
}

export async function logoutRequest() {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
