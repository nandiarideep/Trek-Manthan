import mongoose from "mongoose";

const SiteContentSchema = new mongoose.Schema({
  navbar: {
    email: String,
    phone: String,
    location: String,
    links: [
      {
        label: String,
        path: String,
      }
    ]
  },
  hero: {
    title: String,
    subtitle: String,
  }
}, { timestamps: true });

export default mongoose.models.SiteContent ||
  mongoose.model("SiteContent", SiteContentSchema);
