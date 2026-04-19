import mongoose, { Schema, Model } from "mongoose";
import { User } from "@/types";

const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatar: { type: String },
  badges: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;
