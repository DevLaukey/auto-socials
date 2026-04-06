"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (name: string) => {
    console.error(`Failed to load image: ${name}`);
    setImageErrors((prev) => ({ ...prev, [name]: true }));
  };

  return (
    <main className="bg-white text-gray-900">
      {/* NAVBAR - NOW SCROLLS WITH PAGE (NOT FIXED) */}
      <nav className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            {!imageErrors["Logo"] ? (
              <Image
                src="/images/Logo.jpeg"
                alt="ClipperKiller Logo"
                width={380}
                height={310}
                className="object-contain"
                onError={() => handleImageError("Logo")}
                priority
                unoptimized
              />
            ) : (
              <span className="text-gray-900 font-bold text-lg">CK</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 text-sm px-4"
              onClick={() => router.push("/login")}
            >
              Sign In
            </Button>
            <Button
              className="bg-[#1D4ED8] hover:bg-[#2563EB] text-white text-sm px-5 py-2"
              onClick={() => router.push("/register")}
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </nav>

      {/* NO SPACER NEEDED SINCE NAVBAR IS NOT FIXED */}

      {/* HERO */}
      <section className="flex flex-col justify-center items-center text-center px-6 relative py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-sm text-blue-700 mb-6"
        >
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          One Platform. Unlimited Reach.
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold leading-tight max-w-5xl"
        >
          Control Thousands of Accounts. <br />
          Post Everywhere.{" "}
          <span className="text-[#1D4ED8]">Go Viral Faster.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-lg text-gray-600 max-w-2xl"
        >
          Manage, schedule, and publish content across thousands of social media
          accounts — all from one powerful dashboard. No more switching logins.
          No more wasted time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 flex gap-4"
        >
          <Button
            className="bg-[#1D4ED8] hover:bg-[#2563EB] text-white px-8 py-5 text-base shadow-lg shadow-blue-200"
            onClick={() => router.push("/register")}
          >
            Get Started Free
          </Button>
          <Button
            variant="outline"
            className="px-8 py-5 text-base border-gray-300 text-gray-700 hover:border-gray-400"
            onClick={() => router.push("/login")}
          >
            Sign In
          </Button>
        </motion.div>

        {/* STATS BADGES */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 flex flex-wrap justify-center gap-10"
        >
          {[
            ["10K+", "Accounts Managed"],
            ["1M+", "Posts Distributed"],
            ["10x", "Faster Growth"],
          ].map(([num, label], i) => (
            <div key={i} className="text-center">
              <h3 className="text-3xl font-bold text-gray-900">{num}</h3>
              <p className="text-gray-500 text-sm">{label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* VIRALITY SECTION */}
      <section className="py-20 px-6 relative bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Multiply Your Viral Potential
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              Going viral isn't luck — it's probability. The more accounts you
              control, the more platforms you publish to, the higher your
              chances of explosive reach.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Simultaneous Distribution",
                desc: "Distribute content across thousands of accounts at once — not one by one.",
              },
              {
                title: "Automatic A/B Testing",
                desc: "Test multiple content variations automatically and let data decide the winner.",
              },
              {
                title: "AI-Optimized Timing",
                desc: "AI picks the best time and caption for each platform to maximize engagement.",
              },
              {
                title: "Scale Winning Posts",
                desc: "Instantly amplify posts that are already performing well across your network.",
              },
              {
                title: "Cross-Platform Publishing",
                desc: "TikTok, Instagram, YouTube, X, and more — publish everywhere simultaneously.",
              },
              {
                title: "Network-Wide Analytics",
                desc: "Track performance across your entire account network in real time.",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="bg-white border border-gray-200 hover:border-[#1D4ED8] hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-[#1D4ED8]/20 transition">
                    <span className="text-[#1D4ED8] font-bold text-xl">✓</span>
                  </div>
                  <h3 className="text-gray-900 font-semibold text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI CLIPPING SECTION */}
      <section className="py-20 px-6 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-sm text-blue-700 mb-6">
              AI Powered
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              AI Clipping & Content Automation
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto lg:mx-0 mb-8 text-lg">
              Turn long-form content into viral-ready clips in seconds. Upload
              once. Generate dozens of assets instantly.
            </p>
            <div className="space-y-4">
              {[
                "Detects High-Impact Moments — AI scans your video and pinpoints the moments most likely to hook viewers",
                "Adds Dynamic Captions — Styled, animated captions added automatically to boost watch time",
                "Creates Short-Form Clips — Automatically cuts and formats vertical clips for TikTok, Reels, and Shorts",
                "Optimizes Hooks & Triggers — The AI learns what performs best across your network and continuously improves",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200"
                >
                  <span className="text-[#1D4ED8] font-bold text-xl">✓</span>
                  <span className="text-gray-600 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-gray-100">
              <Image
                src="/images/Clipping.jpeg"
                alt="AI Clipping Automation"
                width={900}
                height={700}
                className="w-full h-auto object-contain"
                onError={() => handleImageError("Clipping")}
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* LINK & CONTROL SECTION */}
      <section className="py-20 px-6 relative bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-12 items-center">
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-gray-100">
              <Image
                src="/images/Posts.jpeg"
                alt="Multi-platform posting"
                width={900}
                height={700}
                className="w-full h-auto object-contain"
                onError={() => handleImageError("Posts")}
                unoptimized
              />
            </div>
          </div>
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-sm text-blue-700 mb-6">
              Full Control
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Link & Control Everything
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto lg:mx-0 text-lg mb-8">
              Connect social accounts, niche pages, brand networks, client
              portfolios, and influencer accounts. Assign permissions, organize
              into groups, and control publishing rules — all from one secure
              dashboard.
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {[
                "Social Media Accounts",
                "Niche & Brand Pages",
                "Client Portfolios",
                "Influencer Accounts",
                "Group-based Permissions",
              ].map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-white rounded-full text-sm text-gray-700 border border-gray-200 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SCALE SECTION */}
      <section className="py-20 px-6 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Ready to Scale?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto lg:mx-0 mb-8 text-lg">
              Link accounts. Ship more. Learn faster. Streamline your operations
              and automate tasks by integrating all your accounts in one place.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto lg:mx-0">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 text-base">
                  Optimize Delivery
                </h4>
                <p className="text-sm text-gray-500">
                  Increase speed and efficiency
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 text-base">
                  Real-time Insights
                </h4>
                <p className="text-sm text-gray-500">
                  Make data-driven decisions
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-gray-100">
              <Image
                src="/images/Scale.jpeg"
                alt="Scale operations"
                width={900}
                height={700}
                className="w-full h-auto object-contain"
                onError={() => handleImageError("Scale")}
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* VIRALITY PROBABILITY SECTION */}
      <section className="py-20 px-6 relative bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-12 items-center">
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-gray-100">
              <Image
                src="/images/Virality.jpeg"
                alt="Virality probability"
                width={900}
                height={700}
                className="w-full h-auto object-contain"
                onError={() => handleImageError("Virality")}
                unoptimized
              />
            </div>
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Virality Is Probability
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto lg:mx-0 text-lg mb-6">
              More accounts = more chances. Auto-test multiple variations with
              AI timing + captions, then scale winning posts fast.
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="bg-white px-4 py-2 rounded-full text-sm text-gray-700 border border-gray-200 shadow-sm">
                🧪 A/B Testing
              </div>
              <div className="bg-white px-4 py-2 rounded-full text-sm text-gray-700 border border-gray-200 shadow-sm">
                🤖 AI Captions
              </div>
              <div className="bg-white px-4 py-2 rounded-full text-sm text-gray-700 border border-gray-200 shadow-sm">
                ⚡ Scale Fast
              </div>
              <div className="bg-white px-4 py-2 rounded-full text-sm text-gray-700 border border-gray-200 shadow-sm">
                📊 Real-time Analytics
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-6 relative bg-gradient-to-br from-blue-50 via-white to-white">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Ready to Scale?
          </h2>
          <p className="text-gray-600 mb-6 text-lg max-w-2xl mx-auto">
            Start managing accounts across multiple platforms. Turn long-form
            content into viral-ready clips in seconds. Upload once. Generate
            dozens of assets instantly.
          </p>
          <p className="text-gray-400 mb-10 text-sm">
            Join thousands of creators and brands already scaling with
            ClipperKiller
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              className="bg-[#1D4ED8] hover:bg-[#2563EB] text-white px-10 py-5 text-base shadow-lg shadow-blue-200"
              onClick={() => router.push("/register")}
            >
              Get Started Today
            </Button>
            <Button
              variant="outline"
              className="px-10 py-5 text-base border-gray-300 text-gray-700 hover:border-gray-400"
              onClick={() => router.push("/login")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-500 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                <Image
                  src="/images/Logo.jpeg"
                  alt="ClipperKiller Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-gray-800 text-sm">
                CLIPPER KILLER
              </span>
            </div>
            <div className="flex gap-6 text-xs">
              <a href="#" className="hover:text-gray-700 transition">
                Terms
              </a>
              <a href="#" className="hover:text-gray-700 transition">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-700 transition">
                Contact
              </a>
            </div>
            <p className="text-xs">
              © {new Date().getFullYear()} ClipperKiller. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
