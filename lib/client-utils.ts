import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Motivational Quotes
const quotes = [
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future depends on what you do today.",
  "Believe you can and you're halfway there.",
  "Success is the sum of small efforts repeated day in and day out.",
  "You don't have to be great to start, but you have to start to be great.",
  "The only way to do great work is to love what you do.",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
];

export function getRandomQuote(): string {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Badge System
export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  streakRequired: number;
  rarity: BadgeRarity;
  unlockMessage: string;
}

export const badges: Badge[] = [
  // Common Badges (Gray)
  { id: "first-day", name: "First Step", description: "Complete 1 day", icon: "🌱", streakRequired: 1, rarity: "common", unlockMessage: "Every journey begins with a single step!" },
  { id: "three-days", name: "Getting Started", description: "Complete 3 days", icon: "🔥", streakRequired: 3, rarity: "common", unlockMessage: "You're building momentum!" },
  { id: "week-warrior", name: "Week Warrior", description: "Complete 7 days", icon: "⚡", streakRequired: 7, rarity: "common", unlockMessage: "One week of dedication!" },
  { id: "two-weeks", name: "Fortnight Fighter", description: "Complete 14 days", icon: "💪", streakRequired: 14, rarity: "common", unlockMessage: "Two weeks of consistency!" },
  
  // Rare Badges (Blue)
  { id: "habit-former", name: "Habit Former", description: "Complete 21 days", icon: "🎯", streakRequired: 21, rarity: "rare", unlockMessage: "They say it takes 21 days to form a habit!" },
  { id: "month-master", name: "Month Master", description: "Complete 30 days", icon: "🏆", streakRequired: 30, rarity: "rare", unlockMessage: "A full month of excellence!" },
  { id: "unstoppable", name: "Unstoppable", description: "Complete 45 days", icon: "🚀", streakRequired: 45, rarity: "rare", unlockMessage: "Nothing can stop you now!" },
  
  // Epic Badges (Purple)
  { id: "two-month-titan", name: "Two Month Titan", description: "Complete 60 days", icon: "👑", streakRequired: 60, rarity: "epic", unlockMessage: "Two months of pure dedication!" },
  { id: "quarter-champion", name: "Quarter Champion", description: "Complete 90 days", icon: "💎", streakRequired: 90, rarity: "epic", unlockMessage: "A full quarter of transformation!" },
  { id: "half-year-hero", name: "Half Year Hero", description: "Complete 180 days", icon: "🌟", streakRequired: 180, rarity: "epic", unlockMessage: "Six months of unwavering commitment!" },
  
  // Legendary Badges (Gold)
  { id: "year-legend", name: "Year Legend", description: "Complete 365 days", icon: "🏅", streakRequired: 365, rarity: "legendary", unlockMessage: "A FULL YEAR! You are a legend!" },
];

export function getRarityColor(rarity: BadgeRarity): string {
  switch (rarity) {
    case "common": return "#9ca3af"; // gray
    case "rare": return "#3b82f6"; // blue
    case "epic": return "#a855f7"; // purple
    case "legendary": return "#eab308"; // gold
    default: return "#9ca3af";
  }
}

export function getRarityLabel(rarity: BadgeRarity): string {
  switch (rarity) {
    case "common": return "Common";
    case "rare": return "Rare";
    case "epic": return "Epic";
    case "legendary": return "Legendary";
    default: return "Common";
  }
}

export function getBadgeForStreak(streak: number): Badge | null {
  const earnedBadge = badges.find(badge => badge.streakRequired === streak);
  return earnedBadge || null;
}

// XP and Level System (Client-side calculations only)
export const XP_REWARDS = {
  DAILY_CHECKIN: 10,
  STREAK_MILESTONE: 25,
  DAILY_CHALLENGE: 15,
  WEEKLY_CONSISTENCY: 50,
  BADGE_EARNED: 100,
  PERFECT_WEEK: 200,
} as const;

export function calculateLevel(totalXP: number): number {
  // Level formula: Level = floor(sqrt(totalXP / 100)) + 1
  // Level 1: 0-99 XP, Level 2: 100-399 XP, Level 3: 400-899 XP, etc.
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
}

export function getXPForLevel(level: number): number {
  // XP required to reach a level
  return Math.pow(level - 1, 2) * 100;
}

export function getXPForNextLevel(currentLevel: number): number {
  return getXPForLevel(currentLevel + 1);
}

export function getCurrentLevelProgress(totalXP: number): { 
  currentLevel: number; 
  currentLevelXP: number; 
  nextLevelXP: number; 
  progress: number; 
} {
  const currentLevel = calculateLevel(totalXP);
  const currentLevelXP = getXPForLevel(currentLevel);
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  const progress = ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  
  return {
    currentLevel,
    currentLevelXP,
    nextLevelXP,
    progress: Math.min(100, Math.max(0, progress)),
  };
}

// Daily Challenge Generation (Client-side only)
export function generateDailyChallenges(date: Date) {
  const challenges = [
    {
      title: "Daily Warrior",
      description: "Complete your daily check-in",
      type: "checkin" as const,
      xpReward: XP_REWARDS.DAILY_CHECKIN,
      target: 1,
    },
    {
      title: "Streak Master",
      description: "Maintain a 3+ day streak",
      type: "streak" as const,
      xpReward: XP_REWARDS.STREAK_MILESTONE,
      target: 3,
    },
    {
      title: "Consistency Champion",
      description: "Check in for 5 days this week",
      type: "consistency" as const,
      xpReward: XP_REWARDS.WEEKLY_CONSISTENCY,
      target: 5,
    },
  ];

  // Add weekend bonus challenge
  if (date.getDay() === 0 || date.getDay() === 6) {
    challenges.push({
      title: "Weekend Warrior",
      description: "Stay consistent on the weekend",
      type: "checkin" as const,
      xpReward: XP_REWARDS.DAILY_CHECKIN + 5,
      target: 1,
    });
  }

  return challenges;
}