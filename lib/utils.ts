import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const motivationalQuotes = [
  "Discipline is choosing between what you want now and what you want most.",
  "Success is the sum of small efforts repeated day in and day out.",
  "The only way to do great work is to love what you do.",
  "Don't break the chain. Keep going.",
  "Your future self will thank you for not giving up today.",
  "Consistency is the key to achieving your goals.",
  "Every day is a new opportunity to be better.",
  "The pain of discipline is far less than the pain of regret.",
  "Small daily improvements lead to stunning results.",
  "You don't have to be great to start, but you have to start to be great.",
];

export function getRandomQuote(): string {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

export const badges = [
  { id: "first-blood", name: "First Blood", description: "Complete your first day", icon: "🔥", streak: 1 },
  { id: "one-week", name: "One Week Strong", description: "Maintain a 7-day streak", icon: "💪", streak: 7 },
  { id: "21-warrior", name: "21 Day Warrior", description: "Achieve a 21-day streak", icon: "🏆", streak: 21 },
  { id: "30-champion", name: "30 Day Champion", description: "Reach a 30-day streak", icon: "👑", streak: 30 },
  { id: "unbreakable", name: "Unbreakable", description: "Complete a 90-day challenge", icon: "💎", streak: 90 },
];

export function checkBadgeEarned(streak: number, duration: number): string | null {
  // First Blood - complete day 1
  if (streak === 1) return "first-blood";
  
  // Streak-based badges
  if (streak === 7) return "one-week";
  if (streak === 21) return "21-warrior";
  if (streak === 30) return "30-champion";
  
  // Unbreakable - complete 90 day challenge
  if (streak === duration && duration === 90) return "unbreakable";
  
  return null;
}
