"use client";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function TasksPage() {
  const { loading } = useAuthGuard("employeeApproved");
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Tasks</h1>
      <p>Example area for employee tasks.</p>
    </div>
  );
}
