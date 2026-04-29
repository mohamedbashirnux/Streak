"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { User, DailyChallenge } from "@/types";
import { 
  Zap, 
  Trophy, 
  Target, 
  Star, 
  Gift,
  Loader2,
  Crown,
  Medal,
  Award
} from "lucide-react";
import { getCurrentLevelProgress } from "@/lib/client-utils";
import toast from "react-hot-toast";

interface GamificationPanelProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

export default function GamificationPanel({ user, onUserUpdate }: GamificationPanelProps) {
  const { data: session } = useSession();
  const [dailyChallenges, setDailyChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingChallenge, setCompletingChallenge] = useState<string | null>(null);

  useEffect(() => {
    fetchDailyChallenges();
  }, []);

  const fetchDailyChallenges = async () => {
    try {
      const res = await fetch("/api/daily-challenges");
      if (res.ok) {
        const data = await res.json();
        setDailyChallenges(data.challenges);
      }
    } catch {
      // Silently fail - daily challenges are optional
    } finally {
      setLoading(false);
    }
  };

  const completeChallenge = async (challengeId: string) => {
    setCompletingChallenge(challengeId);
    try {
      const res = await fetch("/api/daily-challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`+${data.xpEarned} XP earned! 🎉`);
        
        // Update challenges
        setDailyChallenges(prev => 
          prev.map(challenge => 
            challenge._id === challengeId 
              ? { ...challenge, completed: true, xpEarned: data.xpEarned }
              : challenge
          )
        );

        // Update user XP (you might want to refetch user data here)
        const updatedUser = { 
          ...user, 
          totalXP: user.totalXP + data.xpEarned,
          xp: user.xp + data.xpEarned 
        };
        onUserUpdate(updatedUser);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to complete challenge");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setCompletingChallenge(null);
    }
  };

  const levelProgress = getCurrentLevelProgress(user.totalXP || 0);

  return (
    <div className="space-y-6">
      {/* XP & Level Card */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Zap className="text-yellow-500" size={20} />
          <h3 className="text-lg font-semibold text-white">Level & XP</h3>
        </div>
        
        <div className="space-y-4">
          {/* Level Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{user.level || 1}</span>
              </div>
              <div>
                <p className="text-white font-medium">Level {user.level || 1}</p>
                <p className="text-gray-400 text-sm">{(user.totalXP || 0).toLocaleString()} Total XP</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-yellow-500 font-bold">+{user.xp || 0} XP</p>
              <p className="text-gray-400 text-xs">This session</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progress to Level {(user.level || 1) + 1}</span>
              <span className="text-white">{Math.round(levelProgress.progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {(levelProgress.nextLevelXP - (user.totalXP || 0)).toLocaleString()} XP to next level
            </p>
          </div>
        </div>
      </Card>

      {/* Daily Challenges */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Target className="text-green-500" size={20} />
          <h3 className="text-lg font-semibold text-white">Daily Challenges</h3>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-green-500" size={32} />
          </div>
        ) : dailyChallenges.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No challenges available today</p>
        ) : (
          <div className="space-y-3">
            {dailyChallenges.map((challenge) => (
              <div 
                key={challenge._id}
                className={`p-4 rounded-lg border transition-all ${
                  challenge.completed 
                    ? "bg-green-500/10 border-green-500/30" 
                    : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{challenge.title}</h4>
                    <p className="text-gray-400 text-sm">{challenge.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Zap className="text-yellow-500" size={14} />
                      <span className="text-yellow-500 text-sm font-medium">
                        +{challenge.xpReward} XP
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {challenge.completed ? (
                      <div className="flex items-center gap-2 text-green-500">
                        <Star size={16} />
                        <span className="text-sm font-medium">Completed!</span>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => completeChallenge(challenge._id)}
                        disabled={completingChallenge === challenge._id}
                        className="min-w-[80px]"
                      >
                        {completingChallenge === challenge._id ? (
                          <Loader2 className="animate-spin" size={14} />
                        ) : (
                          "Complete"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Stats */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="text-purple-500" size={20} />
          <h3 className="text-lg font-semibold text-white">Your Stats</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <Crown className="mx-auto text-yellow-500 mb-2" size={24} />
            <p className="text-white font-bold text-lg">{user.level || 1}</p>
            <p className="text-gray-400 text-sm">Level</p>
          </div>
          
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <Zap className="mx-auto text-yellow-500 mb-2" size={24} />
            <p className="text-white font-bold text-lg">{(user.totalXP || 0).toLocaleString()}</p>
            <p className="text-gray-400 text-sm">Total XP</p>
          </div>
        </div>
      </Card>
    </div>
  );
}