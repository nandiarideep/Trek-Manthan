import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
    {
        count: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.Visit || mongoose.model("Visit", visitSchema);