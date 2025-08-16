"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * Guards page access based on role and approval.
 * - "admin": must be admin.
 * - "employeeApproved": must be employee AND approved.
 */
export function useAuthGuard(requirement: "admin" | "employeeApproved") {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for auth state

    // 1️⃣ Not logged in → go to /login
    if (!user) {
      router.replace("/login");
      return;
    }

    // 2️⃣ No profile loaded yet
    if (!profile) return;

    // 3️⃣ Role & approval checks
    if (requirement === "admin" && profile.role !== "admin") {
      router.replace("/");
      return;
    }

    if (requirement === "employeeApproved") {
      const approved = profile.role === "employee" && profile.approved;
      if (!approved) {
        router.replace("/login?status=pending");
        return;
      }
    }
  }, [user, profile, loading, router, requirement]);

  return { user, profile, loading };
}
