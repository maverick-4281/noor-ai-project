import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  prompt: { type: String, required: true },
  originalPrompt: { type: String, default: '' },
  style: { type: String, default: '' },
  size: { type: String, default: '' },
  imageBase64: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Image', imageSchema);
