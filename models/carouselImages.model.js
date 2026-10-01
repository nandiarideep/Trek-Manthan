import mongoose from 'mongoose';

const carouselImageSchema = new mongoose.Schema({
  id: { type: Number, default: 1 },
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
  image: { type: String, required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.CarouselImage || mongoose.model('CarouselImage', carouselImageSchema);
