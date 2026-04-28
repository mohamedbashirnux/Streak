"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressRing from "@/components/challenge/ProgressRing";
import CalendarHeatmap from "@/components/challenge/CalendarHeatmap";
import CheckInButton from "@/components/challenge/CheckInButton";
import { Challenge } from "@/types";
import { Loader2, Trash2, Ban, Target, Flame, Trophy, Star, BarChart, Calendar, TrendingUp, CheckCircle, Percent } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function ChallengeDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id && params.id) {
      fetchChallenge();
    }
  }, [session, params.id]);

  const fetchChallenge = async () => {
    try {
      const res = await fetch(`/api/challenges/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setChallenge(data);
      } else {
        toast.error("Challenge not found");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Failed to load challenge");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (success: boolean) => {
    try {
      const res = await fetch(`/api/challenges/${params.id}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success }),
      });

      const data = await res.json();

      if (res.ok) {
        setChallenge(data.challenge);
        toast.success(data.message);
        
        if (data.earnedBadge) {
          toast.success(`🎉 Badge earned: ${data.earnedBadge}!`, { duration: 5000 });
        }
      } else {
        toast.error(data.error || "Check-in failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this challenge?")) return;

    try {
      const res = await fetch(`/api/challenges/${params.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Challenge deleted");
        router.push("/dashboard");
      } else {
        toast.error("Failed to delete challenge");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleSaveNote = async (date: Date, notes: string) => {
    try {
      const res = await fetch(`/api/challenges/${params.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, notes }),
      });

      if (res.ok) {
        toast.success("Note saved!");
        await fetchChallenge(); // Refresh to show updated notes
      } else {
        toast.error("Failed to save note");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-green-500" size={48} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-green-500" size={48} />
        </div>
      </div>
    );
  }

  if (!challenge) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayDay = challenge.days.find((day) => {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate.getTime() === today.getTime();
  });

  const canCheckIn = todayDay && todayDay.status === "pending" && challenge.status === "active";

  // Milestones
  const milestones = [
    { days: 7, name: "Week Warrior", emoji: "🔥", color: "orange" },
    { days: 21, name: "Habit Former", emoji: "💪", color: "blue" },
    { days: 30, name: "Month Master", emoji: "⭐", color: "yellow" },
    { days: 60, name: "Consistency King", emoji: "👑", color: "purple" },
    { days: 90, name: "Legend", emoji: "🏆", color: "green" },
    { days: 180, name: "Half Year Hero", emoji: "🎯", color: "cyan" },
    { days: 365, name: "Year Champion", emoji: "🎉", color: "pink" },
  ];

  const earnedMilestones = milestones.filter(m => challenge.currentStreak >= m.days);
  const nextMilestone = milestones.find(m => challenge.currentStreak < m.days);
  const daysToNext = nextMilestone ? nextMilestone.days - challenge.currentStreak : 0;

  // Streak Insights Calculations
  const totalDays = challenge.days.length;
  const successfulDays = challenge.days.filter(day => day.status === "success").length;
  const failedDays = challenge.days.filter(day => day.status === "failed").length;
  const successRate = totalDays > 0 ? Math.round((successfulDays / totalDays) * 100) : 0;
  
  // Best streak this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthDays = challenge.days.filter(day => {
    const dayDate = new Date(day.date);
    return dayDate.getMonth() === currentMonth && dayDate.getFullYear() === currentYear;
  });
  
  // Calculate best streak this month
  let bestStreakThisMonth = 0;
  let currentMonthStreak = 0;
  thisMonthDays.forEach(day => {
    if (day.status === "success") {
      currentMonthStreak++;
      bestStreakThisMonth = Math.max(bestStreakThisMonth, currentMonthStreak);
    } else {
      currentMonthStreak = 0;
    }
  });
  
  // Average streak length (calculate all streaks)
  const streaks: number[] = [];
  let currentStreakCount = 0;
  challenge.days.forEach(day => {
    if (day.status === "success") {
      currentStreakCount++;
    } else {
      if (currentStreakCount > 0) {
        streaks.push(currentStreakCount);
        currentStreakCount = 0;
      }
    }
  });
  if (currentStreakCount > 0) streaks.push(currentStreakCount);
  const averageStreak = streaks.length > 0 ? Math.round(streaks.reduce((a, b) => a + b, 0) / streaks.length) : 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              {challenge.type === "avoid" ? (
                <Ban className="text-green-500" size={32} />
              ) : (
                <Target className="text-green-500" size={32} />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{challenge.name}</h1>
              <p className="text-gray-400 capitalize">{challenge.type} habit</p>
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 size={16} />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="flex flex-col items-center justify-center">
            <ProgressRing current={challenge.currentStreak} total={challenge.duration} />
            <p className="text-gray-400 mt-4">Progress</p>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Flame className="text-orange-500" size={24} />
              <h3 className="text-lg font-semibold text-white">Current Streak</h3>
            </div>
            <p className="text-4xl font-bold text-white">{challenge.currentStreak}</p>
            <p className="text-gray-400 mt-2">days</p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`font-medium capitalize ${
                  challenge.status === "active" ? "text-green-500" :
                  challenge.status === "completed" ? "text-blue-500" : "text-red-500"
                }`}>
                  {challenge.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white">{challenge.duration} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Started:</span>
                <span className="text-white">
                  {format(new Date(challenge.startDate), "MMM d, yyyy")}
                </span>
              </div>
              {challenge.status === "active" && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Will end on:</span>
                  <span className="text-blue-500 font-medium">
                    {format(
                      new Date(new Date(challenge.startDate).getTime() + (challenge.duration - 1) * 24 * 60 * 60 * 1000),
                      "MMM d, yyyy"
                    )}
                  </span>
                </div>
              )}
              {challenge.completedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Completed:</span>
                  <span className="text-green-500 font-medium">
                    {format(new Date(challenge.completedAt), "MMM d, yyyy")}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Longest Streak:</span>
                <span className="text-white">{challenge.longestStreak} days</span>
              </div>
            </div>
          </Card>
        </div>

        {challenge.motivation && (
          <Card className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-2">Motivation</h3>
            <p className="text-gray-300 italic">"{challenge.motivation}"</p>
          </Card>
        )}

        {/* Streak Insights */}
        <Card className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart className="text-blue-500" size={24} />
            <h3 className="text-xl font-semibold text-white">Streak Insights</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Best Streak This Month */}
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="text-blue-500" size={16} />
                <span className="text-xs text-gray-400 uppercase tracking-wide">This Month</span>
              </div>
              <p className="text-2xl font-bold text-white">{bestStreakThisMonth}</p>
              <p className="text-xs text-gray-400">Best Streak</p>
            </div>

            {/* Average Streak Length */}
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-purple-500" size={16} />
                <span className="text-xs text-gray-400 uppercase tracking-wide">Average</span>
              </div>
              <p className="text-2xl font-bold text-white">{averageStreak}</p>
              <p className="text-xs text-gray-400">Streak Length</p>
            </div>

            {/* Total Successful Days */}
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-green-500" size={16} />
                <span className="text-xs text-gray-400 uppercase tracking-wide">Success</span>
              </div>
              <p className="text-2xl font-bold text-white">{successfulDays}</p>
              <p className="text-xs text-gray-400">Total Days</p>
            </div>

            {/* Success Rate Percentage */}
            <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="text-yellow-500" size={16} />
                <span className="text-xs text-gray-400 uppercase tracking-wide">Success Rate</span>
              </div>
              <p className="text-2xl font-bold text-white">{successRate}%</p>
              <p className="text-xs text-gray-400">Overall</p>
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-400">Total Streaks</p>
                <p className="text-lg font-semibold text-white">{streaks.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Failed Days</p>
                <p className="text-lg font-semibold text-red-400">{failedDays}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Longest Ever</p>
                <p className="text-lg font-semibold text-green-400">{challenge.longestStreak}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Milestones & Achievements */}
        <Card className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="text-yellow-500" size={24} />
            <h3 className="text-xl font-semibold text-white">Milestones & Achievements</h3>
          </div>

          {/* Next Milestone Countdown */}
          {nextMilestone && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star className="text-purple-500" size={20} />
                  <span className="text-white font-semibold">Next Milestone</span>
                </div>
                <span className="text-2xl">{nextMilestone.emoji}</span>
              </div>
              <p className="text-gray-300 mb-3">{nextMilestone.name}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  {daysToNext} day{daysToNext !== 1 ? 's' : ''} to go
                </span>
                <span className="text-purple-500 font-bold">
                  {challenge.currentStreak}/{nextMilestone.days} days
                </span>
              </div>
              <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${(challenge.currentStreak / nextMilestone.days) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Earned Badges */}
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-4">
              Earned Badges ({earnedMilestones.length}/{milestones.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {milestones.map((milestone) => {
                const isEarned = challenge.currentStreak >= milestone.days;
                return (
                  <div
                    key={milestone.days}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isEarned
                        ? `border-${milestone.color}-500 bg-${milestone.color}-500/10 hover:scale-105`
                        : "border-gray-700 bg-gray-800/50 opacity-50"
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-4xl mb-2 ${isEarned ? "animate-bounce" : "grayscale"}`}>
                        {milestone.emoji}
                      </div>
                      <p className={`text-sm font-semibold mb-1 ${
                        isEarned ? "text-white" : "text-gray-500"
                      }`}>
                        {milestone.name}
                      </p>
                      <p className="text-xs text-gray-400">{milestone.days} days</p>
                      {isEarned && (
                        <div className="mt-2 text-xs text-green-500 font-medium">
                          ✓ Unlocked
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Celebration Message */}
          {earnedMilestones.length > 0 && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
              <p className="text-green-500 font-semibold">
                🎉 Amazing! You've unlocked {earnedMilestones.length} milestone{earnedMilestones.length !== 1 ? 's' : ''}!
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Keep going to unlock all {milestones.length} achievements!
              </p>
            </div>
          )}
        </Card>

        {challenge.status === "active" && (
          <div className="mb-8 max-w-md mx-auto">
            <CheckInButton
              challengeId={challenge._id}
              onCheckIn={handleCheckIn}
              disabled={!canCheckIn}
            />
          </div>
        )}

        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">Calendar</h3>
          <CalendarHeatmap 
            days={challenge.days} 
            startDate={new Date(challenge.startDate)}
            challengeId={challenge._id}
            onSaveNote={handleSaveNote}
          />
        </Card>
      </main>
    </div>
  );
}
