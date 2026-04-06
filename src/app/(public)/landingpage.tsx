"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [imagesLoaded, setImagesLoaded] = useState({
    Logo: false,
    Clipping: false,
    Posts: false,
    Scale: false,
    Virality: false,
  });

  const handleImageLoad = (name: string) => {
    setImagesLoaded((prev) => ({ ...prev, [name]: true }));
  };

  const handleImageError = (name: string) => {
    console.error(`Failed to load image: ${name}`);
    setImagesLoaded((prev) => ({ ...prev, [name]: false }));
  };

  return (
    <main className="bg-[#0B1220] text-white overflow-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B1220]/80 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-[#1D4ED8] to-purple-600 flex items-center justify-center">
              <Image
                src="/images/Logo.jpeg"
                alt="ClipperKiller Logo"
                width={48}
                height={48}
                className="object-contain p-1"
                onLoad={() => handleImageLoad("Logo")}
                onError={() => handleImageError("Logo")}
                priority
              />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white leading-tight">
                CLIPPER KILLER
              </h1>
              <p className="text-[10px] text-gray-400 -mt-1">
                SOCIAL MEDIA MANAGING SOFTWARE
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Sign In
            </Button>
            <Button className="bg-[#1D4ED8] hover:bg-[#2563EB] text-white">
              Get Started Free
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1D4ED8]/20 to-transparent blur-3xl" />

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold leading-tight max-w-5xl"
        >
          Control Thousands of Accounts. <br />
          Post Everywhere. Go Viral Faster.
        </motion.h1>

        <p className="mt-6 text-xl text-gray-300 max-w-3xl">
          Manage, schedule, and publish content across thousands of social media
          accounts — all from one powerful dashboard. No more switching logins.
          No more wasted time.
        </p>

        <div className="mt-8 flex gap-4">
          <Button className="bg-[#1D4ED8] hover:bg-[#2563EB] text-white px-8 py-6 text-lg">
            Get Started Free
          </Button>
          <Button
            variant="outline"
            className="px-8 py-6 text-lg border-gray-600 text-gray-300"
          >
            Sign In
          </Button>
        </div>

        {/* STATS BADGES */}
        <div className="mt-16 flex flex-wrap justify-center gap-8">
          {[
            ["10K+", "Accounts Managed"],
            ["1M+", "Posts Distributed"],
            ["10x", "Faster Growth"],
          ].map(([num, label], i) => (
            <div key={i} className="text-center">
              <h3 className="text-3xl font-bold text-white">{num}</h3>
              <p className="text-gray-400 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VIRALITY SECTION */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Multiply Your Viral Potential
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
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
                className="bg-[#111827] border border-[#1F2937] hover:border-[#1D4ED8] transition group cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-full bg-[#1D4ED8]/20 flex items-center justify-center mb-4 group-hover:bg-[#1D4ED8]/40 transition">
                    <span className="text-[#1D4ED8] font-bold text-xl">✓</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI CLIPPING SECTION */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#1D4ED8]/5 blur-3xl" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              AI Clipping & Content Automation
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto lg:mx-0 mb-8 text-lg">
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
                  className="flex items-start gap-3 bg-[#111827]/50 p-4 rounded-xl border border-[#1F2937]"
                >
                  <span className="text-[#1D4ED8] font-bold text-xl">✓</span>
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl shadow-[#1D4ED8]/20 border border-[#1F2937] bg-gradient-to-br from-gray-900 to-gray-800 min-h-[400px] flex items-center justify-center">
              <Image
                src="/images/Clipping.jpeg"
                alt="AI Clipping Automation"
                width={600}
                height={600}
                className="w-full h-auto object-cover"
                onError={() => handleImageError("Clipping")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* LINK & CONTROL SECTION */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-12 items-center">
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl shadow-[#1D4ED8]/20 border border-[#1F2937] bg-gradient-to-br from-gray-900 to-gray-800 min-h-[400px] flex items-center justify-center">
              <Image
                src="/images/Posts.jpeg"
                alt="Multi-platform posting"
                width={600}
                height={600}
                className="w-full h-auto object-cover"
                onError={() => handleImageError("Posts")}
              />
            </div>
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Link & Control Everything
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto lg:mx-0 text-lg mb-8">
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
                  className="px-3 py-1 bg-[#111827] rounded-full text-sm text-gray-300 border border-[#1F2937]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SCALE SECTION */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#1D4ED8]/5 blur-3xl" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Scale?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto lg:mx-0 mb-8 text-lg">
              Link accounts. Ship more. Learn faster. Streamline your operations
              and automate tasks by integrating all your accounts in one place.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto lg:mx-0">
              <div className="bg-[#111827] p-4 rounded-xl border border-[#1F2937]">
                <h4 className="font-semibold text-white">Optimize Delivery</h4>
                <p className="text-sm text-gray-400">
                  Increase speed and efficiency
                </p>
              </div>
              <div className="bg-[#111827] p-4 rounded-xl border border-[#1F2937]">
                <h4 className="font-semibold text-white">Real-time Insights</h4>
                <p className="text-sm text-gray-400">
                  Make data-driven decisions
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl shadow-[#1D4ED8]/20 border border-[#1F2937] bg-gradient-to-br from-gray-900 to-gray-800 min-h-[400px] flex items-center justify-center">
              <Image
                src="/images/Scale.jpeg"
                alt="Scale operations"
                width={600}
                height={600}
                className="w-full h-auto object-cover"
                onError={() => handleImageError("Scale")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* VIRALITY PROBABILITY SECTION */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-12 items-center">
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl shadow-[#1D4ED8]/20 border border-[#1F2937] bg-gradient-to-br from-gray-900 to-gray-800 min-h-[400px] flex items-center justify-center">
              <Image
                src="/images/Virality.jpeg"
                alt="Virality probability"
                width={600}
                height={600}
                className="w-full h-auto object-cover"
                onError={() => handleImageError("Virality")}
              />
            </div>
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Virality Is Probability
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto lg:mx-0 text-lg mb-6">
              More accounts = more chances. Auto-test multiple variations with
              AI timing + captions, then scale winning posts fast.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="bg-[#111827] px-4 py-2 rounded-full text-sm text-gray-300 border border-[#1F2937]">
                🧪 A/B Testing
              </div>
              <div className="bg-[#111827] px-4 py-2 rounded-full text-sm text-gray-300 border border-[#1F2937]">
                🤖 AI Captions
              </div>
              <div className="bg-[#111827] px-4 py-2 rounded-full text-sm text-gray-300 border border-[#1F2937]">
                ⚡ Scale Fast
              </div>
              <div className="bg-[#111827] px-4 py-2 rounded-full text-sm text-gray-300 border border-[#1F2937]">
                📊 Real-time Analytics
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 text-center px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D4ED8]/10 to-transparent" />
        <div className="relative z-10">
          <h2 className="text-5xl font-bold mb-6">Ready to Scale?</h2>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
            Start managing accounts across multiple platforms. Turn long-form
            content into viral-ready clips in seconds. Upload once. Generate
            dozens of assets instantly.
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-[#1D4ED8] hover:bg-[#2563EB] text-white px-10 py-6 text-lg">
              Get Started Today
            </Button>
            <Button
              variant="outline"
              className="px-10 py-6 text-lg border-gray-600 text-gray-300"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-500 border-t border-[#1F2937]">
        © {new Date().getFullYear()} ClipperKiller. All rights reserved.
      </footer>
    </main>
  );
}
