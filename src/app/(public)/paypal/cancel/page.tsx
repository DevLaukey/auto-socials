"use client";

import { useRouter } from "next/navigation";

export default function PayPalCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 text-sm mb-6">
          You cancelled the PayPal payment. No charges were made. You can try again whenever you're ready.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.replace("/subscription")}
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
          >
            View Plans
          </button>
          <button
            onClick={() => router.replace("/")}
            className="border border-gray-200 px-5 py-2 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
