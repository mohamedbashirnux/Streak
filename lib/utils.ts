import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ─────────────────────────────────────────────
// CN UTILITY
// ─────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─────────────────────────────────────────────
// MOTIVATIONAL QUOTES
// ─────────────────────────────────────────────
export const motivationalQuotes = [
  // Originals (kept)
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

  // Discipline
  "Discipline is not a punishment. It is the highest form of self-respect.",
  "Do it even when you don't feel like it. Especially then.",
  "Every act of discipline is a vote for the person you're becoming.",
  "You will never always be motivated. You must learn to be disciplined.",
  "Discipline is the bridge between goals and accomplishment.",
  "Suffer the pain of discipline or suffer the pain of regret. Your choice.",

  // Consistency
  "Consistency is not a mood. It's a decision.",
  "You don't rise to the level of your goals. You fall to the level of your systems.",
  "One day or day one. You decide.",
  "It's not about being perfect. It's about showing up every single day.",
  "The secret to results? Do it again. And again. And again.",

  // Identity & Growth
  "The man you're becoming doesn't do what the old you did.",
  "Every day I hold, I become someone I actually respect.",
  "You are not breaking a habit. You are building a king.",
  "What you resist, you master.",
  "The version of you 90 days from now is watching. Don't disappoint him.",
  "Identity first. Actions follow. Results are inevitable.",

  // Strength & Resilience
  "Every urge you defeat makes you 1% harder to break.",
  "This is where weak men stop. You don't stop.",
  "Hard days are proof you're doing something worth doing.",
  "The comeback is always stronger than the setback.",
  "Your struggle today is your strength tomorrow.",
  "Iron sharpens iron. Hard days sharpen men.",
  "You've survived 100% of your hardest days. This is just another one.",
  "Pressure makes diamonds. Keep going.",

  // Focus & Clarity
  "Clear mind. Sharp focus. Full control.",
  "Your energy is too valuable to waste.",
  "What you feed grows. What you starve dies.",
  "Reclaim your mind. Reclaim your life.",
  "Focus is the art of saying no to everything that doesn't matter.",
  "The quieter you become, the more powerful you get.",

  // Short & Punchy
  "Hold the line.",
  "Not today.",
  "Win the day. Then the next one.",
  "Stay hard.",
  "One more day. Always one more day.",
  "You've got this. Now prove it.",
  "Earn it.",
  "No excuses. No shortcuts. No breaks.",
];

export function getRandomQuote(): string {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

export function getDailyQuote(): string {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return motivationalQuotes[seed % motivationalQuotes.length];
}

// ─────────────────────────────────────────────
// BADGES SYSTEM
// ─────────────────────────────────────────────
export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  streak: number;
  rarity: BadgeRarity;
  unlockedMessage: string;
}

export const badges: Badge[] = [
  // ── COMMON ──────────────────────────────────
  {
    id: "first-blood",
    name: "First Blood",
    description: "Complete Day 1",
    icon: "🔥",
    streak: 1,
    rarity: "common",
    unlockedMessage: "Day 1 done. The journey begins. Don't stop now.",
  },
  {
    id: "3-day-starter",
    name: "3 Day Starter",
    description: "Complete a 3 day streak",
    icon: "✅",
    streak: 3,
    rarity: "common",
    unlockedMessage: "3 days strong. Most people quit by now. You didn't.",
  },
  {
    id: "first-week",
    name: "One Week Strong",
    description: "Complete a 7 day streak",
    icon: "💪",
    streak: 7,
    rarity: "common",
    unlockedMessage: "One full week. Your brain is already rewiring. Keep going.",
  },

  // ── RARE ────────────────────────────────────
  {
    id: "10-day-grinder",
    name: "The Grinder",
    description: "Complete a 10 day streak",
    icon: "⚙️",
    streak: 10,
    rarity: "rare",
    unlockedMessage: "10 days. You're not lucky — you're disciplined. Big difference.",
  },
  {
    id: "two-weeks",
    name: "Two Week Warrior",
    description: "Complete a 14 day streak",
    icon: "⚔️",
    streak: 14,
    rarity: "rare",
    unlockedMessage: "14 days. Habits take 21 days to form. You're almost there.",
  },
  {
    id: "21-warrior",
    name: "21 Day Warrior",
    description: "Complete a 21 day streak",
    icon: "🏆",
    streak: 21,
    rarity: "rare",
    unlockedMessage: "21 days. Science says the habit is forming. You're rewiring yourself.",
  },
  {
    id: "25-day-finisher",
    name: "Iron Finisher",
    description: "Complete a 25 day streak",
    icon: "🛡️",
    streak: 25,
    rarity: "rare",
    unlockedMessage: "25 days. You're made of something different. Keep proving it.",
  },

  // ── EPIC ────────────────────────────────────
  {
    id: "30-champion",
    name: "30 Day Champion",
    description: "Complete a 30 day streak",
    icon: "👑",
    streak: 30,
    rarity: "epic",
    unlockedMessage: "30 days. One full month of pure discipline. You are not the same person.",
  },
  {
    id: "40-day-monk",
    name: "Monk Mode",
    description: "Complete a 40 day streak",
    icon: "🧘",
    streak: 40,
    rarity: "epic",
    unlockedMessage: "40 days. You've entered monk territory. Pure clarity. Pure control.",
  },
  {
    id: "45-legend",
    name: "45 Day Legend",
    description: "Complete a 45 day streak",
    icon: "🌟",
    streak: 45,
    rarity: "epic",
    unlockedMessage: "45 days. Half of 90. The mountain is real. You're climbing it.",
  },
  {
    id: "50-day-titan",
    name: "Titan",
    description: "Complete a 50 day streak",
    icon: "🗿",
    streak: 50,
    rarity: "epic",
    unlockedMessage: "50 days. You are a titan. Unmovable. Unshakable. Keep going.",
  },
  {
    id: "60-master",
    name: "60 Day Master",
    description: "Complete a 60 day streak",
    icon: "💎",
    streak: 60,
    rarity: "epic",
    unlockedMessage: "60 days. Two months of holding the line. Most will never know this feeling.",
  },

  // ── LEGENDARY ───────────────────────────────
  {
    id: "75-hard",
    name: "75 Hard",
    description: "Complete a 75 day streak",
    icon: "🔱",
    streak: 75,
    rarity: "legendary",
    unlockedMessage: "75 days. The final stretch. Don't you dare stop now.",
  },
  {
    id: "unbreakable",
    name: "Unbreakable",
    description: "Complete a full 90 day challenge",
    icon: "🏅",
    streak: 90,
    rarity: "legendary",
    unlockedMessage: "90 days. You did what most only dream about. You are unbreakable.",
  },
  {
    id: "century",
    name: "The Century",
    description: "Complete a 100 day streak",
    icon: "💯",
    streak: 100,
    rarity: "legendary",
    unlockedMessage: "100 days. A century of discipline. This is who you are now.",
  },
  {
    id: "iron-will",
    name: "Iron Will",
    description: "Complete a 120 day streak",
    icon: "⚜️",
    streak: 120,
    rarity: "legendary",
    unlockedMessage: "120 days. Four months. You have forged something unbreakable inside yourself.",
  },
  {
    id: "eternal",
    name: "Eternal",
    description: "Complete a 180 day streak",
    icon: "♾️",
    streak: 180,
    rarity: "legendary",
    unlockedMessage: "180 days. Six months. This is no longer a challenge — it's who you are.",
  },
  {
    id: "the-one",
    name: "The One",
    description: "Complete a full 365 day streak",
    icon: "🌌",
    streak: 365,
    rarity: "legendary",
    unlockedMessage: "365 days. One full year. You have become the person you always wanted to be.",
  },
];

