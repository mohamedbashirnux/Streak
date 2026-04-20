"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Card from "@/components/ui/Card";
import { Stats } from "@/types";
import { Loader2, Trophy, Target, XCircle, Flame, Calendar } from "lucide-react";
import { badges } from "@/lib/utils";
import toast from "react-hot-toast";

export default function StatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats & { badges: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchStats();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-green-500" size={48} />
      </div>
    );
  }

  const successRate = stats
    ? stats.totalChallenges > 0
      ? Math.round((stats.totalCompleted / stats.totalChallenges) * 100)
      : 0
    : 0;

  const earnedBadges = badges.filter((badge) => stats?.badges.includes(badge.id));
  const lockedBadges = badges.filter((badge) => !stats?.badges.includes(badge.id));

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Your Statistics</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-green-500" size={48} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Target className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Challenges</p>
                    <p className="text-3xl font-bold text-white">{stats?.totalChallenges || 0}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Trophy className="text-green-500" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Completed</p>
                    <p className="text-3xl font-bold text-white">{stats?.totalCompleted || 0}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                    <XCircle className="text-red-500" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Failed</p>
                    <p className="text-3xl font-bold text-white">{stats?.totalFailed || 0}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                    <Flame className="text-orange-500" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Longest Streak</p>
                    <p className="text-3xl font-bold text-white">{stats?.longestStreakEver || 0}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                    <Calendar className="text-purple-500" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Days Completed</p>
                    <p className="text-3xl font-bold text-white">{stats?.totalDaysCompleted || 0}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Trophy className="text-green-500" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Success Rate</p>
                    <p className="text-3xl font-bold text-white">{successRate}%</p>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-6">🏆 Achievements</h2>
              
              {earnedBadges.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-green-500 mb-4">Earned ({earnedBadges.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {earnedBadges.map((badge) => (
                      <Card key={badge.id} className="text-center border-green-500/20">
                        <div className="text-5xl mb-2">{badge.icon}</div>
                        <p className="font-bold text-white text-sm">{badge.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{badge.description}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {lockedBadges.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-400 mb-4">Locked ({lockedBadges.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {lockedBadges.map((badge) => (
                      <Card key={badge.id} className="text-center opacity-40">
                        <div className="text-5xl mb-2 grayscale">{badge.icon}</div>
                        <p className="font-bold text-gray-400 text-sm">{badge.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
