import mongoose, { Schema, Model } from "mongoose";
import { Challenge } from "@/types";

const ChallengeDaySchema = new Schema({
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["success", "failed", "missed", "pending"], 
    default: "pending" 
  },
  notes: { type: String, default: "" },
});

const ChallengeSchema = new Schema<Challenge>({
  userId: { type: String, required: true, ref: "User" },
  name: { type: String, required: true },
  type: { type: String, enum: ["avoid", "build"], required: true },
  duration: { type: Number, required: true },
  motivation: { type: String },
  startDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["active", "completed", "failed"], 
    default: "active" 
  },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  days: { type: [ChallengeDaySchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

const ChallengeModel: Model<Challenge> = 
  mongoose.models.Challenge || mongoose.model<Challenge>("Challenge", ChallengeSchema);

export default ChallengeModel;
