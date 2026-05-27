import mongoose, { Schema, Model } from "mongoose";
import { Journey } from "@/types";

const JourneySchema = new Schema<Journey>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  color: { type: String, default: "#22c55e" },
  duration: { type: Number, required: true },
  startDate: { type: Date, required: true },
  status: { type: String, enum: ["active", "completed", "archived"], default: "active" },
  createdAt: { type: Date, default: Date.now },
});

const JourneyModel: Model<Journey> =
  mongoose.models.Journey || mongoose.model<Journey>("Journey", JourneySchema);

export default JourneyModel;
