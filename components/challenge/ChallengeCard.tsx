"use client";

import { Challenge } from "@/types";
import Card from "@/components/ui/Card";
import ProgressBar from "./ProgressBar";
import CheckInButton from "./CheckInButton";
import { motion } from "framer-motion";
import { Flame, Target, Ban, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChallengeCardProps {
  challenge: Challenge;
  onCheckIn: (challengeId: string, success: boolean) => Promise<void>;
}

export default function ChallengeCard({ challenge, onCheckIn }: ChallengeCardProps) {
  const router = useRouter();
  const daysRemaining = challenge.duration - challenge.currentStreak;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayDay = challenge.days.find((day) => {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate.getTime() === today.getTime();
  });

  const canCheckIn = todayDay && todayDay.status === "pending";
  const doneToday = todayDay?.status === "success";
  const streakBroken = challenge.streakBroken === true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`cursor-pointer transition-all ${
          streakBroken
            ? "border-red-500/40 bg-red-500/5"
            : doneToday
            ? "border-green-500/40 bg-green-500/5"
            : ""
        }`}
        onClick={() => router.push(`/challenge/${challenge._id}`)}
      >
        {/* Streak broken notice */}
        {streakBroken && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertTriangle className="text-red-400 flex-shrink-0" size={15} />
            <p className="text-red-400 text-xs font-medium">
              Streak broken — you missed a day. Tap to restart 🔥
            </p>
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              streakBroken ? "bg-red-500/10" : doneToday ? "bg-green-500/20" : "bg-green-500/10"
            }`}>
              {challenge.type === "avoid" ? (
                <Ban className={streakBroken ? "text-red-400" : "text-green-500"} size={24} />
              ) : (
                <Target className={streakBroken ? "text-red-400" : "text-green-500"} size={24} />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{challenge.name}</h3>
              <p className="text-sm text-gray-400 capitalize">{challenge.type} habit</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 ${streakBroken ? "text-red-400" : "text-orange-500"}`}>
            <Flame size={20} />
            <span className="text-lg font-bold">{challenge.currentStreak}</span>
          </div>
        </div>

        {challenge.motivation && (
          <p className="text-gray-400 text-sm mb-4 italic">"{challenge.motivation}"</p>
        )}

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="text-white font-medium">
              Day {challenge.currentStreak} of {challenge.duration}
            </span>
          </div>
          <ProgressBar current={challenge.currentStreak} total={challenge.duration} />
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Days remaining</span>
            <span className="text-green-500 font-medium">{daysRemaining}</span>
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <CheckInButton
            challengeId={challenge._id}
            onCheckIn={(success) => onCheckIn(challenge._id, success)}
            disabled={!canCheckIn}
          />
        </div>
      </Card>
    </motion.div>
  );
}
