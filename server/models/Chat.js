import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  role: { type: String, enum: ['user', 'ai'], required: true },
  content: { type: String, default: '' },
  originalPrompt: { type: String, default: '' },
  style: { type: String, default: '' },
  size: { type: String, default: '' },
  error: { type: String, default: '' },
  isLoading: { type: Boolean, default: false },
  imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' }
});

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, default: 'New Conversation' },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Chat', chatSchema);
