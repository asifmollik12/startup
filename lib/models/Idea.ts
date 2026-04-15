import mongoose, { Schema, models } from "mongoose";

const IdeaSchema = new Schema({
  title: String,
  description: String,
  submittedBy: String,
  userId: { type: String, default: "" },
  userEmail: { type: String, default: "" },
  votes: { type: Number, default: 0 },
  month: String,
  winner: { type: Boolean, default: false },
  category: String,
  pitchDeck: String,
  targetMarket: String,
  problem: String,
  uvp: String,
  stage: String,
  marketSize: String,
  prototypeUrl: String,
  role: String,
  location: String,
  linkedin: String,
}, { timestamps: true });

export const Idea = models.Idea || mongoose.model("Idea", IdeaSchema);
