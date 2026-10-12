import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    fileId: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
    images: {
      type: [imageSchema],
      validate: [(v) => v.length >= 1 && v.length <= 5, 'A destination needs 1 to 5 images'],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Destination || mongoose.model('Destination', destinationSchema);