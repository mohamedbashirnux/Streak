"use client";

import { LifeChapter } from "@/types";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/challenge/ProgressBar";
import { motion } from "framer-motion";
import { Flame, Calendar, Target, Ban, Crown } from "lucide-react";
import { useRouter } from "next/navigation";

interface LifeChapterCardProps {
  chapter: LifeChapter;
}

export default function LifeChapterCard({ chapter }: LifeChapterCardProps) {
  const router = useRouter();
  const daysRemaining = chapter.duration - chapter.currentStreak;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayProgress = chapter.days.find((day) => {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate.getTime() === today.getTime();
  });

  const canCheckIn = todayProgress && todayProgress.status === "pending";
  const wonToday = todayProgress?.dayWon || false;

  const completedHabits = todayProgress?.habits.filter(h => h.completed).length || 0;
  const totalHabits = chapter.habits.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`cursor-pointer transition-all ${wonToday ? "border-green-500/40 bg-green-500/5" : ""}`}
        onClick={() => router.push(`/life-chapter/${chapter._id}`)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${wonToday ? "bg-green-500/20" : "bg-purple-500/10"}`}>
              <Crown className="text-purple-500" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{chapter.title}</h3>
              <p className="text-sm text-gray-400">Life Transformation</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-orange-500">
            <Flame size={20} />
            <span className="text-lg font-bold">{chapter.currentStreak}</span>
          </div>
        </div>

        {chapter.description && (
          <p className="text-gray-400 text-sm mb-4 italic">"{chapter.description}"</p>
        )}

        {/* Habits Preview */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-400">Today's Habits</span>
            <span className="text-sm text-white font-medium">
              {completedHabits}/{totalHabits}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {chapter.habits.slice(0, 4).map((habit) => {
              const habitProgress = todayProgress?.habits.find(h => h.habitId === habit.id);
              const completed = habitProgress?.completed || false;
              
              return (
                <div
                  key={habit.id}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    completed 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  <span>{habit.icon}</span>
                  <span className="truncate max-w-20">{habit.name}</span>
                  {habit.type === "build" ? (
                    <Target size={12} />
                  ) : (
                    <Ban size={12} />
                  )}
                </div>
              );
            })}
            {chapter.habits.length > 4 && (
              <div className="px-2 py-1 rounded-full text-xs bg-gray-800 text-gray-400">
                +{chapter.habits.length - 4} more
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="text-white font-medium">
              Day {chapter.currentStreak} of {chapter.duration}
            </span>
          </div>
          <ProgressBar current={chapter.currentStreak} total={chapter.duration} />
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Days remaining</span>
            <span className="text-purple-500 font-medium">{daysRemaining}</span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">
              {canCheckIn ? "Ready to check in" : wonToday ? "Perfect day!" : "Check back tomorrow"}
            </span>
          </div>
          {wonToday && (
            <div className="text-green-500 text-sm font-medium">
              ✨ Day Won
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}