export type ChallengeType = "avoid" | "build";
export type ChallengeStatus = "active" | "completed" | "failed";
export type DayStatus = "success" | "failed" | "missed" | "pending";

// ── CATEGORY TYPES ──────────────────────────
export interface CategoryHabit {
  id: string;
  name: string;
  description?: string;
  type: "build" | "avoid";
  icon: string;
}

export interface HabitProgress {
  habitId: string;
  completed: boolean;
  notes?: string;
}

export interface DayProgress {
  date: Date;
  habits: HabitProgress[];
  dayWon: boolean; // true if ALL habits completed
  status: "pending" | "won" | "lost";
}

export interface Category {
  _id: string;
  userId: string;
  title: string; // "My 2026 Transformation"
  description?: string; // "Become the person I want to be"
  duration: number; // days (365 for 1 year)
  startDate: Date;
  endDate: Date;
  
  habits: CategoryHabit[]; // 4 connected habits
  days: DayProgress[]; // daily progress
  
  // Stats
  currentStreak: number; // consecutive days won
  longestStreak: number;
  totalDaysWon: number;
  totalDaysLost: number;
  
  status: "active" | "completed" | "failed";
  completedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

// ── ORIGINAL CHALLENGE TYPES ────────────────────
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
  // Category stats
  totalCategories?: number;
  totalCategoriesCompleted?: number;
  totalPerfectDays?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}
