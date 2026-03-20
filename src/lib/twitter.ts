// src/lib/twitter.ts

import { apiFetch } from "./api";

export interface TwitterAuthStatus {
  authenticated: boolean;
  account_id: number;
  auth_url?: string;
  error?: string;
}

export interface TweetMetrics {
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
  impressions: number;
  bookmarks: number;
}

/**
 * Start Twitter OAuth flow
 * Redirects user to Twitter for authentication
 */
export const connectTwitter = (accountId: number, redirectPath: string = "/") => {
  const encodedRedirect = encodeURIComponent(redirectPath);
  window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/twitter/start/${accountId}?next=${encodedRedirect}`;
};

/**
 * Check Twitter connection status for an account
 */
export const checkTwitterStatus = async (accountId: number): Promise<TwitterAuthStatus> => {
  return apiFetch(`/auth/twitter/status/${accountId}`);
};

/**
 * Manually refresh Twitter token
 */
export const refreshTwitterToken = async (accountId: number): Promise<{ message: string }> => {
  return apiFetch(`/auth/twitter/refresh/${accountId}`, {
    method: "POST",
  });
};

/**
 * Get tweet metrics for analytics
 */
export const getTweetMetrics = async (tweetId: string): Promise<TweetMetrics> => {
  return apiFetch(`/api/twitter/metrics/${tweetId}`);
};