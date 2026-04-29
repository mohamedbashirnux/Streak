"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { LeaderboardEntry } from "@/types";
import { 
  Loader2, 
  Trophy, 
  Medal, 
  Award, 
  Zap, 
  Target, 
  Calendar,
  Crown,
  Star,
  User as UserIcon
} from "lucide-react";
import toast from "react-hot-toast";

export default function LeaderboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"xp" | "streak" | "challenges">("xp");
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) fetchLeaderboard();
  }, [session, activeTab]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?type=${activeTab}&limit=50`);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard);
        setCurrentUserRank(data.currentUserRank);
      } else {
        toast.error("Failed to load leaderboard");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="text-yellow-500" size={20} />;
      case 2: return <Medal className="text-gray-400" size={20} />;
      case 3: return <Award className="text-amber-600" size={20} />;
      default: return <span className="text-gray-500 font-bold">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30";
      case 2: return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30";
      case 3: return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30";
      default: return "bg-gray-800/50 border-gray-700";
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "xp": return <Zap size={16} />;
      case "streak": return <Target size={16} />;
      case "challenges": return <Calendar size={16} />;
      default: return <Trophy size={16} />;
    }
  };

  const getDisplayValue = (entry: any) => {
    switch (activeTab) {
      case "xp": return `${entry.totalXP?.toLocaleString() || 0} XP`;
      case "streak": return `${entry.longestStreak || 0} days`;
      case "challenges": return `${entry.totalCompleted || 0} completed`;
      default: return "";
    }
  };

  const getDisplayLabel = (entry: any) => {
    switch (activeTab) {
      case "xp": return `Level ${entry.level || 1}`;
      case "streak": return `${entry.totalChallenges || 0} total challenges`;
      case "challenges": return `${entry.totalChallenges || 0} total challenges`;
      default: return "";
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-green-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">🏆 Leaderboard</h1>
          <p className="text-gray-400">Compete with other habit builders!</p>
        </div>

        {/* Tabs */}
        <Card>
          <div className="flex gap-2 mb-6">
            {[
              { key: "xp", label: "XP & Level", icon: "xp" },
              { key: "streak", label: "Longest Streak", icon: "streak" },
              { key: "challenges", label: "Completed Challenges", icon: "challenges" },
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "primary" : "secondary"}
                onClick={() => setActiveTab(tab.key as any)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {getTabIcon(tab.icon)}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.key.toUpperCase()}</span>
              </Button>
            ))}
          </div>

          {/* Current User Rank */}
          {currentUserRank && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <Star className="text-green-500" size={20} />
                <div>
                  <p className="text-white font-medium">Your Rank</p>
                  <p className="text-green-400">#{currentUserRank} out of {leaderboard.length}+ players</p>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-green-500" size={48} />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="mx-auto text-gray-500 mb-4" size={48} />
              <p className="text-gray-400">No data available yet</p>
              <p className="text-gray-500 text-sm">Start completing challenges to appear on the leaderboard!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry._id}
                  className={`p-4 rounded-lg border transition-all hover:scale-[1.02] ${getRankColor(entry.rank)}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex-shrink-0 w-8 flex justify-center">
                      {getRankIcon(entry.rank)}
                    </div>

                    {/* Avatar */}
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {entry.avatar ? (
                        <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="text-green-500" size={24} />
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{entry.name}</h3>
                      <p className="text-gray-400 text-sm">{getDisplayLabel(entry)}</p>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <p className="text-white font-bold">{getDisplayValue(entry)}</p>
                      {entry.rank <= 3 && (
                        <p className="text-xs text-gray-400">
                          {entry.rank === 1 ? "Champion" : entry.rank === 2 ? "Runner-up" : "3rd Place"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Motivational Message */}
        <Card>
          <div className="text-center">
            <Trophy className="mx-auto text-green-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">Keep Building Your Habits!</h3>
            <p className="text-gray-400">
              Every check-in, every streak, and every completed challenge brings you closer to the top. 
              Stay consistent and watch your rank climb! 🚀
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}