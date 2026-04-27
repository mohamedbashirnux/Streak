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
  createdAt: Date;
}

export interface ChallengeDay {
  date: Date;
  status: DayStatus;
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
