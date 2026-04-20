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
  { id: "first-blood", name: "First Blood", description: "Complete Day 1", icon: "🔥", streak: 1 },
  { id: "3-day-starter", name: "3 Day Starter", description: "3 day streak", icon: "⚡", streak: 3 },
  { id: "one-week", name: "One Week Strong", description: "7 day streak", icon: "💪", streak: 7 },
  { id: "two-week", name: "Two Week Warrior", description: "14 day streak", icon: "⚔️", streak: 14 },
  { id: "21-warrior", name: "21 Day Warrior", description: "3 week streak", icon: "🏆", streak: 21 },
  { id: "30-champion", name: "30 Day Champion", description: "1 month streak", icon: "👑", streak: 30 },
  { id: "45-legend", name: "45 Day Legend", description: "45 day streak", icon: "🌟", streak: 45 },
  { id: "60-master", name: "60 Day Master", description: "2 month streak", icon: "💎", streak: 60 },
  { id: "90-unbreakable", name: "90 Day Unbreakable", description: "3 month streak", icon: "🏅", streak: 90 },
];

export function checkBadgeEarned(streak: number): string | null {
  const badge = badges.find(b => b.streak === streak);
  return badge ? badge.id : null;
}
