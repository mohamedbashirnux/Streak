"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useChallengeStore } from "@/store/challengeStore";
import Navbar from "@/components/layout/Navbar";
import ChallengeCard from "@/components/challenge/ChallengeCard";
import MotivationalQuote from "@/components/dashboard/MotivationalQuote";
import Button from "@/components/ui/Button";
import { Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { challenges, setChallenges, updateChallenge, loading, setLoading } = useChallengeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchChallenges();
    }
  }, [session]);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/challenges");
      if (res.ok) {
        const data = await res.json();
        setChallenges(data);
      }
    } catch (error) {
      toast.error("Failed to load challenges");
    } finally {
      setLoading(false);
    }
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
        
        if (data.earnedBadge) {
          toast.success(`🎉 Badge earned: ${data.earnedBadge}!`, { duration: 5000 });
        }

        // Celebrate milestones
        const milestones = [7, 21, 30, 60, 90];
        if (milestones.includes(data.challenge.currentStreak)) {
          toast(`🎉 ${data.challenge.currentStreak} day milestone! Keep going!`, {
            duration: 5000,
            icon: "🏆",
            style: { background: "#166534", color: "#fff", border: "1px solid #22c55e" },
          });
        }
      } else {
        toast.error(data.error || "Check-in failed");
      }
    } catch (error) {
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

  const activeChallenges = challenges.filter((c) => c.status === "active");

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {session.user?.name}!
            </h1>
            <p className="text-gray-400">Keep your streaks alive today</p>
          </div>
          <Button onClick={() => router.push("/challenge/new")} className="flex items-center gap-2">
            <Plus size={20} />
            New Challenge
          </Button>
        </div>

        <MotivationalQuote />

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-green-500" size={48} />
          </div>
        ) : activeChallenges.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No active challenges yet</p>
            <Button onClick={() => router.push("/challenge/new")}>
              Create Your First Challenge
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge._id}
                challenge={challenge}
                onCheckIn={handleCheckIn}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
