"use client";

import "./globals.css";
import { ReactNode, useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-50">
        <AuthProvider>
          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden absolute top-4 left-4 z-50">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 bg-white rounded-md shadow hover:bg-gray-100 focus:outline-none"
            >
              {/* Inline Menu Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Sidebar */}
          <div
            className={`fixed lg:static z-40 h-full bg-white transition-transform transform ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 lg:flex-shrink-0`}
          >
            <Sidebar />
          </div>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 lg:hidden z-30"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 p-4 lg:ml-0">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
