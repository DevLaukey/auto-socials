export default function Home() {
  return (
    <main className="bg-black text-white">
      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-5xl">
          Control Thousands of Accounts. <br />
          Post Everywhere. Go Viral Faster.
        </h1>

        <p className="mt-6 text-xl text-gray-300 max-w-2xl">
          One Platform. Unlimited Reach.
        </p>

        <p className="mt-4 text-gray-400 max-w-3xl">
          Manage, schedule, and publish content across thousands of social media
          accounts — all from one powerful dashboard.
        </p>

        <div className="mt-8 flex gap-4">
          <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
            Get Started
          </button>
          <button className="border border-gray-600 px-6 py-3 rounded-xl hover:bg-gray-900 transition">
            Learn More
          </button>
        </div>
      </section>

      {/* VIRAL SECTION */}
      <section className="py-24 px-6 text-center max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">
          Multiply Your Viral Potential
        </h2>
        <p className="text-gray-400 mb-10">
          Going viral isn’t luck — it’s probability.
        </p>

        <div className="grid md:grid-cols-2 gap-6 text-left">
          {[
            "Distribute content across thousands of accounts",
            "Test multiple variations automatically",
            "AI-optimized timing and captions",
            "Scale winning posts instantly",
            "Analyze performance across your network",
          ].map((item, i) => (
            <div key={i} className="bg-gray-900 p-6 rounded-xl">
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* AI CLIPPING */}
      <section className="py-24 px-6 bg-gray-950 text-center">
        <h2 className="text-4xl font-bold mb-6">
          AI Clipping & Content Automation
        </h2>

        <p className="text-gray-400 max-w-3xl mx-auto mb-10">
          Turn long-form content into viral-ready clips in seconds.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto text-left">
          {[
            "Detects high-impact moments",
            "Creates short-form vertical clips",
            "Adds dynamic captions",
            "Optimizes hooks and engagement",
            "Formats for TikTok, Reels, Shorts",
          ].map((item, i) => (
            <div
              key={i}
              className="bg-black p-6 rounded-xl border border-gray-800"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* CONTROL SECTION */}
      <section className="py-24 px-6 text-center max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">Link & Control Everything</h2>

        <div className="grid md:grid-cols-2 gap-6 text-left">
          {[
            "Social media accounts",
            "Niche pages",
            "Brand networks",
            "Client portfolios",
            "Influencer accounts",
          ].map((item, i) => (
            <div key={i} className="bg-gray-900 p-6 rounded-xl">
              {item}
            </div>
          ))}
        </div>

        <p className="text-gray-400 mt-10">
          Assign permissions, organize groups, and control publishing — all from
          one dashboard.
        </p>
      </section>

      {/* DATA SECTION */}
      <section className="py-24 px-6 bg-gray-950 text-center">
        <h2 className="text-4xl font-bold mb-6">
          📊 Data-Driven Growth Engine
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            "Engagement rates",
            "Watch time",
            "Shares",
            "Conversions",
            "Account performance",
            "Network trends",
          ].map((item, i) => (
            <div
              key={i}
              className="bg-black p-6 rounded-xl border border-gray-800"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* SCALE */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">Built for Scale</h2>

        <div className="grid md:grid-cols-2 gap-6 text-left">
          {[
            "High-volume posting",
            "Lightning-fast scheduling",
            "Secure account management",
            "Enterprise-grade reliability",
          ].map((item, i) => (
            <div key={i} className="bg-gray-900 p-6 rounded-xl">
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* WHY IT WORKS */}
      <section className="py-24 px-6 bg-gray-950 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">Why It Works</h2>

        <p className="text-gray-400">
          Virality is a numbers game powered by strategy.
        </p>

        <p className="mt-6 text-gray-300">
          More posts. More data. More opportunities. More viral moments.
        </p>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center">
        <h2 className="text-5xl font-bold mb-6">Ready to Scale?</h2>

        <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
          Stop managing accounts one by one. Start building a distribution
          machine.
        </p>

        <button className="bg-white text-black px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-200 transition">
          Get Started Today
        </button>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-500 text-sm border-t border-gray-800">
        © {new Date().getFullYear()} Your Platform. All rights reserved.
      </footer>
    </main>
  );
}
