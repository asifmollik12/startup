import mongoose, { Schema, models } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, unique: true },
  slug: { type: String, unique: true },
  color: { type: String, default: "#C8102E" },
  description: String,
}, { timestamps: true });

export const Category = models.Category || mongoose.model("Category", CategorySchema);
