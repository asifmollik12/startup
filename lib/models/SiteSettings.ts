import mongoose, { Schema, models } from "mongoose";

const SiteSettingsSchema = new Schema({
  key: { type: String, unique: true },
  value: Schema.Types.Mixed,
}, { timestamps: true });

export const SiteSettings = models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);
