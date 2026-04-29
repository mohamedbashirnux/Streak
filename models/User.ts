import mongoose, { Schema, Model } from "mongoose";
import { User } from "@/types";

const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatar: { type: String },
  badges: { type: [String], default: [] },
  timezone: { type: String, default: "UTC" },
  theme: { type: String, enum: ["light", "dark"], default: "dark" },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  totalXP: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;
