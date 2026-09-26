import mongoose from "mongoose";

const SiteSettingsSchema = new mongoose.Schema(
  {
    siteName: String,
    heroTitle: String,
    heroSubtitle: String,
    primaryColor: String,
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings ||
  mongoose.model("SiteSettings", SiteSettingsSchema);
