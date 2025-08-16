"use client";

import { useAuth } from "@/context/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { loginWithGoogle, loading, profile } = useAuth();
  const params = useSearchParams();
  const pending = params.get("status") === "pending";
  const router = useRouter();

  // ✅ Redirect when logged in & approved
  useEffect(() => {
    if (profile) {
      if (profile.role === "admin") {
        router.push("/admin/dashboard");
      } else if (profile.role === "employee" && profile.approved) {
        router.push("/employee/dashboard");
      } else if (profile.role === "employee" && !profile.approved) {
        router.push("/login?status=pending");
      }
    }
  }, [profile, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2D5128] via-[#1a3015] to-[#2D5128] flex items-center justify-center p-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-lime-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Login Container */}
        <div className="relative z-10 max-w-md w-full">
            {/* Glass Card */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-500">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-0.257-0.257A6 6 0 1118 8zM2 8a8 8 0 1016 0A8 8 0 002 8zm8-3a3 3 0 100 6 3 3 0 000-6z" clipRule="evenodd"></path>
                </svg>
                </div>
               <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
  Welcome Back
</h1> 
                <p className="text-white/80 text-lg">
                Sign in with your Google account to continue
                </p>
            </div>

            {/* Status Messages */}
            {pending && (
                <div className="mb-6 backdrop-blur-sm bg-yellow-400/20 border border-yellow-400/30 rounded-2xl p-4 text-center animate-pulse">
                <div className="flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-yellow-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-yellow-200 font-semibold">Pending Approval</span>
                </div>
                <p className="text-yellow-100 text-sm">
                    Your account is awaiting admin approval. Please try again later.
                </p>
                </div>
            )}

            {profile && !pending && (
                <div className="mb-6 backdrop-blur-sm bg-green-400/20 border border-green-400/30 rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-green-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-green-200 font-semibold">Signed In Successfully</span>
                </div>
                <p className="text-green-100 text-sm">
                    You are signed in. Use the sidebar to navigate the application.
                </p>
                </div>
            )}

            {/* Google Login Button */}
            <button
                onClick={loginWithGoogle}
                disabled={loading}
                className="group w-full relative overflow-hidden backdrop-blur-sm bg-white/90 hover:bg-white text-gray-800 font-bold py-4 px-6 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                <div className="flex items-center justify-center space-x-3">
                {loading ? (
                    <>
                    <div className="w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                    </>
                ) : (
                    <>
                    {/* Google Logo */}
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                    </>
                )}
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </button>

            {/* Footer */}
            <div className="mt-8 text-center">
                <div className="flex justify-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse delay-500"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full animate-pulse delay-1000"></div>
                </div>
                <p className="text-white/60 text-sm">
                Secure authentication powered by Google
                </p>
            </div>
            </div>

            {/* Brand Name */}
            <div className="text-center mt-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Multifactors Sales QMS
            </h2>
            </div>
        </div>
        </div>
    );
    }