import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="w-full px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white">
        <Link href="/" className="font-bold text-lg text-gray-900 hover:text-gray-700 transition">
          AutoPlatform
        </Link>
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-900 transition flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-gray-400 border-t border-slate-200">
        © {new Date().getFullYear()} AutoPlatform. All rights reserved.
      </footer>
    </div>
  );
}
