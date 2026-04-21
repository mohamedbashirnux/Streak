"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/challenge/ProgressBar";
import { 
  Loader2, Folder, Flame, Calendar, Target, Ban, 
  CheckCircle, XCircle, Clock, Trash2, ArrowLeft, Plus, Edit 
} from "lucide-react";
import toast from "react-hot-toast";
import { Category, HabitProgress } from "@/types";
import { format } from "date-fns";

export default function CategoryDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [habitProgress, setHabitProgress] = useState<HabitProgress[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id && id) {
      fetchCategory();
    }
  }, [session, id]);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/categories/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCategory(data);
        
        // Initialize today's progress
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayProgress = data.days.find((day: any) => {
          const dayDate = new Date(day.date);
          dayDate.setHours(0, 0, 0, 0);
          return dayDate.getTime() === today.getTime();
        });

        if (todayProgress) {
          setHabitProgress(todayProgress.habits);
        } else {
          // Initialize empty progress
          setHabitProgress(data.habits.map((habit: any) => ({
            habitId: habit.id,
            completed: false,
          })));
        }
      } else {
        toast.error("Category not found");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = (habitId: string) => {
    setHabitProgress(prev => 
      prev.map(h => 
        h.habitId === habitId 
          ? { ...h, completed: !h.completed }
          : h
      )
    );
  };

  const handleCheckIn = async () => {
    if (!category) return;

    setCheckingIn(true);
    try {
      const res = await fetch(`/api/categories/${id}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitProgress }),
      });

      const data = await res.json();

      if (res.ok) {
        setCategory(data.category);
        toast.success(data.message);
        
        if (data.earnedBadge) {
          toast.success(`🎉 Badge earned: ${data.earnedBadge}!`, { duration: 5000 });
        }

        // Celebrate milestones
        if (data.dayWon) {
          const milestones = [7, 21, 30, 60, 90, 180, 365];
          if (milestones.includes(data.category.currentStreak)) {
            toast(`🎉 ${data.category.currentStreak} day milestone! You're transforming!`, {
              duration: 5000,
              icon: "📁",
              style: { background: "#7c3aed", color: "#fff", border: "1px solid #a855f7" },
            });
          }
        }
      } else {
        toast.error(data.error || "Check-in failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setCheckingIn(false);
    }
  };

  const deleteCategory = async () => {
    if (!confirm("Are you sure you want to delete this Category? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Category deleted");
        router.push("/dashboard");
      } else {
        toast.error("Failed to delete Category");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  if (!session || !category) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayProgress = category.days.find((day) => {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate.getTime() === today.getTime();
  });

  const canCheckIn = todayProgress && todayProgress.status === "pending";
  const wonToday = todayProgress?.dayWon || false;
  const completedHabits = habitProgress.filter(h => h.completed).length;
  const allCompleted = completedHabits === category.habits.length;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Folder className="text-purple-500" size={32} />
              <h1 className="text-3xl font-bold text-white">{category.title}</h1>
            </div>
            {category.description && (
              <p className="text-gray-400">{category.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => router.push(`/category/${id}/edit`)}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600"
            >
              <Plus size={16} />
              Add New Habit
            </Button>
            <Button
              variant="danger"
              onClick={deleteCategory}
              className="flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
                <Flame className="text-orange-500" size={20} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Current Streak</p>
                <p className="text-2xl font-bold text-white">{category.currentStreak}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                <Folder className="text-purple-500" size={20} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Longest Streak</p>
                <p className="text-2xl font-bold text-white">{category.longestStreak}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-500" size={20} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Days Won</p>
                <p className="text-2xl font-bold text-white">{category.totalDaysWon}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                <XCircle className="text-red-500" size={20} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Days Lost</p>
                <p className="text-2xl font-bold text-white">{category.totalDaysLost}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="text-purple-500" size={24} />
            <h2 className="text-xl font-bold text-white">Progress</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Overall Progress</span>
              <span className="text-white font-medium">
                Day {category.currentStreak} of {category.duration}
              </span>
            </div>
            <ProgressBar current={category.currentStreak} total={category.duration} />
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Days remaining</span>
              <span className="text-purple-500 font-medium">
                {category.duration - category.currentStreak}
              </span>
            </div>
          </div>
        </Card>

        {/* Today's Check-in */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                wonToday ? "bg-green-500/20" : "bg-purple-500/10"
              }`}>
                {wonToday ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : canCheckIn ? (
                  <Clock className="text-purple-500" size={20} />
                ) : (
                  <XCircle className="text-gray-500" size={20} />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Today's Habits ({format(today, "MMM d")})
                </h2>
                <p className="text-gray-400 text-sm">
                  {wonToday ? "Perfect day completed!" : 
                   canCheckIn ? "Complete all habits to win the day" : 
                   "Check back tomorrow"}
                </p>
              </div>
            </div>
            {wonToday && (
              <div className="text-green-500 font-bold text-lg">
                ✨ Day Won!
              </div>
            )}
          </div>

          <div className="space-y-4 mb-6">
            {category.habits.length > 0 ? (
              category.habits.map((habit) => {
                const progress = habitProgress.find(h => h.habitId === habit.id);
                const completed = progress?.completed || false;

                return (
                  <div
                    key={habit.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      completed 
                        ? "bg-green-500/10 border-green-500/30" 
                        : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                    } ${!canCheckIn ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => canCheckIn && toggleHabit(habit.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{habit.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{habit.name}</h3>
                          {habit.type === "build" ? (
                            <Target className="text-green-500" size={16} />
                          ) : (
                            <Ban className="text-red-500" size={16} />
                          )}
                        </div>
                        {habit.description && (
                          <p className="text-sm text-gray-400">{habit.description}</p>
                        )}
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        completed 
                          ? "bg-green-500 border-green-500" 
                          : "border-gray-600"
                      }`}>
                        {completed && <CheckCircle className="text-white" size={16} />}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500">
                  <Plus className="mx-auto mb-2" size={48} />
                  <h3 className="text-lg font-semibold">No habits added yet</h3>
                  <p className="text-sm">Go back to dashboard and recreate this category with habits</p>
                </div>
              </div>
            )}
          </div>

          {canCheckIn && category.habits.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                {completedHabits}/{category.habits.length} habits completed
                {allCompleted && " - Ready to win the day! 🔥"}
              </div>
              <Button
                onClick={handleCheckIn}
                disabled={checkingIn}
                className={`flex items-center gap-2 ${
                  allCompleted 
                    ? "bg-green-500 hover:bg-green-600" 
                    : "bg-purple-500 hover:bg-purple-600"
                }`}
              >
                {checkingIn ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <CheckCircle size={16} />
                )}
                {allCompleted ? "Win the Day!" : "Check In"}
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}