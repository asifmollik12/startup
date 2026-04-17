import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
  role: { type: String, default: "user" },
  bio: { type: String, default: "" },
  readingList: [{ type: String }], // article slugs
  aiChatCount: { type: Number, default: 0 },
  ttsCount: { type: Number, default: 0 },
  aiUsageDate: { type: String, default: "" },
  subscription: { type: String, default: "free" }, // "free" | "pro"
  subscriptionExpiry: { type: Date, default: null },
}, { timestamps: true });

export const User = models.User || mongoose.model("User", UserSchema);
