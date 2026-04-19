"use client";

import { Challenge } from "@/types";
import Card from "@/components/ui/Card";
import ProgressBar from "./ProgressBar";
import CheckInButton from "./CheckInButton";
import { motion } from "framer-motion";
import { Flame, Target, Ban } from "lucide-react";
import { format, isToday } from "date-fns";
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="cursor-pointer" onClick={() => router.push(`/challenge/${challenge._id}`)}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              {challenge.type === "avoid" ? (
                <Ban className="text-green-500" size={24} />
              ) : (
                <Target className="text-green-500" size={24} />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{challenge.name}</h3>
              <p className="text-sm text-gray-400 capitalize">{challenge.type} habit</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-orange-500">
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
