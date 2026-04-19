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
  { id: "first-blood", name: "First Blood", description: "Complete Day 1", icon: "🔥" },
  { id: "one-week", name: "One Week Strong", description: "7 day streak", icon: "💪" },
  { id: "21-warrior", name: "21 Day Warrior", description: "21 day streak", icon: "🏆" },
  { id: "30-champion", name: "30 Day Champion", description: "30 day streak", icon: "👑" },
  { id: "unbreakable", name: "Unbreakable", description: "Complete a 90 day challenge", icon: "💎" },
];

export function checkBadgeEarned(streak: number, duration: number): string | null {
  if (streak === 1) return "first-blood";
  if (streak === 7) return "one-week";
  if (streak === 21) return "21-warrior";
  if (streak === 30) return "30-champion";
  if (duration === 90 && streak === 90) return "unbreakable";
  return null;
}
