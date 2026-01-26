"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import { apiFetch } from "@/src/lib/api";

type Plan = {
  id: number;
  name: string;
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

  /**
   * Load plans
   */
  useEffect(() => {
    const loadPlans = async () => {
      const data = await apiFetch("/subscriptions/plans");
      setPlans(data);
      setLoading(false);
    };

    loadPlans();
  }, []);

  /**
   * Redirect if already subscribed
   */
  useEffect(() => {
    if (
      !loadingAuth &&
      user?.subscription &&
      user.subscription.is_active === true
    ) {
      router.replace("/");
    }
  }, [loadingAuth, user, router]);

  /**
   * Center active card
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const card = container.children[activeIndex] as HTMLElement;
    if (!card) return;

    const containerCenter = container.offsetWidth / 2;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;

    container.scrollTo({
      left: cardCenter - containerCenter,
      behavior: "smooth",
    });
  }, [activeIndex]);

  const startHoverScroll = (direction: "left" | "right") => {
    stopHoverScroll();

    hoverIntervalRef.current = setInterval(() => {
      setActiveIndex((prev) =>
        direction === "left"
          ? Math.max(0, prev - 1)
          : Math.min(plans.length - 1, prev + 1),
      );
    }, 350);
  };

  const stopHoverScroll = () => {
    if (hoverIntervalRef.current) {
      clearInterval(hoverIntervalRef.current);
      hoverIntervalRef.current = null;
    }
  };

  /**
   * Subscribe → redirect to payment
   */
  const subscribe = async (planId: number) => {
    try {
      setSubmitting(planId);

      const res = await apiFetch("/subscriptions/subscribe", {
        method: "POST",
        body: JSON.stringify({ plan_id: planId }),
      });

      if (!res?.payment_url) {
        throw new Error("Missing payment URL");
      }

      // 🔑 Redirect to ZeroID payment page
      window.location.href = res.payment_url;
    } catch (err: any) {
      alert(err?.message || "Failed to start payment");
    } finally {
      setSubmitting(null);
    }
  };

  if (loading || loadingAuth) {
    return <div className="p-8">Loading subscription plans…</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 relative">
      <h1 className="text-3xl font-bold mb-2 text-center">
        Choose a Subscription
      </h1>
      <p className="text-gray-500 mb-10 text-center">
        You must have an active subscription to use the platform.
      </p>

      {/* LEFT ARROW */}
      <button
        onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
        onMouseEnter={() => startHoverScroll("left")}
        onMouseLeave={stopHoverScroll}
        disabled={activeIndex === 0}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10
                   bg-white shadow-xl rounded-full w-11 h-11
                   flex items-center justify-center
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
                   flex items-center justify-center
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
                hover:scale-[1.03]
                hover:-translate-y-2
              `}
            >
              <div className="rounded-2xl bg-gray-100 p-4 shadow-lg h-full hover:shadow-2xl transition">
                <div className="bg-white rounded-xl p-6 h-full flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-center">
                      {plan.name}
                    </h2>

                    <ul className="space-y-3 text-sm text-gray-600">
                      <li>
                        <strong>Channels:</strong> {plan.max_channels}
                      </li>
                      <li>
                        <strong>Posts/day:</strong> {plan.posts_per_day}
                      </li>
                      <li>
                        <strong>Comments/day:</strong> {plan.comments_per_day}
                      </li>
                      <li>
                        <strong>DMs/day:</strong> {plan.dms_per_day}
                      </li>
                    </ul>
                  </div>

                  <button
                    disabled={submitting === plan.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      subscribe(plan.id);
                    }}
                    className="mt-8 bg-black text-white py-2 rounded-lg
                               hover:bg-gray-800 transition
                               disabled:opacity-50"
                  >
                    {submitting === plan.id ? "Processing…" : "Select Plan"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
