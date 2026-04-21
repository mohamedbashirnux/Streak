"use client";

import { Category } from "@/types";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/challenge/ProgressBar";
import { motion } from "framer-motion";
import { Flame, Calendar, Target, Ban, Folder } from "lucide-react";
import { useRouter } from "next/navigation";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter();
  const daysRemaining = category.duration - category.currentStreak;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayProgress = category.days.find((day) => {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate.getTime() === today.getTime();
  });

  const canCheckIn = todayProgress && todayProgress.status === "pending";
  const wonToday = todayProgress?.dayWon || false;

  const completedHabits = todayProgress?.habits.filter(h => h.completed).length || 0;
  const totalHabits = category.habits.length;

  const handleClick = () => {
    console.log("Clicking category:", category._id);
    router.push(`/category/${category._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`cursor-pointer transition-all hover:scale-[1.02] ${wonToday ? "border-purple-500/40 bg-purple-500/5" : "hover:border-purple-500/30"}`}
        onClick={handleClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{category.title}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>{category.habits.length} habits</span>
              <span>•</span>
              <span>{category.duration} days</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-orange-500/10 px-3 py-1.5 rounded-full">
            <Flame className="text-orange-500" size={18} />
            <span className="text-lg font-bold text-orange-500">{category.currentStreak}</span>
          </div>
        </div>

        {/* Description */}
        {category.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{category.description}</p>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Day {category.currentStreak}</span>
            <span>{Math.round((category.currentStreak / category.duration) * 100)}%</span>
          </div>
          <ProgressBar current={category.currentStreak} total={category.duration} />
        </div>

        {/* Habits Preview */}
        {category.habits.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {category.habits.slice(0, 6).map((habit) => {
              const habitProgress = todayProgress?.habits.find(h => h.habitId === habit.id);
              const completed = habitProgress?.completed || false;
              
              return (
                <div
                  key={habit.id}
                  className={`text-lg ${completed ? "opacity-100" : "opacity-40 grayscale"}`}
                  title={habit.name}
                >
                  {habit.icon}
                </div>
              );
            })}
            {category.habits.length > 6 && (
              <div className="text-xs text-gray-500 flex items-center">
                +{category.habits.length - 6}
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic mb-4">
            Click to add habits
          </div>
        )}

        {/* Footer Status */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
          <div className="flex items-center gap-2">
            {wonToday ? (
              <>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-purple-400 font-medium">Perfect day!</span>
              </>
            ) : canCheckIn ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">Ready to check in</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                <span className="text-sm text-gray-500">Check back tomorrow</span>
              </>
            )}
          </div>
          <span className="text-xs text-gray-500">{daysRemaining} days left</span>
        </div>
      </Card>
    </motion.div>
  );
}