import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
  role: { type: String, default: "user" },
}, { timestamps: true });

export const User = models.User || mongoose.model("User", UserSchema);
