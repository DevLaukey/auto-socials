"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import { apiFetch } from "@/src/lib/api";

type Plan = {
  id: number;
  name: string;
  price: number;
  max_channels: number;
  posts_per_day: number;
  comments_per_day: number;
  dms_per_day: number;
};

export default function SubscriptionPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const user = useAuthStore((s) => s.user);
  const loadingAuth = useAuthStore((s) => s.loading);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await apiFetch("/subscriptions/plans");
        setPlans(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load plans");
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, []);

  useEffect(() => {
    if (
      !loadingAuth &&
      user?.subscription &&
      user.subscription.is_active === true
    ) {
      router.replace("/");
    }
  }, [loadingAuth, user, router]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const card = container.children[activeIndex] as HTMLElement;
    if (!card) return;
    const containerCenter = container.offsetWidth / 2;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    container.scrollTo({ left: cardCenter - containerCenter, behavior: "smooth" });
  }, [activeIndex]);

  const startHoverScroll = (direction: "left" | "right") => {
    stopHoverScroll();
    hoverIntervalRef.current = setInterval(() => {
      setActiveIndex((prev) =>
        direction === "left"
          ? Math.max(0, prev - 1)
          : Math.min(plans.length - 1, prev + 1)
      );
    }, 350);
  };

  const stopHoverScroll = () => {
    if (hoverIntervalRef.current) {
      clearInterval(hoverIntervalRef.current);
      hoverIntervalRef.current = null;
    }
  };

  const subscribe = async (planId: number) => {
    setError(null);
    try {
      setSubmitting(planId);

      const res = await apiFetch("/paypal/create-subscription-order", {
        method: "POST",
        body: JSON.stringify({ plan_id: planId }),
      });

      if (!res?.approval_url) {
        throw new Error("Missing PayPal approval URL");
      }

      // Redirect user to PayPal to approve payment
      window.location.href = res.approval_url;
    } catch (err: any) {
      setError(err?.message || "Failed to start PayPal payment");
      setSubmitting(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 relative">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
      >
        <span className="text-xl">←</span>
        <span>Back</span>
      </button>

      <h1 className="text-3xl font-bold mb-2 text-center">
        Choose a Subscription
      </h1>
      <p className="text-gray-500 mb-2 text-center">
        Subscribe to unlock posting and other features.
      </p>

      {/* PayPal badge */}
      <p className="text-center text-sm text-gray-400 mb-8 flex items-center justify-center gap-2">
        <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.79A.859.859 0 0 1 5.79 2.1h7.918c2.76 0 4.76.617 5.95 1.835.55.565.91 1.16 1.09 1.8.19.68.19 1.41.01 2.24-.01.04-.02.08-.03.13-.65 3.32-2.88 4.47-5.73 4.47h-1.45c-.35 0-.64.25-.7.6l-.75 4.76-.03.17a.641.641 0 0 1-.633.54H7.076z"/>
        </svg>
        Secure payment via PayPal
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* LEFT ARROW */}
          <button
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            onMouseEnter={() => startHoverScroll("left")}
            onMouseLeave={stopHoverScroll}
            disabled={activeIndex === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10
                       bg-white shadow-xl rounded-full w-11 h-11
                       flex items-center justify-center text-2xl
                       hover:scale-110 transition disabled:opacity-30"
          >
            ‹
          </button>

          {/* RIGHT ARROW */}
          <button
            onClick={() => setActiveIndex((i) => Math.min(plans.length - 1, i + 1))}
            onMouseEnter={() => startHoverScroll("right")}
            onMouseLeave={stopHoverScroll}
            disabled={activeIndex === plans.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10
                       bg-white shadow-xl rounded-full w-11 h-11
                       flex items-center justify-center text-2xl
                       hover:scale-110 transition disabled:opacity-30"
          >
            ›
          </button>

          {/* CAROUSEL */}
          <div ref={containerRef} className="flex gap-10 overflow-hidden px-20">
            {plans.map((plan, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={plan.id}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className={`
                    flex-shrink-0 w-[340px] cursor-pointer
                    transition-all duration-300 ease-out
                    ${isActive ? "scale-110 z-10" : "scale-90 opacity-60"}
                    hover:scale-[1.03] hover:-translate-y-2
                  `}
                >
                  <div className="rounded-2xl bg-gray-100 p-4 shadow-lg h-full hover:shadow-2xl transition">
                    <div className="bg-white rounded-xl p-6 h-full flex flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-semibold mb-1 text-center">
                          {plan.name}
                        </h2>
                        <p className="text-3xl font-bold text-center mb-4">
                          ${plan.price}
                          <span className="text-sm font-normal text-gray-500">/mo</span>
                        </p>

                        <ul className="space-y-3 text-sm text-gray-600">
                          <li className="flex justify-between">
                            <span className="text-gray-400">Channels</span>
                            <span className="font-medium">{plan.max_channels}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-400">Posts/day</span>
                            <span className="font-medium">{plan.posts_per_day}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-400">Comments/day</span>
                            <span className="font-medium">{plan.comments_per_day}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-400">DMs/day</span>
                            <span className="font-medium">{plan.dms_per_day}</span>
                          </li>
                        </ul>
                      </div>

                      <button
                        disabled={submitting === plan.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          subscribe(plan.id);
                        }}
                        className="mt-8 bg-[#0070ba] hover:bg-[#003087] text-white py-2.5 rounded-lg
                                   transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {submitting === plan.id ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Redirecting to PayPal…
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.79A.859.859 0 0 1 5.79 2.1h7.918c2.76 0 4.76.617 5.95 1.835.55.565.91 1.16 1.09 1.8.19.68.19 1.41.01 2.24-.01.04-.02.08-.03.13-.65 3.32-2.88 4.47-5.73 4.47h-1.45c-.35 0-.64.25-.7.6l-.75 4.76-.03.17a.641.641 0 0 1-.633.54H7.076z"/>
                            </svg>
                            Pay with PayPal
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
