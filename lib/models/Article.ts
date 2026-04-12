import mongoose, { Schema, models } from "mongoose";

const ArticleSchema = new Schema({
  title: String,
  slug: { type: String, unique: true },
  excerpt: String,
  content: String,
  category: String,
  author: String,
  authorAvatar: String,
  coverImage: String,
  publishedAt: String,
  readTime: Number,
  featured: Boolean,
  tags: [String],
}, { timestamps: true });

export const Article = models.Article || mongoose.model("Article", ArticleSchema);
