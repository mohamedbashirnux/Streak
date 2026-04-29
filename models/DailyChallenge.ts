import mongoose, { Schema, Model } from "mongoose";
import { DailyChallenge } from "@/types";

const DailyChallengeSchema = new Schema<DailyChallenge>({
  date: { type: Date, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  xpReward: { type: Number, required: true },
  type: { type: String, enum: ["checkin", "streak", "consistency", "social"], required: true },
  target: { type: Number },
  isActive: { type: Boolean, default: true },
});

const DailyChallengeModel: Model<DailyChallenge> = 
  mongoose.models.DailyChallenge || mongoose.model<DailyChallenge>("DailyChallenge", DailyChallengeSchema);

export default DailyChallengeModel;