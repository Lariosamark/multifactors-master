'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function EmployeeDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      setUserName(user.displayName || user.email || 'Employee');
    } else {
      router.push('/login');
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-medium">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">


      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">Welcome, {userName}!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Your account is approved. You can now access your dashboard.
        </p>
      </main>
    </div>
  );
}
