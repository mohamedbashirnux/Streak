import mongoose, { Schema, Model } from "mongoose";
import { Stats } from "@/types";

const StatsSchema = new Schema<Stats>({
  userId: { type: String, required: true, unique: true, ref: "User" },
  totalChallenges: { type: Number, default: 0 },
  totalCompleted: { type: Number, default: 0 },
  totalFailed: { type: Number, default: 0 },
  longestStreakEver: { type: Number, default: 0 },
  totalDaysCompleted: { type: Number, default: 0 },
});

const StatsModel: Model<Stats> = 
  mongoose.models.Stats || mongoose.model<Stats>("Stats", StatsSchema);

export default StatsModel;
