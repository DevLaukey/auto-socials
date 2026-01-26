const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function loginRequest(email: string, password: string) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  return response.json();
}
