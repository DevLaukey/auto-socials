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

  // Twitter/X specific fields
  tweet_id?: string;
  media_ids?: string[];
  reply_to_tweet_id?: string;
  is_thread?: boolean;
  thread_tweets?: string[];

  // AI engagement fields
  ai_comment_enabled?: boolean;
  ai_comment_count?: number;
  ai_comment_style?: string;
  ai_comments_delay_minutes?: number;
  ai_dms_enabled?: boolean;

  // Engagement job counts
  comment_jobs_count?: number;
  dm_jobs_count?: number;
}

export interface PostStatus {
  id: number;
  status: string;
  scheduled_time?: string | null;
  executed_at?: string | null;
  error_message?: string | null;
}

export interface CreatePostData {
  // Core fields
  account_ids: number[];
  group_ids?: number[];
  media_file: string;
  title?: string;
  description?: string;
  hashtags?: string;
  scheduled_time?: string | null;
  privacy_status?: string;
  post_type?: string;

  // Payment method
  payment_method?: "zeroid" | "paypal" | "moneymotion";
  return_url?: string;
  cancel_url?: string;

  // Twitter/X specific fields
  is_thread?: boolean;
  thread_tweets?: string[];
  quote_tweet_id?: string;
  reply_to_tweet_id?: string;

  // AI Comments settings
  ai_comments_enabled?: boolean;
  ai_comments_count?: number;
  ai_comments_style?:
    | "casual"
    | "funny"
    | "thoughtful"
    | "question"
    | "supportive";
  ai_comments_delay_minutes?: number;
  ai_comments_spread?: boolean;

  // AI DMs settings
  ai_dms_enabled?: boolean;
  ai_dms_target_users?: string[];
  ai_dms_message_style?:
    | "friendly"
    | "professional"
    | "casual"
    | "enthusiastic"
    | "helpful";
  ai_dms_delay_minutes?: number;

  // Clip source indicator
  clip_source?: boolean;
  clip_data?: any;
}

export interface CreatePostResponse {
  id: number;
  status: string;
  scheduled_time?: string | null;
  platform_counts?: Record<string, number>;
}

export interface CreatePostWithEngagementResponse {
  post_id: number;
  status: string;
  scheduled_time?: string | null;
  engagement_jobs: {
    comments: Array<{
      job_id: number;
      account_id: number;
      comment: string;
      scheduled_time: string;
    }>;
    dms: Array<{
      job_id: number;
      account_id: number;
      recipient: string;
      message: string;
      scheduled_time: string;
    }>;
  };
}

export interface CommentJob {
  job_id: number;
  account_id: number;
  target_url: string;
  comment: string;
  scheduled_time: string | null;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
}

export interface DMJob {
  job_id: number;
  account_id: number;
  recipient: string;
  message: string;
  scheduled_time: string | null;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
}

export interface PaymentInitiateResponse {
  payment_id: string;
  payment_url: string;
  message: string;
}

export interface PaymentMethodResponse {
  payment_method: string;
  action: string;
  endpoint?: string;
  data?: any;
  payment_id?: string;
  payment_url?: string;
}

export interface PaymentStatus {
  payment_id: string;
  status: "pending" | "paid" | "failed";
  is_paid: boolean;
  payment_method?: string;
  created_at: string;
  updated_at: string;
}

export interface PostPayment {
  payment_id: string;
  status: "pending" | "paid" | "failed";
  is_paid: boolean;
  payment_method?: string;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
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
      errorMessage = data.detail || data.message || data.error || errorMessage;
    } catch {
      try {
        const text = await res.text();
        if (text) errorMessage = text;
      } catch {}
    }
    throw new Error(errorMessage);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

// =====================================================
// POST CRUD OPERATIONS
// =====================================================

// List all posts
export async function listPosts(): Promise<Post[]> {
  return postsFetch("/posts");
}

