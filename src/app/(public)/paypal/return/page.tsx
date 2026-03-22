"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/src/lib/api";
import { useAuthStore } from "@/src/store/authStore";

type Status = "capturing" | "success" | "error";

function PayPalReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkAuth = useAuthStore((s) => s.checkAuth);

  const [status, setStatus] = useState<Status>("capturing");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // PayPal returns ?token=ORDER_ID&PayerID=XXXXX
    const orderId = searchParams.get("token");

    if (!orderId) {
      setErrorMsg("Missing order information from PayPal.");
      setStatus("error");
      return;
    }

    const capture = async () => {
      try {
        await apiFetch(`/paypal/capture-order/${orderId}`, {
          method: "POST",
        });

        // Refresh auth state so subscription is reflected immediately
        await checkAuth();

        setStatus("success");

        // Redirect to app after a short delay
        setTimeout(() => router.replace("/"), 2500);
      } catch (err: any) {
        setErrorMsg(err?.message || "Payment capture failed. Please contact support.");
        setStatus("error");
      }
    };

    capture();
  }, [searchParams, checkAuth, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        {status === "capturing" && (
          <>
            <div className="w-14 h-14 border-4 border-gray-200 border-t-[#0070ba] rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-xl font-semibold mb-2">Confirming your payment…</h1>
            <p className="text-gray-500 text-sm">Please wait while we activate your subscription.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold mb-2">Subscription Activated!</h1>
            <p className="text-gray-500 text-sm mb-6">
              Your payment was successful. Redirecting you to the dashboard…
            </p>
            <button
              onClick={() => router.replace("/")}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
            >
              Go to Dashboard
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold mb-2">Payment Failed</h1>
            <p className="text-gray-500 text-sm mb-6">{errorMsg}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.replace("/subscription")}
                className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
              >
                Try Again
              </button>
              <button
                onClick={() => router.replace("/")}
                className="border border-gray-200 px-5 py-2 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                Go Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PayPalReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0070ba] rounded-full animate-spin" />
        </div>
      }
    >
      <PayPalReturnContent />
    </Suspense>
  );
}
