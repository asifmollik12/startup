import mongoose, { Schema, models } from "mongoose";

const IdeaSchema = new Schema({
  title: String,
  description: String,
  submittedBy: String,
  votes: { type: Number, default: 0 },
  month: String,
  winner: { type: Boolean, default: false },
  category: String,
  pitchDeck: String,
}, { timestamps: true });

export const Idea = models.Idea || mongoose.model("Idea", IdeaSchema);
