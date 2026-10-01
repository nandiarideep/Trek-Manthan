import mongoose from 'mongoose';

const tripTypesSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.TripType || mongoose.model('TripType', tripTypesSchema);