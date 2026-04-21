"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useChallengeStore } from "@/store/challengeStore";
import Navbar from "@/components/layout/Navbar";
import ChallengeCard from "@/components/challenge/ChallengeCard";
import CategoryCard from "@/components/category/CategoryCard";
import MotivationalQuote from "@/components/dashboard/MotivationalQuote";
import CreateTrackerModal from "@/components/dashboard/CreateTrackerModal";
import Button from "@/components/ui/Button";
import { Plus, Loader2, Folder, Target } from "lucide-react";
import toast from "react-hot-toast";
import { Category } from "@/types";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { challenges, setChallenges, updateChallenge, loading, setLoading } = useChallengeStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
      fetchCategories();
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

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setCategoriesLoading(false);
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
  const activeCategories = categories.filter((c) => c.status === "active");

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
          <Button 
            onClick={() => setShowCreateModal(true)} 
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-purple-500 hover:from-green-600 hover:to-purple-600"
          >
            <Plus size={20} />
            Create Tracker
          </Button>
        </div>

        <CreateTrackerModal 
          isOpen={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
        />

        <MotivationalQuote />

        {/* Categories Section */}
        {(categoriesLoading || activeCategories.length > 0) && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Folder className="text-purple-500" size={24} />
              <h2 className="text-2xl font-bold text-white">Multiple Habits</h2>
              <span className="text-sm text-gray-400">({activeCategories.length})</span>
            </div>
            
            {categoriesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-purple-500" size={32} />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {activeCategories.map((category) => (
                  <CategoryCard key={category._id} category={category} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Regular Challenges Section */}
        {(loading || activeChallenges.length > 0) && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Target className="text-green-500" size={24} />
              <h2 className="text-2xl font-bold text-white">Single Habits</h2>
              <span className="text-sm text-gray-400">({activeChallenges.length})</span>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-green-500" size={32} />
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
          </div>
        )}

        {/* Empty State */}
        {!loading && !categoriesLoading && activeCategories.length === 0 && activeChallenges.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Start Your Journey</h3>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Create your first habit tracker and start building the life you want.
                Track single habits or group multiple habits together.
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-green-500 to-purple-500 hover:from-green-600 hover:to-purple-600 flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Create Your First Tracker
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
