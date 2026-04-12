import mongoose, { Schema, models } from "mongoose";

const FounderSchema = new Schema({
  name: String,
  slug: { type: String, unique: true },
  title: String,
  company: String,
  industry: String,
  avatar: String,
  coverImage: String,
  bio: String,
  netWorth: String,
  founded: String,
  location: String,
  achievements: [String],
  socialLinks: {
    twitter: String,
    linkedin: String,
    website: String,
  },
  rank: Number,
}, { timestamps: true });

export const Founder = models.Founder || mongoose.model("Founder", FounderSchema);