// ─────────────────────────────────────────────
// BADGE UTILITIES
// ─────────────────────────────────────────────

export function checkBadgeEarned(streak: number, duration: number): string | null {
  if (streak === 90 && duration === 90) return "unbreakable";
  const match = badges.find((b) => b.streak === streak && b.id !== "unbreakable");
  return match ? match.id : null;
}

export function getAllEarnedBadges(streak: number, duration: number): Badge[] {
  return badges.filter((b) => {
    if (b.id === "unbreakable") return streak >= 90 && duration >= 90;
    return streak >= b.streak;
  });
}

export function getBadgeById(id: string): Badge | undefined {
  return badges.find((b) => b.id === id);
}

export function getRarityColor(rarity: BadgeRarity): string {
  const colors: Record<BadgeRarity, string> = {
    common: "#6b7280",
    rare: "#3b82f6",
    epic: "#a855f7",
    legendary: "#f59e0b",
  };
  return colors[rarity];
}

export function getRarityLabel(rarity: BadgeRarity): string {
  const labels: Record<BadgeRarity, string> = {
    common: "Common",
    rare: "Rare",
    epic: "Epic",
    legendary: "Legendary",
  };
  return labels[rarity];
}

// ─────────────────────────────────────────────
// DATE & STREAK UTILITIES
// ─────────────────────────────────────────────

export function getStreakLabel(current: number, total: number): string {
  return `Day ${current} of ${total}`;
}

export function getProgressPercent(current: number, total: number): number {
  return Math.min(Math.round((current / total) * 100), 100);
}

export function getDaysRemaining(current: number, total: number): number {
  return Math.max(total - current, 0);
}

export function hasCheckedInToday(lastCheckIn: Date | string | null): boolean {
  if (!lastCheckIn) return false;
  const last = new Date(lastCheckIn);
  const now = new Date();
  return (
    last.getFullYear() === now.getFullYear() &&
    last.getMonth() === now.getMonth() &&
    last.getDate() === now.getDate()
  );
}

export function getRelativeDay(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─────────────────────────────────────────────
// CHALLENGE UTILITIES
// ─────────────────────────────────────────────

export type ChallengeStatus = "active" | "completed" | "failed";

export function getStatusLabel(status: ChallengeStatus): string {
  const labels: Record<ChallengeStatus, string> = {
    active: "🟢 On Track",
    completed: "🏆 Completed",
    failed: "🔴 Failed",
  };
  return labels[status];
}

export function getProgressMessage(percent: number): string {
  if (percent === 0) return "The journey of a thousand miles begins with a single step.";
  if (percent < 10) return "You've started. That's more than most ever do.";
  if (percent < 25) return "Early days. Stay sharp. Don't let your guard down.";
  if (percent < 50) return "You're building momentum. Keep the chain unbroken.";
  if (percent === 50) return "Halfway. The second half is where legends are made.";
  if (percent < 75) return "More than halfway. The end is in sight. Don't stop now.";
  if (percent < 90) return "Almost there. This is where most people slip. Not you.";
  if (percent < 100) return "Final stretch. You're so close. Make it count.";
  return "You did it. You are unbreakable.";
}

export const durationOptions = [
  { label: "7 Days", value: 7 },
  { label: "14 Days", value: 14 },
  { label: "21 Days", value: 21 },
  { label: "30 Days", value: 30 },
  { label: "45 Days", value: 45 },
  { label: "60 Days", value: 60 },
  { label: "75 Days", value: 75 },
  { label: "90 Days", value: 90 },
  { label: "100 Days", value: 100 },
  { label: "180 Days", value: 180 },
  { label: "365 Days", value: 365 },
  { label: "Custom", value: 0 },
];
