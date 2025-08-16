"use client";

import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { profile } = useAuth();

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-gray-100 rounded-2xl p-8 border border-gray-200 shadow-lg">
          <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 text-center">Loading your profile...</p>
        </div>
      </div>
    );
  }

 const getRoleColor = (role: string | undefined) => {
  const colors: Record<string, string> = {
    admin: 'from-red-500 to-pink-600',
    manager: 'from-orange-500 to-yellow-600',
    user: 'from-blue-500 to-cyan-600',
    moderator: 'from-green-500 to-emerald-600'
  };
  return colors[role?.toLowerCase() || ""] || 'from-gray-500 to-gray-600';
};

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-100 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-100 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="relative group">
                <div className={`w-28 h-28 rounded-full bg-gradient-to-r ${getRoleColor(profile.role)} flex items-center justify-center text-white font-bold text-3xl shadow-xl ring-4 ring-white/20 transform transition-all duration-500 hover:scale-110 hover:rotate-6`}>
                  {profile.displayName?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Profile Info */}
              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
                  {profile.displayName}
                </h1>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-white/30 mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-800 font-medium capitalize">
                    {profile.role}
                  </span>
                </div>
                <p className="text-white flex items-center justify-center md:justify-start gap-2">
                  <span className="text-lg">📧</span>
                  {profile.email}
                </p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Profile Details */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Details</h2>
                
                {[
                  { 
                    label: 'Full Name', 
                    value: profile.displayName, 
                    icon: '👤',
                    gradient: 'from-blue-400 to-blue-600'
                  },
                  { 
                    label: 'Email Address', 
                    value: profile.email, 
                    icon: '📧',
                    gradient: 'from-green-400 to-green-600'
                  },
                  { 
                    label: 'Role', 
                    value: profile.role?.charAt(0).toUpperCase() + profile.role?.slice(1), 
                    icon: '🛡️',
                    gradient: 'from-purple-400 to-purple-600'
                  }
                ].map((item, index) => (
                  <div key={index} className="group relative">
                    <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 hover:border-gray-200 transition-all duration-300 hover:transform hover:scale-105">
                      <div className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                          {item.label}
                        </p>
                        <p className="text-gray-800 font-semibold text-lg">
                          {item.value}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </div>
                ))}
              </div>

              {/* Status Card */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Status</h2>
                
                {/* Status Badge */}
                <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg">
                      ✅
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Account Verified</h3>
                    <p className="text-green-700 text-sm">Your profile is complete and verified</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center hover:bg-gray-100 transition-all duration-300">
                    <div className="text-2xl font-bold text-gray-800">100%</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Complete</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center hover:bg-gray-100 transition-all duration-300">
                    <div className="text-2xl font-bold text-gray-800">Active</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Status</div>
                  </div>
                </div>

                {/* Security Info */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-lg">🔐</span>
                    <h3 className="text-lg font-semibold text-gray-800">Security</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Two-factor auth</span>
                      <span className="text-green-600 font-medium">✓ Enabled</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Email verified</span>
                      <span className="text-green-600 font-medium">✓ Verified</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Strong password</span>
                      <span className="text-green-600 font-medium">✓ Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}