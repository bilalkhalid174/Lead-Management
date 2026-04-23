"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import StatsBar from "@/components/ui/StatsBar";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
   const { data: session } = useSession();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/leads/stats");
      const data = await res.json();
      setStats(data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Lead Management Dashboard
        </h1>

        <div className="p-6">
        <h1 className="text-xl font-semibold">
        Welcome, {session?.user?.name}
        </h1>
        </div>

        <StatsBar stats={stats} loading={loading} />
      </div>
    </div>
  );
}