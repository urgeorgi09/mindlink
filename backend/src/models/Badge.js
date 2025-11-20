import mongoose from 'mongoose';

const BadgeSchema = new mongoose.Schema({
  badgeId: { type: String, required: true, unique: true }, // ex: "chatbot_10"
  name: String,
  description: String,
  category: String,
  criteria: Object, // optional meta about condition
  color: [String],
  // list of userIds who unlocked it (simple approach)
  unlockedBy: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Badge', BadgeSchema);
