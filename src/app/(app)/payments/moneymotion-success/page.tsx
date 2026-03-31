"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";

function MoneyMotionSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const [countdown, setCountdown] = useState(3);

  const paymentId = searchParams.get("payment_id");
  const reference = searchParams.get("reference");
  const status = searchParams.get("status");

  useEffect(() => {
    // Refresh auth state
    checkAuth();

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.replace("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [checkAuth, router]);

  const isSuccess =
    status === "completed" || status === "success" || status === "paid";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        {isSuccess ? (
          <>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-7 h-7 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold mb-2">Payment Successful!</h1>
            <p className="text-gray-500 text-sm mb-4">
              Your subscription has been activated successfully.
            </p>
            {reference && (
              <p className="text-xs text-gray-400 mb-6">
                Reference: {reference}
              </p>
            )}
            <p className="text-sm text-gray-500 mb-6">
              Redirecting to dashboard in {countdown} seconds...
            </p>
            <button
              onClick={() => router.replace("/")}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
            >
              Go to Dashboard Now
            </button>
          </>
        ) : (
          <>
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-7 h-7 text-yellow-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold mb-2">Payment Pending</h1>
            <p className="text-gray-500 text-sm mb-6">
              Your payment is being processed. You'll receive a confirmation
              email once completed.
            </p>
            <button
              onClick={() => router.replace("/")}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function MoneyMotionSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      }
    >
      <MoneyMotionSuccessContent />
    </Suspense>
  );
}
