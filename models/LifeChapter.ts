import mongoose, { Schema, Document } from "mongoose";

export interface IHabit {
  id: string;
  name: string;
  description: string;
  type: "build" | "avoid"; // build = do something, avoid = stop something
  icon: string;
}

export interface IDayProgress {
  date: Date;
  habits: {
    habitId: string;
    completed: boolean;
    notes?: string;
  }[];
  dayWon: boolean; // true if ALL habits completed
  status: "pending" | "won" | "lost";
}

export interface ILifeChapter extends Document {
  _id: string;
  userId: string;
  title: string; // "My 2026 Transformation"
  description: string; // "Become the person I want to be"
  duration: number; // days (365 for 1 year)
  startDate: Date;
  endDate: Date;
  
  habits: IHabit[]; // 4 connected habits
  
  days: IDayProgress[]; // daily progress
  
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

const HabitSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["build", "avoid"], required: true },
  icon: { type: String, required: true },
});

const DayProgressSchema = new Schema({
  date: { type: Date, required: true },
  habits: [{
    habitId: { type: String, required: true },
    completed: { type: Boolean, required: true },
    notes: { type: String },
  }],
  dayWon: { type: Boolean, required: true },
  status: { type: String, enum: ["pending", "won", "lost"], required: true },
});

const LifeChapterSchema = new Schema<ILifeChapter>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  habits: [HabitSchema],
  days: [DayProgressSchema],
  
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  totalDaysWon: { type: Number, default: 0 },
  totalDaysLost: { type: Number, default: 0 },
  
  status: { type: String, enum: ["active", "completed", "failed"], default: "active" },
  completedAt: { type: Date },
}, {
  timestamps: true,
});

export default mongoose.models.LifeChapter || mongoose.model<ILifeChapter>("LifeChapter", LifeChapterSchema);