// Create a new post (basic)
export async function createPost(
  data: CreatePostData,
): Promise<CreatePostResponse> {
  return postsFetch("/posts/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Create a post with AI engagement automation
export async function createPostWithEngagement(
  data: CreatePostData,
): Promise<CreatePostWithEngagementResponse> {
  return postsFetch("/posts/with-engagement", {
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
export async function executePost(
  postId: number,
): Promise<{ message: string }> {
  return postsFetch(`/posts/${postId}/execute`, {
    method: "POST",
  });
}

// Cancel a scheduled post
export async function cancelPost(postId: number): Promise<{ message: string }> {
  return postsFetch(`/posts/${postId}/cancel`, {
    method: "PATCH",
  });
}

// Reschedule a post
export async function reschedulePost(
  postId: number,
  scheduledTime: string,
): Promise<{ message: string }> {
  return postsFetch(`/posts/${postId}/reschedule`, {
    method: "PATCH",
    body: JSON.stringify({ scheduled_time: scheduledTime }),
  });
}

// Repost a failed post
export async function repostPost(postId: number): Promise<{ message: string }> {
  return postsFetch(`/posts/${postId}/repost`, {
    method: "POST",
  });
}

// =====================================================
// COMMENT JOBS MANAGEMENT
// =====================================================

// Get all comment jobs for a post
export async function getPostComments(postId: number): Promise<CommentJob[]> {
  return postsFetch(`/posts/${postId}/comments`);
}

// Cancel a scheduled comment job
export async function cancelCommentJob(
  jobId: number,
): Promise<{ message: string }> {
  return postsFetch(`/posts/comments/${jobId}`, {
    method: "DELETE",
  });
}

// Retry a failed comment job
export async function retryCommentJob(
  jobId: number,
): Promise<{ message: string }> {
  return postsFetch(`/posts/comments/${jobId}/retry`, {
    method: "POST",
  });
}

// =====================================================
// DM JOBS MANAGEMENT
// =====================================================

// Get all DM jobs for a post
export async function getPostDMs(postId: number): Promise<DMJob[]> {
  return postsFetch(`/posts/${postId}/dms`);
}

// Cancel a scheduled DM job
export async function cancelDMJob(jobId: number): Promise<{ message: string }> {
  return postsFetch(`/posts/dms/${jobId}`, {
    method: "DELETE",
  });
}

// Retry a failed DM job
export async function retryDMJob(jobId: number): Promise<{ message: string }> {
  return postsFetch(`/posts/dms/${jobId}/retry`, {
    method: "POST",
  });
}

// =====================================================
// TWITTER/X SPECIFIC
// =====================================================

// Get tweet metrics
export async function getTweetMetrics(tweetId: string): Promise<{
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
  impressions: number;
  bookmarks: number;
}> {
  return postsFetch(`/api/twitter/metrics/${tweetId}`);
}

// =====================================================
// PAYMENT ENDPOINTS
// =====================================================

// Initiate payment for creating a post with method selection
export async function initiatePostPaymentWithMethod(
  data: CreatePostData,
): Promise<PaymentMethodResponse> {
  return postsFetch("/posts/initiate-payment/select-method", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Initiate payment for creating a post (legacy ZeroID)
export async function initiatePostPayment(
  data: CreatePostData,
): Promise<PaymentInitiateResponse> {
  return postsFetch("/posts/initiate-payment", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Check payment status by payment ID
export async function getPaymentStatus(
  paymentId: string,
): Promise<PaymentStatus> {
  return postsFetch(`/posts/payment-status/${paymentId}`);
}

// List all user's post payments
export async function getMyPayments(
  status?: "pending" | "paid" | "failed",
): Promise<PostPayment[]> {
  const query = status ? `?status=${status}` : "";
  return postsFetch(`/posts/my-payments${query}`);
}

// Get available payment methods
export async function getPaymentMethods(): Promise<{
  payment_methods: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    enabled: boolean;
    amount?: number;
    currency?: string;
  }>;
}> {
  return postsFetch("/posts/payment-methods");
}

// =====================================================
// MONEYMOTION PAYMENT FUNCTIONS
// =====================================================

export interface MoneyMotionOrderResponse {
  payment_id: string;
  checkout_url: string;
  reference: string;
}

export async function createMoneyMotionPostOrder(data: {
  post_data: any;
  return_url?: string;
  cancel_url?: string;
}): Promise<MoneyMotionOrderResponse> {
  return postsFetch("/moneymotion/create-post-order", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Format post status for display
export function formatPostStatus(status: string): {
  label: string;
  color: string;
} {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    processing: { label: "Processing", color: "bg-blue-100 text-blue-800" },
    scheduled: { label: "Scheduled", color: "bg-purple-100 text-purple-800" },
    posted: { label: "Posted", color: "bg-green-100 text-green-800" },
    completed: { label: "Completed", color: "bg-green-100 text-green-800" },
    failed: { label: "Failed", color: "bg-red-100 text-red-800" },
    cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-800" },
  };
  return (
    statusMap[status.toLowerCase()] || {
      label: status,
      color: "bg-gray-100 text-gray-800",
    }
  );
}

// Format comment job status for display
export function formatCommentJobStatus(status: string): {
  label: string;
  color: string;
} {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Scheduled", color: "bg-purple-100 text-purple-800" },
    processing: { label: "Posting...", color: "bg-blue-100 text-blue-800" },
    completed: { label: "Posted", color: "bg-green-100 text-green-800" },
    failed: { label: "Failed", color: "bg-red-100 text-red-800" },
    cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-800" },
  };
  return (
    statusMap[status.toLowerCase()] || {
      label: status,
      color: "bg-gray-100 text-gray-800",
    }
  );
}

// Format DM job status for display
export function formatDMJobStatus(status: string): {
  label: string;
  color: string;
} {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Scheduled", color: "bg-purple-100 text-purple-800" },
    processing: { label: "Sending...", color: "bg-blue-100 text-blue-800" },
    completed: { label: "Sent", color: "bg-green-100 text-green-800" },
    failed: { label: "Failed", color: "bg-red-100 text-red-800" },
    cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-800" },
  };
  return (
    statusMap[status.toLowerCase()] || {
      label: status,
      color: "bg-gray-100 text-gray-800",
    }
  );
}

// Check if a post has AI engagement enabled
export function hasAIEngagement(post: Post): boolean {
  return !!(post.ai_comment_enabled || post.ai_dms_enabled);
}

// Get engagement summary for a post
export function getEngagementSummary(post: Post): string {
  const parts = [];
  if (post.ai_comment_enabled) {
    parts.push(`${post.ai_comment_count || 0} AI comments`);
  }
  if (post.ai_dms_enabled) {
    parts.push(`AI DMs`);
  }
  return parts.length > 0 ? parts.join(" • ") : "No AI engagement";
}
