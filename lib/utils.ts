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
