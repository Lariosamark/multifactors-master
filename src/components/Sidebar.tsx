"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ReactNode, useState } from "react";

function NavItem({
  href,
  children,
  icon,
}: {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`group flex items-center space-x-3 rounded-xl px-4 py-3 transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-green-400/20 to-emerald-400/20 border border-green-400/30 text-green-200 shadow-lg backdrop-blur-sm"
          : "text-white/70 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:scale-105"
      }`}
    >
      {icon && (
        <div
          className={`transition-colors duration-300 ${
            active
              ? "text-green-300"
              : "text-white/50 group-hover:text-white/80"
          }`}
        >
          {icon}
        </div>
      )}
      <span className="font-medium">{children}</span>
    </Link>
  );
}

export default function Sidebar() {
  const { profile, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Logout handler with redirect
  const handleLogout = async () => {
    await logout();
    router.push("/"); // Redirect to landing page
  };

  // Hide sidebar completely on landing & login pages
  if (pathname === "/" || pathname.startsWith("/login")) return null;

  const isAdmin = profile?.role === "admin";
  const isEmployee = profile?.role === "employee";

  return (
    <>
      {/* Mobile toggle button */}
      <div className="lg:hidden p-4 fixed top-0 left-0 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 bg-white rounded-md shadow hover:bg-gray-100 focus:outline-none"
        >
          {/* Hamburger icon */}
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-[#2D5128] via-[#1a3015] to-[#2D5128] border-r border-white/10 backdrop-blur-xl overflow-y-auto transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="relative p-6 flex flex-col h-full">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-7 h-7 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                </svg>
              </div>
              <div>
                <div className="text-xl font-black text-white bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Multifactor Sales
                </div>
                <div className="text-xs text-green-300/80">
                  Quotation Management System
                </div>
              </div>
            </div>

            {/* User profile */}
            {profile && (
              <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {profile.displayName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">
                      {profile.displayName}
                    </div>
                    <div className="text-green-300 text-xs font-medium capitalize">
                      {profile.role}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-6 flex-1">
            {isAdmin && (
              <div>
                <div className="mb-4 px-4">
                  <h3 className="text-xs uppercase text-green-300/60 font-bold tracking-wider">
                    Admin Panel
                  </h3>
                  <div className="mt-2 h-px bg-gradient-to-r from-green-400/30 to-transparent"></div>
                </div>
                <div className="space-y-2">
                  <NavItem href="/admin/dashboard">Dashboard</NavItem>
                  <NavItem href="/admin/approvals">Approvals</NavItem>
                  <NavItem href="/component/project">Project Page</NavItem>
                  <NavItem href="/component/save-projects">Save Project</NavItem>
                  <NavItem href="/component/QuotationForm">Quotation Page</NavItem>
                  <NavItem href="/component/quotation-list">Quotation List Page</NavItem>
                  <NavItem href="/component/SupplierCustomer">Supplier And Customer List</NavItem>
                </div>
              </div>
            )}

            {isEmployee && (
              <div>
                <div className="mb-4 px-4">
                  <h3 className="text-xs uppercase text-green-300/60 font-bold tracking-wider">
                    Employee Portal
                  </h3>
                  <div className="mt-2 h-px bg-gradient-to-r from-green-400/30 to-transparent"></div>
                </div>
                <div className="space-y-2">
                  <NavItem href="/employee/dashboard">Dashboard</NavItem>
                  <NavItem href="/component/project">Project Page</NavItem>
                  <NavItem href="/component/save-projects">Save Project</NavItem>
                  <NavItem href="/component/QuotationForm">Quotation Page</NavItem>
                  <NavItem href="/component/quotation-list">Quotation List Page</NavItem>
                  <NavItem href="/employee/profile">Profile</NavItem>
                </div>
              </div>
            )}
          </nav>

          {/* Logout */}
          <div className="pt-6 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="group w-full flex items-center space-x-3 backdrop-blur-sm bg-red-500/20 border border-red-400/30 text-red-200 rounded-xl px-4 py-3 hover:bg-red-500/30 hover:border-red-400/50 hover:text-red-100 transition-all duration-300 hover:scale-105"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
