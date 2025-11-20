import mongoose from 'mongoose';

const UserStatsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  loginStreak: { type: Number, default: 0 },
  lastLoginDate: Date,
  journalEntries: { type: Number, default: 0 },
  chatbotMessages: { type: Number, default: 0 },
  breathingExercises: { type: Number, default: 0 },
  aiConversations: { type: Number, default: 0 },
  // add other counters as needed
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('UserStats', UserStatsSchema);
