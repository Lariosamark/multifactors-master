'use client';

import Link from 'next/link';
import Image from 'next/image'; // <-- Import Next.js Image component

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#2D5128] via-[#1a3015] to-[#2D5128] text-white flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 mt-4">
        <div className="text-2xl font-bold tracking-wide bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Multifactors Sales
        </div>
        <div className="space-x-6">
          <Link
            href="/login"
            className="px-6 py-3 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col-reverse md:flex-row items-center max-w-7xl mx-auto flex-grow px-8 py-20 gap-16">
        <div className="max-w-lg space-y-8">
          <h1 className="text-6xl font-black mb-6 leading-tight">
            MULTIFACTORS{' '}
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-pulse">
              SALES
            </span>
          </h1>
          <p className="mb-8 text-xl opacity-90 leading-relaxed">
            Manage all your sales quotations in one place — create, revise, approve, and track with ease and security.
          </p>
          <div className="flex gap-6">
            <Link
              href="/login"
              className="group px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold rounded-2xl shadow-2xl hover:shadow-yellow-400/25 hover:scale-110 transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>

        <div className="max-w-md relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-2xl animate-pulse"></div>
          <div className="relative backdrop-blur-sm bg-white/10 border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-500 hover:scale-105">
            <Image
              src="/logo.png" // Use absolute path starting with '/'
              alt="Quotation management illustration"
              className="w-full relative z-10"
              width={500} // specify width
              height={500} // specify height
              priority // optional: preload for LCP
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-sm bg-white/5 border-t border-white/10 text-white/70 py-01 text-center">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-small">
            &copy; {new Date().getFullYear()} Multifactors Sales. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-5">
            <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse delay-500"></div>
            <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse delay-1000"></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
