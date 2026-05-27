export type ChallengeType = "avoid" | "build";
export type ChallengeStatus = "active" | "completed" | "failed";
export type DayStatus = "success" | "failed" | "missed" | "pending";

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  badges: string[];
  timezone?: string;
  theme?: "light" | "dark";
  xp: number;
  level: number;
  totalXP: number;
  createdAt: Date;
}

export interface ChallengeDay {
  date: Date;
  status: DayStatus;
  notes?: string;
}

export interface Challenge {
  _id: string;
  userId: string;
  name: string;
  type: ChallengeType;
  duration: number;
  motivation?: string;
  startDate: Date;
  status: ChallengeStatus;
  currentStreak: number;
  longestStreak: number;
  days: ChallengeDay[];
  createdAt: Date;
  completedAt?: Date;
  streakBroken?: boolean;
}

export interface Stats {
  _id: string;
  userId: string;
  totalChallenges: number;
  totalCompleted: number;
  totalFailed: number;
  longestStreakEver: number;
  totalDaysCompleted: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface DailyChallenge {
  _id: string;
  date: Date;
  title: string;
  description: string;
  xpReward: number;
  type: "checkin" | "streak" | "consistency" | "social";
  target?: number;
  isActive: boolean;
}

export interface UserDailyChallenge {
  _id: string;
  userId: string;
  challengeId: string;
  date: Date;
  completed: boolean;
  progress: number;
  xpEarned: number;
}

export interface LeaderboardEntry {
  _id: string;
  userId: string;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  longestStreak: number;
  totalChallenges: number;
  rank: number;
}
