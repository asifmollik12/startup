import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
  role: { type: String, default: "user" },
  bio: { type: String, default: "" },
  readingList: [{ type: String }], // article slugs
  aiChatCount: { type: Number, default: 0 },   // daily chat usage
  ttsCount: { type: Number, default: 0 },       // daily voice usage
  aiUsageDate: { type: String, default: "" },   // YYYY-MM-DD of last reset
}, { timestamps: true });

export const User = models.User || mongoose.model("User", UserSchema);
