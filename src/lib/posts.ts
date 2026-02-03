// Ensure HTTPS in production to avoid mixed content errors
function getApiUrl() {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  if (typeof window !== "undefined" && window.location.protocol === "https:" && url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  return url;
}

const API_URL = getApiUrl();

export interface PostAccount {
  id: number;
  platform: string;
  username: string;
}

export interface Post {
  id: number;
  title?: string;
  description?: string;
  hashtags?: string;
  media_file?: string;
  status: string;
  scheduled_time?: string | null;
  created_at: string;
  updated_at?: string;
  accounts?: PostAccount[];
  post_type?: string;
  privacy_status?: string;
}

export interface PostStatus {
  id: number;
  status: string;
  scheduled_time?: string | null;
  executed_at?: string | null;
  error_message?: string | null;
}

export interface CreatePostData {
  account_ids: number[];
  group_ids?: number[];
  media_file: string;
  title?: string;
  description?: string;
  hashtags?: string;
  scheduled_time?: string | null;
  privacy_status?: string;
  post_type?: string;
}

async function postsFetch(path: string, options: RequestInit = {}) {
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

// List all posts
export async function listPosts(): Promise<Post[]> {
  return postsFetch("/posts");
}

// Create a new post
export async function createPost(data: CreatePostData): Promise<Post> {
  return postsFetch("/posts/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Get a single post by ID
export async function getPost(postId: number): Promise<Post> {
  return postsFetch(`/posts/post/${postId}`);
}

// Get post status
export async function getPostStatus(postId: number): Promise<PostStatus> {
  return postsFetch(`/posts/${postId}/status`);
}

// Execute a post immediately
export async function executePost(postId: number): Promise<void> {
  await postsFetch(`/posts/${postId}/execute`, {
    method: "POST",
  });
}

// Cancel a scheduled post
export async function cancelPost(postId: number): Promise<void> {
  await postsFetch(`/posts/${postId}/cancel`, {
    method: "PATCH",
  });
}

// Reschedule a post
export async function reschedulePost(
  postId: number,
  scheduledTime: string
): Promise<void> {
  await postsFetch(`/posts/${postId}/reschedule`, {
    method: "PATCH",
    body: JSON.stringify({ scheduled_time: scheduledTime }),
  });
}

// Repost a failed post
export async function repostPost(postId: number): Promise<void> {
  await postsFetch(`/posts/${postId}/repost`, {
    method: "POST",
  });
}

// =====================================================
// PAYMENT ENDPOINTS
// =====================================================

export interface PaymentInitiateResponse {
  payment_id: string;
  payment_url: string;
  message: string;
}

export interface PaymentStatus {
  payment_id: string;
  status: "pending" | "paid" | "failed";
  is_paid: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostPayment {
  payment_id: string;
  status: "pending" | "paid" | "failed";
  is_paid: boolean;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

// Initiate payment for creating a post
export async function initiatePostPayment(
  data: CreatePostData
): Promise<PaymentInitiateResponse> {
  return postsFetch("/posts/initiate-payment", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Check payment status by payment ID
export async function getPaymentStatus(
  paymentId: string
): Promise<PaymentStatus> {
  return postsFetch(`/posts/payment-status/${paymentId}`);
}

// List all user's post payments
export async function getMyPayments(
  status?: "pending" | "paid" | "failed"
): Promise<PostPayment[]> {
  const query = status ? `?status=${status}` : "";
  return postsFetch(`/posts/my-payments${query}`);
}
