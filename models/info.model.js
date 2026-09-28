import mongoose from "mongoose";

const infoSchema = new mongoose.Schema({
    videoLink: String,
    cityNames: { type: [String], default: [] },
    tagline: String,
    secondTagline: String,
    email: String,
    contact: String,
    address: String,
    facebook: String,
    whatsapp: String,
    instagram: String,
})

export default mongoose.models.Info ||
    mongoose.model("Info", infoSchema);