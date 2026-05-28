"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useChallengeStore } from "@/store/challengeStore";
import Navbar from "@/components/layout/Navbar";
import ChallengeCard from "@/components/challenge/ChallengeCard";
import MotivationalQuote from "@/components/dashboard/MotivationalQuote";
import CreateTrackerModal from "@/components/dashboard/CreateTrackerModal";
import GamificationPanel from "@/components/dashboard/GamificationPanel";
import Button from "@/components/ui/Button";
import { Plus, Loader2, Target, Trophy, Map, ChevronRight } from "lucide-react";
import { User, Journey } from "@/types";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { challenges, setChallenges, updateChallenge, loading, setLoading } = useChallengeStore();
  const [mounted, setMounted] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [journeys, setJourneys] = useState<Journey[]>([]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchChallenges();
      fetchUserProfile();
      fetchJourneys();
    }
  }, [session]);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/challenges");
      if (res.ok) setChallenges(await res.json());
    } catch {
      toast.error("Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) setUser(await res.json());
    } catch {}
  };

  const fetchJourneys = async () => {
    try {
      const res = await fetch("/api/journeys");
      if (res.ok) setJourneys(await res.json());
    } catch {}
  };

  const handleCheckIn = async (challengeId: string, success: boolean) => {
    try {
      const res = await fetch(`/api/challenges/${challengeId}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success }),
      });
      const data = await res.json();
      if (res.ok) {
        updateChallenge(challengeId, data.challenge);
        toast.success(data.message);
        if (data.earnedBadge) toast.success(`🎉 Badge earned: ${data.earnedBadge}!`, { duration: 5000 });
        if (data.xpEarned) {
          toast.success(`+${data.xpEarned} XP earned! 🎉`);
          setUser(prev => prev ? { ...prev, totalXP: prev.totalXP + data.xpEarned, xp: prev.xp + data.xpEarned } : null);
        }
        const milestones = [7, 21, 30, 60, 90];
        if (milestones.includes(data.challenge.currentStreak)) {
          toast(`🎉 ${data.challenge.currentStreak} day milestone!`, {
            duration: 5000, icon: "🏆",
            style: { background: "#166534", color: "#fff", border: "1px solid #22c55e" },
          });
        }
      } else {
        toast.error(data.error || "Check-in failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (!mounted || status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-green-500" size={48} />
      </div>
    );
  }

  const activeChallenges = challenges.filter(c => c.status === "active");

  // Group habits: by journey, then standalone
  const habitsByJourney: Record<string, typeof activeChallenges> = {};
  const standaloneHabits: typeof activeChallenges = [];

  for (const challenge of activeChallenges) {
    if (challenge.journeyId) {
      if (!habitsByJourney[challenge.journeyId]) habitsByJourney[challenge.journeyId] = [];
      habitsByJourney[challenge.journeyId].push(challenge);
    } else {
      standaloneHabits.push(challenge);
    }
  }

  // Only show journeys that have habits
  const activeJourneys = journeys.filter(j => habitsByJourney[j._id]?.length > 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {session.user?.name}!
            </h1>
            <p className="text-gray-400">Transform your life, one day at a time</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.push("/leaderboard")} className="flex items-center gap-2">
              <Trophy size={20} />
              Leaderboard
            </Button>
            <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
              <Plus size={20} />
              Create Habit
            </Button>
          </div>
        </div>

        <CreateTrackerModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onGroupCreated={fetchJourneys}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <MotivationalQuote />

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-green-500" size={32} />
              </div>
            ) : activeChallenges.length === 0 ? (
              <div className="text-center py-16">
                <Target className="mx-auto text-green-500 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-white mb-2">Start Your Journey</h3>
                <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                  Create your first habit and start building streaks today!
                </p>
                <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 mx-auto">
                  <Plus size={20} />
                  Create Your First Habit
                </Button>
              </div>
            ) : (
              <div className="space-y-10">

                {/* Journey groups */}
                {activeJourneys.map(journey => {
                  const habits = habitsByJourney[journey._id] || [];
                  const completedCount = habits.filter(h => h.days.find(d => {
                    const dd = new Date(d.date); dd.setHours(0,0,0,0);
                    return dd.getTime() === (() => { const t = new Date(); t.setHours(0,0,0,0); return t.getTime(); })() && d.status === "success";
                  })).length;

                  return (
                    <div key={journey._id}>
                      {/* Journey header */}
                      <div
                        className="flex items-center justify-between mb-4 p-4 rounded-xl border"
                        style={{ borderColor: journey.color + "40", backgroundColor: journey.color + "0d" }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: journey.color + "25" }}>
                            <Map size={20} style={{ color: journey.color }} />
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-white">{journey.name}</h2>
                            {journey.description && (
                              <p className="text-gray-400 text-sm">{journey.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Today</p>
                            <p className="text-sm font-semibold" style={{ color: journey.color }}>
                              {completedCount}/{habits.length} done
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                            {journey.duration}d
                          </span>
                        </div>
                      </div>

                      {/* Habits in this journey */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2 border-l-2" style={{ borderColor: journey.color + "40" }}>
                        {habits.map(challenge => (
                          <ChallengeCard
                            key={challenge._id}
                            challenge={challenge}
                            onCheckIn={handleCheckIn}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Standalone habits */}
                {standaloneHabits.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="text-green-500" size={22} />
                      <h2 className="text-xl font-bold text-white">Your Habits</h2>
                      <span className="text-sm text-gray-400">({standaloneHabits.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {standaloneHabits.map(challenge => (
                        <ChallengeCard
                          key={challenge._id}
                          challenge={challenge}
                          onCheckIn={handleCheckIn}
                        />
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Gamification Sidebar */}
          <div className="lg:col-span-1">
            {user && <GamificationPanel user={user} onUserUpdate={setUser} />}
          </div>
        </div>
      </main>
    </div>
  );
}
