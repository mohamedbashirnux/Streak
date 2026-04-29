import mongoose, { Schema, Model } from "mongoose";
import { UserDailyChallenge } from "@/types";

const UserDailyChallengeSchema = new Schema<UserDailyChallenge>({
  userId: { type: String, required: true },
  challengeId: { type: String, required: true },
  date: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  progress: { type: Number, default: 0 },
  xpEarned: { type: Number, default: 0 },
});

const UserDailyChallengeModel: Model<UserDailyChallenge> = 
  mongoose.models.UserDailyChallenge || mongoose.model<UserDailyChallenge>("UserDailyChallenge", UserDailyChallengeSchema);

export default UserDailyChallengeModel;