"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/src/store/authStore";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

export default function LandingPage() {
  const router = useRouter();
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    checkAuth().then(() => setChecked(true));
  }, [checkAuth]);

  useEffect(() => {
    if (checked && user) {
      router.replace("/dashboard");
    }
  }, [checked, user, router]);

  // Show nothing while checking auth to avoid flash
  if (!checked) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="bg-[#0B1220] text-white overflow-hidden">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B1220]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="font-bold text-xl tracking-tight">AutoPlatform</span>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition rounded-lg hover:bg-white/5"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="px-4 py-2 text-sm bg-[#1D4ED8] hover:bg-[#2563EB] text-white rounded-lg transition font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 relative">
        <div className="absolute inset-0 bg-gradient-radial from-[#1D4ED8]/20 via-transparent to-transparent" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1D4ED8]/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-gray-300 mb-6"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          One Platform. Unlimited Reach.
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="text-5xl md:text-7xl font-bold leading-tight max-w-5xl"
        >
          Control Thousands of Accounts.{" "}
          <span className="text-[#3B82F6]">Post Everywhere.</span>{" "}
          Go Viral Faster.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mt-6 text-lg text-gray-400 max-w-2xl"
        >
          Manage, schedule, and publish content across thousands of social media
          accounts — all from one powerful dashboard. No more switching logins.
          No more wasted time.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-10 flex gap-4 flex-wrap justify-center"
        >
          <button
            onClick={() => router.push("/register")}
            className="px-8 py-3.5 bg-[#1D4ED8] hover:bg-[#2563EB] text-white rounded-xl font-medium text-base transition"
          >
            Get Started Free
          </button>
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-3.5 border border-white/20 text-gray-300 hover:text-white hover:border-white/40 rounded-xl font-medium text-base transition"
          >
            Sign In
          </button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          className="mt-20 flex gap-12 flex-wrap justify-center"
        >
          {[
            ["10K+", "Accounts Managed"],
            ["1M+", "Posts Distributed"],
            ["10x", "Faster Growth"],
          ].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold text-white">{num}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── VIRAL POTENTIAL ── */}
      <section className="py-28 px-6 max-w-6xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Multiply Your Viral Potential
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Going viral isn't luck — it's probability. The more accounts you
            control, the more platforms you publish to, the higher your chances
            of explosive reach.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: "⚡",
              title: "Simultaneous Distribution",
              desc: "Distribute content across thousands of accounts at once — not one by one.",
            },
            {
              icon: "🧪",
              title: "Automatic A/B Testing",
              desc: "Test multiple content variations automatically and let data decide the winner.",
            },
            {
              icon: "🤖",
              title: "AI-Optimized Timing",
              desc: "AI picks the best time and caption for each platform to maximize engagement.",
            },
            {
              icon: "📈",
              title: "Scale Winning Posts",
              desc: "Instantly amplify posts that are already performing well across your network.",
            },
            {
              icon: "🌐",
              title: "Cross-Platform Publishing",
              desc: "TikTok, Instagram, YouTube, X, and more — publish everywhere simultaneously.",
            },
            {
              icon: "📊",
              title: "Network-Wide Analytics",
              desc: "Track performance across your entire account network in real time.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i * 0.05}
              className="bg-[#111827] border border-[#1F2937] hover:border-[#1D4ED8]/60 rounded-2xl p-6 transition group"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── AI CLIPPING ── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#1D4ED8]/5 blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#3B82F6] text-sm font-medium uppercase tracking-widest">
              AI Powered
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
              AI Clipping & Content Automation
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Turn long-form content into viral-ready clips in seconds. Upload
              once. Generate dozens of assets instantly.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                icon: "🎯",
                title: "Detects High-Impact Moments",
                desc: "AI scans your video and pinpoints the moments most likely to hook viewers.",
              },
              {
                icon: "✂️",
                title: "Creates Short-Form Clips",
                desc: "Automatically cuts and formats vertical clips for TikTok, Reels, and Shorts.",
              },
              {
                icon: "💬",
                title: "Adds Dynamic Captions",
                desc: "Styled, animated captions added automatically to boost watch time.",
              },
              {
                icon: "🔥",
                title: "Optimizes Hooks & Triggers",
                desc: "The AI learns what performs best across your network and continuously improves.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.08}
                className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 flex gap-4"
              >
                <div className="text-2xl mt-0.5">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LINK & CONTROL ── */}
      <section className="py-28 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <span className="text-[#3B82F6] text-sm font-medium uppercase tracking-widest">
              Full Control
            </span>
            <h2 className="text-4xl font-bold mt-2 mb-4">
              Link & Control Everything
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Connect social accounts, niche pages, brand networks, client
              portfolios, and influencer accounts. Assign permissions, organize
              into groups, and control publishing rules — all from one secure
              dashboard.
            </p>
            <ul className="space-y-3">
              {[
                "Social media accounts",
                "Niche & brand pages",
                "Client portfolios",
                "Influencer accounts",
                "Group-based permissions",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-300">
                  <span className="w-5 h-5 rounded-full bg-[#1D4ED8]/20 border border-[#1D4ED8]/40 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-[#3B82F6]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { label: "Accounts", value: "10,000+" },
              { label: "Platforms", value: "15+" },
              { label: "Posts/day", value: "Unlimited" },
              { label: "Uptime", value: "99.9%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 text-center"
              >
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── DATA DRIVEN ── */}
      <section className="py-28 px-6 bg-[#0D1526]">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <span className="text-[#3B82F6] text-sm font-medium uppercase tracking-widest">
              Analytics
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
              Data-Driven Growth Engine
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-16">
              Every post becomes data. Track, analyze, and automatically scale
              what works. You're not guessing anymore — you're optimizing.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: "👁️", label: "Engagement Rates" },
              { icon: "⏱️", label: "Watch Time" },
              { icon: "🔁", label: "Shares & Reposts" },
              { icon: "💰", label: "Conversion Metrics" },
              { icon: "📱", label: "Account-Level Performance" },
              { icon: "🌍", label: "Network-Wide Trends" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.05}
                className="bg-[#111827] border border-[#1F2937] hover:border-[#1D4ED8]/50 rounded-2xl p-5 flex items-center gap-4 transition"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-gray-300 font-medium">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY IT WORKS ── */}
      <section className="py-28 px-6 max-w-4xl mx-auto text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Why It Works</h2>
          <p className="text-gray-400 text-lg mb-12">
            Virality is a numbers game powered by strategy. When you combine
            massive distribution, AI-powered optimization, real-time feedback,
            and automated scaling — you dramatically increase your statistical
            chance of hitting breakout growth.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { stat: "More Posts", sub: "More surface area" },
            { stat: "More Data", sub: "Smarter decisions" },
            { stat: "More Reach", sub: "Bigger audience" },
            { stat: "More Viral", sub: "Higher probability" },
          ].map((item, i) => (
            <motion.div
              key={item.stat}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i * 0.1}
              className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5"
            >
              <div className="text-[#3B82F6] font-bold text-lg">{item.stat}</div>
              <div className="text-gray-500 text-sm mt-1">{item.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D4ED8]/20 to-transparent blur-2xl pointer-events-none" />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto text-center"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to Scale?
          </h2>
          <p className="text-gray-400 text-lg mb-4">
            Stop managing accounts one by one.
            <br />
            Start building a distribution machine.
          </p>
          <p className="text-gray-500 mb-10 text-sm">
            Link your accounts. Power your content. Increase your viral probability.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => router.push("/register")}
              className="px-10 py-4 bg-[#1D4ED8] hover:bg-[#2563EB] text-white rounded-xl font-semibold text-lg transition"
            >
              Get Started Today
            </button>
            <button
              onClick={() => router.push("/login")}
              className="px-10 py-4 border border-white/20 hover:border-white/40 text-gray-300 hover:text-white rounded-xl font-semibold text-lg transition"
            >
              Sign In
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 text-center text-gray-600 border-t border-[#1F2937] text-sm">
        © {new Date().getFullYear()} AutoPlatform. All rights reserved.
      </footer>
    </main>
  );
}
