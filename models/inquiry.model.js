import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    destination: { type: String, required: true, trim: true },
    travelers: { type: Number, required: true, min: 1 },
    tripType: { type: String, trim: true, default: '' },
    budget: { type: String, trim: true, default: '' },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);