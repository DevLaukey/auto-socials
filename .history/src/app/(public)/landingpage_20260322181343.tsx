"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="bg-[#0B1220] text-white overflow-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B1220]/80 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-bold text-xl text-white">AutoPlatform</h1>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Login
            </Button>
            <Button className="bg-[#1D4ED8] hover:bg-[#2563EB] text-white">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative">
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

        <p className="mt-6 text-xl text-gray-300">
          One Platform. Unlimited Reach.
        </p>

        <p className="mt-4 text-gray-400 max-w-2xl">
          Manage, schedule, and publish content across massive account networks
          — all from one powerful dashboard.
        </p>

        <div className="mt-8 flex gap-4">
          <Button className="bg-[#1D4ED8] hover:bg-[#2563EB] text-white px-6 py-6 text-lg">
            Get Started
          </Button>
          <Button
            variant="outline"
            className="px-6 py-6 text-lg border-gray-600 text-gray-300"
          >
            View Demo
          </Button>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
        {[
          "Distribute to thousands of accounts",
          "AI optimized posting",
          "Scale viral content instantly",
          "Automated A/B testing",
          "Cross-platform publishing",
          "Real-time analytics",
        ].map((item, i) => (
          <Card
            key={i}
            className="bg-[#111827] border border-[#1F2937] hover:border-[#1D4ED8] transition"
          >
            <CardContent className="p-6 text-gray-300">{item}</CardContent>
          </Card>
        ))}
      </section>

      {/* AI SECTION */}
      <section className="py-32 px-6 text-center relative">
        <div className="absolute inset-0 bg-[#1D4ED8]/10 blur-3xl" />

        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          AI Clipping & Automation
        </h2>

        <p className="text-gray-400 max-w-2xl mx-auto mb-12">
          Turn long-form content into dozens of viral-ready clips instantly.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {[
            "Detects viral moments",
            "Creates short-form clips",
            "Adds captions automatically",
            "Optimizes hooks",
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#111827] p-6 rounded-2xl border border-[#1F2937] text-gray-300"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-24 px-6 grid md:grid-cols-3 text-center gap-6 max-w-6xl mx-auto">
        {[
          ["10K+", "Accounts Managed"],
          ["1M+", "Posts Distributed"],
          ["10x", "Faster Growth"],
        ].map(([num, label], i) => (
          <div key={i}>
            <h3 className="text-4xl font-bold text-white">{num}</h3>
            <p className="text-gray-400">{label}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="py-32 text-center px-6">
        <h2 className="text-5xl font-bold mb-6">Ready to Scale?</h2>
        <p className="text-gray-400 mb-10">
          Build your content distribution machine today.
        </p>
        <Button className="bg-[#1D4ED8] hover:bg-[#2563EB] text-white px-10 py-6 text-lg">
          Get Started Now
        </Button>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-500 border-t border-[#1F2937]">
        © {new Date().getFullYear()} AutoPlatform. All rights reserved.
      </footer>
    </main>
  );
}
