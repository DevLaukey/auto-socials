import axios, { AxiosInstance } from "axios";

/**
 * Centralized Axios instance for the frontend
 * Handles cookies, auth, and base URL
 */

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

export const executePost = (id: number) => api.post(`/posts/${id}/execute`);

export const cancelPost = (id: number) => api.post(`/posts/${id}/cancel`);

export const reschedulePost = (id: number, scheduled_time: string) =>
  api.post(`/posts/${id}/reschedule`, { scheduled_time });
