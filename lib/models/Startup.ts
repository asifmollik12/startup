import mongoose, { Schema, models } from "mongoose";

const StartupSchema = new Schema({
  name: String,
  slug: { type: String, unique: true },
  tagline: String,
  description: String,
  logo: String,
  coverImage: String,
  industry: String,
  stage: String,
  founded: String,
  location: String,
  founders: [String],
  funding: String,
  website: String,
}, { timestamps: true });

export const Startup = models.Startup || mongoose.model("Startup", StartupSchema);
